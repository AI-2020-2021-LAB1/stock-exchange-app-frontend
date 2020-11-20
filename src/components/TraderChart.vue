<template>
  <apexchart
    ref="chart"
    width="100%"
    :options="options"
    :series="series"
  ></apexchart>
</template>

<script lang="ts">
import { Component, Prop, Watch, Vue } from 'vue-property-decorator';

@Component
export default class TraderChart extends Vue {
  @Prop({ required: true }) private options!: object;
  @Prop({ required: true }) private series!: object;

  @Watch('options', { deep: true })
  private optionsUpdated(val: object, old: object) {
    console.log(val, old, val === old);
    this.$refs.chart.updateOptions(val);
  }

  @Watch('series', { deep: true })
  private seriesUpdated(series: object) {
    this.$refs.chart.updateSeries(series);
  }
}
</script>
