<template>
  <div class="col-lg-8 col-xl-8 explore-controls-results">
    <div class="headingtext resultheading">
      <h1>Results</h1>
    </div>
    <b-tabs class="nav-tabs">
      <b-tab
        v-for="country of searchFilters"
        class="active"
        :id="'tab-'+country.code"
        :title="country.name"
        :key="'tab-'+country.code"
      >
        <div class="tab-pane fade show active accordion" id="country-1">
          <div id="country-1-accordion">

            <h2
              class="accordion-heading"
              v-b-toggle.collapseCompanies
              role="tab"
            >
              <a class="accordion-companies-button"> Result Companies</a>
            </h2>
            <b-collapse
              class="accordion-collapse collapse"
              id="collapseCompanies"
              accordion="my-accordion"
              visible
              role="tabpanel"
            >
              <ResultsCompanies
                :countryCode="country.code"
              />
            </b-collapse>

            <h2
              class="accordion-heading"
              v-b-toggle.collapseStatistics
              role="tab"
            >
              <a href="javascript:void(0);" class="accordion-statistics-button">
                Result Statistics
              </a>
            </h2>
            <b-collapse
              class="accordion-collapse"
              id="collapseStatistics"
              accordion="my-accordion"
              role="tabpanel"
            >
              <div class="filter-stat-option">
                <div class="btn-group filter-left-option" role="group">
                  <b-form-group>
                    <b-form-radio-group
                      id="btn-radios-1"
                      v-model="filterSelected"
                      button-variant="outline-primary"
                      class="btn-check"
                      size="lg"
                      name="radio-btn-outline"
                      buttons
                    >
                      <b-form-radio
                        value="region"
                        v-b-tooltip.hover
                        title="Group based on Region"
                      >
                        Region
                      </b-form-radio>
                      <b-form-radio
                        value="activity"
                        v-b-tooltip.hover
                        title="Group based on Activity"
                      >
                        Activity
                      </b-form-radio>
                      <!-- <b-form-radio
                        v-if="layoutSelected == 'chart'"
                        value="date"
                        v-b-tooltip.hover
                        title="Group based on Date"
                      >
                        Date
                      </b-form-radio> -->
                    </b-form-radio-group>
                  </b-form-group>
                </div>
                <!-- <div class="form-check form-switch collapse">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    id="flexSwitchCheckDefault"
                  />
                  <label
                    class="form-check-label"
                    for="flexSwitchCheckDefault"
                  >
                    Group by Activity
                  </label>
                </div> -->
                <div class="btn-group filter-right-option" role="group">
                  <b-form-group>
                    <b-form-radio-group
                      id="btn-radios-1"
                      v-model="layoutSelected"
                      button-variant="outline-primary"
                      class="btn-check"
                      size="lg"
                      name="radio-btn-outline"
                      buttons
                    >
                      <b-form-radio
                        value="chart"
                        v-b-tooltip.hover
                        title="Chart View"
                      >
                        <font-awesome-icon :icon="['fas', 'chart-column']" class="w-100" />
                      </b-form-radio>
                      <b-form-radio
                        value="list"
                        v-b-tooltip.hover
                        title="List View"
                      >
                        <font-awesome-icon :icon="['fas', 'list']" class="w-100" />
                      </b-form-radio>
                    </b-form-radio-group>
                  </b-form-group>
                </div>
              </div>
              <ResultsStatistics
                :countryCode="country.code"
                :layout="layoutSelected"
                :filter="filterSelected"
              />
            </b-collapse>
          </div>
        </div>
      </b-tab>
    </b-tabs>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: "ExploreResults",

  components: {
    ResultsCompanies: () => import("./ResultsCompanies"),
    ResultsStatistics: () => import("./ResultsStatistics")
  },

  data() {
    return {
      filterSelected: "region",
      layoutSelected: "chart"
    };
  },

  mounted() {
  },

  computed: {
    ...mapState({
      searchFilters: state => state.searchFilters
    })
  },

  watch: {
    searchFilters(newValue, oldValue) {
      if (JSON.stringify(newValue) === JSON.stringify(oldValue)) {
        return;
      }
      window.scrollTo({top: 0, behavior: 'smooth'});
    }
  },

  methods: {
  },
};
</script>

<style lang="scss" scoped>
</style>
