import * as am4core from "@amcharts/amcharts4/core";
import * as am4maps from "@amcharts/amcharts4/maps";
import * as am4charts from "@amcharts/amcharts4/charts";
import europeHigh from "@amcharts/amcharts4-geodata/region/world/europeHigh";
import Vue from "vue";

Vue.prototype.$am4core = () => {
  return {
    am4core,
    am4maps,
    europeHigh,
    am4charts
  }
}
