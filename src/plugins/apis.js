export const BASE_URL = process.env.baseUrl;
export const SAGE_URL = process.env.sageUrl;

export default function({ $axios }, inject) {
  // STIRData backend
  const backendApi = $axios.create({
    baseURL: BASE_URL
  });

  backendApi.onResponse((response) => {
    if (response.status === 404) {
      console.log('404 error');
    }
  });

  inject('api', backendApi);

  // SAGE backend
  const sageBackendApi = $axios.create({
    baseURL: SAGE_URL
  });

  sageBackendApi.onResponse((response) => {
    if (response.status === 404) {
      console.log('404 error');
    }
  });

  inject('sageApi', sageBackendApi);
}
