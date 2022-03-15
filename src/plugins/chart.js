import Vue from 'vue';
import { Line } from 'vue-chartjs';

Vue.component('line-chart', {
  extends: Line,

  props: {
    data: {
      type: Object,
      required: true
    },
    options: {
      type: Object,
      required: true
    }
  },

  mounted() {
    if (this.$data._chart) {
      this.$data._chart.destroy();
    }
    this.renderChart(this.data, this.options);
  }
});
