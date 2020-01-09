<template>
  <v-row class="cpu-ram-usage">
    <v-col cols="12" sm="6">
      <line-chart
        :chart-data="chartDataCPU"
        :options="chartOptionsCPU"
        :height="250"
      />
    </v-col>
    <v-col cols="12" sm="6">
      <line-chart
        :chart-data="chartDataRAM"
        :options="chartOptionsRAM"
        :height="250"
      />
    </v-col>
  </v-row>
</template>

<script>
import LineChart from './LineChart'
import { getPalette, getColor } from '@/helpers/colors'

export default {
  name: 'CpuRamUsage',

  components: {
    LineChart,
  },

  data: () => ({
    serverCPU: [],
    serverRAM: {},
    valuesCPU: undefined,
    valuesRAM: new Array(61).fill(undefined),
    chartOptionsCPU: {
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
      serverLoad: {
        query: require('../graphql/ServerLoad.gql'),
        result ({ data }) {
          this.serverCPU = data.serverLoad.cpu
          this.processCPUData(this.serverCPU)
          this.serverRAM = data.serverLoad.ram
          this.processRAMData(this.serverRAM.usedPercent)
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

    chartDataCPU () {
      const datasets = []

      for (let i = 0; i < this.numCPU; i++) {
        datasets.push({
          label: `CPU${i}: ${Math.round(this.serverCPU[i])}%`,
          fill: false,
          borderColor: this.pallete[i],
          borderWidth: 1,
          pointStyle: 'dash',
          data: this.valuesCPU[i],
          // lineTension: 0,
          // steppedLine: true,
        })
      }

      return {
        labels: this.labels,
        datasets,
      }
    },

    chartDataRAM () {
      return {
        labels: this.labels,
        datasets: [{
          label: `RAM$: ${Math.round(this.serverRAM.usedPercent)}%`,
          fill: false,
          borderColor: getColor('Green'),
          borderWidth: 1,
          pointStyle: 'dash',
          data: this.valuesRAM,
        }],
      }
    },

    chartOptionsRAM () {
      return {
        // responsive: true,
        maintainAspectRatio: false,
        legend: {
          position: 'bottom',
        },
        animation: false,
        title: {
          display: true,
          text: `Server RAM Usage. Total: ${this.serverRAM.total}Mb, Used: ${this.serverRAM.used}Mb`,
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
      }
    },

    pallete () {
      if (this.numCPU) {
        return getPalette(this.numCPU)
      }

      return getPalette(8)
    },

    numCPU () {
      if (this.valuesCPU) {
        return this.valuesCPU.length
      }

      return undefined
    },
  },

  methods: {
    processCPUData (data) {
      if (this.numCPU === undefined) {
        this.initCPUValues(data.length)
      }

      for (let i = 0; i < this.numCPU; i++) {
        this.$set(this.valuesCPU, i, this.appendToArray(this.valuesCPU[i], data[i]))
      }
    },

    processRAMData (value) {
      this.valuesRAM = this.appendToArray(this.valuesRAM, value)
    },

    appendToArray (arr, value) {
      const result = []
      for (let i = 1; i < arr.length; i++) {
        result.push(arr[i])
      }
      result.push(value)

      return result
    },

    initCPUValues (length) {
      const values = []
      for (let i = 0; i < length; i++) {
        const arr = new Array(61).fill(undefined)
        values.push(arr)
      }

      this.valuesCPU = values
    },
  },
}
</script>
