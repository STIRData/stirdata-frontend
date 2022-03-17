
/* eslint-disable camelcase */

export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'STIRData',
    htmlAttrs: {
      lang: 'en'
    },
    script: [
      /* {
        src: 'https://code.jquery.com/jquery-3.5.1.min.js'
      },*/
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
  css: ['./assets/scss/style', 'vue-slick-carousel/dist/vue-slick-carousel.css'],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '~/plugins/apis',
    '~/plugins/calls',
    '~plugins/filters',
    { src: '~/plugins/chart.js', mode: 'client' },
    { src: '~/plugins/amCharts.js', ssr: false },
    { src: '~/plugins/vue-slick-carousel.js', ssr: false },
    { src: '~/plugins/solidLogin.js' }
  ],
  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    // '@nuxtjs/eslint-module'
    '@nuxtjs/fontawesome'
  ],

  fontawesome: {
    icons: {
      solid: true,
      brands: true
    }
  },

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
};
