<template>
  <div id="simpleMap" :class="{'empty-map': emptyMapBool }" />
</template>

<script>
import { mapState } from 'vuex';
  export default {
    name: 'SimpleMap',

    async beforeRouteLeave(to, from, next) {
      await this.mapChart.dispose();
      next();
    },

    props: {
      regionCode: {
        type: String,
        required: true
      },
      naceCode: {
        type: String,
        required: false
      },
      lau: {
        type: Object,
        required: false
      },
      isActivityLeaf: {
        type: Boolean,
        required: false,
        default: false
      }
    },

    data() {
      return {
        customGeodata: {
          features: [],
          type: 'FeatureCollection'
        },
        emptyMapBool: false
      };
    },

    mounted() {
      this.am4core = this.$am4core().am4core;
      this.am4maps = this.$am4core().am4maps;
      this.europeHigh = this.$am4core().europeHigh;

      const code = this.regionCode.includes(':') ? this.regionCode : `nuts:${this.regionCode}`;
      let resolution = '3M,1M';

      this.$calls.getRegionGeoJSON(this.regionCode, resolution)
        .then(async (response) => {
          response?.forEach(region => {
            this.customGeodata.features.push({
              geometry: 'uri' in region.place[0] ? JSON.parse(region.place[0].geometry) : {},
              id: region.place[0].code,
              properties: {
                name: region.place[0].label,
                id: region.place[0].code,
                Continent: 'Europe'
              },
              type: 'Feature'
            });
          });
          if(!response || !Object.keys(this.customGeodata.features[0].geometry).length){
            this.emptyMapBool = true
          }
          this.initializeMap();
        })
        .catch(error => console.error(error));
    },

    computed: {
      ...mapState({
        hoveredRegion: state => state.hoveredRegion
      })
    },

    watch: {
      hoveredRegion(newValue, oldValue){
        if(!this.polygonSeries || !this.polygonTemplate) return;

        this.$store.commit('setHoveredRegion', newValue);
        if (newValue) {
          this.polygonSeries.data=[{
            id: newValue.code,
            name: newValue.label,
            fill: this.am4core.color("#f9a800")
          }];
          this.polygonTemplate.propertyFields.fill = "fill";
        }
        else{
          this.polygonSeries.data=[{
            id: oldValue.code,
            name: oldValue.label,
            fill: this.am4core.color("#C4CEDD")
          }];
          this.polygonTemplate.propertyFields.fill = "fill";
        }

      }
    },

    methods: {
      initializeMap() {
        // Create map instance
        this.mapChart = this.am4core.create('simpleMap', this.am4maps.MapChart);

        let chart = this.mapChart;
        chart.geodata = this.customGeodata;                       // Set map definition
        chart.projection = new this.am4maps.projections.Miller(); // Set projection
        chart.panBehavior = 'none';                               // Disable map panning
        chart.chartContainer.wheelable = false;                   // Disable map zooming
        chart.seriesContainer.events.disableType('doublehit');
        chart.chartContainer.background.events.disableType('doublehit');

        // Create map polygon series
        let polygonSeries = chart.series.push(new this.am4maps.MapPolygonSeries());
        polygonSeries.useGeodata = true;     // Make map load polygon (like country names) data from GeoJSON

        // Configure series
        let polygonTemplate = polygonSeries.mapPolygons.template;
        polygonTemplate.propertyFields.fill = 'fill';
        polygonTemplate.fill = this.am4core.color('#C4CEDD');
        polygonTemplate.tooltipText = '{name}';
        polygonSeries.tooltip.getFillFromObject = false;
        polygonSeries.tooltip.background.fill = this.am4core.color('#0056b3');
        // If there's a selected lau-region, highlight it on the map
        if (this.lau) {
          polygonSeries.data=[{
            id: this.lau.code,
            name: this.lau.label,
            fill: this.am4core.color("#0056b3")
          }];
          polygonTemplate.propertyFields.fill = "fill";
        }
        // Create hover state and set alternative fill color
        polygonTemplate.cursorOverStyle = this.lau ? this.am4core.MouseCursorStyle.default : this.am4core.MouseCursorStyle.pointer;
        let hs = polygonTemplate.states.create('hover');
        hs.properties.fill = this.am4core.color('#f9a800');

        // Add event listeners
        polygonTemplate.events.on('hit', (ev) => this.handleRegionClick(ev.target.dataItem.dataContext.id));
        this.polygonTemplate = polygonTemplate;
        this.polygonSeries = polygonSeries;
      },

      handleRegionClick(id) {
        if (id.includes('lau') && (this.lau || this.isActivityLeaf)) {
          return;
        }
        if(this.naceCode){
          this.$router.push({ name: 'statistics-region-region', query:{ activity: this.naceCode, place: id } });
        }
        else { this.$router.push({ name: 'statistics-region-region', params: { region: id }})};
      }
    }
  };
</script>

<style lang="scss" scoped>
  #simpleMap {
    height: inherit;
  }
  .empty-map{
    position: relative;
    &::after{
      content:"There are no location data for this region!";
      position: absolute;
      left:50%;
      top: 50%;
      transform: translate(-50%, -50%);
      color: #355FAA;
      font-size: 1.2rem;
      text-align: center;
      font-weight: 600;
    }
  }
</style>
