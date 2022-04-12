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
            <div class="maps-notify"><i class="fa fa-info-circle"></i>Click area on the map to select country or region</div>
          </div>
        </div>
      </div>
      <div class="explore-controls">
        <div class="container">
          <div class="row">
            <div class="col-lg-4 col-xl-4 explore-controls-sidebar">
              <div class="sidebar" id="sidebar-accordion">
                <div class="wraps">
                  <div class="sidebar-savedview sidebar-section-wrap">
                    <h3>Saved View </h3>
                    <b-form-select
                      v-model="selectedSavedView"
                      :options="savedViews"
                    ></b-form-select>
                    <div class="savefilter" v-b-toggle.saveview-form>
                      <span class="add">+</span>Save current view
                    </div>
                    <b-collapse class="form" id="saveview-form" appear>
                      <div class="inputform">
                        <span class="label">View Title</span>
                        <input type="text">
                      </div>
                      <div class="inputaction">
                        <button type="button">Save</button>
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
                    <b-form-group v-if="form.nutsTags.length > 0" class="mb-0">
                      <b-form-tags
                        v-model="form.nutsTags"
                        input-id="nuts-tags"
                        input-class="d-none"
                        :input-attrs="{ readonly: 'true' }"
                        class="p-0"
                        tag-class="pill-class"
                        add-button-text=""
                        no-outer-focus
                        size="lg"
                        placeholder=""
                        @input="removeNutsTags"
                      />
                    </b-form-group>
                    <b-collapse class="accordion-collapse" id="collapseCountries">
                      <div class="input-wrap">
                        <img class="search" src="../../assets/img/ic-search.png">
                        <input class="form-control" type="text" id="searchquery" placeholder="">
                      </div>
                      <div class="input-filter">
                        <ul>
                          <li
                            v-for="(nuts, index) in topLevelNuts"
                            :id="'nuts-'+nuts.value"
                            :key="'nuts-'+nuts.value"
                          >
                            <div class="check-wrap d-flex justify-content-between">
                              <b-form-checkbox
                                :id="'nuts-checkbox-'+nuts.value"
                                v-model="form.nuts[nuts.value]"
                                :name="'nuts-checkbox-'+nuts.value"
                                :value=true
                                :unchecked-value=false
                                @change="updateTags(nuts.value, 'nuts')"
                              >
                                {{ nuts.text }}
                              </b-form-checkbox>
                              <div class="plus-expander" data-filter-toggle="#unitedkingdom-region">
                                <span class="expand"></span>
                              </div>
                            </div>
                            <ul class="collapse" id="unitedkingdom-region">
                              <li>
                                <div class="check-wrap">
                                  <input id="country-uk-east" type="checkbox" name="country-uk-east">
                                  <label for="country-uk-east">East Midlands (England)</label><a href="#" data-filter-toggle="#eastmidlands-region"> <span class="expand"></span></a>
                                </div>
                                <ul class="collapse" id="eastmidlands-region">
                                  <li>
                                    <div class="check-wrap">
                                      <input id="country-uk-east-derby" type="checkbox" name="country-uk-east-derby">
                                      <label for="country-uk-east-derby">Derbyshire and Nottinghamshire</label>
                                    </div>
                                  </li>
                                  <li>
                                    <div class="check-wrap">
                                      <input id="country-uk-east-leicestershire" type="checkbox" name="country-uk-east-leicestershire">
                                      <label for="country-uk-east-leicestershire">Leicestershire</label>
                                    </div>
                                  </li>
                                </ul>
                              </li>
                            </ul>
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
                    <b-form-group v-if="form.naceTags.length > 0" class="mb-0">
                      <b-form-tags
                        v-model="form.naceTags"
                        input-id="nace-tags"
                        input-class="d-none"
                        :input-attrs="{ readonly: 'true' }"
                        class="p-0"
                        tag-class="pill-class"
                        add-button-text=""
                        no-outer-focus
                        size="lg"
                        placeholder=""
                        @input="removeNaceTags"
                      />
                    </b-form-group>
                    <b-collapse class="accordion-collapse" id="collapseActivities">
                      <div class="input-wrap">
                        <img class="search" src="../../assets/img/ic-search.png">
                        <input class="form-control" type="text" id="searchquery" placeholder="">
                      </div>
                      <div class="input-filter">
                        <ul>
                          <li
                            v-for="(nace, index) in topLevelNace"
                            :id="'nace-'+nace.value"
                            :key="'nace-'+nace.value"
                          >
                            <div class="check-wrap d-flex justify-content-between">
                              <b-form-checkbox
                                :id="'nace-checkbox-'+nace.value"
                                v-model="form.nace[nace.value]"
                                :name="'nace-checkbox-'+nace.value"
                                :value=true
                                :unchecked-value=false
                                @change="updateTags(nace.value, 'nace')"
                              >
                                <span
                                  v-b-tooltip.hover.top="nace.text"
                                >
                                  {{ nace.text }}
                                </span>
                              </b-form-checkbox>
                              <div class="plus-expander" data-filter-toggle="#unitedkingdom-region">
                                <span class="expand"></span>
                              </div>
                            </div>
                            <ul class="collapse" id="unitedkingdom-region">
                              <li>
                                <div class="check-wrap">
                                  <input id="country-uk-east" type="checkbox" name="country-uk-east">
                                  <label for="country-uk-east">East Midlands (England)</label><a href="#" data-filter-toggle="#eastmidlands-region"> <span class="expand"></span></a>
                                </div>
                                <ul class="collapse" id="eastmidlands-region">
                                  <li>
                                    <div class="check-wrap">
                                      <input id="country-uk-east-derby" type="checkbox" name="country-uk-east-derby">
                                      <label for="country-uk-east-derby">Derbyshire and Nottinghamshire</label>
                                    </div>
                                  </li>
                                  <li>
                                    <div class="check-wrap">
                                      <input id="country-uk-east-leicestershire" type="checkbox" name="country-uk-east-leicestershire">
                                      <label for="country-uk-east-leicestershire">Leicestershire</label>
                                    </div>
                                  </li>
                                </ul>
                              </li>
                            </ul>
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
                    <b-form-group v-if="form.dateTags.length > 0" class="mb-0">
                      <b-form-tags
                        v-model="form.dateTags"
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
                    <b-collapse class="accordion-collapse" id="collapseRegistration">
                      <div class="form registrationdate">
                        <div class="datepicker">
                          <div class="label">After</div>
                          <button class="icon" type="button" @click="openDatepicker('afterDate')">
                            <font-awesome-icon :icon="['far', 'calendar']" />
                          </button>
                          <div class="dialog">
                            <label @click="openDatepicker('afterDate')">
                              <span v-if="form.foundingStartDate">
                                {{ form.foundingStartDate | formatDateForCompany }}
                              </span>
                            </label>
                            <div id="afterDate" class="calendar-container d-none">
                              <b-calendar
                                v-model="form.foundingStartDate"
                                locale="en-US"
                                :start-weekday="1"
                                :show-decade-nav="true"
                                @input="selectDate('After: ', form.foundingStartDate)"
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
                              <span v-if="form.foundingEndDate">
                                {{ form.foundingEndDate | formatDateForCompany }}
                              </span>
                            </label>
                            <div id="beforeDate" class="calendar-container d-none">
                              <b-calendar
                                v-model="form.foundingEndDate"
                                locale="en-US"
                                :start-weekday="1"
                                :show-decade-nav="true"
                                @input="selectDate('Before: ', form.foundingEndDate)"
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
                        <a @click="resetFilters()">Reset</a>
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

