<template>
  <v-container fluid class="fill-height pa-0">
    <v-row no-gutters v-if="!$vuetify.breakpoint.mdAndUp" class="ma-2">
      <v-col cols="12">
        <v-btn block class="primary" @click="drawer = true"
          >Otwórz wybór akcji</v-btn
        >
      </v-col>
    </v-row>
    <v-row no-gutters justify="center" class="fill-height">
      <v-col
        v-if="$vuetify.breakpoint.mdAndUp"
        :sm="$vuetify.breakpoint.xl ? 2 : 3"
      >
        <trader-stocks-list
          :stocks="stocks"
          :search="searchStocks"
          @search="searchStocks = $event"
          @pagination="paginationClicked($event)"
          @selected="stockSelectionChanged($event)"
        ></trader-stocks-list>
      </v-col>
      <v-col
        :sm="$vuetify.breakpoint.md ? 9 : 12"
        lg="6"
        xl="4"
        v-if="selectedStock.stockInfo.id"
      >
        <v-row no-gutters align="center" class="pb-1">
          <v-col class="px-2">
            <chart-view
              :options="chartOptions"
              :series="chart"
              :length="length"
              @lengthChanged="lengthChanged($event)"
            ></chart-view>
          </v-col>
        </v-row>
        <v-row
          no-gutters
          align="center"
          v-if="
            user.role === 'USER' && user.tag === selectedStock.stockInfo.tag
          "
        >
          <trader-inputs
            :selectedStock="selectedStock"
            @reload="getSelectedStockInfo($event)"
          ></trader-inputs>
        </v-row>
        <v-row no-gutters class="pa-1">
          <v-col :sm="$vuetify.breakpoint.mdAndUp ? 6 : 12">
            <v-row align="start">
              <v-col class="py-0">
                <trader-offers
                  title="Oferty kupna"
                  :offers="buyingOffers"
                  colorClass="success--text"
                ></trader-offers>
              </v-col>
            </v-row>
          </v-col>
          <v-col :sm="$vuetify.breakpoint.mdAndUp ? 6 : 12">
            <v-row align="start">
              <v-col class="py-0">
                <trader-offers
                  title="Oferty sprzedaży"
                  :offers="sellingOffers"
                  colorClass="error--text"
                ></trader-offers>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-col>
      <v-col :sm="$vuetify.breakpoint.md ? 9 : 12" lg="6" xl="4" v-else>
        <v-row no-gutters align="center" class="fill-height">
          <v-col>
            <p class="text-h4 text-center font-weight-bold pa-2">
              Wybierz jakąś akcję
            </p>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-navigation-drawer
      app
      left
      disable-resize-watcher
      v-model="drawer"
      width="300px"
      style="z-index: 999"
    >
      <trader-stocks-list
        :stocks="stocks"
        :search="searchStocks"
        @search="searchStocks = $event"
        @pagination="paginationClicked($event)"
        @selected="stockSelectionChanged($event)"
      ></trader-stocks-list>
    </v-navigation-drawer>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import TraderOffers from '../components/TraderOffers.vue';
import TraderStocksList from '../components/TraderStocksList.vue';
import TraderInputs from '../components/TraderInputs.vue';
import { StocksService } from '../API/stocks';
import { OrdersService } from '../API/orders';
import { OrderType } from '../models/OrderModel';
import { ChartData } from '@/models/StockModel';

@Component({
  components: {
    TraderOffers,
    TraderStocksList,
    TraderInputs,
  },
})
export default class Trader extends Vue {
  private stocksService!: StocksService;
  private orderService!: OrdersService;

  private beforeCreate() {
    this.stocksService = new StocksService();
    this.orderService = new OrdersService();
  }

  private created() {
    this.getStocks({ page: 0 });
    this.$data.lastRequest = { page: 0 };
  }

  private paginationClicked(pageNumber: number) {
    if (this.$data.searchStocks) {
      this.getStocks({ page: pageNumber - 1, name: this.$data.searchStocks });
    } else {
      this.getStocks({ page: pageNumber - 1 });
    }
  }

  private getStocks(params: object) {
    this.stocksService
      .getStocks(params)
      .then((res) => {
        this.$data.stocks = [];
        this.$data.stocks = res.data;
      })
      .catch((err) => {
        if (err.response.status === 403) {
          this.$store.dispatch('logout');
        }
        this.$store.dispatch('setSnackbarState', {
          state: true,
          msg: 'Error ' + err.response.status,
          color: 'error',
          timeout: 7500,
        });
      });
  }

  private stockSelectionChanged(name: string) {
    this.$data.stockName = name;
    this.getSelectedStockInfo(name);
    if (this.user.role === 'USER') {
      this.getUserStocks(name);
    }
    this.getBuyingOrders({
      page: 0,
      orderType: OrderType.BuyingOrder,
      active: true,
      name,
    });
    this.getSellingOrders({
      page: 0,
      orderType: OrderType.SellingOrder,
      active: true,
      name,
    });
  }

