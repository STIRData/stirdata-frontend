export function countryProperties(code, name){
  let country = code.slice(0,2);
  let response = new Object({
    id: code,
    name: `${code} - ${name}`,
    CNTRY: "",
    TYPE: "NUTS-REGION",
  });
  if (country === 'BE') response.CNTRY = "Belgium";
  if (country === 'CZ') response.CNTRY = "Czechia";
  if (country === 'EL') response.CNTRY = "Greece";
  if (country === 'NO') response.CNTRY = "Norway";
  if (country === 'UK') response.CNTRY = "United Kingdom";
  return response;
}

export default (ctx, inject) => {
  const apiCalls = {
    getTopLevel: resource => {
      return ctx.$api.get(resource)
        .then(response => response.data.results.bindings.map(
          (item) => new Object({
            value: item.code.value,
            text: `${item.code.value.split("/").pop()} - ${item.label.value}`
          })
        ));
    },

    getCountryRegions: uri => {
      return ctx.$api.get(`nuts?parent=${uri}`)
        .then(response => new Object({
          countryId: uri,
          regionNames: response.data.results.bindings.map(item => item.label.value),
          regionUris: response.data.results.bindings.map(item => item.code.value)
        }));
    },

    getCountryGeoJSON: (uri, name) => {
      return ctx.$api.get(`nuts/getGeoJson?nutsUri=${uri}`)
        .then(response => response.data['@graph']
          ?
            new Object({
              type: "Feature",
              id: response.data['@graph'][1]['@id'].split(':')[1],
              contains: response.data['@graph'][1]['contains'],
              geometry: JSON.parse(response.data['@graph'][0]['asGeoJSON']),
              properties: countryProperties(response.data['@graph'][1]['@id'].split(':')[1], name)
            })
          :
            null
        )
        .catch(error => console.error(error));
    }
  }

  inject('calls', apiCalls);
}
