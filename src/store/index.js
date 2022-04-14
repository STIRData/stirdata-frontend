export default {
  state: () => ({
    user: null,
    topLevelNuts: [],
    topLevelNace: [],
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
