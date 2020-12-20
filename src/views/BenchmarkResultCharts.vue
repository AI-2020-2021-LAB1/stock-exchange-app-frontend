<template>
  <div id="chart">
    <apexchart
      ref="restEndpointResponses"
      type="bar"
      height="350"
      :options="chartOptions"
      :series="[]"
    ></apexchart>
    <apexchart
      ref="restEndpointCpu"
      type="bar"
      height="350"
      :options="chartOptions"
      :series="[]"
    ></apexchart>
    <apexchart
      ref="restEndpointMemory"
      type="bar"
      height="350"
      :options="chartOptions"
      :series="[]"
    ></apexchart>
    <apexchart
      ref="restMethodResponses"
      type="bar"
      height="350"
      :options="chartOptions"
      :series="[]"
    ></apexchart>
    <apexchart
      ref="restMethodCpu"
      type="bar"
      height="350"
      :options="chartOptions"
      :series="[]"
    ></apexchart>
    <apexchart
      ref="restMethodMemory"
      type="bar"
      height="350"
      :options="chartOptions"
      :series="[]"
    ></apexchart>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { ChartsService } from '../API/charts';

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
    this.getEndpointResponses();
    this.getMethodsResponses();
  }

  private getEndpointResponses() {
    this.chartsService
      .getEndpointRespones(Number(this.$route.params.id))
      .then((res) => {
        console.log(res.data);
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
        this.$refs.restMethodResponses.updateSeries(endpointSeries);
        this.$refs.restMethodResponses.updateOptions({
          title: {
            text:
              'Wykresy prezentujące czasy odpowiedzi uzyskane dla Rest API giełdy',
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
          name: 'cpuUsageMin',
          data: res.data.cpuUsageMin,
        });
        cpuSeries.push({
          name: 'cpuUsageAvg',
          data: res.data.cpuUsageAvg,
        });
        cpuSeries.push({
          name: 'cpuUsageMax',
          data: res.data.cpuUsageMax,
        });
        this.$refs.restMethodCpu.updateSeries(cpuSeries);
        this.$refs.restMethodCpu.updateOptions({
          title: {
            text:
              'Wykresy prezentujące średnie zużycie zasobów CPU dla Rest API giełdy',
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
        this.$refs.restMethodMemory.updateSeries(memorySeries);
        this.$refs.restMethodMemory.updateOptions({
          title: {
            text:
              'Wykresy prezentujące średnie zużycie pamięci RAM dla Rest API giełdy',
            align: 'center',
          },
          xaxis: {
            categories: newLabels,
          },
          yaxis: {
            title: {
              text: 'Średnie użycie pamięci [B]',
            },
          },
        });
      });
  }

  private getMethodsResponses() {
    this.chartsService
      .getMethodRespones(Number(this.$route.params.id))
      .then((res) => {
        console.log(res.data);
        const labels = ['DELETE', 'GET', 'POST'];
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
        this.$refs.restEndpointResponses.updateSeries(endpointSeries);
        this.$refs.restEndpointResponses.updateOptions({
          title: {
            text: 'Wykresy prezentujące czasy odpowiedzi dla metod typu GET, POST, DELETE',
            align: 'center',
          },
          xaxis: {
            categories: labels,
          },
          yaxis: {
            title: {
              text: 'Średni czas odpowiedzi [ms]',
            },
          },
        });
        const cpuSeries: object[] = [];
        cpuSeries.push({
          name: 'cpuUsageMin',
          data: res.data.cpuUsageMin,
        });
        cpuSeries.push({
          name: 'cpuUsageAvg',
          data: res.data.cpuUsageAvg,
        });
        cpuSeries.push({
          name: 'cpuUsageMax',
          data: res.data.cpuUsageMax,
        });
        this.$refs.restEndpointCpu.updateSeries(cpuSeries);
        this.$refs.restEndpointCpu.updateOptions({
          title: {
            text: 'Wykresy prezentujące średnie zużycie CPU dla metod typu GET, POST, DELETE',
            align: 'center',
          },
          xaxis: {
            categories: labels,
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
        this.$refs.restEndpointMemory.updateSeries(memorySeries);
        this.$refs.restEndpointMemory.updateOptions({
          title: {
            text: 'Wykresy prezentujące średnie zużycie pamięci RAM dla metod typu GET, POST, DELETE',
            align: 'center',
          },
          xaxis: {
            categories: labels,
          },
          yaxis: {
            title: {
              text: 'Średnie użycie pamięci [B]',
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
