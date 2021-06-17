<template>
  <div
    class="container"
  >
    <div class="w-100">
      <b-form
        v-if="show"
        @submit="onSubmit"
        @reset="onReset"
      >
        <b-row class="d-flex justify-content-between">
          <b-col>
            <h3 class="mb-4">Region</h3>
            <b-form-group
              v-if="form.nutsTags.length > 0"
            >
              <b-form-tags
                v-model="form.nutsTags"
                input-id="nuts-tags"
                input-class="d-none"
                :input-attrs="{'readonly':'true'}"
                tag-variant="info"
                tag-class="font-weight-bold p-2"
                add-button-text=""
                no-outer-focus
                size="md"
                placeholder=""
              />
            </b-form-group>
            <b-form-group
              v-for="(nuts, index) in nutsOptions"
              :key="'nuts-group-'+index"
              id="'nuts-group-'+index"
            >
              <b-col
                cols="10"
                class="d-inline-flex p-0"
              >
                <b-form-select
                  id="'nuts-'+index"
                  v-model="form.nuts[index]"
                  :options="nuts"
                  v-on:change="selectLevel('nuts', index)"
                />
              </b-col>
              <b-col
                v-if="index < 3 && form.nuts[index] && form.nuts[index].length > 0"
                cols="1"
                class="d-inline-flex p-0"
              >
                <b-button
                  variant="secondary"
                  @click="form.nutsTags.push(form.nuts[index].split('/').pop())"
                >
                  <i class="fa fa-plus" aria-hidden="true" />
                </b-button>
              </b-col>
            </b-form-group>
          </b-col>
          <b-col>
            <h3 class="mb-4">Activity</h3>
            <b-form-group
              v-if="form.naceTags.length > 0"
            >
              <b-form-tags
                v-model="form.naceTags"
                input-id="nace-tags"
                input-class="d-none"
                :input-attrs="{'readonly':'true'}"
                tag-variant="info"
                tag-class="font-weight-bold p-2"
                add-button-text=""
                no-outer-focus
                size="md"
                placeholder=""
              />
            </b-form-group>
            <b-form-group
              v-for="(nace, index) in naceOptions"
              :key="'nace-group-'+index"
              id="'nace-group-'+index"
            >
              <b-col
                cols="10"
                class="d-inline-flex p-0"
              >
                <b-form-select
                  id="'nace-'+index"
                  v-model="form.nace[index]"
                  :options="nace"
                  v-on:change="selectLevel('nace', index)"
                />
              </b-col>
              <b-col
                v-if="index < 3 && form.nace[index] && form.nace[index].length > 0"
                cols="1"
                class="d-inline-flex p-0"
              >
                <b-button
                  variant="secondary"
                  @click="form.naceTags.push(form.nace[index].split('/').pop())"
                >
                  <i class="fa fa-plus" aria-hidden="true" />
                </b-button>
              </b-col>

            </b-form-group>
          </b-col>
          <b-col>
            <h3 class="mb-4">Registration Date</h3>
            <b-form-group
              id="date-group"
            >
              <b-row class="align-items-center mb-2">
                <b-col cols="2" class="mb-2">After:</b-col>
                <b-col cols="10">
                  <b-form-datepicker
                    id="date-0"
                    v-model="form.startDate"
                    class="mb-2"
                    :start-weekday="1"
                    :show-decade-nav="true"
                    :hide-header="true"
                    placeholder="Registered after"
                  />
                </b-col>
              </b-row>
              <b-row class="align-items-center">
                <b-col cols="2" class="mb-2">Before:</b-col>
                <b-col cols="10">
                  <b-form-datepicker
                    id="date-1"
                    v-model="form.endDate"
                    class="mb-2"
                    :start-weekday="1"
                    :show-decade-nav="true"
                    :hide-header="true"
                    :state="validateInput()"
                    placeholder="Registered before"
                  />
                </b-col>
              </b-row>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row class="mt-2 pt-4 d-flex justify-content-between px-3 border-top">
          <div>
            <b-row class="ml-0">
              <b-col cols={6} class="mr-5">
                <b-form-group class="mb-1">
                  <b-form-checkbox
                    id="gnuts3-checkbox"
                    v-model="form.gnuts3"
                    name="group-by-region"
                  >
                    Group by region
                  </b-form-checkbox>
                </b-form-group>
                <b-form-group class="mb-0">
                  <b-form-checkbox
                    id="gnace-checkbox"
                    v-model="form.gnace"
                    name="group-by-activity"
                  >
                    Group by activity
                  </b-form-checkbox>
                </b-form-group>
              </b-col>
              <b-col cols={2} class="align-self-center">
                <b-button
                  variant="primary"
                  @click="searchGroupBy()"
                >
                  View
                </b-button>
              </b-col>
            </b-row>
          </div>
          <div class="align-self-center">
            <b-button
              type="reset"
              variant="outline-danger"
            >
              Reset
            </b-button>
            <b-button
              type="submit"
              variant="primary"
              class="ml-2"
              :disabled="loadingQueries.length > 0"
            >
              <div v-if="loadingQueries.length > 0" class="d-flex">
                <b-spinner small type="grow" class="align-self-center mr-2" /> Searching...
              </div>
              <div v-else>
                Search
              </div>
            </b-button>
          </div>
        </b-row>
      </b-form>
      <div
        v-if="results && Object.keys(results).length > 0"
        class="mt-4 pt-4 border-secondary border-top"
      >
        <h3 id="searchResults" class="text-center mb-4">Results</h3>
        <b-tabs
          justified
          nav-class="mx-3"
        >
          <b-tab
            v-for="(endpoint, index) in results"
            :key="index"
            :title="endpoint.title"
            title-item-class="text-capitalize"
          >
            <div
              v-if="loading"
              class="d-flex justify-content-center m-5"
            >
              <b-spinner label="Loading" />
            </div>
            <b-table
              v-else
              striped
              hover
              small
              :items="endpoint.entries"
            >
              <template #cell(link)="sites">
                <span v-for="link in sites.value">
                  <a :href="link" class="pr-3" target="_blank">
                    <i class="fa fa-external-link" aria-hidden="true" />
                  </a>
                </span>
              </template>
            </b-table>
            <div class="overflow-auto">
              <b-pagination-nav
                align="center"
                :limit="11"
                :number-of-pages="Math.ceil(parseInt(endpoint.count) / pageSize)"
                :link-gen="page => {return '';}"
                @page-click="(event, page) => {goToPage(event, page, endpoint.countryCode);}"
              />
            </div>
          </b-tab>
        </b-tabs>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        show: true,
        loading: false,
        loadingQueries: [],
        form: {
          nuts: [],
          nutsTags: [],
          gnuts3: false,
          nace: [],
          naceTags: [],
          gnace: false,
          startDate: null,
          endDate: null
        },
        nutsOptions: [],
        naceOptions: [],
        queries: [],
        results: null,
        pageSize: 20,
        endpoints: {}
      }
    },

    async fetch() {
      let nuts0 = [];
      let nace0 = [];

      let nutsZeroResponse = await this.$api.get('nuts');
      nutsZeroResponse.data.results.bindings.forEach(item => {
        nuts0.push({'value': item.code.value, 'text': `${item.code.value.split('/').pop()} - ${item.label.value}`});
        this.endpoints[item.code.value.split('/').pop()] = [];
      });
      this.nutsOptions.push(nuts0);

      let naceZeroResponse = await this.$api.get('nace');
      naceZeroResponse.data.results.bindings.forEach(item => {
        nace0.push({'value': item.code.value, 'text': `${item.code.value.split('/').pop()} - ${item.label.value}`});
      });
      this.naceOptions.push(nace0);
    },

    methods: {
      validateInput() {
        let validEndDate = !this.form.endDate || !this.form.startDate || this.form.endDate > this.form.startDate;

        return validEndDate && (this.form.nutsTags.length > 0 || this.form.naceTags.length > 0);
      },

      selectLevel(type, level) {
        let typeOptions = `${type}Options`;
        let typeTags = `${type}Tags`;
        this.$api.get(`${type}?parent=${this.form[type][level]}`)
          .then(response => {
            if (response.data.results.bindings.length > 0) {
              let options = [];
              response.data.results.bindings.forEach(item => {
                options.push({'value': item.code.value, 'text': `${item.code.value.split('/').pop()} - ${item.label.value}`});
              });
              if (level === this[typeOptions].length-1) {
                this[typeOptions].push(options);
              }
              else {
                this[typeOptions].splice(level+1, 1, options);
                this[typeOptions] = this[typeOptions].slice(0, level+2);
                this.form[type].splice(level+1, 4);
              }
            }
            else {
              this.form[typeTags].push(this.form[type][level].split('/').pop());
            }
          });
      },

      goToPage(bvEvent, page, country) {
        this.$scrollTo('#searchResults', {easing: 'ease-in-out', lazy: false, offset: -88, duration: 750});

        let query = this.queries.find(q => q.includes(`country=${country}`)) + `page=${page}`;
        this.loading = true;
        this.searchQuery(query, true);
      },

      buildQueries() {
        let naceQuery = this.form.naceTags.map(code => `NACE=https://lod.stirdata.eu/nace/nace-rev2/code/${code}&`).join('');
        let startDateQuery = this.form.startDate ? `startDate=${this.form.startDate}&` : '';
        let endDateQuery = this.form.endDate ? `endDate=${this.form.endDate}&` : '';

        this.queries = [];
        if (this.form.nutsTags.length > 0) {
          this.form.nutsTags.forEach(code => {
            this.endpoints[code.slice(0,2)].push(`NUTS=https://lod.stirdata.eu/nuts/code/${code}`);
          });
          for (const code in this.endpoints) {
            if (this.endpoints[code] && this.endpoints[code].length > 0) {
              this.queries.push(`query?country=${code}&${this.endpoints[code].join('&')}&${naceQuery}${startDateQuery}${endDateQuery}`);
              // Empty the query of this endpoint, for the next search
              this.endpoints[code] = [];
            }
          };
        }
        else {
          for (const code in this.endpoints) {
            this.queries.push(`query?country=${code}&NUTS=https://lod.stirdata.eu/nuts/code/${code}&${naceQuery}${startDateQuery}${endDateQuery}`);
          };
        }
      },

      searchQuery(q, update) {
        this.$api.get(q)
          .then(queryResponse => {
            if (update) {
              this.results[queryResponse.data[0].endpointName].entries = [];
            } else {
              this.results = Object.assign({}, this.results);
              this.results[queryResponse.data[0].endpointName] = {
                'countryCode': queryResponse.data[0].countryCode,
                'count': queryResponse.data[0].count,
                'title': `${queryResponse.data[0].endpointName.split('-')[0]} (${queryResponse.data[0].count.toLocaleString()})`,
                'entries': []
              };
            }
            if (queryResponse.data[0].response.length > 0) {
              queryResponse.data[0].response.forEach(item => {
                if (item['@type'] && item['@type'][0] === "http://www.w3.org/ns/regorg#RegisteredOrganization") {
                  let name = item['http://www.w3.org/ns/regorg#legalName'] ? item['http://www.w3.org/ns/regorg#legalName'][0]['@value'] : 'no-name-found';
                  let date = item['https://schema.org/foundingDate'] ? item['https://schema.org/foundingDate'][0]['@value'] : (item['http://schema.org/foundingDate'] ? item['http://schema.org/foundingDate'][0]['@value'] : 'no-date-found');
                  let activity = item['http://www.w3.org/ns/regorg#orgActivity'] ? item['http://www.w3.org/ns/regorg#orgActivity'][0]['@id'].split('/').pop() : '';
                  let sites = item['http://www.w3.org/2002/07/owl#sameAs'] ? item['http://www.w3.org/2002/07/owl#sameAs'].map(e => e['@id']).filter(e => !e.includes('opencorporates')) : [];
                  this.results[queryResponse.data[0].endpointName].entries.push({'name': name, 'registration_date': date, 'activity': activity, 'link': sites});
                }
              });
            }
            else {
              this.$bvToast.toast(`${queryResponse.data[0].endpointName}: No response for these criteria.`, {
                variant: 'danger',
                title: 'Warning',
                solid: true
              });
            }
            if (update) {
              this.loading = false;
            } else {
              this.loadingQueries.pop();
            }
          })
          .catch(error => {
            if (update) {
              this.loading = false;
            } else {
              this.loadingQueries.pop();
            }
            console.error(error);
          });
      },

      searchGroupBy(update) {
        // TODO: Retrieve groupBy results and display them
        if (!this.validateInput()) {
          this.$bvToast.toast('You have to select at least one search criteria.', {
            variant: 'danger',
            title: 'Warning',
            solid: true
          });
          return;
        }

        this.buildQueries();
        let q = `${this.queries[0].replace("query", "query/grouped")}&gnace=${this.form.gnace}&gnuts3=${this.form.gnuts3}`;

        this.$api.get(q)
          .then(response => {
            if (update) {
              this.results[response.data[0].endpointName+'-stats'].entries = [];
            } else {
              this.results = Object.assign({}, this.results);
              this.results[response.data[0].endpointName+'-stats'] = {
                'countryCode': response.data[0].countryCode,
                'count': response.data[0].count,
                'title': `${response.data[0].endpointName.split('-')[0]} statistics`,
                'entries': []
              };
            }
            if (response.data[0].response.results.bindings.length > 0) {
              response.data[0].response.results.bindings.forEach(item => {
                let activity = item.nace ? item.nace.value.split('/').pop() : '';
                let region = item.nuts3 ? item.nuts3.value.split('/').pop() : '';
                let count = item.count ? item.count.value : 0;
                this.results[response.data[0].endpointName+'-stats'].entries.push({'activity': activity, 'region': region, 'count': count});
              });
            }
            else {
              this.$bvToast.toast(`${response.data[0].endpointName}: No response for these criteria.`, {
                variant: 'danger',
                title: 'Warning',
                solid: true
              });
            }
            if (update) {
              this.loading = false;
            } else {
              this.loadingQueries.pop();
            }
          })
          .catch(error => {
            if (update) {
              this.loading = false;
            } else {
              this.loadingQueries.pop();
            }
            console.error(error);
          });
      },

      onSubmit(event) {
        event.preventDefault();
        if (!this.validateInput()) {
          this.$bvToast.toast('You have to select at least one search criteria.', {
            variant: 'danger',
            title: 'Warning',
            solid: true
          });
          return;
        }

        this.buildQueries();

        this.results = {};
        for (let q of this.queries) {
          this.loadingQueries.push(true);
          this.searchQuery(q.slice(0, -1), false);
        }
      },

      onReset(event) {
        event.preventDefault();
        // Reset our form values
        this.form.nuts = [];
        this.form.nutsTags = [];
        this.nutsOptions = this.nutsOptions.slice(0, 1);
        this.form.nace = [];
        this.form.naceTags = [];
        this.naceOptions = this.naceOptions.slice(0, 1);
        this.form.startDate = null;
        this.form.endDate = null;
        // Reset/clear native browser form validation state
        this.show = false
        this.$nextTick(() => {
          this.show = true
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '../assets/scss/variables.scss';

  .container {
    margin: 0 auto;
    display: flex;
  }

  .filters-overview {
    width: 80%;
    font-size: $font-size-small;
  }

  .subtitle {
    font-weight: 300;
    font-size: 42px;
    color: #526488;
    word-spacing: 5px;
    padding-bottom: 15px;
  }

  .links {
    padding-top: 15px;
  }

  .b-form-tags {
    padding: 0;
    border: 0;
    background-color: inherit;
  }
</style>
