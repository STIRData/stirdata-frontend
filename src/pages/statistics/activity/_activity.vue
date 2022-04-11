<template>
  <div
    v-if="loading"
    class="text-center"
  >
    <Spinner />
  </div>
  <main
    v-else
    role="main"
  >
    <b-container>
      <Breadcrumb :breadcrumb_items="breadcrumb_items" />
    </b-container>
    <div class="pageintro">
      <div class="container">
        <div class="headingtext">
          <h1>{{ currentActivity.activity[0].label }}</h1>
        </div>
      </div>
    </div>
    <section class="statisticsdetail">
      <b-container>
        <b-row>
          <b-col
            lg="6"
            xl="7"
            class="statisticsdetail-left"
          >
            <ul class="counter">
              <li v-if="countries.length">
                <span class="count">{{ countries.length }}</span>
                <span class="text"> European <br>Countries</span>
              </li>
              <li>
                <span class="count">
                  {{ Number(currentActivity.count).toLocaleString() }}
                </span>
                <span class="text">Registered<br>Companies</span>
              </li>
            </ul>
            <!-- TODO: to be replaced with activity specific image -->
            <div class="activityimage">
              <img src="../../../assets/img/icons/activity/manufacturing.jpg">
            </div>
            <div class="activitylist">
              <div class="headingtext">
                <h2>Explore other Business Activity in STIRDATA</h2>
              </div>
              <div>
                <VueSlickCarousel
                  v-if="!loading"
                  v-bind="activityCarouselSettings"
                >
                  <ul
                    v-for="index in activityNumberOfTriads"
                    :key="index"
                  >
                    <li
                      v-for="activity in arraySlice(index - 1, index)"
                      :key="activity.activity[0].code"
                    >
                      <b-link
                        class="wrap"
                        :to="{ name: 'statistics-activity-activity', params: { activity: activity.activity[0].code.split(':')[1] } }"
                      >
                        <div class="icon">
                          <img :src="getImagePath(activity)">
                        </div>
                        <div class="text">
                          <div class="counter">
                            {{ Number(activity.count).toLocaleString() }}
                          </div>
                          <div class="label">
                            {{ capitalizeTheFirstLetterOfEachWord(activity.activity[0].label) }}
                          </div>
                        </div>
                      </b-link>
                    </li>
                  </ul>
                  <template #prevArrow="">
                    <button
                      type="button"
                      class="slick-prev"
                    >
                      <font-awesome-icon :icon="['fas', 'angle-left']" class="w-30" />
                    </button>
                  </template>
                  <template #nextArrow="">
                    <button
                      type="button"
                      class="slick-next"
                    >
                      <font-awesome-icon :icon="['fas', 'angle-right']" class="w-30" />
                    </button>
                  </template>
                </VueSlickCarousel>
              </div>
            </div>
          </b-col>
          <b-col
            lg="6"
            xl="5"
            class="statisticsdetail-right"
          >
            <div
              v-if="subactivities.length"
              class="regionstats"
            >
              <div class="headingtext">
                <h2>
                  Statistics by {{ capitalizeTheFirstLetterOfEachWord(currentActivity.activity[0].label) }} Business Activity
                </h2>
              </div>
              <!-- line stats-->
              <div class="chart-line-d line-stats">
                <ul>
                  <li class="heading">
                    <div class="wrap">
                      <div class="subject">
                        Activity
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
                    v-for="activity in subactivities"
                    :key="activity.activity[0].code"
                  >
                    <div class="wrap">
                      <div class="subject">
                        <b-link
                          :id="activity.activity[0].code+'-label'"
                          :to="{ name: 'statistics-activity-activity', params: { activity: activity.activity[0].code.split(':')[1] } }"
                        >
                          {{ capitalizeTheFirstLetterOfEachWord(activity.activity[0].label) }}
                        </b-link>
                        <b-tooltip
                          :target="activity.activity[0].code+'-label'"
                          triggers="hover"
                        >
                          {{ capitalizeTheFirstLetterOfEachWord(activity.activity[0].label) }}
                        </b-tooltip>
                      </div>
                      <div class="stat">
                        <span class="detail-a">
                          {{ Number(activity.count).toLocaleString() }}
                        </span>
                      </div>
                      <div class="scale-activity">
                        <span class="percentage">
                          {{ percentage(activity.count) }}%
                        </span>
                        <b-progress
                          :value="activity.count"
                          :max="subactivities[0].count"
                        />
                      </div>
                    </div>
                  </li>
                </ul>
                <div class="action">
                  <b-link :to="{ name: 'search' }">
                    <span class="text">
                      Explore all companies for {{ capitalizeTheFirstLetterOfEachWord(currentActivity.activity[0].label) }} Business Activity
                    </span>
                    <span class="icon"><i class="fa fa-angle-right" /></span>
                  </b-link>
                </div>
              </div>
            </div>
            <div
              v-if="countries.length"
              class="activitystats"
            >
              <div class="headingtext">
                <h2>
                  Top 5 countries by companies amount in {{ capitalizeTheFirstLetterOfEachWord(currentActivity.activity[0].label) }}
                </h2>
              </div>
              <div class="chart-line-c line-stats-dynamic">
                <b-progress
                  class="mt-2"
                  :max="100"
                >
                  <b-progress-bar
                    v-for="(country, index) in countries.slice(0, 5)"
                    :id="country.country.code"
                    :key="index"
                    :value="percentage(country.count)"
                    :style="{ 'background-color': colors[index] }"
                  />
                  <b-tooltip
                    v-for="country in countries.slice(0, 5)"
                    :key="country.country.code"
                    :target="country.country.code"
                    triggers="hover"
                  >
                    {{ percentage(country.count) }}%
                  </b-tooltip>
                </b-progress>
                <ul>
                  <li class="heading">
                    <div class="wrap">
                      <div class="subject">
                        Country
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
                    v-for="(country, index) in countries.slice(0, 5)"
                    :key="country.country.code"
                  >
                    <div class="wrap">
                      <div class="subject">
                        <div
                          class="color"
                          :style="{ 'background-color': colors[index] }"
                        />
                        <b-link
                          :id="country.country.code+'-label'"
                          :to="{ name: 'statistics-region-region', params: { region: country.country.code } }"
                        >
                          {{ country.country.label }}
                        </b-link>
                        <b-tooltip
                          :target="country.country.code+'-label'"
                          triggers="hover"
                        >
                          {{ country.country.label }}
                        </b-tooltip>
                      </div>
                      <div class="stat">
                        <span class="count">
                          {{ Number(country.count).toLocaleString() }}
                        </span>
                      </div>
                      <div class="scale percentage">
                        {{ percentage(country.count) }}
                      </div>
                    </div>
                  </li>
                </ul>
                <div class="action">
                  <b-link :to="{ name: 'search' }">
                    <span class="text">
                      Explore all countries for {{ capitalizeTheFirstLetterOfEachWord(currentActivity.activity[0].label) }} Business Activity
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
  </main>
