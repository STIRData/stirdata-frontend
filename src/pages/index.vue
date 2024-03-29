<template>
  <main role="main">
    <div v-if="fetched" class="maps homepagemap">
      <SvgMap />
    </div>
    <section class="homepage">
      <div class="container">
        <div class="row">
          <div class="col-xl-6 col-lg-6">
            <div class="homepage-hero">
              <h1><span>Explore</span> registered<br>companies in Europe</h1>
              <p>STIRDATA is an online platform for searching, navigating, synthetically analysing, and visualising company-related open data content.</p>
              <nav class="heronav">
                <ul>
                  <li>
                    <b-link
                      class="button"
                      :to="{ name: 'about' }"
                    >
                      Learn More
                    </b-link>
                  </li>
                  <li>
                    <b-link :to="{ name: 'explore' }">
                      <span>or </span>Start Exploring
                    </b-link>
                  </li>
                </ul>
              </nav>
            </div>
            <div
              v-if="fetched"
              class="homepage-stat-region"
            >
              <h2>
                Statistics<br>by Countries
              </h2>
              <div class="line-stats chart-line-a">
                <ul>
                  <li
                    v-for="(entry, index) in countriesStatistics"
                    :key="entry.country.code"
                    :class="{'not-first-5': index > 4 && !showMoreStats}"
                  >
                    <div class="wrap">
                      <div class="subject">
                        <b-link :to="{ name: 'statistics-region-region', params: { region: entry.country.code } }">
                          {{ entry.country.label }}
                        </b-link>
                      </div>
                      <div class="stat">
                        <span class="detail-a">{{ entry.count.toLocaleString() }} Companies</span>
                      </div>
                    </div>
                    <b-progress
                      :value="100 * entry.count / countriesStatistics[0].count"
                      max="100"
                      class="mb-3"
                    />
                  </li>
                </ul>
                <span class="show-more-icon" @click="showMoreStatsClicked"><i class="fa" :class="{ 'fa-angle-down': !showMoreStats, 'fa-angle-up': showMoreStats}" /></span>
                <div class="action">
                  <b-link :to="{ name: 'explore' }">
                    <span class="text">Explore business activities</span>
                  </b-link>
                  <b-link :to="{ name: 'explore' }">
                    <span class="icon"><i class="fa fa-angle-right" /></span>
                  </b-link>
                </div>
              </div>
            </div>
          </div>
          <div class="col-xl-6 col-lg-6">
            <div class="homepage-stat-trend">
              <h2>Established and Dissoluted Company Yearly Trend</h2>
              <p>Quick view of established and dissoluted companies on a yearly basis based on the data each country is providing (not all countries are providing information about dissoluted companies).</p>
              <ul class="selector">
                <li
                  v-for="entry in countriesWithDates"
                  :id="'chartSelector-'+entry.countryCode"
                  :key="entry.countryCode"
                  class="chartSelector"
                >
                  <a @click="switchChart(entry.countryCode)">{{ entry.countryLabel }}</a>
                </li>
              </ul>
              <div
                v-if="fetched"
                id="trend-chart"
                class="trend-chart"
              >
                <DateChart
                  :key="selectedCountryCode"
                  :country-code="selectedCountryCode"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="features">
      <div class="container">
        <div class="row">
          <div class="col-xl-3 col-lg-4 col-md-4 d-sm-none d-md-block">
            <div class="decor">
              <img src="../assets/img/ic-illustration.png">
            </div>
          </div>
          <div class="col-xl-9 col-lg-8 col-md-8">
            <div class="featuretext">
              <h2 class="separator">
                STIRDATA Action
              </h2>
              <p>STIRDATA Action proposes the use of Linked Data and semantic technologies as the means to overcome the technical barriers that hamper the reuse of open data, namely, poor quality and limited availability of Open Data.</p>
              <div class="row features">
                <div class="col-xl-4">
                  <h3>Target </h3>
                  <p>Use of Linked Data and Semantic Technologies as the means to “stir” different and heterogeneous data from multiple sources.</p>
                </div>
                <div class="col-xl-4">
                  <h3>API </h3>
                  <p>STIRDATA is providing an API to access its data. More information on how to use the API can be found in this <a href="https://dev.stirdata.eu/api/swagger-ui/index.html" target="_blank">link.</a></p>
                </div>
                <div class="col-xl-4">
                  <h3>Harvest </h3>
                  <p>The data is harvested from the business registries of the participating countries and updated on a regular basis. More information about the exact dates of the last update for each country can be found <a href="/sources#datinf" target="_self">here.</a></p>
                </div>
              </div>
            </div>
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
      SvgMap: () => import('../components/map/SvgMap'),
      DateChart: () => import('../components/chart/DateChart')
    },

    computed: {
      ...mapState({
        countriesStatistics: state => state.countriesStatistics,
        activitiesStatistics: state => state.activitiesStatistics,
        totalCompanies: state => state.totalCompanies,
        countriesWithDates: state => state.countriesWithDates
      })
    },

    data() {
      return {
        fetched: false,
        selectedCountryCode: '',
        showMoreStats: false
      };
    },

    async mounted() {
      await this.$store.dispatch('fetchTopLevelStatistics');
      if(!this.countriesWithDates.length) await this.$store.dispatch('fetchCountriesWithDates');
      this.fetched = true;
      this.selectedCountryCode = this.countriesWithDates[0].countryCode;
      const activeCountryButton = document.getElementById('chartSelector-' + this.selectedCountryCode);
      activeCountryButton.classList.add('active');
    },

    methods: {
      throwToast(message) {
        this.$bvToast.toast(message, {
          variant: 'danger',
          title: 'Warning',
          solid: true
        });
      },
      switchChart(id) {
        const newActiveButton = document.getElementById('chartSelector-' + id);
        if (!newActiveButton || newActiveButton.classList.contains('active')) {
          return;
        }

        const oldActiveButton = document.getElementsByClassName('chartSelector active')[0];
        if (oldActiveButton) {
          oldActiveButton.classList.remove('active');
        }
        newActiveButton.classList.add('active');

        // Render new line chart for the given country
        this.selectedCountryCode = id;
      },
      showMoreStatsClicked(){
        this.showMoreStats = !this.showMoreStats;
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import "../assets/scss/variables.scss";

  ::v-deep .progress {
    height: 6px;
    border-radius: 3px;
    background: #D8D8D8;
    margin: 11px 0 0 0;

    .progress-bar {
      background-color: $accent-first-color;
      border-radius: 3px;
    }
  }

  .chartSelector:hover {
    cursor: pointer;
  }

  .show-more-icon {
    display: none;
  }
  @media (max-width: 767.98px) {
    .not-first-5{
      display: none;
    }
    .show-more-icon{
      display: block;
      margin-top: -6px;
      text-align: center;
      position: relative;
      top: -3px;
      .fa {
        color: #355FAA;
        font-size: 40px;
        font-weight: bolder;
      }
    }
    .selector li a {
      padding: 4px 15px !important;
    }
  }
</style>
