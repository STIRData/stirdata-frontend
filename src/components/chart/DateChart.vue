<template>
  <div
    v-if="!loading && !failed"
    class="chart"
  >
    <client-only>
      <line-chart
        :key="updateChart"
        :data="chartData"
        :options="chartOptions"
      />
    </client-only>
  </div>
  <div
    v-else-if="loading"
    class="d-flex justify-content-center"
  >
    <Spinner />
  </div>
  <div
    v-else-if="failed"
    class="d-flex justify-content-center"
  >
    There are no available statistics for the selected country.
  </div>
</template>

<script>
  export default {
    name: 'DateChart',

    components: {
      Spinner: () => import('../Spinner')
    },

    props: {
      countryCode: {
        type: String,
        required: true
      },
      countryDates: {
        type: Object,
        required: false
      }
    },

    data() {
      return {
        loading: true,
        failed: false,
        updateChart: 0,
        foundingDates: [],
        foundingDateResolutions: [],
        dissolutionDates: [],
        // Chart content
        chartData: {
          labels: [],
          datasets: []
        },
        // Chart configuration
        chartOptions: {
          responsive: true,
          maintainAspectRatio: false,
          tooltips: {
            callbacks: {
              title(tooltipItem, data) {
                return data.tooltipTitles[parseInt(tooltipItem[0].index)];
              },
              label(tooltipItem, data) {
                return tooltipItem.yLabel.toLocaleString() + ' companies';
              }
            }
          },
          scales: {
            xAxes: [
              {
                gridLines: {
                  display: false
                }
              }
            ],
            yAxes: [
              {
                gridLines: {
                  drawBorder: false
                },
                ticks: {
                  beginAtZero: true,
                  padding: 16,
                  userCallback(value, index, values) {
                    return value.toLocaleString();
                  }
                }
              }
            ]
          },
          legend: {
            align: 'end',
            labels: {
              boxWidth: 7,
              padding: 16,
              fontSize: 14,
              fontFamily: '\'Jost\',\'Avenir\',\'sans-serif\'',
              usePointStyle: true
            }
          }
        }
      };
    },

    mounted() {
      // If the dates are already retrieved, just populate the chart
      if (this.countryDates) {
        this.foundingDates = this.countryDates.foundingDates ? this.countryDates.foundingDates : [];
        this.dissolutionDates = this.countryDates.dissolutionDates ? this.countryDates.dissolutionDates : [];
        if (this.foundingDates.length) {
          this.populateFoundingChartData();
        }
        if (this.dissolutionDates.length) {
          this.populateDissolutionChartData();
        }
        return;
      }

      // If the dates are not passed, call the API and then populate the chart
      this.$calls.getRegionStatistics(this.countryCode)
        .then(response => {
          this.foundingDates = response.foundingDateGroups ? response.foundingDateGroups : [];
          this.dissolutionDates = response.dissolutionDateGroups ? response.dissolutionDateGroups : [];
          if (this.foundingDates.length) {
            this.populateFoundingChartData();
          }
          if (this.dissolutionDates.length) {
            this.populateDissolutionChartData();
          }
          if (this.foundingDates.length + this.dissolutionDates.length == 0) {
            this.loading = false;
            this.failed = true;
          }
        })
        .catch(error => {
          console.error(error);
          this.loading = false;
          this.failed = true;
        });
    },

    methods: {
      populateFoundingChartData() {
        this.chartData.labels = this.foundingDates.map(date => new Date(date.foundingDate.from).getFullYear());
        this.chartData.tooltipTitles = this.foundingDates.map(date => {
          if (new Date(date.foundingDate.from).getFullYear() === new Date(date.foundingDate.to).getFullYear()) {
            return new Date(date.foundingDate.from).getFullYear();
          } else {
            return [new Date(date.foundingDate.from).getFullYear(), new Date(date.foundingDate.to).getFullYear()].join(' - ');
          }
        });
        this.chartData.datasets.push({
          label: 'Established',
          data: this.foundingDates.map(date => new Object({ x: new Date(date.foundingDate.from).getFullYear(), y: date.count })),
          backgroundColor: ['rgba(175, 240, 175, 0.2)'],
          borderColor: 'green',
          borderWidth: 1,
          lineTension: 0
        });
        this.failed = false;
        this.loading = false;
        this.updateChart++;
      },
      populateDissolutionChartData() {
        this.dissolutionDates.forEach(date => {
          let disYear = new Date(date.dissolutionDate.from).getFullYear();
          if (!this.chartData.labels.includes(disYear)) {
            this.chartData.labels.push(disYear);
            this.chartData.labels.sort();
          }
        });
        this.chartData.datasets.push({
          label: 'Dissoluted',
          data: this.dissolutionDates.map(date => new Object({ x: new Date(date.dissolutionDate.from).getFullYear(), y: date.count })),
          backgroundColor: ['rgba(255, 99, 132, 0.2)'],
          borderColor: 'red',
          borderWidth: 1,
          lineTension: 0
        });
        this.failed = false;
        this.loading = false;
        this.updateChart++;
      }
    }
  };
</script>

<style lang="scss" scoped>
@import "../../assets/scss/variables.scss";
</style>
