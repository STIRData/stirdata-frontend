<template>
  <main role="main">
    <b-container>
      <Breadcrumb :breadcrumb_items="breadcrumb_items" />
    </b-container>
    <section class="explore">
      <div class="explore-intro">
        <div class="container">
          <div class="headingtext">
            <h1>Explore</h1>
          </div>
        </div>
      </div>
      <div class="explore-map">
        <div class="container-fluid">
          <div class="explore-map-section" id="explore-map-section">
            <!-- TODO: Replaced img with amchart maps-->
            <img class="tmpmap" src="../../assets/img/img-temp-map.png">
            <!-- <div class="maps-notify"><i class="fa fa-info-circle"></i>Click area on the map to select country or region</div> -->
          </div>
        </div>
      </div>
      <div class="explore-controls">
        <div class="container">
          <div class="row">
            <div class="col-lg-4 col-xl-4 explore-controls-sidebar">
              <div class="sidebar" id="sidebar-accordion">
                <div class="wraps">
                  <div v-if="isAuthenticated" class="sidebar-savedview sidebar-section-wrap">
                    <h3>Saved View </h3>
                    <b-form-select
                      v-model="selectedSavedView"
                      :options="savedViews"
                      @change="selectSavedView()"
                    ></b-form-select>
                    <div class="savefilter" v-b-toggle.saveview-form>
                      <span class="add">+</span>Save current view
                    </div>
                    <b-collapse
                      id="saveview-form"
                      class="form"
                      v-model="toggles.saveview"
                    >
                      <div class="inputform">
                        <span class="label">View Title</span>
                        <b-form-input type="text" v-model="newViewTitle"></b-form-input>
                      </div>
                      <div class="inputaction">
                        <button type="button" @click="saveCurrentView()">Save</button>
                      </div>
                    </b-collapse>
                  </div>
                  <!-- Regions -->
                  <div class="sidebar-countries sidebar-section-wrap">
                    <h3 id="heading-countries">
                      <div v-b-toggle.collapseCountries class="accordion-button d-flex justify-content-between">
                        Countries &amp; Regions
                        <font-awesome-icon icon="chevron-down" />
                      </div>
                    </h3>
                    <b-form-group v-if="nutsTags.length > 0" class="mb-0">
                      <b-form-tags
                        v-model="nutsTags"
                        input-id="nuts-tags"
                        input-class="d-none"
                        :input-attrs="{ readonly: 'true' }"
                        class="p-0"
                        tag-class="pill-class"
                        add-button-text=""
                        no-outer-focus
                        size="lg"
                        placeholder=""
                      />
                    </b-form-group>
                    <b-collapse
                      id="collapseCountries"
                      class="accordion-collapse"
                      v-model="toggles.countries"
                    >
                      <div class="input-wrap">
                        <img class="search" src="../../assets/img/ic-search.png">
                        <b-form-input
                          v-model="searchNutsPrefix"
                          id="searchNuts"
                          class="form-control"
                          placeholder=""
                          @keydown.enter.native="searchTags('nuts-lau', 'searchNutsResults', searchNutsPrefix)"
                        ></b-form-input>
                        <div
                          v-if="searchNutsPrefix.length > 0"
                          class="delete-text"
                        >
                          <font-awesome-icon
                            class="remove"
                            :icon="['far', 'fa-circle-xmark']"
                            @click="clearSearch('searchNutsPrefix', 'searchNutsResults')"
                          />
                        </div>
                      </div>
                      <ul v-if="searchNutsResults.length > 0" class="searchNutsResults expandList">
                        <li
                          v-for="nutsResult in searchNutsResults"
                          :key="nutsResult.text"
                          @click="selectSearchResult('nuts', nutsResult, 'searchNutsPrefix', 'searchNutsResults')"
                        >
                          <div>
                            {{ nutsResult.text }}
                          </div>
                        </li>
                      </ul>
                      <div class="input-filter">
                        <ul>
                          <li
                            v-for="(nuts) in topLevelNuts"
                            :id="'nuts-'+nuts.value"
                            :key="'nuts-'+nuts.value"
                          >
                            <tree-menu-node
                              menuType="nuts"
                              :menuItem="nuts"
                              :tags="nutsTags"
                              @select-tag="selectTag"
                            />
                          </li>
                        </ul>
                      </div>
                    </b-collapse>
                  </div>
                  <!-- Activities -->
                  <div class="sidebar-activities sidebar-section-wrap">
                    <h3 id="heading-activities">
                      <div v-b-toggle.collapseActivities class="accordion-button d-flex justify-content-between">
                        Business Activities
                        <font-awesome-icon icon="chevron-down" />
                      </div>
                    </h3>
                    <b-form-group v-if="naceTags.length > 0" class="mb-0">
                      <b-form-tags
                        v-model="naceTags"
                        input-id="nace-tags"
                        input-class="d-none"
                        :input-attrs="{ readonly: 'true' }"
                        class="p-0"
                        tag-class="pill-class"
                        add-button-text=""
                        no-outer-focus
                        size="lg"
                        placeholder=""
                      />
                    </b-form-group>
                    <b-collapse
                      id="collapseActivities"
                      class="accordion-collapse"
                      v-model="toggles.activities"
                    >
                      <div class="input-wrap">
                        <img class="search" src="../../assets/img/ic-search.png">
                        <b-form-input
                          v-model="searchNacePrefix"
                          id="searchNace"
                          class="form-control"
                          placeholder=""
                          @keydown.enter.native="searchTags('nace', 'searchNaceResults', searchNacePrefix)"
                        ></b-form-input>
                        <div
                          v-if="searchNacePrefix.length > 0"
                          class="delete-text"
                        >
                          <font-awesome-icon
                            class="remove"
                            :icon="['far', 'fa-circle-xmark']"
                            @click="clearSearch('searchNacePrefix', 'searchNaceResults')"
                          />
                        </div>
                      </div>
                      <ul v-if="searchNaceResults.length > 0" class="searchNaceResults expandList">
                        <li
                          v-for="naceResult in searchNaceResults"
                          :key="naceResult.text"
                          @click="selectSearchResult('nace', naceResult, 'searchNacePrefix', 'searchNaceResults')"
                        >
                          <div>
                            {{ naceResult.text }}
                          </div>
                        </li>
                      </ul>
                      <div class="input-filter">
                        <ul>
                          <li
                            v-for="(nace) in topLevelNace"
                            :id="'nace-'+nace.value"
                            :key="'nace-'+nace.value"
                          >
                          <tree-menu-node
                            menuType="nace"
                            :menuItem="nace"
                            :tags="naceTags"
                            @select-tag="selectTag"
                          />
                          </li>
                        </ul>
                      </div>
                    </b-collapse>
                  </div>
                  <!-- Registration Date -->
                  <div class="sidebar-registration sidebar-section-wrap">
                    <h3 id="heading-registration">
                      <div v-b-toggle.collapseRegistration class="accordion-button d-flex justify-content-between">
                        Registration Date
                        <font-awesome-icon icon="chevron-down" />
                      </div>
                    </h3>
                    <b-form-group v-if="dateTags.length > 0" class="mb-0">
                      <b-form-tags
                        v-model="dateTags"
                        input-id="date-tags"
                        input-class="d-none"
                        :input-attrs="{ readonly: 'true' }"
                        class="p-0"
                        tag-class="pill-class"
                        add-button-text=""
                        no-outer-focus
                        size="lg"
                        placeholder=""
                      />
                    </b-form-group>
                    <b-collapse
                      id="collapseRegistration"
                      class="accordion-collapse"
                      v-model="toggles.registration"
                    >
                      <div class="form registrationdate">
                        <div class="datepicker">
                          <div class="label">After</div>
                          <button class="icon" type="button" @click="openDatepicker('afterDate')">
                            <font-awesome-icon :icon="['far', 'calendar']" />
                          </button>
                          <div class="dialog">
                            <label @click="openDatepicker('afterDate')">
                              <span v-if="foundingStartDate">
                                {{ foundingStartDate | formatDateForCompany }}
                              </span>
                            </label>
                            <div id="afterDate" class="calendar-container d-none">
                              <b-calendar
                                v-if="toggles.afterDate"
                                v-model="foundingStartDate"
                                locale="en-US"
                                :start-weekday="1"
                                :show-decade-nav="true"
                                @input="selectDate('After: ', foundingStartDate)"
                                v-click-outside="closeDatepickers"
                              />
                            </div>
                          </div>
                        </div>
                        <div class="datepicker">
                          <div class="label">Before</div>
                          <button class="icon" type="button" @click="openDatepicker('beforeDate')">
                            <font-awesome-icon :icon="['far', 'calendar']" />
                          </button>
                          <div class="dialog">
                            <label @click="openDatepicker('beforeDate')">
                              <span v-if="foundingEndDate">
                                {{ foundingEndDate | formatDateForCompany }}
                              </span>
                            </label>
                            <div id="beforeDate" class="calendar-container d-none">
                              <b-calendar
                                v-if="toggles.beforeDate"
                                v-model="foundingEndDate"
                                locale="en-US"
                                :start-weekday="1"
                                :show-decade-nav="true"
                                @input="selectDate('Before: ', foundingEndDate)"
                                v-click-outside="closeDatepickers"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </b-collapse>
                  </div>
                  <!-- Form buttons -->
                  <div class="sidebar-action sidebar-section-wrap">
                    <div class="inputaction">
                      <button type="button" @click="search()">
                        Search
                      </button>
                      <span class="note space">
                        <a @click="resetFilters(true)">Reset</a>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <ExploreResults />
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script>
import { mapState } from 'vuex';
import vClickOutside from 'v-click-outside';

