export default {
  state: () => ({
    user: null,
    topLevelNuts: [],
    topLevelNace: [],
    // countryRegions: [],
    // countryGeoJSON: null
  }),

  mutations: {
    setUser(state, value) {
      state.user = value;
    },
    setTopLevelNuts(state, value) {
      state.topLevelNuts = value;
    },
    setTopLevelNace(state, value) {
      state.topLevelNace = value;
    },
    // setCountryRegions(state, value) {
    //   state.countryRegions = value;
    // },
    // setCountryGeoJSON(state, value) {
    //   state.countryGeoJSON = value;
    // }
  },

  getters: {
    user(state) {
      return state.user;
    },
    isAuthenticated(state) {
      return !!state.user;
    },
    // countryRegions(state) {
    //   return state.countryRegions;
    // },
    // countryGeoJSON(state) {
    //   return state.countryGeoJSON;
    // }
  },

  actions: {
    fetchTopLevelNuts({ dispatch, commit }) {
      return this.$calls.getTopLevel('nuts')
        .then(nuts => commit('setTopLevelNuts', nuts));
    },
    fetchTopLevelNace({ dispatch, commit }) {
      return this.$calls.getTopLevel('nace')
        .then(nace => commit('setTopLevelNace', nace.filter(item => item.value.includes("nace-rev2"))));
    },
    // fetchCountryRegions({ dispatch, commit }, uri) {
    //   return this.$calls.getCountryRegions(uri)
    //     .then(response => commit('setCountryRegions', response));
    // },
    // fetchCountryGeoJSON({ dispatch, commit }, uri) {
    //   return this.$calls.getCountryGeoJSON(uri)
    //     .then(geoJSON => commit('setCountryGeoJSON', geoJSON));
    // }
  }
}
