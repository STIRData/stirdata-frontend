<template>
  <div id="singleMap" />
</template>

<script>
  export default {
    name: 'SimpleMap',

    data() {
      return {
        countries: [
          { id: "BE", name: "Belgium",        fill: "#2b3595", hasInfo: true },
          { id: "GB", name: "United Kingdom", fill: "#2b3595", hasInfo: true },
          { id: "CZ", name: "Czechia",        fill: "#2b3595", hasInfo: true },
          { id: "GR", name: "Greece",         fill: "#2b3595", hasInfo: true },
          { id: "NO", name: "Norway",         fill: "#2b3595", hasInfo: true }
        ]
      };
    },

    mounted() {
      let { am4core, am4maps, europeHigh, am4charts } = this.$am4core();
      this.initializeMap(am4core, am4maps, europeHigh, am4charts);
    },

    methods: {
      initializeMap(am4core, am4maps, europeHigh, am4charts) {
        // Create map instance
        var chart = am4core.create("singleMap", am4maps.MapChart);
        // Set map definition
        chart.geodata = europeHigh;
        // Set projection
        chart.projection = new am4maps.projections.Miller();
        // Create map polygon series
        var polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());
        // Make map load polygon (like country names) data from GeoJSON
        polygonSeries.useGeodata = true;

        var homeButton = new am4core.Button();
        homeButton.tooltip = new am4core.Tooltip();
        homeButton.icon = new am4core.Sprite();
        homeButton.background.fill = am4core.color("#2b3595");
        homeButton.fill = am4core.color("#FFF");
        homeButton.tooltip.pointerOrientation = "left";
        homeButton.tooltip.dx = 16;
        homeButton.tooltip.dy = 16;
        homeButton.tooltipText = "Return to Europe";
        homeButton.tooltipColorSource = am4core.color("#2b3595");
        homeButton.padding(7, 5, 7, 5);
        homeButton.width = 30;
        homeButton.icon.path = "M16,8 L14,8 L14,16 L10,16 L10,10 L6,10 L6,16 L2,16 L2,8 L0,8 L8,0 L16,8 Z M16,8";
        homeButton.dx = 8;
        homeButton.parent = chart;

        // Configure series
        var polygonTemplate = polygonSeries.mapPolygons.template;
        polygonTemplate.tooltipText = "{name}";
        polygonTemplate.fill = am4core.color("#a6a6a6");

        /* Create selected and hover states and set alternative fill color */
        var ss = polygonTemplate.states.create("active");
        ss.properties.fill = chart.colors.getIndex(2);

        // Create hover state and set alternative fill color
        var hs = polygonTemplate.states.create("hover");
        hs.properties.fill = am4core.color("#4f2593");

        // Add some data
        polygonSeries.data = this.countries;
        polygonTemplate.propertyFields.fill = "fill";

        // Add event listeners
        polygonTemplate.events.on("hit", (ev) => this.handleZoomIn(ev, chart, polygonSeries));
        homeButton.events.on("hit", () => chart.goHome());
      },

      handleZoomIn(ev, chart, polygonSeries) {
        var lastSelected;
        var hasInfoBool = false;
        for (let country of polygonSeries.data) {
          // Check if the country that was clicked is in the countries that we added with separate colors which have info
          if (country.hasOwnProperty("hasInfo") && country.name === ev.target.dataItem.dataContext.name) {
            hasInfoBool = true;
            break;
          }
        }
        //if we do not have info for the clicked country throw toast
        if (!hasInfoBool) {
          //Toast with appropriate message to inform about no available info
          this.$emit('toast-warning', `There is no data available for ${ev.target.dataItem.dataContext.name}`);
          return;
        }

        if (lastSelected) {
          lastSelected.isActive = false;
        }

        var zoomAnimation = chart.zoomToMapObject(ev.target);
      }
    }
  }
</script>

<style lang="scss" scoped>
  #singleMap {
    height: calc(100vh - 160px);
    background-color: white;
  }
</style>
