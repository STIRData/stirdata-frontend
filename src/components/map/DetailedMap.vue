<template>
  <div id="detailedMap" />
</template>

<script>
  export default {
    name: 'DetailedMap',

    data() {
      return {
        countrySeries: [],
        countryTemplate: null,
        selectedCountry: null,
        regionSeries: [],
        regionTemplate: null,
        selectedRegion: null,
        previousLevel: null,
        // countryIds: ['BE', 'GB', 'CZ', 'GR', 'NO'],
        countries: [
          { id: "BE", name: "Belgium",        fill: "#454ea0", hasInfo: true },
          { id: "GB", name: "United Kingdom", fill: "#454ea0", hasInfo: true },
          { id: "CZ", name: "Czechia",        fill: "#454ea0", hasInfo: true },
          { id: "GR", name: "Greece",         fill: "#454ea0", hasInfo: true },
          { id: "NO", name: "Norway",         fill: "#454ea0", hasInfo: true }
        ]
      };
    },

    // computed: {
    //   activeGeoJSON() {
    //     return this.$store.countryGeoJSON || {};
    //   }
    // },

    mounted() {
      this.am4core = this.$am4core().am4core;
      this.am4maps = this.$am4core().am4maps;
      this.europeHigh = this.$am4core().europeHigh;

      this.initializeMap();
    },

    methods: {
      initializeMap() {
        // Create map instance
        this.mapChart = this.am4core.create("detailedMap", this.am4maps.MapChart);

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

        // Create country series
        this.countrySeries = chart.series.push(new this.am4maps.MapPolygonSeries());
        this.countrySeries.useGeodata = true;     // Make map load polygon (like country names) data from GeoJSON
        this.countrySeries.data = this.countries; // Load countries data
        // Configure series
        this.countryTemplate = this.countrySeries.mapPolygons.template;
        this.countryTemplate.propertyFields.fill = "fill";
        this.countryTemplate.tooltipText = "{name}";
        this.countryTemplate.fill = this.am4core.color("#a6a6a6");
        // Create hover state and set alternative fill color
        var hs = this.countryTemplate.states.create("hover");
        hs.properties.fill = this.am4core.color("#0c145c");
        var ss = this.countryTemplate.states.create("active");
        ss.properties.fill = this.am4core.color("#0c145c");

        // Create region series
        this.regionSeries = chart.series.push(new this.am4maps.MapPolygonSeries());
        this.regionSeries.useGeodata = true;
        this.regionSeries.hide();
        // Configure series
        this.regionTemplate = this.regionSeries.mapPolygons.template;
        this.regionTemplate.propertyFields.fill = "fill";
        this.regionTemplate.tooltipText = "{name}";
        this.regionTemplate.fill = this.am4core.color("#a6a6a6");
        // Create hover state and set alternative fill color
        var hs = this.regionTemplate.states.create("hover");
        hs.properties.fill = this.am4core.color("#0c145c");
        var ss = this.regionTemplate.states.create("active");
        ss.properties.fill = this.am4core.color("#0c145c");

        // Add event listeners
        homeButton.events.on("hit", () => this.goMapHome());
        this.countryTemplate.events.on("hit", (ev) => this.zoomInCountry(ev));
      },

      async zoomInCountry(ev) {
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

        var countryUri = `https://lod.stirdata.eu/nuts/code/${this.getCountryCode(ev.target.dataItem.dataContext.id)}`;
        var country = await this.$calls.getCountryRegions(countryUri);

        var regionsGeodata = new Object({
          type: "FeatureCollection",
          features: []
        });
        Promise.all(
          country.regionUris.map((region,index) => {
            return new Promise((resolve) => {
              this.$calls.getCountryGeoJSON(region, country.regionNames[index])
                .then(response => {
                  resolve(response);
                })
            })
          })
        )
        .then(responses => {
          this.countrySeries.getPolygonById(ev.target.dataItem.dataContext.id).hide();
          regionsGeodata.features = responses.filter(item => !!item);
          this.regionSeries.geodata = regionsGeodata;
          console.log(this.regionSeries.geodata);
          this.regionSeries.show();
          this.mapChart.zoomToMapObject(this.selectedCountry);
        });
      },

      goMapHome() {
        if (this.selectedCountry) {
          this.selectedCountry.isActive = false;
        }
        this.regionSeries.hide();
        this.mapChart.goHome();
      },

      getCountryCode(id) {
        if (id === 'GR') return 'EL';
        else if (id === 'GB') return 'UK';
        else return id;
      }
    },

    async beforeRouteLeave(to, from, next) {
      await this.mapChart.dispose();
      next();
    }
  }
</script>

<style lang="scss" scoped>
  #detailedMap {
    height: calc(100vh - 450px);
    background-color: white;
    width: 100%;
    margin-bottom: 3rem;
  }
</style>
