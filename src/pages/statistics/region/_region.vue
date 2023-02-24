<template>
  <main role="main">
    <b-container>
      <Breadcrumb :breadcrumb_items="breadcrumb_items" />
    </b-container>
    <div
      v-if="$fetchState.pending"
      class="text-center"
    >
      <Spinner/>
    </div>
    <div v-else-if="$fetchState.error"><b-container>Error while fetching statistics. Please try again</b-container></div>
    <div v-else>
    <b-container>
      <div class="headingtext">
        <h1>{{ regionLabel }} {{ currentActivity ? `for ${capitalizeTheFirstLetterOfEachWord(currentActivity.activity[0].label)}` : '' }}</h1>
      </div>
    </b-container>
    <section class="statisticsdetail">
      <b-container>
        <b-row>
          <b-col
            lg="6"
            xl="7"
            class="statisticsdetail-left">
            <ul class="counter">
              <li v-show="subregionsCount">
                <span class="count">{{ subregionsCount }}</span>
                <span class="text">
                  {{ subregionTemplate ? "" : "Country" }} <br> Regions
                </span>
              </li>
              <li>
                <span class="count">{{ Number(regionTotalCount).toLocaleString() }}</span>
                <span class="text">Registered<br>Companies</span>
              </li>
              <li v-show="activities.length">
                <span class="count">{{ activitiesCount.toLocaleString() }}</span>
                <span class="text"> Business<br>Activities</span>
              </li>
            </ul>
            <div class="statisticsmap">
              <div class="statisticsmap-section">
                <SimpleMap
                  :region-code="regionCode"
                  :nace-code="nace"
                  :isActivityLeaf="isActivityLeaf"
                />
                <div
                  v-show="!isRegionLeaf"
                  class="maps-notify py-1"
                >
                  <i class="fa fa-info-circle" />Click an area on the map to select a subregion
                </div>
              </div>
            </div>
            <div
              v-show="foundingDates.length || dissolutionDates.length"
              class="statisticstrend"
            >
              <div class="headingtext">
                <h2>
                  Established and Dissoluted Companies Trend in {{ regionLabel }}
                </h2>
              </div>
              <DateChart
                :key="regionCode"
                :country-code="regionCode"
                :country-dates="{foundingDates, dissolutionDates}"
              />
            </div>
            <div class="statisticsother">
              <div class="headingtext">
                <h2>Explore other countries in STIRDATA</h2>
              </div>
              <ul>
                <li
                  v-for="country in allCountries"
                  :key="country.country.code"
                >
                  <b-link
                    class="wrap"
                    :to="{ name: 'statistics-region-region', params: { region: country.country.code } }"
                  >
                    <div class="icon">
                      <img :src="getImagePath(country)">
                    </div>
                    <div class="text">
                      <div class="counter">
                        {{ Number(country.count).toLocaleString() }}
                      </div>
                      <div class="label">
                        {{ country.country.label }}
                      </div>
                    </div>
                  </b-link>
                </li>
              </ul>
            </div>
          </b-col>
          <b-col
            lg="6"
            xl="5"
            class="statisticsdetail-right"
          >
            <div
              v-show="subregionsCount"
              class="regionstats"
            >
              <div class="headingtext">
                <h2>Statistics by region in {{ regionLabel }} {{ currentActivity ? `for ${capitalizeTheFirstLetterOfEachWord(currentActivity.activity[0].label)}` : ''  }}</h2>
                <p>
                  {{ Number(regionTotalCount).toLocaleString() }} Registered Companies in {{ subregionsCount }} Regions
                </p>
              </div>
              <div class="chart-line-b line-stats">
                <ul>
                  <li class="heading">
                    <div class="wrap">
                      <div class="subject">
                        Region
                      </div>
                      <div class="stat">
                        Companies
                      </div>
                      <div class="plothead">
                        Percentage
                      </div>
                    </div>
                  </li>
                  <li
                    v-for="reg in subregions"
                    :key="reg.place[0].code">
                    <div class="wrap">
                      <div
                        class="subject"
                        v-b-tooltip.hover.left
                        :title="reg.place[0].label"
                        @mouseover="regionHover(reg.place[0])"
                        @mouseleave="regionHover(null)"
                      >
                        <b-link :disabled="isActivityLeaf && reg.place[0].leaf"
                          :id="reg.place[0].code+'-label'"
                          class="wrap"
                          :to="currentActivity ? { name: 'statistics-region-region', query:{ activity: currentActivity.activity[0].code.split(':')[1], place: reg.place[0].code }}   : { name: 'statistics-region-region', params: { region: reg.place[0].code } } "
                       >
                          {{ reg.place[0].label }}
                        </b-link>
                      </div>
                      <div class="stat">
                        <span class="detail-a">
                          {{ Number(reg.count).toLocaleString() }}
                        </span>
                      </div>
                      <div class="scale">
                        <span class="percentage">
                          {{ percentage(reg.count, regionTotalCount) }}%
                        </span>
                        <b-progress
                          :value="reg.count"
                          :max="subregions[0].count"
                        />
                      </div>
                    </div>
                  </li>
                </ul>
                <div class="action">
                  <b-link :to="{ name: 'explore', params: { nutsFilter: regionCode,  naceFilter: naceCode } }">
                    <span class="text">
                      Explore all companies in {{ regionLabel }} {{ currentActivity ? `for ${capitalizeTheFirstLetterOfEachWord(currentActivity.activity[0].label)}` : ''  }}
                    </span>
                    <span class="icon"><i class="fa fa-angle-right" /></span>
                  </b-link>
                </div>
              </div>
            </div>
            <div
              v-show="activities.length"
              class="activitystats">
              <div class="headingtext">
                <h2>
                  Top 5 activities by companies amount in {{ regionLabel }}{{ currentActivity ? ` for ${capitalizeTheFirstLetterOfEachWord(currentActivity.activity[0].label)}` : ''  }}
                </h2>
                <p>
                  {{ Number(activitiesTotalCount).toLocaleString() }} Registered Activity Codes in {{ activitiesCount }} Activities
                </p>
              </div>
              <div class="chart-line-c line-stats-dynamic">
                <b-progress
                  class="mt-2"
                  :max="100"
                >
                  <b-progress-bar
                    v-for="(activity, index) in activities.slice(0, 5)"
                    :id="activity.activity[0].code"
                    :key="index"
                    :value="percentage(activity.count, activitiesTotalCount)"
                    :style="{ 'background-color': colors[index] }"
                  />
                  <b-tooltip
                    v-for="activity in activities.slice(0, 5)"
                    :key="activity.activity[0].code"
                    :target="activity.activity[0].code"
                    triggers="hover"
                  >
                    {{ percentage(activity.count, activitiesTotalCount) }}%
                  </b-tooltip>
                  <b-progress-bar
                    id="other"
                    :value="percentage(activitiesOtherCount, activitiesTotalCount)"
                    :style="{ 'background-color': colors[colors.length - 1] }"
                  >
                    <b-tooltip
                      target="other"
                      triggers="hover"
                    >
                      {{ percentage(activitiesOtherCount, activitiesTotalCount) }}%
                    </b-tooltip>
                  </b-progress-bar>
                </b-progress>
                <ul>
                  <li class="heading">
                    <div class="wrap">
                      <div class="subject">
                        Business Activity
                      </div>
                      <div class="stat">
                        Companies
                      </div>
                      <div class="scale">
                        Percentage
                      </div>
                    </div>
                  </li>
                  <li
                    v-for="(activity, index) in activities.slice(0, 5)"
                    :key="activity.activity[0].code"
                  >
                    <div class="wrap">
                      <div
                        class="subject"
                        v-b-tooltip.hover.left
                        :title="capitalizeTheFirstLetterOfEachWord(activity.activity[0].label)"
                      >
                        <div
                          class="color"
                          :style="{ 'background-color': colors[index] }"
                        />
                        <b-link :disabled="isRegionLeaf && activity.activity[0].leaf"
                          :id="activity.activity[0].code+'-label'"
                          :to="{ name: 'statistics-region-region', query: { activity: activity.activity[0].code.split(':')[1] , place: region} }"

                        >
                          {{ capitalizeTheFirstLetterOfEachWord(activity.activity[0].label) }}
                        </b-link>
                      </div>
                      <div class="stat">
                        <span class="count">
                          {{ Number(activity.count).toLocaleString() }}
                        </span>
                      </div>
                      <div class="scale percentage">
                        {{ percentage(activity.count, activitiesTotalCount) }}%
                      </div>
                    </div>
                  </li>
                  <li>
                    <div class="wrap">
                      <div class="subject">
                        <div
                          class="color"
                          :style="{ 'background-color': colors[colors.length - 1] }"
                        />
                        <a>Other Business Activities</a>
                      </div>
                      <div class="stat">
                        <span class="count">
                          {{ Number(activitiesOtherCount).toLocaleString() }}
                        </span>
                      </div>
                      <div class="scale percentage">
                        {{ percentage(activitiesOtherCount, activitiesTotalCount) }}%
                      </div>
                    </div>
                  </li>
                </ul>
                <div class="action">
                  <b-link :to="{ name: 'explore', params: { nutsFilter: regionCode } }">
                    <span class="text">
                      Explore all Business Activities in {{ regionLabel }}
                    </span>
                    <span class="icon"><i class="fa fa-angle-right" /></span>
                  </b-link>
                </div>
              </div>
            </div>
          </b-col>
        </b-row>
      </b-container>
    </section>
    </div>
  </main>
