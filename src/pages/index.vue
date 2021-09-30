<template>
  <div
    class="landpage"
  >
    <div id="chartdiv" />
  </div>
</template>

<script>
export default {
  mounted() {
    /**
     * --------------------------------------------------------
     * This demo was created using amCharts V4 preview release.
     *
     * V4 is the latest installement in amCharts data viz
     * library family, to be released in the first half of
     * 2018.
     *
     * For more information and documentation visit:
     * https://www.amcharts.com/docs/v4/
     * --------------------------------------------------------
     */
    let { am4core, am4maps, europeHigh, am4charts } = this.$am4core();

    // Create map instance
    var chart = am4core.create("chartdiv", am4maps.MapChart);

    // Set map definition
    chart.geodata = europeHigh;

    // Set projection
    chart.projection = new am4maps.projections.Miller();

    // Create map polygon series
    var polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());

    chart.zoomControl = new am4maps.ZoomControl();
    chart.zoomControl.plusButton.background.fill = am4core.color("#5C5CFE");
    chart.zoomControl.plusButton.fill = am4core.color("#dbd3d3");
    chart.zoomControl.minusButton.background.fill = am4core.color("#5C5CFE");
    chart.zoomControl.minusButton.fill = am4core.color("#dbd3d3");

    var homeButton = new am4core.Button();
    homeButton.background.fill = am4core.color("#5C5CFE");
    homeButton.fill = am4core.color("#dbd3d3");
    homeButton.tooltipText = "Zoom back to Europe";
    homeButton.tooltipColorSource = am4core.color("#5C5CFE");
    homeButton.events.on("hit", function () {
      // document.getElementById('chartdiv').classList.remove("w-60");
      chart.goHome();
    });
    homeButton.icon = new am4core.Sprite();
    homeButton.padding(7, 5, 7, 5);
    homeButton.width = 30;
    homeButton.icon.path =
      "M16,8 L14,8 L14,16 L10,16 L10,10 L6,10 L6,16 L2,16 L2,8 L0,8 L8,0 L16,8 Z M16,8";
    homeButton.marginBottom = 10;
    homeButton.parent = chart.zoomControl;
    homeButton.insertBefore(chart.zoomControl.plusButton);

    // polygonSeries.include = ["BE", "GR", "GB", "CZ", "NO"];

    // Exclude Antartica
    polygonSeries.exclude = ["AQ"];

    // Make map load polygon (like country names) data from GeoJSON
    polygonSeries.useGeodata = true;

    // Configure series
    var polygonTemplate = polygonSeries.mapPolygons.template;
    polygonTemplate.tooltipText = "{name}";
    polygonTemplate.fill = am4core.color("#4f4f4f");

    var lastSelected;

    polygonTemplate.events.on("hit", function (ev) {
      var hasInfoBool = false;
      for (let country of polygonSeries.data) {
        // Check if the country that was clicked is in the countries that we added with separate colors which have info
        if (country.hasOwnProperty("hasInfo") && country.name === ev.target.dataItem.dataContext.name) {
          console.log(country.name, country.hasOwnProperty("hasInfo"));
          hasInfoBool = true;
          break;
        }
      }
      //if we do not have info for the clicked country do not show piechart
      if (!hasInfoBool) {
        //Toast with appropriate message to inform about no available info
        $nuxt.$emit('toast-warning', `There is no data available for ${ev.target.dataItem.dataContext.name}`);
        return;
      }

      if (lastSelected) {
        lastSelected.isActive = false;
      }

      zoomToCountry(ev.target);
    });

    /* Create selected and hover states and set alternative fill color */
    var ss = polygonTemplate.states.create("active");
    ss.properties.fill = chart.colors.getIndex(2);

    // Create hover state and set alternative fill color
    var hs = polygonTemplate.states.create("hover");
    hs.properties.fill = am4core.color("#9c0303");

    // Setting map's initial zoom
    // chart.homeZoomLevel = 3.5;
    // chart.homeGeoPoint = {
    //   latitude: 54.8,
    //   longitude: 11,
    // };
    // Add some data
    polygonSeries.data = [
      {
        id: "BE",
        name: "Belgium",
        fill: am4core.color("#5C5CFF"),
        hasInfo: true,
      },
      {
        id: "GB",
        name: "United Kingdom",
        fill: am4core.color("#5C5CFF"),
        hasInfo: true,
      },
      {
        id: "CZ",
        name: "Czechia",
        fill: am4core.color("#5C5CFF"),
        hasInfo: true,
      },
      {
        id: "GR",
        name: "Greece",
        fill: am4core.color("#5C5CFF"),
        hasInfo: true,
      },
      {
        id: "NO",
        name: "Norway",
        fill: am4core.color("#5C5CFF"),
        hasInfo: true,
      },
    ];
    polygonTemplate.propertyFields.fill = "fill";
    // Pie chart
    var pieChart = chart.seriesContainer.createChild(am4charts.PieChart);
    // Set width/heigh of a pie chart for easier positioning only
    pieChart.width = 100;
    pieChart.height = 100;
    pieChart.hidden = true; // can't use visible = false!

    // because defauls are 50, and it's not good with small countries
    pieChart.chartContainer.minHeight = 1;
    pieChart.chartContainer.minWidth = 1;

    var pieSeries = pieChart.series.push(new am4charts.PieSeries());
    pieSeries.dataFields.value = "value";
    pieSeries.dataFields.category = "category";
    pieSeries.data = [
      { value: 100, category: "First" },
      { value: 20, category: "Second" },
      { value: 10, category: "Third" },
    ];

    var dropShadowFilter = new am4core.DropShadowFilter();
    dropShadowFilter.blur = 4;
    pieSeries.filters.push(dropShadowFilter);

    var sliceTemplate = pieSeries.slices.template;
    sliceTemplate.fillOpacity = 1;
    sliceTemplate.strokeOpacity = 0;

    var activeState = sliceTemplate.states.getKey("active");
    activeState.properties.shiftRadius = 0; // no need to pull on click, as country circle under the pie won't make it good

    var sliceHoverState = sliceTemplate.states.getKey("hover");
    sliceHoverState.properties.shiftRadius = 0; // no need to pull on click, as country circle under the pie won't make it good

    // we don't need default pie chart animation, so change defaults
    var hiddenState = pieSeries.hiddenState;
    hiddenState.properties.startAngle = pieSeries.startAngle;
    hiddenState.properties.endAngle = pieSeries.endAngle;
    hiddenState.properties.opacity = 0;
    hiddenState.properties.visible = false;

    // series labels
    var labelTemplate = pieSeries.labels.template;
    labelTemplate.nonScaling = true;
    labelTemplate.fill = am4core.color("#FFFFFF");
    labelTemplate.fontSize = 10;
    labelTemplate.background = new am4core.RoundedRectangle();
    labelTemplate.background.fillOpacity = 0.9;
    labelTemplate.padding(4, 9, 4, 9);
    labelTemplate.background.fill = am4core.color("#10123d");

    // we need pie series to hide faster to avoid strange pause after country is clicked
    pieSeries.hiddenState.transitionDuration = 200;

    function zoomToCountry(polygon) {
      var zoomAnimation = chart.zoomToMapObject(polygon);
      console.log(polygon);
      if (zoomAnimation) {
        zoomAnimation.events.on("animationended", function () {
          showPieChart(polygon);
        });
      } else {
        showPieChart(polygon);
      }
    }
    function showPieChart(polygon) {
      // document.getElementById('chartdiv').classList.add("w-60");
      /*
      polygon.polygon.measure();
      var radius =
        ((polygon.polygon.measuredWidth / 2) * polygon.globalScale) /
        chart.seriesContainer.scale;
      pieChart.width = radius;
      pieChart.height = radius;
      pieChart.radius = radius / 2;

      var centerPoint = am4core.utils.spritePointToSvg(
        polygon.polygon.centerPoint,
        polygon.polygon
      );
      centerPoint = am4core.utils.svgPointToSprite(
        centerPoint,
        chart.seriesContainer
      );

      pieChart.x = centerPoint.x - 0.6 * radius;
      pieChart.y = centerPoint.y - 0.6 * radius;

      var fill = polygon.fill;
      // var desaturated = fill.saturate(0.3);

      for (var i = 0; i < pieSeries.dataItems.length; i++) {
        var dataItem = pieSeries.dataItems.getIndex(i);
        dataItem.value = Math.round(Math.random() * 100);
        dataItem.slice.fill = am4core.color(
          am4core.colors.interpolate(
            am4core.color("#750202").rgb,
            am4core.color("#ffffff").rgb,
            0.2 * i
          )
        );
      }

      pieSeries.show();
      pieChart.show();
      */
    }

  },

  created() {
    this.$nuxt.$on('toast-warning', (message) => {
      this.$bvToast.toast(message, {
        variant: 'danger',
        title: 'Warning',
        solid: true
      });
    });
  }
};
</script>

<style lang="scss" scoped>
  @import '../assets/scss/variables.scss';

  #chartdiv {
    height: calc(100vh - 160px);
    background-color: white;
  }

  .landpage {
    padding-left: 12rem;
    padding-right: 12rem;
  }
</style>
