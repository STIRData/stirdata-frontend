export default {
  state: () => ({
    user: null,
    topLevelNuts: [],
    topLevelNace: [],
    regionFeatures: [],
    countriesStatistics: [],
    countriesWithDates: [],
    activitiesStatistics: [],
    totalCompanies: 0,
    searchFilters: [],
    hoveredRegion: null
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
    setCountriesWithDates(state, value) {
      state.countriesWithDates = value;
    },
    setSearchFilters(state, value) {
      state.searchFilters = value;
    },
    setHoveredRegion(state, value) {
      state.hoveredRegion = value;
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
    },
    async fetchCountriesWithDates({ dispatch, commit, state }) {
      let countriesWithDates = await Promise.all(state.countriesStatistics.map( async (stat) =>{
        return new Promise((resolve) => {
          this.$calls.getRegionStatistics(stat.country.code)
            .then( response =>{
              response['countryCode'] = stat.country.code
              response['countryLabel'] = stat.country.label
            resolve(response);
          })
        })
      }))
      countriesWithDates =  countriesWithDates.filter(
        ( stat ) =>
          (stat.dissolutionDateGroups && stat.dissolutionDateGroups.length) ||
          (stat.foundingDateGroups && stat.foundingDateGroups.length))
      commit('setCountriesWithDates', countriesWithDates)

    }
  }
};
