<template>
  <Spinner class="text-center" v-if="companiesLoading" />
  <h3 v-else-if="companiesCallError">
    An error occured while fetching the data. Please try again or set different search criteria.
  </h3>
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
      <!-- <a class="download">Download Results</a> -->
    </div>
    <table class="table table-borderless table-stir">
      <thead>
        <tr>
          <th scope="col" class="company-name-col">Company Name</th>
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
          <td class="company-name-col">
            <b-link
              :to="company.legalNames ? { name: 'company', query: {iri: company.uri} } : null"
              target="_blank"
              :class="{ 'empty-legalnames': !company.legalNames }"
            >
              {{ company.legalNames ? company.legalNames[0].value : 'Legal name not available' }}
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
              :key="'activity-' + company.uri.split('/').at(-1) + activity.code+index"
            >
              <a v-if="index < 3" :title="activity.label" v-b-tooltip.hover>
                {{ activity.code }}<span v-if="index != company.companyActivities.length - 1">, </span>
              </a>
            </div>
            <template v-if="company.companyActivities && company.companyActivities.length > 3">
              <b-collapse
                class=""
                :id="'collapseMoreNace' + company.uri.split('/').at(-1)"
                :accordion="'nace-accordion' + company.uri.split('/').at(-1)"
              >
                <div
                  v-for="(activity, index) in company.companyActivities"
                  :key="'activity-' + company.uri.split('/').at(-1) + activity.code+index"
                >
                  <a v-if="index >= 3" :title="activity.label" v-b-tooltip.hover>
                    {{ activity.code }}<span v-if="index != company.companyActivities.length - 1">, </span>
                  </a>
                </div>
              </b-collapse>
              <a
                class="show-more-nace-btn"
                :id="'collapseMoreNace-' + company.uri.split('/').at(-1) +'-toggle'"
                v-b-toggle="'collapseMoreNace' + company.uri.split('/').at(-1)"
                role="tab"
              >
                Show <span class="more-text"> more</span> <span class="less-text"> less</span> <i class="fa fa-angle-down rotate"></i>
              </a>
            </template>
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
                Visit IRI
              </b-dropdown-item>
              <b-dropdown-item
                v-if="company.legalNames"
                :to="{ name: 'company', query: {iri: company.uri} }"
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
      countrySearchQuery: '',
      companiesCallError: false
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
      this.companiesCallError = false;
      this.companiesLoading = true;
      this.countryFilters = this.searchFilters.find(filterObj => filterObj.code === this.countryCode);
      this.countrySearchQuery = this.countryFilters.query;
      this.$calls.searchCompanies(this.countrySearchQuery)
        .then(response => {
          this.resultsCompanies = response[0];
          if (this.resultsCompanies) {
            this.totalResults = this.resultsCompanies.page.totalResults ?? 0;
            this.totalPages = Math.ceil(this.totalResults / this.resultsCompanies.page.pageSize);
            this.currentPage = this.resultsCompanies.page.pageNumber;
          } else {
            this.totalResults = 0;
          }
          // Loading the first page is a lot slower than the other pages
          // Solution: we keep the first 20 companies and we load them instantly
          // this.firstResultsCompanies = this.resultsCompanies;

          this.companiesLoading = false;
        })
        .catch(error => {
          console.error(error);
          this.companiesCallError = true;
          this.companiesLoading = false;
        });
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

.company-name-col {
  max-width: 350px;
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

.empty-legalnames{
  opacity: 0.5;
  cursor: text;
  &:hover{
    text-decoration: none !important;
  }
}
@media (max-width: 767.98px) {
  .table-stir {
    vertical-align: top !important;
    th, td {
      padding: 15px 3px !important;
    }
  }
}
.show-more-nace-btn {
  color: #355FAA !important;
  cursor: pointer;
}

.collapsed{
  .less-text{
    display: none;
  }
}

.not-collapsed{
  .more-text{
    display: none;
  }
  .rotate{
    transform: rotate(180deg);
  }
}
</style>
