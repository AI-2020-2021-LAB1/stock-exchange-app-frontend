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
        v-if="buyingOffers.length || sellingOffers.length"
      >
        <v-row no-gutters align="center">
          <v-col>
            <trader-chart
              :options="chartOptions"
              :series="chart"
            ></trader-chart>
          </v-col>
        </v-row>
        <v-row no-gutters align="center">
          <trader-inputs
            :selectedStock="selectedStock"
            @reload="getSelectedStockInfo($event)"
          ></trader-inputs>
        </v-row>
        <v-row no-gutters>
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
import TraderChart from '../components/TraderChart.vue';
import { StocksService } from '../API/stocks';
import { OrdersService } from '../API/orders';
import { OrderType } from '../models/OrderModel';
import { ChartData } from '@/models/StockModel';

@Component({
  components: {
    TraderOffers,
    TraderStocksList,
    TraderChart,
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
    this.getUserStocks(name);
    this.getBuyingOrders({
      page: 0,
      orderType: OrderType.BuyingOrder,
      name,
    });
    this.getSellingOrders({
      page: 0,
      orderType: OrderType.SellingOrder,
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
        this.stocksService
          .getStockChart(this.$data.selectedStock.stockInfo.id, {})
          .then((resp) => {
            const candles = resp.data.map((el: ChartData) => {
              return [
                Date.parse(el.timestamp),
                el.open.toFixed(2),
                el.max.toFixed(2),
                el.min.toFixed(2),
                el.close.toFixed(2),
              ];
            });
            this.$data.chart = [
              { data: candles },
            ];
            this.$data.chartOptions.xaxis.max = Date.now();
            this.$data.chartOptions.xaxis.min = Date.now() - 3600;
          });
      })
      .catch((err) => {
        this.$store.dispatch('setSnackbarState', {
          state: true,
          msg: 'Error ' + err.response.status,
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
            amount: offer.amount,
            sum: (offer.price * offer.amount).toFixed(2),
          });
        }
      })
      .catch((err) => {
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
            amount: offer.amount,
            sum: (offer.price * offer.amount).toFixed(2),
          });
        }
      })
      .catch((err) => {
        this.$store.dispatch('setSnackbarState', {
          state: true,
          msg: 'Error ' + err.response.status,
          color: 'error',
          timeout: 7500,
        });
      });
  }

  @Watch('sellingOffersTotalElements')
  private sellingOffersTotalElementsChanged(newVal: number, oldVal: number) {
    if (newVal !== oldVal) {
      this.getSellingOrders({
        page: 0,
        orderType: OrderType.SellingOrder,
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
        stockInfo: { amount: 0},
        userPossession: { amountAvailableForSale: 0 },
      },
      chart: [],
      drawer: false,
      chartOptions: {
        chart: {
          type: 'candlestick',
        },
        title: {
          text: 'Akcje spółki Test',
          align: 'left',
        },
        xaxis: {
          type: 'datetime',
        },
        yaxis: {
          tooltip: {
            enabled: true,
          },
          max: function(max: any) { return max + 10 },
          min: function(min: any) { return min },
        },
      },
      series: [
        {
          data: [
            {
              x: new Date(1538778600000),
              y: [6629.81, 6650.5, 6623.04, 6633.33],
            },
            {
              x: new Date(1538780400000),
              y: [6632.01, 6643.59, 6620, 6630.11],
            },
            {
              x: new Date(1538782200000),
              y: [6630.71, 6648.95, 6623.34, 6635.65],
            },
            {
              x: new Date(1538784000000),
              y: [6635.65, 6651, 6629.67, 6638.24],
            },
            {
              x: new Date(1538785800000),
              y: [6638.24, 6640, 6620, 6624.47],
            },
            {
              x: new Date(1538787600000),
              y: [6624.53, 6636.03, 6621.68, 6624.31],
            },
            {
              x: new Date(1538789400000),
              y: [6624.61, 6632.2, 6617, 6626.02],
            },
            {
              x: new Date(1538791200000),
              y: [6627, 6627.62, 6584.22, 6603.02],
            },
            {
              x: new Date(1538793000000),
              y: [6605, 6608.03, 6598.95, 6604.01],
            },
            {
              x: new Date(1538794800000),
              y: [6604.5, 6614.4, 6602.26, 6608.02],
            },
            {
              x: new Date(1538796600000),
              y: [6608.02, 6610.68, 6601.99, 6608.91],
            },
            {
              x: new Date(1538798400000),
              y: [6608.91, 6618.99, 6608.01, 6612],
            },
            {
              x: new Date(1538800200000),
              y: [6612, 6615.13, 6605.09, 6612],
            },
            {
              x: new Date(1538802000000),
              y: [6612, 6624.12, 6608.43, 6622.95],
            },
            {
              x: new Date(1538803800000),
              y: [6623.91, 6623.91, 6615, 6615.67],
            },
            {
              x: new Date(1538805600000),
              y: [6618.69, 6618.74, 6610, 6610.4],
            },
            {
              x: new Date(1538807400000),
              y: [6611, 6622.78, 6610.4, 6614.9],
            },
            {
              x: new Date(1538809200000),
              y: [6614.9, 6626.2, 6613.33, 6623.45],
            },
            {
              x: new Date(1538811000000),
              y: [6623.48, 6627, 6618.38, 6620.35],
            },
            {
              x: new Date(1538812800000),
              y: [6619.43, 6620.35, 6610.05, 6615.53],
            },
            {
              x: new Date(1538814600000),
              y: [6615.53, 6617.93, 6610, 6615.19],
            },
            {
              x: new Date(1538816400000),
              y: [6615.19, 6621.6, 6608.2, 6620],
            },
            {
              x: new Date(1538818200000),
              y: [6619.54, 6625.17, 6614.15, 6620],
            },
            {
              x: new Date(1538820000000),
              y: [6620.33, 6634.15, 6617.24, 6624.61],
            },
            {
              x: new Date(1538821800000),
              y: [6625.95, 6626, 6611.66, 6617.58],
            },
            {
              x: new Date(1538823600000),
              y: [6619, 6625.97, 6595.27, 6598.86],
            },
            {
              x: new Date(1538825400000),
              y: [6598.86, 6598.88, 6570, 6587.16],
            },
            {
              x: new Date(1538827200000),
              y: [6588.86, 6600, 6580, 6593.4],
            },
            {
              x: new Date(1538829000000),
              y: [6593.99, 6598.89, 6585, 6587.81],
            },
            {
              x: new Date(1538830800000),
              y: [6587.81, 6592.73, 6567.14, 6578],
            },
            {
              x: new Date(1538832600000),
              y: [6578.35, 6581.72, 6567.39, 6579],
            },
            {
              x: new Date(1538834400000),
              y: [6579.38, 6580.92, 6566.77, 6575.96],
            },
            {
              x: new Date(1538836200000),
              y: [6575.96, 6589, 6571.77, 6588.92],
            },
            {
              x: new Date(1538838000000),
              y: [6588.92, 6594, 6577.55, 6589.22],
            },
            {
              x: new Date(1538839800000),
              y: [6589.3, 6598.89, 6589.1, 6596.08],
            },
            {
              x: new Date(1538841600000),
              y: [6597.5, 6600, 6588.39, 6596.25],
            },
            {
              x: new Date(1538843400000),
              y: [6598.03, 6600, 6588.73, 6595.97],
            },
            {
              x: new Date(1538845200000),
              y: [6595.97, 6602.01, 6588.17, 6602],
            },
            {
              x: new Date(1538847000000),
              y: [6602, 6607, 6596.51, 6599.95],
            },
            {
              x: new Date(1538848800000),
              y: [6600.63, 6601.21, 6590.39, 6591.02],
            },
            {
              x: new Date(1538850600000),
              y: [6591.02, 6603.08, 6591, 6591],
            },
            {
              x: new Date(1538852400000),
              y: [6591, 6601.32, 6585, 6592],
            },
            {
              x: new Date(1538854200000),
              y: [6593.13, 6596.01, 6590, 6593.34],
            },
            {
              x: new Date(1538856000000),
              y: [6593.34, 6604.76, 6582.63, 6593.86],
            },
            {
              x: new Date(1538857800000),
              y: [6593.86, 6604.28, 6586.57, 6600.01],
            },
            {
              x: new Date(1538859600000),
              y: [6601.81, 6603.21, 6592.78, 6596.25],
            },
            {
              x: new Date(1538861400000),
              y: [6596.25, 6604.2, 6590, 6602.99],
            },
            {
              x: new Date(1538863200000),
              y: [6602.99, 6606, 6584.99, 6587.81],
            },
            {
              x: new Date(1538865000000),
              y: [6587.81, 6595, 6583.27, 6591.96],
            },
            {
              x: new Date(1538866800000),
              y: [6591.97, 6596.07, 6585, 6588.39],
            },
            {
              x: new Date(1538868600000),
              y: [6587.6, 6598.21, 6587.6, 6594.27],
            },
            {
              x: new Date(1538870400000),
              y: [6596.44, 6601, 6590, 6596.55],
            },
            {
              x: new Date(1538872200000),
              y: [6598.91, 6605, 6596.61, 6600.02],
            },
            {
              x: new Date(1538874000000),
              y: [6600.55, 6605, 6589.14, 6593.01],
            },
            {
              x: new Date(1538875800000),
              y: [6593.15, 6605, 6592, 6603.06],
            },
            {
              x: new Date(1538877600000),
              y: [6603.07, 6604.5, 6599.09, 6603.89],
            },
            {
              x: new Date(1538879400000),
              y: [6604.44, 6604.44, 6600, 6603.5],
            },
            {
              x: new Date(1538881200000),
              y: [6603.5, 6603.99, 6597.5, 6603.86],
            },
            {
              x: new Date(1538883000000),
              y: [6603.85, 6605, 6600, 6604.07],
            },
            {
              x: new Date(1538884800000),
              y: [6604.98, 6606, 6604.07, 6606],
            },
          ],
        },
      ],
    };
  }
}
</script>
