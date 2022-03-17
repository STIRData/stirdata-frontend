export const BASE_URL = process.env.baseUrl;

export default function({ $axios }, inject) {
  const backendApi = $axios.create({
    baseURL: BASE_URL
  });

  backendApi.onResponse((response) => {
    if (response.status === 404) {
      console.log('404 error');
    }
  });

  inject('api', backendApi);
}
