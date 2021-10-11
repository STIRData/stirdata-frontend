<template>
  <div id="simpleMap" />
</template>

<script>
  export default {
    name: 'SimpleMap',

    data() {
      return {
        selectedCountry: null,
        countries: [
          { id: "BE", name: "Belgium",        fill: "#454ea0", hasInfo: true },
          { id: "GB", name: "United Kingdom", fill: "#454ea0", hasInfo: true },
          { id: "CZ", name: "Czechia",        fill: "#454ea0", hasInfo: true },
          { id: "GR", name: "Greece",         fill: "#454ea0", hasInfo: true },
          { id: "NO", name: "Norway",         fill: "#454ea0", hasInfo: true }
        ]
      };
    },

    mounted() {
      this.am4core = this.$am4core().am4core,
      this.am4maps = this.$am4core().am4maps,
      this.europeHigh = this.$am4core().europeHigh,

      this.initializeMap();
    },

    methods: {
      initializeMap() {
        // Create map instance
        this.mapChart = this.am4core.create("simpleMap", this.am4maps.MapChart);

        var chart = this.mapChart;
        chart.geodata = this.europeHigh;                          // Set map definition
        chart.projection = new this.am4maps.projections.Miller(); // Set projection
        chart.panBehavior = "none";                               // Disable map panning

        // Configure home button
        var homeButton = new this.am4core.Button();
        homeButton.tooltip = new this.am4core.Tooltip();
        homeButton.icon = new this.am4core.Sprite();
        homeButton.background.fill = this.am4core.color("#2b3595");
        homeButton.fill = this.am4core.color("#FFF");
        homeButton.tooltip.pointerOrientation = "left";
        homeButton.tooltip.dx = 16;
        homeButton.tooltip.dy = 13;
        homeButton.tooltipText = "Return to Europe";
        homeButton.tooltipColorSource = this.am4core.color("#2b3595");
        homeButton.padding(7, 5, 23, 5);
        homeButton.height = 40;
        homeButton.width = 40;
        homeButton.icon.path = "M16,8 L14,8 L14,16 L10,16 L10,10 L6,10 L6,16 L2,16 L2,8 L0,8 L8,0 L16,8 Z M16,8";
        homeButton.dx = 8;
        homeButton.dy = 8;
        homeButton.parent = chart;

        // Create map polygon series
        var polygonSeries = chart.series.push(new this.am4maps.MapPolygonSeries());
        polygonSeries.useGeodata = true;     // Make map load polygon (like country names) data from GeoJSON
        polygonSeries.data = this.countries; // Load countries data

        // Configure series
        var polygonTemplate = polygonSeries.mapPolygons.template;
        polygonTemplate.propertyFields.fill = "fill";
        polygonTemplate.tooltipText = "{name}";
        polygonTemplate.fill = this.am4core.color("#a6a6a6");

        // Create hover state and set alternative fill color
        var hs = polygonTemplate.states.create("hover");
        hs.properties.fill = this.am4core.color("#0c145c");
        var ss = polygonTemplate.states.create("active");
        ss.properties.fill = this.am4core.color("#0c145c");

        // Add event listeners
        homeButton.events.on("hit", () => this.goMapHome());
        polygonTemplate.events.on("hit", (ev) => this.handleZoomIn(ev));
      },

      handleZoomIn(ev) {
        var hasCountryInfo = this.countries.findIndex(c => c.hasOwnProperty("hasInfo") && c.name === ev.target.dataItem.dataContext.name) > -1;

        if (!hasCountryInfo) {
          this.$emit('toast-warning', `There is no data available for ${ev.target.dataItem.dataContext.name}`);
          return;
        }

        if (this.selectedCountry) {
          this.selectedCountry.isActive = false;
        }
        this.selectedCountry = ev.target;
        this.selectedCountry.isActive = true;
        this.mapChart.zoomToMapObject(this.selectedCountry);

        // TODO: Also render chart with country-stats, next to the map
      },

      goMapHome() {
        if (this.selectedCountry) {
          this.selectedCountry.isActive = false;
        }
        this.mapChart.goHome();
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
    height: calc(100vh - 160px);
    background-color: white;
  }
</style>
