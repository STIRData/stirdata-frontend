
/* eslint-disable camelcase */

export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'STIRData',
    htmlAttrs: {
      lang: 'en'
    },
    script: [
      {
        src: 'https://apis.google.com/js/platform.js?onload=renderButton'
      }
    ],
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'STIRData portal' },
      {
        name: 'google-signin-scope',
        content: 'profile email'
      },
      {
        name: 'google-signin-client_id',
        content: process.env.GOOGLE_CLIENT_ID
      }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  env: {
    baseUrl: process.env.BASE_API_URL
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ['./assets/scss/style'],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '~/plugins/apis',
    {
      src: '~/plugins/amCharts.js',
      ssr: false
    }
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    // '@nuxtjs/eslint-module'
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/bootstrap
    'bootstrap-vue/nuxt',
    'vue-scrollto/nuxt',
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios'
  ],

  axios: {
  },

   // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
  },

  srcDir: 'src/'
}
