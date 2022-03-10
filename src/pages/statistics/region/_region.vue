<template>
  <div v-if="loading" class="text-center">
    <Spinner />
  </div>
  <main role="main" v-else>
    <b-container>
      <Breadcrumb :breadcrumb_items="breadcrumb_items" />
    </b-container>
    <b-container>
      <div class="headingtext">
        <h1>{{ regionLabel }}</h1>
      </div>
    </b-container>

    <section class="statisticsdetail">
      <b-container>
        <b-row>
          <b-col lg="6" xl="7" class="statisticsdetail-left">
            <ul class="counter">
              <li v-if="subregionsCount">
                <span class="count">{{ subregionsCount }}</span>
                <span class="text">
                  {{ subregionTemplate ? "" : "Country" }} <br /> Regions
                </span>
              </li>
              <li>
                <span class="count">{{ Number(regionTotalCount).toLocaleString() }}</span>
                <span class="text">Registered<br />Companies</span>
              </li>
              <li v-if="activities.length">
                <span class="count">{{ activitiesCount }}</span>
                <span class="text"> Business<br />Activities</span>
              </li>
            </ul>
            <div class="statisticsmap">
              <div class="statisticsmap-section">
                <!-- temp image of map, need to be replaced by amchart maps-->
                <!-- to be replaced with js maps-->
                <img
                  class="tmpmap"
                  src="../../../assets/img/img-temp-map.png"
                />
                <div class="maps-notify">
                  <i class="fa fa-info-circle"> </i>Click area on the map to select country and region
                </div>
              </div>
            </div>
            <div
              class="statisticstrend"
              v-if="foundingDates.length || dissolutionDates.length"
            >
              <div class="headingtext">
                <h2>
                  Established and Dissoluted Companies Trend in {{ regionLabel }}
                </h2>
              </div>
              <div class="chart">
                <client-only>
                  <line-chart
                    :data="chartData"
                    :options="chartOptions"
                  >
                  </line-chart>
                </client-only>
              </div>
            </div>
            <div class="statisticsother">
              <div class="headingtext">
                <h2>Explore other countries in STIRDATA</h2>
              </div>
              <ul>
                <li v-for="country in allCountries" :key="country.country.code">
                  <b-link
                    class="wrap"
                    :to="{ name: 'statistics-region-region', params: { region: country.country.code } }"
                  >
                    <div class="icon">
                      <img :src="getImagePath(country)" />
                    </div>
                    <div class="text">
                      <div class="counter">
                        {{ Number(country.count).toLocaleString() }}
                      </div>
                      <div class="label">{{ country.country.label }}</div>
                    </div>
                  </b-link>
                </li>
              </ul>
            </div>
          </b-col>
          <b-col lg="6" xl="5" class="statisticsdetail-right">
            <div class="regionstats" v-if="subregionsCount">
              <div class="headingtext">
                <h2>Statistics by region in {{ regionLabel }}</h2>
                <p>
                  {{ Number(regionTotalCount).toLocaleString() }} Registered Companies in {{ subregionsCount }} Regions
                </p>
              </div>
              <div class="chart-line-b line-stats">
                <ul>
                  <li class="heading">
                    <div class="wrap">
                      <div class="subject">Region</div>
                      <div class="stat">Companies</div>
                      <div class="plothead">Percentage</div>
                    </div>
                  </li>
                  <li v-for="reg in subregions" :key="reg.place.code">
                    <div class="wrap">
                      <div class="subject">
                        <b-link
                          class="wrap"
                          :to="{ name: 'statistics-region-region', params: { region: reg.place.code } }"
                        >
                          {{ reg.place.label }}
                        </b-link>
                      </div>
                      <div class="stat">
                        <span class="detail-a">
                          {{ Number(reg.count).toLocaleString() }}
                        </span>
                      </div>
                      <div class="scale">
                        <span class="percentage">
                          {{ percentage(reg.count) }}%
                        </span>
                        <b-progress
                          :value="reg.count"
                          :max="subregions[0].count"
                        >
                        </b-progress>
                      </div>
                    </div>
                  </li>
                </ul>
                <div class="action">
                  <b-link :to="{ name: 'search' }">
                    <span class="text">
                      Explore all companies in {{ regionLabel }}
                    </span>
                    <span class="icon"><i class="fa fa-angle-right"></i></span>
                  </b-link>
                </div>
              </div>
            </div>
            <div class="activitystats" v-if="activities.length">
              <div class="headingtext">
                <h2>
                  Top 5 activities by companies amount in {{ regionLabel }}
                </h2>
                <p>
                  {{ Number(regionTotalCount).toLocaleString() }} Registered Companies in {{ activitiesCount }} Activities
                </p>
              </div>
              <div class="chart-line-c line-stats-dynamic">
                <b-progress class="mt-2" :max="100">
                  <b-progress-bar
                    v-for="(activity, index) in activities.slice(0, 5)"
                    :key="index"
                    :value="percentage(activity.count)"
                    :style="{ 'background-color': colors[index] }"
                    :id="activity.activity.code"
                  >
                  </b-progress-bar>
                  <b-tooltip
                    v-for="activity in activities.slice(0, 5)"
                    :key="activity.activity.code"
                    :target="activity.activity.code"
                    triggers="hover"
                  >
                    {{ percentage(activity.count) }}%
                  </b-tooltip>
                  <b-progress-bar
                    :value="percentage(activitiesOtherCount)"
                    :style="{ 'background-color': colors[colors.length - 1] }"
                    id="other"
                  >
                    <b-tooltip target="other" triggers="hover">
                      {{ percentage(activitiesOtherCount) }}%
                    </b-tooltip>
                  </b-progress-bar>
                </b-progress>
                <ul>
                  <li class="heading">
                    <div class="wrap">
                      <div class="subject">Business Activity</div>
                      <div class="stat">Companies</div>
                      <div class="scale">Percentage</div>
                    </div>
                  </li>
                  <li
                    v-for="(activity, index) in activities.slice(0, 5)"
                    :key="activity.activity.code"
                  >
                    <div class="wrap">
                      <div class="subject">
                        <div
                          class="color"
                          :style="{ 'background-color': colors[index] }"
                        >
                        </div>
                        <b-link
                          :to="{ name: 'statistics-activity-activity', params: { activity: activity.activity.code.split(':')[1] } }"
                        >
                          {{ capitalizeTheFirstLetterOfEachWord(activity.activity.label) }}
                        </b-link>
                      </div>
                      <div class="stat">
                        <span class="count">
                          {{ Number(activity.count).toLocaleString() }}
                        </span>
                      </div>
                      <div class="scale percentage">
                        {{ percentage(activity.count) }}%
                      </div>
                    </div>
                  </li>
                  <li>
                    <div class="wrap">
                      <div class="subject">
                        <div
                          class="color"
                          :style="{ 'background-color': colors[colors.length - 1] }"
                        >
                        </div>
                        <a>Other Business Activities</a>
                      </div>
                      <div class="stat">
                        <span class="count">
                          {{ Number(activitiesOtherCount).toLocaleString() }}
                        </span>
                      </div>
                      <div class="scale percentage">
                        {{ percentage(activitiesOtherCount) }}%
                      </div>
                    </div>
                  </li>
                </ul>
                <div class="action">
                  <b-link :to="{ name: 'search' }">
                    <span class="text">
                      Explore all Business Activities in {{ regionLabel }}
                    </span>
                    <span class="icon"><i class="fa fa-angle-right"></i></span>
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
export default {
  components: {
    Breadcrumb: () => import("../../../components/Breadcrumb")
  },

  data() {
    return {
      chartData: {
        labels: [],
        datasets: []
      },
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          xAxes: [
            {
              gridLines: {
                display: false,
              },
            },
          ]
        },
        legend: {
          align: "end",
          labels: {
            boxWidth: 7,
            padding: 16,
            fontSize: 14,
            fontFamily: "'Jost','Avenir','sans-serif'",
            usePointStyle: true
          }
        }
      },
      breadcrumb_items: [],
      colors: [
        "#75A1F3",
        "#FFBC6D",
        "#F86DFF",
        "#FF4A4A",
        "#97CC04",
        "#D8D8D8",
      ],
      subregions: [],
      activities: [],
      dissolutionDates: [],
      foundingDates: [],
      regionTotalCount: 0,
      regionLabel: "",
      loading: true,
      allCountries: [],
      subregionTemplate: false,
      country: {}
    };
  },
  computed: {
    subregionsCount: function () {
      return this.subregions.length;
    },
    activitiesCount: function () {
      return this.activities.length;
    },
    addCountryNameInBreadcrumb: function () {
      if (!this.subregionTemplate) {
        this.breadcrumb_items = [
          {
            text: "HOME",
            to: { name: "index" },
          },
          {
            text: "STATISTICS",
            to: { name: "statistics" },
          },
          {
            text: "COUNTRY",
            active: true,
          },
          {
            text: this.regionLabel.toUpperCase(),
            active: true,
          }
        ];
      }
      else {
        this.breadcrumb_items = [
          {
            text: "HOME",
            to: { name: "index" },
          },
          {
            text: "STATISTICS",
            to: { name: "statistics" },
          },
          {
            text: "COUNTRY / " + this.country.label.toUpperCase(),
            to: {
              name: "statistics-region-region",
              params: { region: this.country.code },
            },
          },
          {
            text: this.regionLabel.toUpperCase(),
            active: true,
          }
        ];
      }
    },
    foundingChartData: function () {
      this.chartData.labels = this.foundingDates.map((date) => {
        return new Date(date.foundingDate.from).getFullYear();
      });
      this.chartData.datasets.push({
        label: "Established",
        data: this.foundingDates.map((date) => {
          return {
            x: new Date(date.foundingDate.from).getFullYear(),
            y: date.count
          };
        }),
        backgroundColor: ["rgba(175, 240, 175, 0.2)"],
        borderColor: "green",
        borderWidth: 1
      });
    },
    dissolutionChartData: function () {
      this.dissolutionDates.forEach((date) => {
        let disYear = new Date(date.dissolutionDate.from).getFullYear();
        if (!this.chartData.labels.includes(disYear)) {
          this.chartData.labels.push(disYear);
          this.chartData.labels.sort();
        }
      });
      this.chartData.datasets.push({
        label: "Dissoluted",
        data: this.dissolutionDates.map((date) => {
          return {
            x: new Date(date.dissolutionDate.from).getFullYear(),
            y: date.count,
          };
        }),
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
        ],
        borderColor: "red",
        borderWidth: 1
      });
    },
    activitiesOtherCount: function () {
      let sum = 0;
      this.activities.slice(0, 5).forEach((activity) => {
        sum += activity.count;
      });
      return this.regionTotalCount - sum;
    }
  },
  async mounted() {
    await this.$calls.getRegionStatistics(this.$route.params.region)
      .then(response => {
        this.subregions = response.placeGroups ? response.placeGroups : [];
        this.activities = response.activityGroups ? response.activityGroups : [];
        this.foundingDates = response.foundingDateGroups ? response.foundingDateGroups : [];
        this.dissolutionDates = response.dissolutionDateGroups ? response.dissolutionDateGroups : [];

        function sortByCount(a, b) {
          if (a.count < b.count) {
            return 1;
          }
          if (a.count > b.count) {
            return -1;
          }
          return 0;
        }
        this.subregions.sort(sortByCount);
        this.activities.sort(sortByCount);
        if (this.foundingDates.length) this.foundingChartData;
        if (this.dissolutionDates.length) this.dissolutionChartData;
      });
    await this.$calls.getRegionData(this.$route.params.region)
      .then(response => {
        this.regionTotalCount = response.selection.count;
        this.subregionTemplate = "place" in response.selection;
        this.regionLabel = this.subregionTemplate ? response.selection.place.label : response.selection.country.label;
        this.country = response.selection.country;
        this.addCountryNameInBreadcrumb;
      });
    this.allCountries = await this.$calls.getAllPlaces()
      .then(response => {
        return response.placeGroups;
      });
    this.loading = false;
  },

  methods: {
    getImagePath: function (country) {
      return require(`../../../assets/img/icons/ic-${country.country.code.toLowerCase()}.png`);
    },
    percentage: function (count) {
      return ((count / this.regionTotalCount) * 100).toFixed(1) === "0.0" ? 0.1 : Number(((count / this.regionTotalCount) * 100).toFixed(1));
    },
    capitalizeTheFirstLetterOfEachWord: function (words) {
      var separateWord = words.toLowerCase().split(" ");
      for (var i = 0; i < separateWord.length; i++) {
        separateWord[i] = separateWord[i].charAt(0).toUpperCase() + separateWord[i].substring(1);
      }
      separateWord = separateWord.join(" ");
      if (separateWord.length > 75) {
        separateWord = separateWord.slice(0, 75) + "...";
      }
      return separateWord;
    }
  }
};
</script>

<style lang="scss" scoped>
  @import "../../../assets/scss/variables.scss";

  ::v-deep .arrow::before {
    border-top-color: $accent-first-color;
    border-bottom-color: $accent-first-color;
  }
</style>