export default {
  components: {
    TreeMenuNode: () => import("../../components/TreeMenuNode"),
    ExploreResults: () => import("../../components/explore/ExploreResults"),
    Breadcrumb: () => import("../../components/Breadcrumb"),
    Spinner: () => import("../../components/Spinner")
  },

  directives: {
    clickOutside: vClickOutside.directive
  },

  data() {
    return {
      show: true,
      loading: false,
      breadcrumb_items: [
        {
          text: "HOME",
          to: { name: "index" },
        },
        {
          text: "EXPLORE",
          active: true,
        }
      ],
      selectedSavedView: null,
      savedViews: [
        { value: null, text: 'Select Saved View', disabled: true }
      ],
      toggles: {
        saveview: false,
        countries: false,
        activities: false,
        registration: false,
        afterDate: false,
        beforeDate: false
      },
      searchNutsPrefix: '',
      searchNutsResults: [],
      searchNacePrefix: '',
      searchNaceResults: [],
      nutsTags: [],
      naceTags: [],
      dateTags: [],
      foundingStartDate: null,
      foundingEndDate: null,
      newViewTitle: ''
    };
  },

  async mounted() {
    if (!this.topLevelNuts.length) {
      await this.$store.dispatch('fetchTopLevelNuts');
    }
    if (!this.topLevelNace.length) {
      await this.$store.dispatch('fetchTopLevelNace');
    }
    if (this.isAuthenticated) {
      this.$calls.getSavedViews().then(response => {
        response.forEach(view => this.savedViews.push({ value: view.id, text: view.name}));
      });
    }
  },

  computed: {
    ...mapState({
      topLevelNuts: state => state.topLevelNuts,
      topLevelNace: state => state.topLevelNace,
      searchFilters: state => state.searchFilters
    }),
    isAuthenticated() {
      return this.$auth.loggedIn;
    }
  },

  watch: {
    nutsTags(newValue, oldValue) {
      let tagsDifference = oldValue.filter(tag => !newValue.includes(tag));

      if (tagsDifference.length == 1) {
        let checkbox = document.getElementById('nuts-checkbox-'+tagsDifference[0].split(':')[1]);
        if (checkbox) {
          checkbox.checked = false;
        }
      }
    },
    naceTags(newValue, oldValue) {
      let tagsDifference = oldValue.filter(tag => !newValue.includes(tag));

      if (tagsDifference.length == 1) {
        let checkbox = document.getElementById('nace-checkbox-'+tagsDifference[0].split(':')[1]);
        if (checkbox) {
          checkbox.checked = false;
        }
      }
    },
    dateTags(newValue, oldValue) {
      let before = false;
      let after = false;
      newValue.forEach(tag => {
        if (tag.startsWith("After")) {
          after = true;
        }
        if (tag.startsWith("Before")) {
          before = true;
        }
      })
      if (!before) {
        this.foundingEndDate = null;
      }
      if (!after) {
        this.foundingStartDate = null;
      }
    }
  },

  methods: {
    async selectSavedView() {
      this.resetFilters(false);
      let view = await this.$calls.getSavedView(this.selectedSavedView);

      view.place.forEach(place => {
        this.selectSearchResult('nuts', { type: place.split(':')[0], value: place.split(':')[1] }, 'searchNutsPrefix', 'searchNutsResults');
      });
      view.activity.forEach(activity => {
        this.selectSearchResult('nace', { type: activity.split(':')[0], value: activity.split(':')[1] }, 'searchNacePrefix', 'searchNaceResults');
      });
      if (!!view.startDate) {
        this.foundingStartDate = view.startDate;
        this.selectDate('After: ', view.startDate);
      }
      if (!!view.endDate) {
        this.foundingEndDate = view.endDate;
        this.selectDate('Before: ', view.endDate);
      }
    },
    async saveCurrentView() {
      if (!this.validateInput()) {
        return;
      }
      let filters = this.buildFilters();
      let view = {
        name: this.newViewTitle,
        activity: filters[0].activity,
        startDate: filters[0].date ? filters[0].date.split(':')[0] : null,
        endDate: filters[0].date ? filters[0].date.split(':')[1] : null,
        place: filters.reduce((a,b) => a.concat(b.place), [])
      }
      await this.$calls.saveNewView(view)
        .then(response => {
          this.$bvToast.toast('Custom query saved successfully', {
              variant: 'success',
              title: 'Success',
              solid: true
          });
          this.toggles.saveview = false;
        })
        .catch(error => {
          this.$bvToast.toast('Error while saving query', {
              variant: 'danger',
              title: 'Error',
              solid: true
          });
        });
      this.$calls.getSavedViews()
        .then(response => {
          this.savedViews = [{ value: null, text: 'Select Saved View', disabled: true }];
          response.forEach(view => this.savedViews.push({ value: view.id, text: view.name}));
          this.selectedSavedView = null;
        })
        .catch(error => console.error(error));
    },
    searchTags(type, resultsArray, prefix) {
      if (prefix.length == 0) {
        return;
      }

      this.$calls.searchLabels(type, prefix)
        .then(response => {
          this[resultsArray] = response;
        })
        .catch(error => console.error(error));
    },
    clearSearch(prefix, results) {
      this[prefix] = '';
      this[results] = [];
    },
    selectSearchResult(type, tag, prefix, results) {
      let checkbox = document.getElementById(`${type}-checkbox-${tag.value}`);
      if (checkbox) {
        checkbox.checked = true;
      }
      this.updateTags(`${tag.type}:${tag.value}`, type, true);
      this.clearSearch(prefix, results);
    },
    selectTag(e) {
      this.updateTags(e.tagCode, e.type, e.checked);
    },
    updateTags(tagCode, type, checked) {
      let formTags = type + 'Tags';

      if (checked) {
        this[formTags].push(tagCode);
      }
      else {
          let index = this[formTags].findIndex(code => code == tagCode);
          this[formTags].splice(index, 1);
      }
    },
    openDatepicker(id) {
      let calendar = document.getElementById(id);
      calendar.classList.remove('d-none');
      this.toggles[id] = true;
    },
    closeDatepickers() {
      let calendars = document.getElementsByClassName('calendar-container');
      calendars.forEach(cal => cal.classList.add('d-none'));
      this.toggles.afterDate = false;
      this.toggles.beforeDate = false;
    },
    selectDate(when, date) {
      let index = this.dateTags.findIndex(tag => tag.startsWith(when));
      if (index >= 0) {
        this.dateTags.splice(index, 1);
      }
      this.dateTags.push(when + this.$options.filters.formatDateForCompany(date));
      this.dateTags.sort();
      this.closeDatepickers();
    },
    resetFilters(resetSavedView) {
      this.nutsTags = [];
      this.naceTags = [];
      this.dateTags = [];
      this.foundingStartDate = null;
      this.foundingEndDate = null;
      if (resetSavedView) {
        this.selectedSavedView = null;
      }
      document.getElementsByClassName('custom-control-input').forEach(el => el.checked = false);

      this.$store.commit('setSearchFilters', []);
    },
    buildFilters() {
      let filters = [];
      let countries = {};
      // Fork queries based on the country of the nutsTags
      for (let nuts of this.nutsTags) {
        let country = nuts.split(':')[1].substring(0, 2);
        if (!countries[country]) {
          countries[country] = [];
        }
        countries[country].push(nuts);
      }

      // Build filters and query for each country
      for (let country of Object.keys(countries)) {
        let countryName = '';
        for (let topNuts of this.topLevelNuts) {
          if (topNuts.value == country) {
            countryName = topNuts.text.split(' - ')[1];
            break;
          }
        }
        let filter = {
          code: country,
          name: countryName,
          place: countries[country],
          activity: this.naceTags
        };
        filter.query = `place=${filter.place.join()}&activity=${filter.activity.join()}`;
        if (this.foundingStartDate || this.foundingEndDate) {
          filter.date = (this.foundingStartDate ?? '') + ':' + (this.foundingEndDate ?? '');
          filter.query += `&founding=date-range:${filter.date}`;
        }
        filters.push(filter);
      }
      return filters;
    },
    validateInput() {
      let validFoundingEndDate =
        !this.foundingEndDate ||
        !this.foundingStartDate ||
        this.foundingEndDate > this.foundingStartDate;
      if (!validFoundingEndDate) {
        this.$bvToast.toast(
          'Invalid date range',
          {
            variant: 'danger',
            title: 'Warning',
            solid: true
          }
        );
        return false;
      }
      if (this.nutsTags.length == 0) {
        this.$bvToast.toast(
          'You have to select at least one region',
          {
            variant: 'danger',
            title: 'Warning',
            solid: true
          }
        );
        return false;
      }
      return true;
    },
    search() {
      if (!this.validateInput()) {
        return;
      }

      let filters = this.buildFilters();

      // Initiate search queries
      // Shallow-copy the filters to avoid mutating vuex store state outside mutation handlers
      this.$store.commit('setSearchFilters', JSON.parse(JSON.stringify(filters)));
      // Collapse open menus
      this.toggles.saveview = false;
      this.toggles.countries = false;
      this.toggles.activities = false;
      this.toggles.registration = false;
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../../assets/scss/variables.scss";

.custom-select {
  border-color: $text-first-color;
  border-radius: 4px;
  padding: 10px;
  margin-top: 15px;
  height: inherit;
  color: #212529;
  background-image: $form-select-indicator;
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  background-size: 16px 12px;
}

.input-wrap .delete-text .remove {
  position: absolute;
  right: 15px;
  top: 15px;
  width: 16px;

  &:hover {
    cursor: pointer;
  }
}

ul.searchNutsResults,
ul.searchNaceResults {
  list-style-type: none;
  padding-left: 0;
  margin-top: 1px;
  position: absolute;
  background-color: white;
  border: 1px solid black;
  border-radius: 4px;
  z-index: 2;
  width: 100%;

  li {
    border-radius: 4px;
    padding: 4px 12px 4px 12px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    &:hover {
      cursor: pointer;
      background-color: $list-border-color;
    }
  }
}

::v-deep .fa-chart-column,
::v-deep .fa-list {
  width: 14px !important;
}

.fa-chevron-down {
  width: 19px;
  color: #525558;
  transform: rotate(0deg);
  transition: transform 0.2s linear;
}

:not(.collapsed) > .fa-chevron-down {
  color: #377fe8;
  transform: rotate(-180deg);
  transition: transform 0.2s linear;
}

.b-form-tags {
  padding: 0;
  border: 0;
  background-color: inherit;
}

::v-deep .pill-class {
  background: $pills-color;
  padding: 6px 10px;
  border-radius: 4px;
  font-size: 0.875rem;
  color: #fff;
  margin-right: 7px;
}

::v-deep button.b-form-tag-remove {
  color: rgba(255, 255, 255, 1);
  margin-left: 6px;
  font-weight: normal;
  font-size: 14pt;
}

.form-control {
  height: inherit;
}

.custom-control.custom-checkbox {
  width: 97%;
  padding-left: 0;

  ::v-deep .custom-control-label::before {
    display: none;
  }
}

.note.space:hover {
  cursor: pointer;
  text-decoration: underline;
}

::v-deep .toast-header {
  height: fit-content;
}

::v-deep .b-calendar {
  position: absolute;
  right: -271px;
  top: -1px;
}
::v-deep .b-calendar-inner {
  background-color: #eff3f8;
  z-index: 2;
  padding: 0.5rem;
  border: 1px solid black;
  border-radius: 0.25rem;
}
::v-deep .b-calendar .b-calendar-header {
  height: fit-content;
}
::v-deep .b-calendar .b-calendar-grid {
  margin-top: 0 !important;
  padding: 0 !important;
}
::v-deep .b-calendar-grid-caption {
  height: fit-content;
}
::v-deep .b-calendar output {
  margin-top: 0 !important;
  padding: 0.4rem 0.25rem 0.25rem 0.25rem !important
}
::v-deep .b-calendar-grid-help {
  display: none;
}
</style>
