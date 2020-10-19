<template>
  <div class="small">
    <line-chart :chart-data="datacollection"></line-chart>
    <button @click="fillData()">Randomize</button>
  </div>
</template>

<script>
import LineChart from "./LineChart.js";

export default {
  components: {
    LineChart,
  },
  data() {
    return {
      datacollection: null,
    };
  },
  mounted() {
    this.fillData();
  },
  methods: {
    fillData() {
      this.datacollection = {
        labels: [this.getRandomInt(), this.getRandomInt(), this.getRandomInt()],
        datasets: [
          {
            label: "Data One",
            backgroundColor: "#f87979",
            data: [
              this.getRandomInt(),
              this.getRandomInt(),
              this.getRandomInt(),
            ],
          },
          {
            label: "Data two",
            backgroundColor: "#234512",
            data: [
              this.getRandomInt(),
              this.getRandomInt(),
              this.getRandomInt(),
            ],
          },
          {
            label: "Data three",
            backgroundColor: "#982718",
            data: [
              this.getRandomInt(),
              this.getRandomInt(),
              this.getRandomInt(),
            ],
          },
        ],
      };
    },
    getRandomInt() {
      return Math.floor(Math.random() * 100);
    },
  },
};
</script>

<style>
.small {
  max-width: 600px;
  margin: 150px auto;
}
</style>
