<template>
  <svg
    v-if="!loading"
    id="homepagemap"
    baseprofile="tiny"
    fill="#E4E8EE"
    stroke="#ffffff"
    stroke-linecap="round"
    stroke-linejoin="round"
    stroke-width="1"
    version="1.2"
    viewBox="100,100,900,800"
    preserveAspectRatio="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <template v-for="code of Object.keys(regions)">
      <!-- Countries with no data -->
      <path
        v-if="!countryCounts[code]"
        :id="code"
        :key="'country-' + code"
        :name="regions[code].name"
        :d="regions[code].coordinates"
      />
      <!-- Countries with data -->
      <template
        v-else
      >
        <b-link
          :id="code + 'pop'"
          :key="'link-' + code"
          :to="{ name: 'statistics-region-region', params: { region: code } }"
        >
          <path
            :id="code"
            :name="regions[code].name"
            :d="regions[code].coordinates"
          />
        </b-link>
        <b-tooltip
          :key="'tooltip-' + code"
          :target="code + 'pop'"
          triggers="hover"
        >
          <div class="htmlpop">
            <span class="count">
              {{ regions[code].name }}
              <span class="label" />
            </span>
            <br />
            <span
              v-if="!loading"
              class="detail"
            >
              {{ countryCounts[code].toLocaleString() }} Companies
            </span>
          </div>
        </b-tooltip>
      </template>
    </template>
    <!-- <circle cx="399.9" cy="390.8" id="0"></circle>
    <circle cx="575.4" cy="412" id="1"></circle>
    <circle cx="521" cy="266.6" id="2"></circle> -->
  </svg>
</template>

<script>
  import { mapState } from 'vuex';
  import regions from '../../../data/regions.json';

  export default {
    name: 'SvgMap',

    data() {
      return {
        loading: true,
        countryCounts: {},
        regions: {}
      };
    },

    computed: {
      ...mapState({
        countriesStatistics: state => state.countriesStatistics
      })
    },

    async mounted() {
      this.regions = regions;
      if (this.countriesStatistics.length == 0) {
        this.loading = true;
        await this.$store.dispatch('fetchTopLevelStatistics');
      }
      this.countriesStatistics.forEach(entry => {
        this.countryCounts[entry.country.code] = entry.count;
      });
      this.loading = false;
    }
  };
</script>

<style lang="scss" scoped>
  @import "../../assets/scss/variables.scss";

  ::v-deep .arrow::before {
    border-top-color: $accent-first-color;
    border-bottom-color: $accent-first-color;
  }
</style>
