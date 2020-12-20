<template>
  <div id="chart">
    <apexchart
      ref="restendpointResponses"
      type="bar"
      height="350"
      :options="chartOptions"
      :series="[]"
    ></apexchart>
    <apexchart
      ref="restendpointCpu"
      type="bar"
      height="350"
      :options="chartOptions"
      :series="[]"
    ></apexchart>
    <apexchart
      ref="restendpointMemory"
      type="bar"
      height="350"
      :options="chartOptions"
      :series="[]"
    ></apexchart>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { ChartsService } from '../endpoint/charts';

@Component
export default class BenchmarkResultCharts extends Vue {
  private chartsService!: ChartsService;

  private beforeCreate() {
    this.chartsService = new ChartsService();
  }

  private getPosition(str: string, subStr: string, index: number) {
    return str.split(subStr, index).join(subStr).length;
  }

  private created() {
    this.chartsService.getEndpointRespones(1).then((res) => {
      const labels = res.data.label;
      const newLabels: string[] = [];
      labels.forEach((el: string) => {
        newLabels.push(el.slice(this.getPosition(el, '/', 3)));
      });
      const endpointSeries: object[] = [];
      endpointSeries.push({
        name: 'operationTimeMin',
        data: res.data.operationTimeMin,
      });
      endpointSeries.push({
        name: 'operationTimeAvg',
        data: res.data.operationTimeAvg,
      });
      endpointSeries.push({
        name: 'operationTimeMax',
        data: res.data.operationTimeMax,
      });
      endpointSeries.push({
        name: 'dbQueryTimeMin',
        data: res.data.dbQueryTimeMin,
      });
      endpointSeries.push({
        name: 'dbQueryTimeAvg',
        data: res.data.dbQueryTimeAvg,
      });
      endpointSeries.push({
        name: 'dbQueryTimeMax',
        data: res.data.dbQueryTimeMax,
      });
      this.$refs.restendpointResponses.updateSeries(endpointSeries);
      this.$refs.restendpointResponses.updateOptions({
        title: {
          text: 'Wyniki testów',
          align: 'center',
        },
        xaxis: {
          categories: newLabels,
        },
        yaxis: {
          title: {
            text: 'Średni czas odpowiedzi [ms]',
          },
        },
      });
      const cpuSeries: object[] = [];
      cpuSeries.push({
        name: 'operationTimeMin',
        data: res.data.cpuUsageMin,
      });
      cpuSeries.push({
        name: 'operationTimeAvg',
        data: res.data.cpuUsageAvg,
      });
      cpuSeries.push({
        name: 'operationTimeMax',
        data: res.data.cpuUsageMax,
      });
      this.$refs.restendpointCpu.updateSeries(cpuSeries);
      this.$refs.restendpointCpu.updateOptions({
        title: {
          text: 'Wyniki testów',
          align: 'center',
        },
        xaxis: {
          categories: newLabels,
        },
        yaxis: {
          title: {
            text: 'Średnie użycie procesora [%]',
          },
        },
      });
      const memorySeries: object[] = [];
      cpuSeries.push({
        name: 'memoryUsageMin',
        data: res.data.memoryUsageMin,
      });
      memorySeries.push({
        name: 'memoryUsageAvg',
        data: res.data.memoryUsageAvg,
      });
      memorySeries.push({
        name: 'memoryUsageMax',
        data: res.data.memoryUsageMax,
      });
      memorySeries.push({
        name: 'memoryUseMin',
        data: res.data.memoryUsageMin,
      });
      memorySeries.push({
        name: 'memoryUseAvg',
        data: res.data.memoryUsageAvg,
      });
      memorySeries.push({
        name: 'memoryUseMax',
        data: res.data.memoryUsageMax,
      });
      this.$refs.restendpointMemory.updateSeries(memorySeries);
      this.$refs.restendpointMemory.updateOptions({
        title: {
          text: 'Wyniki testów',
          align: 'center',
        },
        xaxis: {
          categories: newLabels,
        },
        yaxis: {
          title: {
            text: 'Średnie użycie pamięci [MB]',
          },
        },
      });
    });
  }

  private data() {
    return {
      series: [],
      chartOptions: {
        chart: {
          type: 'bar',
          height: 600,
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          show: true,
          width: 2,
          colors: ['transparent'],
        },
      },
    };
  }
}
</script>
