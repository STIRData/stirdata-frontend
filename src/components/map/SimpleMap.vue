<template>
  <div id="simpleMap" />
</template>

<script>
  export default {
    name: 'SimpleMap',

    props: {
      regionCode: {
        type: String,
        required: true
      }
    },

    data() {
      return {
        hasLauSubregions: false,
        customGeodata: {
          features: [],
          type: 'FeatureCollection'
        }
      };
    },

    mounted() {
      this.am4core = this.$am4core().am4core;
      this.am4maps = this.$am4core().am4maps;
      this.europeHigh = this.$am4core().europeHigh;

      const code = this.regionCode.includes(':') ? this.regionCode : `nuts:${this.regionCode}`;
      const resolution = code.split(':')[1].length < 5 ? '3M' : '1M';
      this.hasLauSubregions = code.split(':')[1].length < 5 ? false : true;

      this.$calls.getRegionGeoJSON(this.regionCode, resolution)
        .then(response => {
          response.forEach(region => {
            this.customGeodata.features.push({
              geometry: JSON.parse(region.place.geometry),
              id: region.place.code,
              properties: {
                name: region.place.label,
                id: region.place.code,
                Continent: 'Europe'
              },
              type: 'Feature'
            });
          });
          this.initializeMap();
        })
        .catch(error => console.error(error));
    },

    methods: {
      initializeMap() {
        // Create map instance
        this.mapChart = this.am4core.create("simpleMap", this.am4maps.MapChart);

        var chart = this.mapChart;
        chart.geodata = this.customGeodata;                       // Set map definition
        chart.projection = new this.am4maps.projections.Miller(); // Set projection
        chart.panBehavior = "none";                               // Disable map panning
        chart.chartContainer.wheelable = false;                   // Disable map zooming
        chart.seriesContainer.events.disableType("doublehit");
        chart.chartContainer.background.events.disableType("doublehit");

        // Create map polygon series
        var polygonSeries = chart.series.push(new this.am4maps.MapPolygonSeries());
        polygonSeries.useGeodata = true;     // Make map load polygon (like country names) data from GeoJSON

        // Configure series
        var polygonTemplate = polygonSeries.mapPolygons.template;
        polygonTemplate.propertyFields.fill = "fill";
        polygonTemplate.fill = this.am4core.color("#C4CEDD");
        polygonTemplate.tooltipText = "{name}";
        polygonSeries.tooltip.getFillFromObject = false;
        polygonSeries.tooltip.background.fill = this.am4core.color("#0056b3");

        // Create hover state and set alternative fill color
        polygonTemplate.cursorOverStyle = this.hasLauSubregions ? this.am4core.MouseCursorStyle.default : this.am4core.MouseCursorStyle.pointer;
        var hs = polygonTemplate.states.create("hover");
        hs.properties.fill = this.am4core.color("#f9a800");

        // Add event listeners
        polygonTemplate.events.on("hit", (ev) => this.handleRegionClick(ev.target.dataItem.dataContext.id));
      },

      handleRegionClick(id) {
        if (id.includes('lau')) {
          return;
        }
        this.$router.push({ name: 'statistics-region-region', params: { region: id } });
      }
    },

    async beforeRouteLeave(to, from, next) {
      await this.mapChart.dispose();
      next();
    }
  }
</script>

<style lang="scss" scoped>
  #simpleMap {
    height: inherit;
  }
</style>
