<template>
  <Spinner v-if="statisticsLoading" />
  <div v-else>
    <!-- Chart View -->
    <div v-if="layout === 'chart'">
      <div class="headingtext">
        <h3 v-if="errorOccured">
          An error occured while fetching the data. Please try again or set different search criteria.
        </h3>
        <h3 v-else-if="filteredArrayToShow.length === 0">
          There are no {{ titleToShow }} in {{ countryFilters.name }} based on Filter
        </h3>
        <h3 v-else>Top 10 {{ titleToShow }} in {{ countryFilters.name }} based on Filter</h3>
      </div>
      <!-- Group based on Region & Activity -->
      <b-row
        v-if="filter != 'date'"
      >
        <b-col xl="6">
          <div class="line-stats chart-line-a">
            <ul>
              <li
                v-for="inst in filteredArrayToShow.slice(0, 5)"
                :key="inst[statisticsKey][0].code"
              >
                <div class="wrap">
                  <div class="subject">
                    <b-link
                      :id="inst[statisticsKey][0].code + '-label'"
                      :to="statisticsKey === 'place'
                          ? { name: 'statistics-region-region', params: { region: inst[statisticsKey][0].code } }
                          : { name: 'statistics-activity-activity', params: { activity: inst[statisticsKey][0].code } }"
                      target="_blank"
                    >
                      {{ capitalizeTheFirstLetterOfEachWord(inst[statisticsKey][0].label) }}
                    </b-link>
                    <b-tooltip
                      :target="inst[statisticsKey][0].code + '-label'"
                      triggers="hover"
                    >
                      {{ inst[statisticsKey][0].label }}
                    </b-tooltip>
                  </div>
                  <div class="stat">
                    <span class="detail-a">
                      {{ inst.count.toLocaleString() }} Companies
                    </span>
                    <!-- <span class="detail-b">{{ index }} Activities</span> -->
                  </div>
                </div>
                <div class="explore-progress">
                  <b-progress
                    :value="inst.count"
                    :max="filteredArrayToShow[0].count"
                  />
                </div>
              </li>
            </ul>
          </div>
        </b-col>
        <b-col xl="6">
          <div class="line-stats chart-line-a">
            <ul>
              <li
                v-for="inst in filteredArrayToShow.slice(5, 10)"
                :key="inst[statisticsKey][0].code"
              >
                <div class="wrap">
                  <div class="subject">
                    <b-link
                      :id="inst[statisticsKey][0].code + '-label'"
                      :to="statisticsKey === 'place'
                          ? { name: 'statistics-region-region', params: { region: inst[statisticsKey][0].code } }
                          : { name: 'statistics-activity-activity', params: { activity: inst[statisticsKey][0].code } }"
                      target="_blank"
                    >
                      {{ capitalizeTheFirstLetterOfEachWord(inst[statisticsKey][0].label) }}
                    </b-link>
                    <b-tooltip
                      :target="inst[statisticsKey][0].code + '-label'"
                      triggers="hover"
                    >
                      {{ inst[statisticsKey][0].label }}
                    </b-tooltip>
                  </div>
                  <div class="stat">
                    <span class="detail-a">
                      {{ inst.count.toLocaleString() }} Companies
                    </span>
                    <!-- <span class="detail-b">{{ index }} Activities</span> -->
                  </div>
                </div>
                <div class="explore-progress">
                  <b-progress
                    :value="inst.count"
                    :max="filteredArrayToShow[0].count"
                  />
                </div>
              </li>
            </ul>
          </div>
        </b-col>
      </b-row>
      <!-- Group based on Date -->
      <b-row
        v-else
      >
        <div class="chart">
          <!-- TODO: Replace image with amChart graph, when API response is set -->
          <img class="pl-3" src="../../assets/img/ic-graph-home.png">
        </div>
      </b-row>
    </div>
    <!-- List view -->
    <div v-if="layout === 'list'">
      <h3 v-if="filteredArrayToShow.length === 0">
        There are no {{ titleToShow }} in {{ countryFilters.name }} based on Filter
      </h3>
      <div v-else>
        <div v-if="filter != 'date'">
          <div class="pagination-detail">
            Showing
            {{ ((currentPage - 1) * pageSize + 1).toLocaleString() }}
            -
            {{ Math.min(pageSize * currentPage, totalResults).toLocaleString() }}
            from
            {{ totalResults.toLocaleString() }}
          </div>
          <table class="table table-borderless table-stir">
            <thead>
              <tr>
                <th scope="col">{{ titleToShow }}</th>
                <th scope="col" class="end">Companies</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="inst in paginatedArrayToShow(filteredArrayToShow, currentPage)"
                :key="inst[statisticsKey][0].code"
              >
                <td>
                  <b-link
                    :to="statisticsKey === 'place'
                        ? { name: 'statistics-region-region', params: { region: inst[statisticsKey][0].code } }
                        : { name: 'statistics-activity-activity', params: { activity: inst[statisticsKey][0].code } }"
                    target="_blank"
                  >
                    {{ inst[statisticsKey][0].label }}
                  </b-link>
                </td>
                <td class="end">
                  {{ inst.count.toLocaleString() }}
                </td>
              </tr>
            </tbody>
          </table>
          <div
            v-if="totalResults > pageSize"
            class="inputaction"
          >
            <nav class="pagination-stir">
              <ul>
                <li>
                  <a
                    :class="currentPage === 1 ? 'disabled' : null"
                    @click="paginationImplementation(currentPage - 1)"
                  >
                    Previous
                  </a>
                </li>
                <li
                  :class="currentPage === 1 ? 'active' : null"
                  @click="paginationImplementation(1)"
                >
                  <a>1</a>
                </li>
                <span v-if="currentPage !== 2 && currentPage !== 1" class="mx-1">
                  . . .
                </span>
                <li
                  class="active"
                  v-if="currentPage !== 1 && currentPage !== totalPages"
                >
                  <a>{{ currentPage }}</a>
                </li>

                <span
                  v-if="currentPage < totalPages - 1 && currentPage !== 1"
                  class="mx-1"
                >
                  . . .
                </span>
                <li
                  :class="currentPage === totalPages ? 'active' : null"
                  @click="paginationImplementation(totalPages)"
                >
                  <a>{{ totalPages }}</a>
                </li>
                <li>
                  <a
                    :class="currentPage === totalPages ? 'disabled' : null"
                    @click="paginationImplementation(currentPage + 1)"
                  >
                    Next
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: "ResultsStatistics",

  props: {
    countryCode: {
      type: String,
      required: true
    },
    layout: {
      type: String,
      required: true,
    },
    filter: {
      type: String,
      required: true,
    }
  },

  data() {
    return {
      countryFilters: {},
      countryStatisticsQuery: '',
      statisticsLoading: true,
      statisticsSelection: {},
      statisticsActivity: [],
      statisticsPlaces: [],
      pageSize: 20,
      placeCurrentPage: 1,
      placeTotalPages: 1,
      placeTotalResults: 0,
      activityCurrentPage: 1,
      activityTotalPages: 1,
      activityTotalResults: 0,
      errorOccured: false
    };
  },

  mounted() {
    this.initiateRetrieveStatistics();
  },

  computed: {
    ...mapState({
      searchFilters: state => state.searchFilters
    }),
    statisticsKey: function () {
      if (this.filter === "region") {
        return "place";
      } else if (this.filter === "activity") {
        return "activity";
      } else {
        return "place";
      }
    },
    titleToShow: function () {
      if (this.filter === "region") {
        return "Regions";
      } else if (this.filter === "activity") {
        return "Activities";
      } else {
        return "Dates";
      }
    },
    filteredArrayToShow: function () {
      if (this.filter === "region") {
        return this.statisticsPlaces;
      } else if (this.filter === "activity") {
        return this.statisticsActivity;
      } else {
        return this.statisticsPlaces;
      }
    },
    currentPage: function () {
      if (this.filter === "region") {
        return this.placeCurrentPage;
      } else if (this.filter === "activity") {
        return this.activityCurrentPage;
      } else {
        return this.placeCurrentPage;
      }
    },
    totalPages: function () {
      if (this.filter === "region") {
        return this.placeTotalPages;
      } else if (this.filter === "activity") {
        return this.activityTotalPages;
      } else {
        return this.placeTotalPages;
      }
    },
    totalResults: function () {
      if (this.filter === "region") {
        return this.placeTotalResults;
      } else if (this.filter === "activity") {
        return this.activityTotalResults;
      } else {
        return this.placeTotalResults;
      }
    },
  },

  watch: {
    searchFilters(newValue, oldValue) {
      let oldFilters = oldValue.find(filterObj => filterObj.code === this.countryCode);
      let newFilters = newValue.find(filterObj => filterObj.code === this.countryCode);
      if (JSON.stringify(oldFilters) === JSON.stringify(newFilters)) {
        return;
      }
      this.initiateRetrieveStatistics();
    }
  },

  methods: {
    initiateRetrieveStatistics() {
      this.errorOccured = false;
      this.statisticsLoading = true;
      this.countryFilters = this.searchFilters.find(filterObj => filterObj.code === this.countryCode);
      this.countryStatisticsQuery = `place=${this.countryFilters.place.join()}&activity=${this.countryFilters.activity.join()}&dimension=selection,place,activity,foundingDate`;
      this.$calls.getQueryStatistics(this.countryStatisticsQuery)
        .then(response => {
          this.resultsStatistics = response;
          this.statisticsSelection = response.selection ?? [];
          this.statisticsActivity = response.activityGroups ?? [];
          this.statisticsPlaces = response.placeGroups ?? [];
          function sortByCount(a, b) {
            if (a.count < b.count) {
              return 1;
            }
            if (a.count > b.count) {
              return -1;
            }
            return 0;
          }
          this.statisticsPlaces.sort(sortByCount);
          this.placeTotalResults = this.statisticsPlaces.length;
          this.placeTotalPages = Math.ceil(this.placeTotalResults / this.pageSize);

          this.statisticsActivity.sort(sortByCount);
          this.activityTotalResults = this.statisticsActivity.length;
          this.activityTotalPages = Math.ceil(this.activityTotalResults / this.pageSize);

          this.statisticsLoading = false;
        })
        .catch(error => {
          console.error(error);
          this.errorOccured = true;
          this.statisticsLoading = false;
        });
    },
    paginatedArrayToShow(arr, cur) {
      return arr.slice(this.pageSize * (cur - 1), this.pageSize * cur);
    },
    paginationImplementation(pageToGo) {
      if (
        pageToGo < 1 ||
        (this.filter === "region" && pageToGo > this.placeTotalPages) ||
        (this.filter === "activity" && pageToGo > this.activityTotalPages)
      )
        return;
      if (this.filter === "region") {
        this.placeCurrentPage = pageToGo;
      } else if (this.filter === "activity") {
        this.activityCurrentPage = pageToGo;
      } else if (this.filter === "date") {
        this.placeCurrentPage = pageToGo;
      }
    },
    capitalizeTheFirstLetterOfEachWord(words) {
      if (this.filter === "region") return words;
      let separateWord = words.toLowerCase().split(" ");
      for (let i = 0; i < separateWord.length; i++) {
        separateWord[i] =
          separateWord[i].charAt(0).toUpperCase() +
          separateWord[i].substring(1);
      }
      separateWord = separateWord.join(" ");
      if (separateWord.length > 30) {
        separateWord = separateWord.slice(0, 30) + "...";
      }
      return separateWord;
    },
  },
};
</script>

<style lang="scss" scoped>
.pagination-stir ul li a:hover {
  cursor: pointer;
}

.disabled {
  background-color: rgb(182, 181, 181) !important;
  cursor: not-allowed !important;
}
.chart img {
  max-width: 844px;
}
</style>
