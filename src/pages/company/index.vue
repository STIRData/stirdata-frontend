<template>
  <main role="main">
    <b-container>
      <Breadcrumb :breadcrumb_items="breadcrumb_items" />
    </b-container>
    <b-container v-if="loading">
      <Spinner />
    </b-container>
    <b-container v-else-if="failed">
      <h5>There are no available data for the selected company.</h5>
    </b-container>
    <section class="companydetail" v-else>
      <b-container>
        <b-row>
          <b-col lg="6" xl="6" class="companydetail-left">
            <div class="companydetail-map">
              <div class="companydetail-map-section">
                <SimpleMap
                  :region-code="company.registeredAddresses[0].nuts3.code"
                  :lau="company.registeredAddresses[0].lau"
                />
              </div>
            </div>
          </b-col>
          <b-col lg="6" xl="6" class="companydetail-right">
            <div class="regionstats">
              <div class="headingtext">
                <h2>{{ companyName }}</h2>
              </div>
              <div class="companydetail-data">
                <b-row>
                  <b-col md="4" class="head">
                    Registration Date
                  </b-col>
                  <b-col md="8">
                    {{ company.foundingDate | formatDateForCompany }}
                  </b-col>
                </b-row>
                <b-row
                  v-for="(addr, index) in company.registeredAddresses"
                  :class="index !== company.registeredAddresses.length - 1 ? 'content-row' : ''"
                  :key="'address-'+index"
                >
                  <b-col md="4" class="head">
                    {{ index === 0 ? "Address" : "" }}
                  </b-col>
                  <b-col md="8">
                    {{ addr.fullAddress }}
                  </b-col>
                </b-row>
                <b-row
                  v-for="(addr, index) in company.registeredAddresses"
                  :class="index !== company.registeredAddresses.length - 1 ? 'content-row' : ''"
                  :key="'region-'+index"
                >
                  <b-col md="4" class="head">
                    {{ index === 0 ? "Region" : "" }}
                  </b-col>
                  <b-col md="8">
                    <div class="category-pill">
                      <ul>
                        <li>
                          <span class="pill">
                            <b-link
                              :to="{ name: 'statistics-region-region', params: { region: addr.nuts3.code } }"
                              target="_blank"
                            >
                              {{ addr.nuts3.label }}
                            </b-link>
                          </span>
                        </li>
                        <ul>
                          <li class="separator" v-if="addr.lau">
                            <ul>
                              <li>
                                <span class="pill">
                                  <a>{{ addr.lau.label }}</a>
                                </span>
                              </li>
                            </ul>
                          </li>
                        </ul>
                      </ul>
                    </div>
                  </b-col>
                </b-row>
                <b-row>
                  <b-col md="4" class="head">
                    Business Activity
                  </b-col>
                  <b-col md="8">
                    <div class="category-pill">
                      <ul
                        v-for="act in companyActivities"
                        :key="act.code"
                      >
                        <li>
                          <span class="pill">
                            <b-link
                              :to=" !act.code.includes('tol') ? { name: 'statistics-activity-activity', params: { activity: act.code } } : {}"
                              :class="act.code.includes('tol') ? 'not-clickable' : ''"
                            >
                              {{ act.label }}
                            </b-link>
                          </span>
                        </li>
                      </ul>
                      <span v-if="allActivitiesLoaded" class="pill" @click="loadMoreActivities">
                        Load more
                      </span>
                    </div>
                  </b-col>
                </b-row>
                <b-row>
                  <b-col md="4" class="head">URI</b-col>
                  <b-col md="8">
                    <b-link
                      class="anchor"
                      :href="company.uri"
                      target="_blank"
                    >
                      {{ company.uri }}
                    </b-link>
                  </b-col>
                </b-row>
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
  // TODO: remove these instructions after merge with explore page
  // How to redirect to this page
  // <b-link :to="{ name: 'company', query: {uri: '...'} }">
  //   Company
  // </b-link>
  components: {
    SimpleMap: () => import("../../components/map/SimpleMap"),
  },

  data() {
    return {
      breadcrumb_items: [
        {
          text: "HOME",
          to: { name: "index" },
        },
        {
          text: "EXPLORE",
          to: { name: "search" },
        },
        {
          text: "COMPANY",
          active: true,
        },
      ],
      company: {},
      loading: true,
      failed: false,
      companyActivities: []
    };
  },

  async mounted() {
    this.company = await this.$calls.getCompany(this.$route.query.uri)
      .then((response) => {
        return response;
      })
      .catch((error) => {
        console.error(error);
        this.loading = false;
        this.failed = true;
      });
    this.companyActivities = this.company.companyActivities.slice(0,5);
    this.loading = false;
  },

  computed: {
    companyName: function () {
      return this.company.legalNames
        .reduce((prev, cur) => `${prev} | ${cur.value}`, "")
        .slice(2);
    },

    allActivitiesLoaded: function(){
      return this.companyActivities.length < this.company.companyActivities.length
    }
  },

  methods:{
    loadMoreActivities(){
      this.companyActivities = this.company.companyActivities.slice(0,this.companyActivities.length+5)
    }
  }
};
</script>

<style lang="scss" scoped>
.not-clickable {
  cursor: text;
  &:hover {
    text-decoration: none;
  }
}
</style>
