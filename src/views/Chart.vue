<template>
  <v-row class="fill-height" align="center">
    <v-col cols="12" class="pa-0">
      <apexchart
        class="my-auto"
        align="center"
        width="500"
        type="bar"
        :options="options"
        :series="series"
      ></apexchart>
    </v-col>
  </v-row>
</template>

<script>
export default {
  data: function() {
    return {
      options: {
        chart: {
          id: "vuechart-example",
        },
        xaxis: {
          categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998],
        },
      },
      series: [
        {
          name: "series-1",
          data: [30, 40, 45, 50, 49, 60, 70, 91],
        },
      ],
    };
  },
};
</script>

<style>
.small {
  max-width: 600px;
  margin: 150px auto;
}
</style>
