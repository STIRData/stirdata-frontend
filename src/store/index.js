export default {
  state: () => ({
    user: null,
    topLevelNuts: [],
    topLevelNace: [],
    regionFeatures: [],
    countriesStatistics: [],
    activitiesStatistics: [],
    totalCompanies: 0,
    searchFilters: []
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
    setRegionFeatures(state, value) {
      state.regionFeatures = value;
    },
    setCountriesStatistics(state, value) {
      state.countriesStatistics = value;
    },
    setActivitiesStatistics(state, value) {
      state.activitiesStatistics = value;
    },
    setTotalCompanies(state, value) {
      state.totalCompanies = value;
    },
    setSearchFilters(state, value) {
      state.searchFilters = value;
    }
  },

  getters: {
    user(state) {
      return state.user;
    },
    isAuthenticated(state) {
      return !!state.user;
    }
  },

  actions: {
    fetchTopLevelNuts({ dispatch, commit }) {
      return this.$calls.getTopLevel('nuts?top=stirdata')
        .then(nuts => commit('setTopLevelNuts', nuts));
    },
    fetchTopLevelNace({ dispatch, commit }) {
      return this.$calls.getTopLevel('nace')
        .then(nace => commit('setTopLevelNace', nace));
    },
    fetchRegionFeatures({ dispatch, commit }) {
      return this.$calls.getRegionFeatures()
        .then(features => commit('setRegionFeatures', features));
    },
    fetchTopLevelStatistics({ dispatch, commit }) {
      return this.$calls.getStatistics()
        .then(response => {
          commit('setTotalCompanies', response.placeGroups.reduce((previous, current) => previous + current.count, 0));
          commit('setActivitiesStatistics', response.activityGroups);
          commit('setCountriesStatistics', response.placeGroups);
        });
    }
  }
};
