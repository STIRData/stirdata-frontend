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
            <h3 class="mb-4">
              Region
              <h5 v-if="form.nuts" class="font-weight-normal mt-3">
                {{ `Selected region: ${nutsOptions.find(option => option.value === form.nuts).text}` }}
              </h5>
            </h3>
            <b-form-group
              id="nuts-group"
              label="Select country"
              label-for="nuts-0"
            >
              <b-form-select
                id="nuts-0"
                v-model="form.nuts"
                :options="nutsOptions"
              />
            </b-form-group>
          </b-col>
          <b-col>
            <h3 class="mb-4">
              Activity
              <h5 v-if="form.nace" class="font-weight-normal mt-3">
                {{ `Selected activity: ${naceOptions.find(option => option.value === form.nace).text}` }}
              </h5>
            </h3>
            <b-form-group
              id="nace-group"
              label="Select category"
              label-for="nace-0"
            >
              <b-form-select
                id="nace-0"
                v-model="form.nace"
                :options="naceOptions"
              />
            </b-form-group>
          </b-col>
          <b-col>
            <h3 class="mb-4">
              Date
            </h3>
            <b-form-group
              id="date-group"
              label="Select date range"
              label-for="date-0"
            >
              <b-row class="align-items-center">
                <b-col cols="2" class="mb-2">From:</b-col>
                <b-col cols="10">
                  <b-form-datepicker
                    id="date-0"
                    v-model="form.startDate"
                    class="mb-2"
                    :start-weekday="1"
                    :show-decade-nav="true"
                    :hide-header="true"
                    placeholder="Choose a start date"
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
                    placeholder="Choose an end date"
                  />
                </b-col>
              </b-row>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row class="mt-2 pt-4 d-flex justify-content-end px-3 border-top">
          <b-button
            type="reset"
            variant="outline-danger"
          >
            Reset
          </b-button>
          <b-button
            type="submit"
            variant="primary"
            class="ml-3"
          >
            Search
          </b-button>
        </b-row>
      </b-form>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        form: {
          nuts: null,
          nace: null,
          startDate: null,
          endDate: null
        },
        nutsOptions: [],
        naceOptions: [],
        foods: [{ text: 'Select One', value: null }, 'Carrots', 'Beans', 'Tomatoes', 'Corn'],
        show: true,
        // Remove when api setup is ready
        nutsZeroResponse: {'head':{'vars':['code','label']},'results':{'bindings':[{'code':{'type':'uri','value':'https://lod.stirdata.eu/nuts/code/BE'},'label':{'type':'literal','value':'Belgique/België'}},{'code':{'type':'uri','value':'https://lod.stirdata.eu/nuts/code/CZ'},'label':{'type':'literal','value':'Česko'}},{'code':{'type':'uri','value':'https://lod.stirdata.eu/nuts/code/NO'},'label':{'type':'literal','value':'Norge'}}]}},
        naceZeroResponse: {'head': {'vars': [ 'code', 'label' ]}, 'results': {'bindings': [ {'code': {'type': 'uri', 'value': 'https://lod.stirdata.eu/nace/code/A'}, 'label': {'type': 'literal', 'xml:lang': 'en', 'value': 'AGRICULTURE, FORESTRY AND FISHING'}}, {'code': {'type': 'uri', 'value': 'https://lod.stirdata.eu/nace/code/B'}, 'label': {'type': 'literal', 'xml:lang': 'en', 'value': 'MINING AND QUARRYING'}}, {'code': {'type': 'uri', 'value': 'https://lod.stirdata.eu/nace/code/C'}, 'label': {'type': 'literal', 'xml:lang': 'en', 'value': 'MANUFACTURING'}}, {'code': {'type': 'uri', 'value': 'https://lod.stirdata.eu/nace/code/D'}, 'label': {'type': 'literal', 'xml:lang': 'en', 'value': 'ELECTRICITY, GAS, STEAM AND AIR CONDITIONING SUPPLY'}}, {'code': {'type': 'uri', 'value': 'https://lod.stirdata.eu/nace/code/E'}, 'label': {'type': 'literal', 'xml:lang': 'en', 'value': 'WATER SUPPLY; SEWERAGE, WASTE MANAGEMENT AND REMEDIATION ACTIVITIES'}}, {'code': {'type': 'uri', 'value': 'https://lod.stirdata.eu/nace/code/F'}, 'label': {'type': 'literal', 'xml:lang': 'en', 'value': 'CONSTRUCTION'}}, {'code': {'type': 'uri', 'value': 'https://lod.stirdata.eu/nace/code/G'}, 'label': {'type': 'literal', 'xml:lang': 'en', 'value': 'WHOLESALE AND RETAIL TRADE; REPAIR OF MOTOR VEHICLES AND MOTORCYCLES'}}, {'code': {'type': 'uri', 'value': 'https://lod.stirdata.eu/nace/code/H'}, 'label': {'type': 'literal', 'xml:lang': 'en', 'value': 'TRANSPORTATION AND STORAGE'}}, {'code': {'type': 'uri', 'value': 'https://lod.stirdata.eu/nace/code/I'}, 'label': {'type': 'literal', 'xml:lang': 'en', 'value': 'ACCOMMODATION AND FOOD SERVICE ACTIVITIES'}}, {'code': {'type': 'uri', 'value': 'https://lod.stirdata.eu/nace/code/J'}, 'label': {'type': 'literal', 'xml:lang': 'en', 'value': 'INFORMATION AND COMMUNICATION'}}, {'code': {'type': 'uri', 'value': 'https://lod.stirdata.eu/nace/code/K'}, 'label': {'type': 'literal', 'xml:lang': 'en', 'value': 'FINANCIAL AND INSURANCE ACTIVITIES'}}, {'code': {'type': 'uri', 'value': 'https://lod.stirdata.eu/nace/code/L'}, 'label': {'type': 'literal', 'xml:lang': 'en', 'value': 'REAL ESTATE ACTIVITIES'}}, {'code': {'type': 'uri', 'value': 'https://lod.stirdata.eu/nace/code/M'}, 'label': {'type': 'literal', 'xml:lang': 'en', 'value': 'PROFESSIONAL, SCIENTIFIC AND TECHNICAL ACTIVITIES'}}, {'code': {'type': 'uri', 'value': 'https://lod.stirdata.eu/nace/code/N'}, 'label': {'type': 'literal', 'xml:lang': 'en', 'value': 'ADMINISTRATIVE AND SUPPORT SERVICE ACTIVITIES'}}, {'code': {'type': 'uri', 'value': 'https://lod.stirdata.eu/nace/code/O'}, 'label': {'type': 'literal', 'xml:lang': 'en', 'value': 'PUBLIC ADMINISTRATION AND DEFENCE; COMPULSORY SOCIAL SECURITY'}}, {'code': {'type': 'uri', 'value': 'https://lod.stirdata.eu/nace/code/P'}, 'label': {'type': 'literal', 'xml:lang': 'en', 'value': 'EDUCATION'}}, {'code': {'type': 'uri', 'value': 'https://lod.stirdata.eu/nace/code/Q'}, 'label': {'type': 'literal', 'xml:lang': 'en', 'value': 'HUMAN HEALTH AND SOCIAL WORK ACTIVITIES'}}, {'code': {'type': 'uri', 'value': 'https://lod.stirdata.eu/nace/code/R'}, 'label': {'type': 'literal', 'xml:lang': 'en', 'value': 'ARTS, ENTERTAINMENT AND RECREATION'}}, {'code': {'type': 'uri', 'value': 'https://lod.stirdata.eu/nace/code/S'}, 'label': {'type': 'literal', 'xml:lang': 'en', 'value': 'OTHER SERVICE ACTIVITIES'}}, {'code': {'type': 'uri', 'value': 'https://lod.stirdata.eu/nace/code/T'}, 'label': {'type': 'literal', 'xml:lang': 'en', 'value': 'ACTIVITIES OF HOUSEHOLDS AS EMPLOYERS; UNDIFFERENTIATED GOODS- AND SERVICES-PRODUCING ACTIVITIES OF HOUSEHOLDS FOR OWN USE'}}, {'code': {'type': 'uri', 'value': 'https://lod.stirdata.eu/nace/code/U'}, 'label': {'type': 'literal', 'xml:lang': 'en', 'value': 'ACTIVITIES OF EXTRATERRITORIAL ORGANISATIONS AND BODIES'}} ]}}
      }
    },

    fetch() {
      // Replace with API call when api setup is ready
      this.nutsZeroResponse.results.bindings.forEach(item => {
        this.nutsOptions.push({'value': item.code.value, 'text': `${item.code.value.split('/').pop()} - ${item.label.value}`});
      });
      this.naceZeroResponse.results.bindings.forEach(item => {
        this.naceOptions.push({'value': item.code.value, 'text': `${item.code.value.split('/').pop()} - ${item.label.value}`});
      });
    },

    methods: {
      validateInput(field) {
        // let validNuts = !!this.form.nuts;
        // let validNace = !!this.form.nace;
        // let validStartDate = !!this.form.startDate;
        let validEndDate = !this.form.endDate || !this.form.startDate || this.form.endDate > this.form.startDate;

        if (field === 'endDate') return validEndDate;

        return validEndDate && (!!this.form.nuts || !!this.form.nace || !!this.form.startDate || !!this.form.endDate);
      },

      onSubmit(event) {
        event.preventDefault();
        if (!this.validateInput('')) {
          alert('You have to enter at least one value in the form.')
          return;
        }
        alert(JSON.stringify(this.form));
      },

      onReset(event) {
        event.preventDefault();
        // Reset our form values
        this.form.nuts = null;
        this.form.nace = null;
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

<style>
  .container {
    margin: 0 auto;
    /* min-height: 100vh; */
    display: flex;
    /* justify-content: center; */
    /* align-items: center; */
    /* text-align: center; */
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
