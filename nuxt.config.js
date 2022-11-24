/* eslint-disable camelcase */
import axios from 'axios';

export default {
  target: 'static',
  
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'STIRData',
    htmlAttrs: {
      lang: 'en'
    },
    script: [
      /* {
        src: 'https://code.jquery.com/jquery-3.5.1.min.js'
      },
      {
        src: 'https://apis.google.com/js/platform.js?onload=renderButton'
      }*/
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
    baseUrl: process.env.BASE_API_URL,
    sageUrl: process.env.SAGE_API_URL
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ['./assets/scss/style', 'vue-slick-carousel/dist/vue-slick-carousel.css'],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '~/plugins/apis',
    '~/plugins/calls',
    '~plugins/filters',
    { src: '~/plugins/chart.js', mode: 'client' },
    { src: '~/plugins/amCharts.js', mode: 'client' },
    { src: '~/plugins/vue-slick-carousel.js', mode: 'client' },
    { src: '~/plugins/solidLogin.js'},
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
      regular: true,
      solid: true,
      brands: true
    }
  },

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/bootstrap
    '@nuxtjs/axios',
    '@nuxtjs/auth-next',
    'bootstrap-vue/nuxt',
    'vue-scrollto/nuxt',
    '@nuxtjs/toast'
  ],


 /* dynamic route generation */
  generate: {
    fallback: '404.html',
    crawler: true,
    routes() {
      return axios.get(`${process.env.BASE_API_URL}/statistics?dimension=place`).then(res => {
        return res.data.placeGroups.map(place => {
          return {
            route: '/statistics/region/' + place.country.code,
            payload: place.country
          }
        })
      })
    }
  },

  auth: {
    redirect: {
      login : '/signin',
      callback: '/signin/callback',
      home: false,  
    },
    strategies: {
      local: {
        token: {
        property: 'token',
        global: true,
        type: 'Bearer'
        },
        user: {
          property: false,
          autoFetch: true
        },
        endpoints: {
          login: {url: `${process.env.BASE_API_URL}/user/login`, method: 'post', propertyName: 'token' },
          logout: false,
          user: {url: `${process.env.BASE_API_URL}/user/me`, method: 'get'},
        }
      },
      google: {
        clientId:  process.env.GOOGLE_CLIENT_ID,
        codeChallengeMethod: '',
        responseType: 'token id_token',
        scope: ['email', 'profile', 'openid'],
      }
    },
    plugins: [{ src: '~/plugins/apis.js', ssr: true }, {src:'~/plugins/auth.js'}]
  },
 toast: {
      position: 'top-right',
  },
  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
  },

  srcDir: 'src/'
};
