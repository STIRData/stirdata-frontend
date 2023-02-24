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
          <b-col lg="6" xl="6" class="companydetail-left" v-if="company.registeredAddresses && company.registeredAddresses[0].nuts3">
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
                    {{ addr.fullAddress || createFullAddress(addr) }}
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
                        <li v-if="addr.nuts3">
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
                          <li class="separator" v-if="addr.lau" :class="{ 'no-parent-separator': !addr.nuts3 }">
                            <ul>
                              <li class="pill">
                                <a class="not-clickable">
                                  {{ addr.lau.label }}
                                </a>
                              </li>
                            </ul>
                          </li>
                        </ul>
                      </ul>
                    </div>
                  </b-col>
                </b-row>
                <b-row v-if="companyActivities.length > 0">
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
                              :to="{ name: 'statistics-activity-activity', params: { activity: act.code } }"
                              target="_blank"
                            >
                              {{ act.label ? act.label : act.code }}
                            </b-link>
                          </span>
                        </li>
                        <template v-if="act.child">
                          <ActivityChildNode :child="act.child" />
                        </template>
                      </ul>
                      <span v-if="allActivitiesLoaded" class="pill" @click="loadMoreActivities">
                        Load more
                      </span>
                    </div>
                  </b-col>
                </b-row>
                <b-row>
                  <b-col md="4" class="head">IRI</b-col>
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
                <b-row v-if="company.leiCode">
                  <b-col md="4" class="head">LEI Code</b-col>
                  <b-col md="8">
                    <p
                      class="anchor"
                    >
                      {{ company.leiCode }}
                    </p>
                  </b-col>
                </b-row>
                <div v-if="company.addOns" class="section-addons">
                  <b-row
                    v-for="(addOn, indexAddon) in company.addOns" :key="'addon-'+indexAddon"
                  >
                    <b-col v-if="addOn.results.length">
                      <div
                        class="w-100 head d-inline-flex justify-content-between align-items-center"
                        v-b-toggle="'collapse-'+indexAddon"
                      >
                        <span class="title">{{ addOn.label }}</span>
                        <font-awesome-icon icon="chevron-down" />
                      </div>
                      <b-collapse :id="'collapse-'+indexAddon">
                        <b-row class="addon-row">
                          <b-col
                            v-for="(addOnKey, indexKey) in Object.keys(addOn.results[0])" :key="'addon-header-col-'+indexKey"
                            class="head text-capitalize"
                            :class="'col-' + 12/Object.keys(addOn.results[0]).length"
                          >
                            {{ fieldName(addOn.fields, addOnKey) }}
                          </b-col>
                        </b-row>
                        <b-row
                          class="addon-row"
                          v-for="(row, indexRow) in addOn.results" :key="'addon-row-'+indexRow"
                        >
                          <b-col
                            v-for="(col, indexCol) in row" :key="'addon-col-'+indexCol"
                            :class="'col-' + 12/Object.keys(addOn.results[0]).length"
                          >
                            <span v-if="!col.startsWith('http')">{{ col }}</span>
                            <font-awesome-icon
                              v-else
                              icon="fa-solid fa-arrow-up-right-from-square"
                              :title="col"
                              @click="openExternalLink(col)"
                            />
                          </b-col>
                        </b-row>
                      </b-collapse>
                    </b-col>
                  </b-row>
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
          to: { name: "explore" },
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
    this.$calls.getCompany(this.$route.query.iri)
      .then(response => {
        this.company = response;
        this.companyActivities = response.companyActivities ? response.companyActivities.slice(0,5) : [];
        this.loading = false;
      })
      .catch(error => {
        console.error(error);
        this.loading = false;
        this.failed = true;
      });
  },

  computed: {
    companyName: function () {
      return this.company.legalNames
        .reduce((prev, cur) => `${prev} | ${cur.value}`, "")
        .slice(2);
    },
    allActivitiesLoaded: function() {
      return this.company.companyActivities ? this.companyActivities.length < this.company.companyActivities.length : true;
    }
  },

  methods: {
    loadMoreActivities() {
      this.companyActivities = this.company.companyActivities.slice(0,this.companyActivities.length+5)
    },
    createFullAddress(address) {
      let locatorDesignator = address.locatorDesignator ?? '';
      let street = address.thoroughfare ?? '';
      let postCode = address.postCode ?? '';
      let city = address.postName ?? '';
      return `${street.length ? locatorDesignator : ''} ${street}${street.length ? ',' : ''} ${postCode} ${city}`
    },
    openExternalLink(link) {
      window.open(link, '_blank');
    },
    fieldName(addOnFields, key) {
      for (let field of addOnFields) {
        if (field.name === key) {
          return field.label;
        }
      }
      return '-';
    }
  }
};
</script>

<style lang="scss">
section.companydetail {
  @media (max-width: 991.98px) {
    padding: 0 1rem;
  }
}
.not-clickable {
  cursor: text;
  &:hover {
    text-decoration: none;
  }
}
.fa-chevron-down {
  width: 19px;
  color: #525558;
  transform: rotate(0deg);
  transition: transform 0.2s linear;
}
:not(.collapsed) > .fa-chevron-down {
  color: #377fe8;
  transform: rotate(-180deg);
  transition: transform 0.2s linear;
}
:not(.collapsed) > .title {
  font-weight: 600;
}
.row:last-of-type {
  border-bottom: none !important;
}
.addon-row {
  border-bottom: 1px solid #F3F3F2 !important;
  .col {
    text-align: center;
    font-size: 0.875rem;
  }
}
.fa-arrow-up-right-from-square {
  cursor: pointer;
  display: var(--fa-display, inline-block);
  height: 1em;
  overflow: visible;
  vertical-align: -.125em;
}
</style>
