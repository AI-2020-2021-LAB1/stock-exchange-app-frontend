<template>
  <div>
    <div class="ma-2">
      <v-btn large block link to="/admin/benchmark/tests" class="primary">
        <span>Powróć do listy testów</span>
      </v-btn>
    </div>
    <div class="ma-2">
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
        (this as any).$refs.restMethodResponses.updateSeries(endpointSeries);
        (this as any).$refs.restMethodResponses.updateOptions({
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
        (this as any).$refs.restMethodCpu.updateSeries(cpuSeries);
        (this as any).$refs.restMethodCpu.updateOptions({
          title: {
            text: 'Wykresy prezentujące zasobów CPU dla Rest API giełdy',
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
        (this as any).$refs.restMethodMemory.updateSeries(memorySeries);
        (this as any).$refs.restMethodMemory.updateOptions({
          title: {
            text:
              'Wykresy prezentujące zużycie pamięci RAM dla Rest API giełdy',
            align: 'center',
          },
          xaxis: {
            categories: newLabels,
          },
          yaxis: {
            title: {
              text: 'Średnie użycie pamięci [MiB]',
            },
          },
        });
      });
  }

  private getMethodsResponses() {
    this.chartsService
      .getMethodRespones(Number(this.$route.params.id))
      .then((res) => {
        const labels = res.data.label;
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
        (this as any).$refs.restEndpointResponses.updateSeries(endpointSeries);
        (this as any).$refs.restEndpointResponses.updateOptions({
          title: {
            text:
              'Wykresy prezentujące czasy odpowiedzi dla metod typu GET, POST, DELETE',
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
        (this as any).$refs.restEndpointCpu.updateSeries(cpuSeries);
        (this as any).$refs.restEndpointCpu.updateOptions({
          title: {
            text:
              'Wykresy prezentujące zużycie CPU dla metod typu GET, POST, DELETE',
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
        (this as any).$refs.restEndpointMemory.updateSeries(memorySeries);
        (this as any).$refs.restEndpointMemory.updateOptions({
          title: {
            text:
              'Wykresy prezentujące zużycie pamięci RAM dla metod typu GET, POST, DELETE',
            align: 'center',
          },
          xaxis: {
            categories: labels,
          },
          yaxis: {
            title: {
              text: 'Średnie użycie pamięci [MiB]',
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
