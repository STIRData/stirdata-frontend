export default {
  state: () => ({
    user: null,
    topLevelNuts: [],
    topLevelNace: [],
    countriesStatistics: [],
    activitiesStatistics: [],
    totalCompanies: 0
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
    setCountriesStatistics(state, value) {
      state.countriesStatistics = value;
    },
    setActivitiesStatistics(state, value) {
      state.activitiesStatistics = value;
    },
    setTotalCompanies(state, value) {
      state.totalCompanies = value;
    }
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
    }
    // countryRegions(state) {
    //   return state.countryRegions;
    // },
    // countryGeoJSON(state) {
    //   return state.countryGeoJSON;
    // }
  },

  actions: {
    fetchTopLevelNuts({ dispatch, commit }) {
      return this.$calls.getTopLevel('nuts?top=stirdata')
        .then(nuts => commit('setTopLevelNuts', nuts));
    },
    fetchTopLevelNace({ dispatch, commit }) {
      return this.$calls.getTopLevel('nace')
        .then(nace => commit('setTopLevelNace', nace.filter(item => item.value.includes('nace-rev2'))));
    },
    fetchTopLevelStatistics({ dispatch, commit }) {
      return this.$calls.getStatistics()
        .then(response => {
          commit('setTotalCompanies', response.placeGroups.reduce((previous, current) => previous + current.count, 0));
          commit('setActivitiesStatistics', response.activityGroups);
          commit('setCountriesStatistics', response.placeGroups);
        });
    }
    // fetchCountryRegions({ dispatch, commit }, uri) {
    //   return this.$calls.getCountryRegions(uri)
    //     .then(response => commit('setCountryRegions', response));
    // },
    // fetchCountryGeoJSON({ dispatch, commit }, uri) {
    //   return this.$calls.getCountryGeoJSON(uri)
    //     .then(geoJSON => commit('setCountryGeoJSON', geoJSON));
    // }
  }
};
