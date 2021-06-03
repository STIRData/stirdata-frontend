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
              v-for="(nuts, index) in nutsOptions"
              :key="'nuts-group-'+index"
              id="'nuts-group-'+index"
            >
              <b-form-select
                id="'nuts-'+index"
                v-model="form.nuts[index]"
                :options="nuts"
                v-on:change="selectNuts(index)"
              />
            </b-form-group>
          </b-col>
          <b-col>
            <h3 class="mb-4">Activity</h3>
            <b-form-group
              v-for="(nace, index) in naceOptions"
              :key="'nace-group-'+index"
              id="'nace-group-'+index"
            >
              <b-form-select
                id="'nace-'+index"
                v-model="form.nace[index]"
                :options="nace"
                v-on:change="selectNace(index)"
              />
            </b-form-group>
          </b-col>
          <b-col>
            <h3 class="mb-4">
              Date
            </h3>
            <b-form-group
              id="date-group"
            >
              <b-row class="align-items-center mb-2">
                <b-col cols="2" class="mb-2">From:</b-col>
                <b-col cols="10">
                  <b-form-datepicker
                    id="date-0"
                    v-model="form.startDate"
                    class="mb-2"
                    :start-weekday="1"
                    :show-decade-nav="true"
                    :hide-header="true"
                    placeholder="Start date"
                  />
                </b-col>
              </b-row>
              <b-row class="align-items-center">
                <b-col cols="2" class="mb-2">Until:</b-col>
                <b-col cols="10">
                  <b-form-datepicker
                    id="date-1"
                    v-model="form.endDate"
                    class="mb-2"
                    :start-weekday="1"
                    :show-decade-nav="true"
                    :hide-header="true"
                    :state="validateInput('endDate')"
                    placeholder="End date"
                  />
                </b-col>
              </b-row>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row class="mt-2 pt-4 d-flex justify-content-end px-3 border-top">
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
            >
              Search
            </b-button>
          </div>
        </b-row>
      </b-form>
      <div
        v-if="results"
        class="mt-4 pt-4 border-secondary border-top"
      >
        <h3 class="text-center">Results</h3>
        <div
          v-for="(endpoint, index) in results"
          :key="index"
        >
          <h5 class="mt-4">{{ index }}</h5>
          <b-table striped hover small :items="endpoint"></b-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        show: true,
        form: {
          nuts: [],
          nace: [],
          startDate: null,
          endDate: null
        },
        queryResponse: null,
        results: null,
        nutsOptions: [],
        naceOptions: []
      }
    },

    async fetch() {
      let nuts0 = [];
      let nace0 = [];

      let nutsZeroResponse = await this.$api.get('nuts');
      nutsZeroResponse.data.results.bindings.forEach(item => {
        nuts0.push({'value': item.code.value, 'text': `${item.code.value.split('/').pop()} - ${item.label.value}`});
      });
      this.nutsOptions.push(nuts0);

      let naceZeroResponse = await this.$api.get('nace');
      naceZeroResponse.data.results.bindings.forEach(item => {
        nace0.push({'value': item.code.value, 'text': `${item.code.value.split('/').pop()} - ${item.label.value}`});
      });
      this.naceOptions.push(nace0);
    },

    methods: {
      validateInput(field) {
        let validNuts = this.form.nuts.length == 4;
        // let validNace = !!this.form.nace;
        // let validStartDate = !!this.form.startDate;
        let validEndDate = !this.form.endDate || !this.form.startDate || this.form.endDate > this.form.startDate;

        if (field === 'endDate') return validEndDate;

        return validNuts && validEndDate && (!!this.form.nuts || !!this.form.nace || !!this.form.startDate || !!this.form.endDate);
      },

      selectNuts(level) {
        this.$api.get(`nuts?parent=${this.form.nuts[level]}`)
          .then(response => {
            if (response.data.results.bindings.length > 0) {
              let options = [];
              response.data.results.bindings.forEach(item => {
                options.push({'value': item.code.value, 'text': `${item.code.value.split('/').pop()} - ${item.label.value}`});
              });
              if (level === this.nutsOptions.length-1) {
                this.nutsOptions.push(options);
              }
              else {
                this.nutsOptions.splice(level+1, 1, options);
                this.nutsOptions = this.nutsOptions.slice(0, level+2);
              }
            }
          });
      },

      selectNace(level) {
        this.$api.get(`nace?parent=${this.form.nace[level]}`)
          .then(response => {
            if (response.data.results.bindings.length > 0) {
              let options = [];
              response.data.results.bindings.forEach(item => {
                options.push({'value': item.code.value, 'text': `${item.code.value.split('/').pop()} - ${item.label.value}`});
              });
              if (level === this.naceOptions.length-1) {
                this.naceOptions.push(options);
              }
              else {
                this.naceOptions.splice(level+1, 1, options);
                this.naceOptions = this.naceOptions.slice(0, level+2);
              }
            }
          });
      },

      onSubmit(event) {
        event.preventDefault();
        if (!this.validateInput('')) {
          alert('You have to select a region and enter a valid date range.')
          return;
        }

        let query = "";
        if (this.form.nuts.length > 0) query = query + `NUTS=${this.form.nuts[this.form.nuts.length - 1]}&`;
        if (this.form.nace.length > 0) query = query + `NACE=${this.form.nace[this.form.nace.length - 1]}&`;
        if (this.form.startDate) query = query + `startDate=${this.form.startDate}&`;
        if (this.form.endDate) query = query + `endDate=${this.form.endDate}&`;
        this.$api.get(`query?${query.slice(0, -1)}`)
          .then(queryResponse => {
            this.results = {};
            for (let endpoint of queryResponse.data) {
              this.results[endpoint.endpointName] = [];

              endpoint.response.forEach(item => {
                let name = item['http://www.w3.org/ns/regorg#legalName'][0]['@value'];
                let date = item['https://schema.org/foundingDate'][0]['@value'];
                this.results[endpoint.endpointName].push({'name': name, 'date': date});
              });
            }
          })
          .catch(error => {
            console.error(error);
          });
      },

      onReset(event) {
        event.preventDefault();
        // Reset our form values
        this.form.nuts = [];
        this.nutsOptions = this.nutsOptions.slice(0, 1);
        this.form.nace = [];
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
    /* min-height: 100vh; */
    display: flex;
    /* justify-content: center; */
    /* align-items: center; */
    /* text-align: center; */
  }

  .filters-overview {
    width: 80%;
    font-size: $font-size-small;
  }

  .title {
    font-family:
      'Quicksand',
      'Source Sans Pro',
      -apple-system,
      BlinkMacSystemFont,
      'Segoe UI',
      Roboto,
      'Helvetica Neue',
      Arial,
      sans-serif;
    display: block;
    font-weight: 300;
    font-size: 100px;
    color: #35495e;
    letter-spacing: 1px;
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
</style>
