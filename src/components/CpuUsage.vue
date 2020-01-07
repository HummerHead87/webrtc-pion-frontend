<template>
  <div class="cpu-usage">
    <line-chart
      :chart-data="chartData"
      :options="chartOptions"
      :height="250"
    />
  </div>
</template>

<script>
import LineChart from './LineChart'
import { getPalette } from '@/helpers/colors'

export default {
  name: 'CpuUsage',

  components: {
    LineChart,
  },

  data: () => ({
    serverCPU: [],
    values: undefined,
    chartOptions: {
      // responsive: true,
      maintainAspectRatio: false,
      legend: {
        position: 'bottom',
      },
      animation: false,
      title: {
        display: true,
        text: 'Server CPU Usage',
      },
      scales: {
        yAxes: [{
          // display: true,
          // type: 'logarithmic',
          ticks: {
            min: 0,
            max: 100,
          },
        }],
      },
    },
  }),

  apollo: {
    $subscribe: {
      serverCPU: {
        query: require('../graphql/ServerCPU.gql'),
        result ({ data }) {
          this.serverCPU = data.serverCPU
          this.processData(data.serverCPU)
        },
      },
    },
  },

  computed: {
    labels () {
      const result = []
      for (let i = 60; i >= 0; i--) {
        result.push(i)
      }

      return result
    },

    chartData () {
      const datasets = []

      for (let i = 0; i < this.numCPU; i++) {
        datasets.push({
          label: `CPU${i}: ${Math.round(this.serverCPU[i])}%`,
          fill: false,
          borderColor: this.pallete[i],
          borderWidth: 1,
          pointStyle: 'dash',
          data: this.values[i],
          // lineTension: 0,
          // steppedLine: true,
        })
      }

      return {
        labels: this.labels,
        datasets,
      }
    },

    pallete () {
      if (this.numCPU) {
        return getPalette(this.numCPU)
      }

      return getPalette(8)
    },

    numCPU () {
      if (this.values) {
        return this.values.length
      }

      return undefined
    },
  },

  methods: {
    processData (data) {
      if (this.numCPU === undefined) {
        this.initScale(data.length)
      }

      for (let i = 0; i < this.numCPU; i++) {
        this.$set(this.values, i, this.appendToArray(this.values[i], data[i]))
      }
    },

    appendToArray (arr, value) {
      const result = []
      for (let i = 1; i < arr.length; i++) {
        result.push(arr[i])
      }
      result.push(value)

      return result
    },

    initScale (length) {
      const values = []
      for (let i = 0; i < length; i++) {
        const arr = new Array(61).fill(undefined)
        values.push(arr)
      }

      this.values = values
    },
  },
}
</script>