</template>

<script>
  import VueSlickCarousel from 'vue-slick-carousel';
  import 'vue-slick-carousel/dist/vue-slick-carousel.css';
  import { mapState } from 'vuex';

  export default {
    components: {
      Breadcrumb: () => import('../../../components/Breadcrumb'),
      VueSlickCarousel
    },

    data() {
      return {
        activityCarouselSettings: {
          dots: false,
          edgeFriction: 0.35,
          infinite: false,
          speed: 500,
          slidesToShow: 2,
          slidesToScroll: 1,
          responsive: [
            {
              breakpoint: 1024,
              settings: {
                slidesToShow: 2,
                slidesToScroll: 1
              }
            },
            {
              breakpoint: 760,
              settings: {
                slidesToShow: 2,
                slidesToScroll: 1
              }
            },
            {
              breakpoint: 520,
              settings: {
                slidesToShow: 1,
                slidesToScroll: 1
              }
            }
          ]
        },
        colors: [
          '#75A1F3',
          '#FFBC6D',
          '#F86DFF',
          '#FF4A4A',
          '#97CC04',
          '#D8D8D8'
        ],
        breadcrumb_items: [],
        currentActivity: {},
        loading: true,
        subactivities: [],
        countries: []
      };
    },

    async mounted() {
      let nace = this.$route.params.activity;
      await this.$calls.getActivityStatistics(nace)
        .then(response => {
          this.subactivities = response.activityGroups ?? [];
          this.countries = response.placeGroups ?? [];

          function sortByCount(a, b) {
            if (a.count < b.count) {
              return 1;
            }
            if (a.count > b.count) {
              return -1;
            }
            return 0;
          }
          this.subactivities.sort(sortByCount);
          this.countries.sort(sortByCount);
        });

      if (this.activities.length === 0) {
        await this.$store.dispatch('fetchTopLevelStatistics');
      }
      this.currentActivity = await this.$calls.getActivityData(nace)
        .then(response => response.selection);
      this.addActivityInBreadcrumb;
      this.loading = false;
    },

    computed: {
    ...mapState({
      activities: state => state.activitiesStatistics
    }),
    activityNumberOfTriads() {
      return Math.ceil(this.activities.length / 3);
    },
    addActivityInBreadcrumb() {
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
            text: 'ACTIVITY',
            active: true
          },
          {
            text: this.currentActivity.activity[0].label.toUpperCase(),
            active: true
          }
        ];
      }
    }
    },

    methods: {
      percentage(count) {
        return ((count / this.currentActivity.count) * 100).toFixed(1) === '0.0' ? 0.1 : Number(((count / this.currentActivity.count) * 100).toFixed(1));
      },
      arraySlice(start, end) {
        return this.activities.slice(start * 3, 3 * end);
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
      getImagePath(activity) {
        return require(`../../../assets/img/icons/ic-${activity.activity[0].code.split(':')[1]}.png`);
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import "../../../assets/scss/mixin.scss";
  @import "../../../assets/scss/variables.scss";

  body main[role=main] .chart-line-d ul li .subject {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  ::v-deep .arrow::before {
    border-top-color: $accent-first-color;
    border-bottom-color: $accent-first-color;
  }

  body main[role=main] .chart-line-c .action a,
  body main[role=main] .chart-line-d .action a {
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
</style>
