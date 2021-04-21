<template>
  <div style="width: 100%;">
    <v-btn
      icon
      class="mr-3"
      @click="createChart()"
    >
      <v-tooltip
        bottom
        open-on-hover
        open-delay="500"
      >
        <template v-slot:activator="{ on }">
          <v-icon :color="chartVisible ? 'wasdmedium' : ''" v-on="on">
            fas fa-chart-line
          </v-icon>
        </template>
        <span>{{ chartVisible ? 'Скрыть диаграмму' : 'Показать диаграмму' }}</span>
      </v-tooltip>
    </v-btn>
    <v-row dense class="ml-2 mr-5">
      <v-col cols="3">
        <canvas id="myChart" class="pa-2" />
      </v-col>
      <v-col cols="3">
        <canvas id="myChart1" class="pa-2" />
      </v-col>
      <v-col cols="3">
        <canvas id="myChart2" class="pa-2" />
      </v-col>
      <v-col cols="3">
        <canvas id="myChart3" class="pa-2" />
      </v-col>
    </v-row>
    <!-- <highcharts
      v-if="chartVisible"
      :options="chartOptions"
      ref="lineCharts"
      style="width: 100%"
    /> -->
  </div>
</template>

<script>
// import axios from 'axios'
import { mapFields } from 'vuex-map-fields'
import Chart from 'chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels'
Chart.plugins.register(ChartDataLabels)
// import { Chart } from 'highcharts-vue'
// import Highcharts from 'highcharts'
// import loadDrilldown from 'highcharts/modules/drilldown.js'
// loadDrilldown(Highcharts)

export default {
  components: {
    // highcharts: Chart
  },
  data: () => ({
    chartVisible: false,
    // chartOptions: {
    //   title: {
    //     text: 'wasd'
    //   },
    //   chart: {
    //     defaultSeriesType: 'column',
    //     title: 'wasd'
    //   },
    //   yAxis: {
    //     title: {
    //       text: 'Total percent market share'
    //     }
    //   },
    //   xAxis: {
    //     categories: [
    //       'Всего',
    //       'Исполнено',
    //       'Просрочено',
    //       'ПИР'
    //     ]
    //   },
    //   tooltip: {
    //     crosshairs: true,
    //     shared: true
    //   },
    //   // credits: {
    //   //   enabled: false
    //   // },
    //   // plotOptions: {
    //   //   spline: {
    //   //     marker: {
    //   //       radius: 4,
    //   //       lineColor: '#666666',
    //   //       lineWidth: 1
    //   //     }
    //   //   }
    //   // },
    //   series: [
    //     {
    //       data: [192, 116, 33, 6]
    //     }
    //   ]
    // }
    options: {
      title: {
        display: true,
        text: 'Обязательства Заказчика перед WASD'
      },
      legend: {
        display: false,
        labels: {
          fontColor: 'rgb(255, 99, 132)'
        }
      },
      plugins: {
        datalabels: {
          anchor: 'end',
          align: 'top',
          formatter: Math.round,
          font: {
            weight: 'bold'
          }
        }
      },
      tooltips: { enabled: false }
    },
    lineChartData: {
      labels: ['Всего', 'Исполнено', 'Просрочено', 'ПИР'],
      datasets: [
        {
          label: '',
          data: [192, 116, 33, 6],
          backgroundColor: [
            'rgba(54, 162, 235, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(255, 99, 132, 0.2)'
          ],
          borderColor: [
            'rgba(54, 162, 235, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(255, 99, 132, 1)'
          ],
          borderWidth: 1
        }
      ]
    }
  }),
  computed: {
    ...mapFields([
      'selectedHeaders',
      'allHeaders',
      'currentUser'
    ])
  },
  methods: {
    createChart () {
      this.chartVisible = true
      // var Chart = require('chart.js')
      var ctx = document.getElementById('myChart')
      var myChart = new Chart(ctx, {
        plugins: [ChartDataLabels],
        type: 'bar',
        data: this.lineChartData,
        options: this.options
      })
      var ctx1 = document.getElementById('myChart1')
      var myChart1 = new Chart(ctx1, {
        plugins: [ChartDataLabels],
        type: 'bar',
        data: this.lineChartData,
        options: this.options
      })
      var ctx2 = document.getElementById('myChart2')
      var myChart2 = new Chart(ctx2, {
        plugins: [ChartDataLabels],
        type: 'bar',
        data: this.lineChartData,
        options: this.options
      })
      var ctx3 = document.getElementById('myChart3')
      var myChart3 = new Chart(ctx3, {
        plugins: [ChartDataLabels],
        type: 'bar',
        data: this.lineChartData,
        options: this.options
      })
    }
  }
}
</script>