  private getSelectedStockInfo(name: string) {
    this.stocksService
      .getStocks({ name })
      .then((res) => {
        if (res.data.content.length === 1) {
          this.$data.selectedStock.stockInfo = res.data.content[0];
        } else {
          this.$data.selectedStock.stockInfo = { amount: 0 };
          this.$data.chart = [];
        }
        this.getStockChart();
      })
      .catch((err) => {
        if (err.response.status === 403) {
          this.$store.dispatch('logout');
        }
        this.$store.dispatch('setSnackbarState', {
          state: true,
          msg: 'Error ' + err.response.status,
          color: 'error',
          timeout: 7500,
        });
      });
  }

  private getStockChart() {
    this.stocksService
      .getStockChart(this.$data.selectedStock.stockInfo.id, {
        interval: this.$data.length,
      })
      .then((res) => {
        const candles = res.data.map((el: ChartData) => {
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
              text: 'Akcje spółki ' + this.$data.selectedStock.stockInfo.name,
              align: 'center',
            },
          },
        };
      })
      .catch((err) => {
        if (err.response.status === 403) {
          this.$store.dispatch('logout');
        }
        this.$store.dispatch('setSnackbarState', {
          state: true,
          msg: 'Błąd ' + err.response.status + ' podczas pobierania wykresu!',
          color: 'error',
          timeout: 7500,
        });
      });
  }

  private getUserStocks(name: string) {
    this.stocksService
      .getUserStocks({
        name,
      })
      .then((res) => {
        if (res.data.content.length === 1) {
          this.$data.selectedStock.userPossession = res.data.content[0];
        } else {
          this.$data.selectedStock.userPossession = {
            amountAvailableForSale: 0,
          };
        }
      })
      .catch((err) => {
        if (err.response.status === 403) {
          this.$store.dispatch('logout');
        }
        this.$store.dispatch('setSnackbarState', {
          state: true,
          msg: 'Error ' + err.response.status,
          color: 'error',
          timeout: 7500,
        });
      });
  }

  private getBuyingOrders(params: object) {
    this.orderService
      .getOrders(params)
      .then((res) => {
        this.$data.buyingOffers = [];
        this.$data.buyingOffersTotalElements = res.data.totalElements;
        for (const offer of res.data.content) {
          this.$data.buyingOffers.push({
            price: offer.price,
            remainingAmount: offer.remainingAmount,
            sum: (offer.price * offer.amount).toFixed(2),
          });
        }
      })
      .catch((err) => {
        if (err.response.status === 403) {
          this.$store.dispatch('logout');
        }
        this.$store.dispatch('setSnackbarState', {
          state: true,
          msg: 'Error ' + err.response.status,
          color: 'error',
          timeout: 7500,
        });
      });
  }

  private getSellingOrders(params: object) {
    this.orderService
      .getOrders(params)
      .then((res) => {
        this.$data.sellingOffers = [];
        this.$data.sellingOffersTotalElements = res.data.totalElements;
        for (const offer of res.data.content) {
          this.$data.sellingOffers.push({
            price: offer.price,
            remainingAmount: offer.remainingAmount,
            sum: (offer.price * offer.amount).toFixed(2),
          });
        }
      })
      .catch((err) => {
        if (err.response.status === 403) {
          this.$store.dispatch('logout');
        }
        this.$store.dispatch('setSnackbarState', {
          state: true,
          msg: 'Error ' + err.response.status,
          color: 'error',
          timeout: 7500,
        });
      });
  }

  private lengthChanged(val: number) {
    this.$data.length = val;
    this.getStockChart();
  }

  @Watch('sellingOffersTotalElements')
  private sellingOffersTotalElementsChanged(newVal: number, oldVal: number) {
    if (newVal !== oldVal) {
      this.getSellingOrders({
        page: 0,
        orderType: OrderType.SellingOrder,
        active: true,
        size: newVal,
        name: this.$data.stockName,
      });
    }
  }

  @Watch('buyingOffersTotalElements')
  private buyingOffersTotalElementsChanged(newVal: number, oldVal: number) {
    if (newVal !== oldVal) {
      this.getBuyingOrders({
        page: 0,
        orderType: OrderType.BuyingOrder,
        active: true,
        size: newVal,
        name: this.$data.stockName,
      });
    }
  }

  @Watch('searchStocks')
  private queryStocks(val: string) {
    if (val) {
      this.getStocks({ page: 0, name: val });
    } else {
      this.getStocks({ page: 0 });
    }
  }

  get user() {
    return this.$store.getters.user;
  }

  private data() {
    return {
      stocks: [],
      sellingOffers: [],
      buyingOffers: [],
      stockName: '',
      sellingOffersTotalElements: 0,
      buyingOffersTotalElements: 0,
      searchStocks: '',
      selectedStock: {
        stockInfo: { amount: 0, id: 0 },
        userPossession: { amountAvailableForSale: 0 },
      },
      chart: [],
      length: 5,
      drawer: false,
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
    };
  }
}
</script>
