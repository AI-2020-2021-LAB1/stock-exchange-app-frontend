<template>
  <div>
    <apexchart
      ref="chart"
      width="100%"
      :options="options"
      :series="series"
    ></apexchart>
    <v-row no-gutters align="center">
      <v-col cols="auto">
        <p class="text-h6 font-weight-bold my-auto">Długość świec:</p>
      </v-col>
      <v-col class="py-0">
        <v-select :items="lengths" v-model="len"></v-select>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch, Vue } from 'vue-property-decorator';

@Component
export default class ChartView extends Vue {
  @Prop({ required: true }) private options!: object;
  @Prop({ required: true }) private series!: object;
  @Prop({ required: true }) private length!: number;

  get len() {
    return this.length;
  }

  set len(val: number) {
    this.$emit('lengthChanged', val);
  }

  private data() {
    return {
      lengths: [1, 5, 10, 15, 20, 30, 60],
    };
  }
}
</script>
