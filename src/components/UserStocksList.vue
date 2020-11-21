<template>
  <v-card class="rounded-lg mx-auto mx-2" tile>
    <v-card-title
      class="text-h5 font-weight-bold justify-center white--text primary py-1"
      >Lista posiadanych akcji</v-card-title
    >
    <v-card-text class="pt-2 pb-0">
      <v-text-field
        solo-inverted
        text
        clearable
        hide-details
        v-model="Search"
        color="primary"
        label="Wyszukaj akcje"
        prepend-inner-icon="mdi-database-search"
      ></v-text-field>
      <v-expansion-panels
        :inset="$vuetify.breakpoint.mdAndUp"
        :popout="!$vuetify.breakpoint.mdAndUp"
        class="mt-4"
        v-model="ownStockInspect"
      >
        <v-expansion-panel v-for="stock in stocks.content" :key="stock.id">
          <v-expansion-panel-header>
            <v-row no-gutters align="center" justify="start">
              <v-col cols="auto">
                <v-icon left class="primary--text">mdi-wallet</v-icon>
              </v-col>
              <v-col
                v-for="el in stockElems"
                :key="el.text"
                cols="auto"
                class="pa-3"
              >
                <p class="mt-auto font-weight-bold text-center mb-1">
                  {{ el.text }}
                </p>
                <p class="my-auto text-center">{{ stock[el.value] }}</p>
              </v-col>
            </v-row>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <chart-view :options="chartOptions" :series="chart"></chart-view>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
      <v-pagination
        v-model="currentPage"
        :length="stocks.totalPages"
        @input="paginationClicked"
      ></v-pagination>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { StocksService } from '../API/stocks';
import { ChartData, Stocks } from '@/models/StockModel';

@Component
export default class UserStocksList extends Vue {
  private stocksService!: StocksService;
  @Prop({ required: true }) private stocks!: Stocks;
  @Prop({ required: true }) private search!: string;

  private beforeCreate() {
    this.stocksService = new StocksService();
  }

  get Search() {
    return this.search;
  }

  set Search(val: string) {
    this.$emit('search', val);
  }

  private paginationClicked(page: number) {
    this.$emit('pagination', page);
  }

  private getStockChart(id: number, index: number) {
    this.stocksService
      .getStockChart(id, {
        interval: 5,
      })
      .then((resp) => {
        console.log(new Date().getTime())
        const candles = resp.data.map((el: ChartData) => {
          return [
            new Date(el.timestamp),
            el.open.toFixed(2),
            el.max.toFixed(2),
            el.min.toFixed(2),
            el.close.toFixed(2),
          ];
        });
        const min = new Date();
        min.setHours(min.getHours() - 1);
        this.$data.chart = [{ data: candles }];
        this.$data.chartOptions = {
          ...this.$data.chartOptions,
          ...{
            title: {
              text: 'Akcje spółki ' + this.stocks.content[index].name,
              align: 'center',
            },
          },
        };
      })
      .catch((err) => {
        this.$store.dispatch('setSnackbarState', {
          state: true,
          msg: 'Błąd ' + err.response.status + ' podczas pobierania wykresu!',
          color: 'error',
          timeout: 7500,
        });
      });
  }

  @Watch('ownStockInspect')
  private loadChart(val: number) {
    if (val !== undefined) {
      this.getStockChart(this.stocks.content[val].id, val);
    }
  }

  private data() {
    return {
      type: 'datetime',
      currentPage: 1,
      chart: [],
      ownStockInspect: undefined,
      chartOptions: {
        chart: {
          type: 'candlestick',
        },
        title: {
          text: '',
          align: 'center',
        },
        xaxis: {
          type: 'datetime',
        },
        yaxis: {
          tooltip: {
            enabled: true,
          },
        },
      },
      stockElems: [
        {
          text: 'Nazwa',
          value: 'name',
        },
        {
          text: 'Skrót',
          value: 'abbreviation',
        },
        {
          text: 'Aktualna cena',
          value: 'currentPrice',
        },
        {
          text: 'Posiadane akcje',
          value: 'amount',
        },
      ],
    };
  }
}
</script>
