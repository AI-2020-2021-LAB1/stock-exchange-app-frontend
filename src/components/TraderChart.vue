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
}
</script>
