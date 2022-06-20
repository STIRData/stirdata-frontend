<template>
  <Spinner class="text-center" v-if="companiesLoading" />
  <h3 v-else-if="totalResults === 0">
    There are no companies in {{ countryFilters.name }} based on Filter
  </h3>
  <div v-else>
    <div class="filter-list-option">
      <div class="pagination-detail" id="pagination-details">
        Showing
        {{ ((currentPage - 1) * resultsCompanies.page.pageSize + 1).toLocaleString() }}
        -
        {{ Math.min((resultsCompanies.page.pageSize * currentPage), totalResults).toLocaleString() }}
        from
        {{ totalResults.toLocaleString() }}
      </div>
      <a class="download">Download Results</a>
    </div>
    <table class="table table-borderless table-stir">
      <thead>
        <tr>
          <th scope="col">Company Name</th>
          <th scope="col">Registration Date</th>
          <th scope="col">Activity</th>
          <th class="end" scope="col">Action</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="company in resultsCompanies.legalEntities"
          :key="company.uri"
        >
          <!-- Company Name -->
          <td>
            <b-link
              :to="{ name: 'company', query: {uri: company.uri} }"
              target="_blank"
            >
              {{ company.legalNames[0].value }}
            </b-link>
          </td>
          <!-- Registration Date -->
          <td>
            {{ company.foundingDate | formatDate }}
          </td>
          <!-- Activities -->
          <td>
            <div
              v-for="(activity, index) in company.companyActivities"
              :key="'activity-'+activity.code"
            >
              <a
                :title="activity.label"
                v-b-tooltip.hover
              >
                {{ activity.code }}<span v-if="index != company.companyActivities.length-1">, </span>
              </a>
            </div>
          </td>
          <!-- Action button -->
          <td class="end">
            <b-dropdown
              no-caret
              toggle-class="text-decoration-none px-0 py-1"
              variant="link"
            >
              <template #button-content>
                <img src="../../assets/img/ic-bullets.png"/>
              </template>
              <b-dropdown-item
                :href="company.uri"
                target="_blank"
                rel="noopener noreferrer"
              >
                Visit URI
              </b-dropdown-item>
              <b-dropdown-item
                :to="{ name: 'company', query: {uri: company.uri} }"
                target="_blank"
                rel="noopener noreferrer"
              >
                Company Details
              </b-dropdown-item>
            </b-dropdown>
          </td>
        </tr>
      </tbody>
    </table>
    <!-- Pagination -->
    <div class="inputaction" v-if="totalResults > resultsCompanies.page.pageSize">
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
          <span v-if="currentPage !== 2 " class="mx-1">
            . . .
          </span>
          <li
            class="active"
            v-if="currentPage !== 1 && currentPage !== totalPages"
          >
            <a>
              {{ currentPage }}
            </a>
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
            <a>
              {{ totalPages }}
            </a>
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
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: "ResultsCompanies",

  props: {
    countryCode: {
      type: String,
      required: true
    }
  },

  data() {
    return {
      resultsCompanies: {},
      companiesLoading: true,
      countryFilters: {},
      countrySearchQuery: ''
    };
  },

  mounted() {
    this.initiateSearch();
  },

  computed: {
    ...mapState({
      searchFilters: state => state.searchFilters
    })
  },

  watch: {
    searchFilters(newValue, oldValue) {
      let oldFilters = oldValue.find(filterObj => filterObj.code === this.countryCode);
      let newFilters = newValue.find(filterObj => filterObj.code === this.countryCode);
      if (JSON.stringify(oldFilters) === JSON.stringify(newFilters)) {
        return;
      }
      this.initiateSearch();
    }
  },

  methods: {
    initiateSearch() {
      this.companiesLoading = true;
      this.countryFilters = this.searchFilters.find(filterObj => filterObj.code === this.countryCode);
      this.countrySearchQuery = this.countryFilters.query;
      this.$calls.searchCompanies(this.countrySearchQuery)
        .then(response => {
          this.resultsCompanies = response[0];
          this.totalResults = this.resultsCompanies.page.totalResults;
          this.totalPages = Math.ceil(this.totalResults / this.resultsCompanies.page.pageSize);
          this.currentPage = this.resultsCompanies.page.pageNumber;

          // Loading the first page is a lot slower than the other pages
          // Solution: we keep the first 20 companies and we load them instantly
          // this.firstResultsCompanies = this.resultsCompanies;

          this.companiesLoading = false;
        })
        .catch(error => console.error(error));
    },
    paginationImplementation(pageToGo) {
      if (pageToGo > this.totalPages || pageToGo < 1) return;
      // document.getElementById("pagination-details").scrollIntoView({
      //   behavior: "smooth",
      // });

      // Loading the first page is a lot slower than the other pages
      // Solution: we keep the first 20 companies and we load them instantly
      if (pageToGo === 1) {
        this.resultsCompanies = this.resultsCompanies;
      }

      this.companiesLoading = true;

      this.$calls.searchCompanies(`${this.countrySearchQuery}&page=${pageToGo}`)
        .then(response => {
          this.resultsCompanies = response[0];
          this.currentPage = this.resultsCompanies.page.pageNumber;
          this.companiesLoading = false;
          document.getElementById("pagination-details").scrollIntoView({behavior: "smooth"});
        })
        .catch(error => console.error(error));
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

::v-deep .dropdown-menu {
  border-radius: 0.25rem;
}

::v-deep .dropdown-item {
  display: block;
  width: 100%;
  padding: 0.25rem 1rem;

  &:hover {
    border-radius: 0.25rem;
  }
}
</style>