export default {
  components: {
    ExploreResults: () => import("../../components/explore/ExploreResults"),
    Breadcrumb: () => import("../../components/Breadcrumb"),
    Spinner: () => import("../../components/Spinner")
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
        { value: null, text: 'Select Saved View' },
        { value: 1, text: 'Belgium agriculture' },
        { value: 2, text: 'Greece companies in IT' },
        { value: 3, text: 'Manufacturing in Latvia' }
      ],
      loadingQueries: [],
      form: {
        nuts: [],
        nutsTags: [],
        gnuts3: false,
        nace: [],
        naceTags: [],
        gnace: false,
        dateTags: [],
        foundingStartDate: null,
        foundingEndDate: null
      },
      filters: {
        place: [],
        activity: [],
        afterDate: '',
        beforeDate: ''
      },
      tableColumns: [],
      nutsOptions: [],
      naceOptions: [],
      queries: [],
      queriesGrouped: [],
      results: null,
      pageSize: 20,
      endpoints: {},
      selectedEntry: {}
    };
  },

  async mounted() {
    if (!this.topLevelNuts.length) {
      await this.$store.dispatch('fetchTopLevelNuts');
    }
    this.topLevelNuts.forEach(nuts => {
      this.form.nuts[nuts.value] = false;
    });

    if (!this.topLevelNace.length) {
      await this.$store.dispatch('fetchTopLevelNace');
    }
  },

  computed: {
    ...mapState({
      topLevelNuts: state => state.topLevelNuts,
      topLevelNace: state => state.topLevelNace,
      searchFilters: state => state.searchFilters
    })
  },

  methods: {
    updateTags(tagCode, type) {
      let formTags = type + 'Tags';
      if (this.form[type][tagCode]) {
        this.form[formTags].push(tagCode);
      }
      else {
        let index = this.form[formTags].findIndex(code => code == tagCode);
        this.form[formTags].splice(index, 1);
      }
    },
    removeNutsTags(nutsTags) {
      Object.keys(this.form.nuts).forEach(nuts => this.form.nuts[nuts] = false);
      nutsTags.forEach(tag => {
        this.form.nuts[tag] = true;
      });
    },
    removeNaceTags(naceTags) {
      Object.keys(this.form.nace).forEach(nace => this.form.nace[nace] = false);
      naceTags.forEach(tag => {
        this.form.nace[tag] = true;
      });
    },
    openDatepicker(id) {
      let calendars = document.getElementsByClassName('calendar-container');
      calendars.forEach(cal => cal.classList.add('d-none'));

      let calendar = document.getElementById(id);
      calendar.classList.remove('d-none');
    },
    selectDate(when, date) {
      let index = this.form.dateTags.findIndex(tag => tag.startsWith(when));
      if (index >= 0) {
        this.form.dateTags.splice(index, 1);
      }
      this.form.dateTags.push(when + this.$options.filters.formatDateForCompany(date));
      this.form.dateTags.sort();
      let calendars = document.getElementsByClassName('calendar-container');
      calendars.forEach(cal => cal.classList.add('d-none'));
    },
    resetFilters() {
      this.form.nutsTags = [];
      this.form.naceTags = [];
      this.form.dateTags = [];
      Object.keys(this.form.nuts).forEach(nuts => this.form.nuts[nuts] = false);
      Object.keys(this.form.nace).forEach(nace => this.form.nace[nace] = false);
      this.$store.commit('setSearchFilters', []);
    },
    validateInput() {
      let validFoundingEndDate =
        !this.form.foundingEndDate ||
        !this.form.foundingStartDate ||
        this.form.foundingEndDate > this.form.foundingStartDate;
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
      if (this.form.nutsTags.length > 0 || this.form.naceTags.length > 0) {
        this.$bvToast.toast(
          'You have to select at least one region and one activity',
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
      if (!this.validateInput('')) {
        return;
      }
      // TODO: Replace these static filters with values from the form
      console.log(this.form)
      let filters = [
        {
          code: 'FI',
          name: 'Finland',
          place: [
            "nuts:FI1"
          ],
          activity: [
            "nace-rev2:C",
            "nace-rev2:D"
          ]
        },
        {
          code: 'UK',
          name: 'United Kingdom',
          place: [
            "nuts:UK1"
          ],
          activity: [
            "nace-rev2:C",
            "nace-rev2:D"
          ]
        }
      ]
      this.$store.commit('setSearchFilters', filters);
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

.fa-chevron-down {
  width: 19px;
  color: #525558;
  transform: rotate(0deg);
  transition: transform 0.2s linear;
}

::v-deep .fa-chart-column,
::v-deep .fa-list {
  width: 14px !important;
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