</template>

<script>
  import { mapState } from 'vuex';

  export default {
    components: {
      Breadcrumb: () => import('../../../components/Breadcrumb'),
      DateChart: () => import('../../../components/chart/DateChart'),
      SimpleMap: () => import('../../../components/map/SimpleMap')
    },

    data() {
      return {
        regionCode: '',
        breadcrumb_items: [],
        colors: [
          '#75A1F3',
          '#FFBC6D',
          '#F86DFF',
          '#FF4A4A',
          '#97CC04',
          '#D8D8D8'
        ],
        subregions: [],
        activities: [],
        dissolutionDates: [],
        foundingDates: [],
        regionTotalCount: 0,
        activitiesTotalCount: 0,
        regionLabel: '',
        currentActivity: null,
        subregionTemplate: false,
        country: {},
        naceCode: '',
        nace: '',
        region: '',
        timeout: null,
        isRegionLeaf: false,
        isActivityLeaf: false
      };
    },
    computed: {
    ...mapState({
      allCountries: state => state.countriesStatistics,
      hoveredRegion: state => state.hoveredRegion
    }),
    hasLauSubregions() {
      return  this.subregions.length ? this.subregions[0].place[0].code.split(':')[0] === 'lau' : true;
    },
    subregionsCount() {
      return this.subregions.length;
    },
    activitiesCount() {
      return this.activities.length;
    },
    addCountryNameInBreadcrumb() {
      if (!this.subregionTemplate) {
        this.breadcrumb_items = [
          {
            text: 'HOME',
            to: { name: 'index' }
          },
          {
            text: 'STATISTICS',
            to: { name: 'statistics' }
          },
          {
            text: 'COUNTRY',
            active: true
          },
          {
            text: this.regionLabel.toUpperCase(),
            active: true
          }
        ];
      } else {
        this.breadcrumb_items = [
          {
            text: 'HOME',
            to: { name: 'index' }
          },
          {
            text: 'STATISTICS',
            to: { name: 'statistics' }
          },
          {
            text: 'COUNTRY / ' + this.country.label.toUpperCase(),
            to: {
              name: 'statistics-region-region',
              params: { region: this.country.code }
            }
          },
          {
            text: this.regionLabel.toUpperCase(),
            active: true
          }
        ];
      }
    },
    activitiesOtherCount() {
      let sum = 0;
      this.activities.slice(0, 5).forEach((activity) => {
        sum += activity.count;
      });
      return this.activitiesTotalCount - sum;
    }
    },
    watch: {
     '$route.params': '$fetch'
    },
    async fetch() {
      this.region = this.$route.params.region ? this.$route.params.region : this.$route.query.place;
      this.nace = this.$route.query && this.$route.query.activity ? this.$route.query.activity : '';
      if(this.nace!=='')
       this.naceCode = this.nace.includes(':') ? this.nace : `nace-rev2:${this.nace}`;
      if(this.region!=='')
       this.regionCode = this.region.includes(':') ? this.region : `nuts:${this.region}`;
      await this.$calls.getActivityByRegionStatistics(this.nace, this.region)
        .then(response => {
          this.subregions = response.placeGroups ?? [];
          this.activities = response.activityGroups ?? [];
          // Update the code and the dates in order to render the chart
          this.foundingDates = response.foundingDateGroups ?? [];
          this.dissolutionDates = response.dissolutionDateGroups ?? [];
          if(response.selection){
            this.subregionTemplate = 'place' in response.selection;
            this.regionLabel = this.subregionTemplate ? response.selection.place[0].label : response.selection.country.label;
            this.country = response.selection.country;
            this.isRegionLeaf = response.selection.place ? response.selection.place[0].leaf : false;
            this.isActivityLeaf = response.selection.activity ? response.selection.activity[0].leaf : false;
            this.addCountryNameInBreadcrumb;
          }
          function sortByCount(a, b) {
            if (a.count < b.count) {
              return 1;
            }
            if (a.count > b.count) {
              return -1;
            }
            return 0;
          }
          this.regionTotalCount = response.selection.count;
          this.subregions.sort(sortByCount);
          this.activities.sort(sortByCount);
        });

      await this.$store.dispatch('fetchTopLevelStatistics');
      this.activitiesTotalCount = this.activities.reduce(((a,b) => a + b.count), 0);

      if(this.nace)
        this.currentActivity = await this.$calls.getActivityData(this.nace)
          .then(response => response.selection);

     // this.loading = false;
    },
    fetchOnServer: false,
    methods: {
     regionIsLau(code){
        return code.split(':')[0] === 'lau'
      },
      getImagePath(country) {
        try {
          return require(`../../../assets/img/icons/ic-${country.country.code.toLowerCase()}.png`);
        } catch (e) {
          return require('../../../assets/img/broken-image.png');
        }
      },
      percentage(count, totalCount) {
        return ((count / totalCount) * 100).toFixed(1) === '0.0' ? 0.1 : Number(((count / totalCount) * 100).toFixed(1));
      },
      capitalizeTheFirstLetterOfEachWord(words) {
        let separateWord = words.toLowerCase().split(' ');
        for (let i = 0; i < separateWord.length; i++) {
          separateWord[i] = separateWord[i].charAt(0).toUpperCase() + separateWord[i].substring(1);
        }
        separateWord = separateWord.join(' ');
        if (separateWord.length > 75) {
          separateWord = separateWord.slice(0, 75) + '...';
        }
        return separateWord;
      },
      regionHover(region){
        if (this.timeout) clearTimeout(this.timeout)
          this.timeout = setTimeout(() => {
            this.$store.commit('setHoveredRegion', region);
          }, 100)
      },
    }
  };
</script>

<style lang="scss" scoped>
  @import "../../../assets/scss/variables.scss";

  .subject {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  body main[role=main] .chart-line-b .action a,
  body main[role=main] .chart-line-c .action a {
    display: flex;
    align-items: center;
    padding-left: 2rem;

    span.text {
      width: 90%;
      text-align: end;
    }
    span.icon {
      top: 0;
    }
  }

  .disabled {
    opacity: 0.8;
    pointer-events: none;
  }

  .tooltip {
    margin-right: 0.5rem;
  }
</style>
