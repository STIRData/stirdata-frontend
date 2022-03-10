export function countryProperties(code, name) {
  let country = code.slice(0, 2);
  let response = new Object({
    id: code,
    name: `${code} - ${name}`,
    CNTRY: '',
    TYPE: 'NUTS-REGION',
  });
  if (country === 'BE') response.CNTRY = 'Belgium';
  if (country === 'CZ') response.CNTRY = 'Czechia';
  if (country === 'EL') response.CNTRY = 'Greece';
  if (country === 'NO') response.CNTRY = 'Norway';
  if (country === 'UK') response.CNTRY = 'United Kingdom';
  return response;
}

export default (ctx, inject) => {
  const apiCalls = {
    getProviders: () => {
      return ctx.$api.get('datasets').then(response => response.data);
    },
    getTopLevel: resource => {
      let grouping = (resource === 'nace') ? 'activityGroups' : 'placeGroups';
      let type = (resource === 'nace') ? 'activity' : 'place';
      return ctx.$api.get(resource)
        .then(response => response.data[grouping].map(item => new Object({value: item[type].code.split(':')[1], text: `${item[type].code.split(':')[1]} - ${item[type].label}` })));
    },
    getStatistics: () => {
      return ctx.$api.get(`statistics?dimension=place,activity`).then(response => response.data)
    },
    getAllPlaces: () => {
      return ctx.$api.get(`statistics?dimension=place`).then(response => response.data)
    },
    getAllActivities: () => {
      return ctx.$api.get(`statistics?dimension=activity`).then(response => response.data)
    },
    getRegionStatistics: regionCode => {
      let code = regionCode.includes(':') ? regionCode : `nuts:${regionCode}`
      return ctx.$api.get(`statistics?place=${code}&dimension=place,activity,foundingDate,dissolutionDate`).then(response => response.data)
    },
    getActivityStatistics: activityCode => {
      let code = activityCode.includes(':') ? activityCode : `nace-rev2:${activityCode}`
      return ctx.$api.get(`statistics?activity=${code}&dimension=place,activity`).then(response => response.data)
    },
    getRegionData: regionCode => {
      let code = regionCode.includes(':') ? regionCode : `nuts:${regionCode}`
      return ctx.$api.get(`statistics?place=${code}`).then(response => response.data)
    },
    getActivityData: activityCode => {
      let code = activityCode.includes(':') ? activityCode : `nace-rev2:${activityCode}`
      return ctx.$api.get(`statistics?activity=${code}`).then(response => response.data)
    },
    getSubRegions: uri => {
      return ctx.$api.get(`nuts?parent=${uri}`)
        .then(response => new Object({
          names: response.data.results.bindings.map(item => item.label.value),
          uris: response.data.results.bindings.map(item => item.code.value)
        }));
    },

    getCountryGeoJSON: (uri, name, resolution) => {
      return ctx.$api.get(`nuts/getGeoJson?nutsUri=${uri}&spatialResolution=${resolution}`)
        .then(response => response.data['@graph']
          ?
            new Object({
              type: "Feature",
              id: response.data['@graph'][1]['@id'].split(':')[1],
              // contains: response.data['@graph'][1]['contains'],
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
