<template>
  <div class="mx-2">
    <v-row no-gutters>
      <v-col cols="12" class="my-1">
        <v-card width="600" class="mx-auto">
          <v-img height="300px" src="@/assets/stock-exchange.jpeg">
            <v-card-title class="white--text mt-8">
              <v-avatar>
                <v-icon class="white--text">mdi-account-circle</v-icon>
              </v-avatar>
              <p class="my-auto">{{ user.firstName }} {{ user.lastName }}</p>
            </v-card-title>
          </v-img>
        </v-card>
      </v-col>
    </v-row>
    <v-row no-gutters>
      <v-col cols="12" class="my-1">
        <user-dialog-change-user-data></user-dialog-change-user-data>
      </v-col>
    </v-row>
    <v-row no-gutters>
      <v-col cols="12" class="my-1">
        <detailed-list
          title="Lista posiadanych akcji"
          :list="stocks"
          :listElements="stockElems"
          :search="searchStocks"
          searchLabel="Wyszukaj akcje po nazwie"
          objIcon="mdi-wallet"
          @search="searchStocks = $event"
          @pagination="paginationClicked($event)"
          @panelChanged="panelOpened($event)"
        >
          <chart-view
            class="mt-2"
            :options="chartOptions"
            :series="chart"
            :length="length"
            @lengthChanged="lengthChanged($event)"
          ></chart-view>
        </detailed-list>
      </v-col>
    </v-row>
    <v-row no-gutters>
      <v-col cols="12" class="my-1">
        <user-transactions
          title="Historia transakcji kupna"
          :transactions="buyingTransactions"
          colorClass="success--text"
          :headers="headersBuyingTransactions"
          :paginationEnum="2"
          :totalPages="pagesBuyingTrans"
          @paginationByEnum="paginationByEnum($event)"
        ></user-transactions>
      </v-col>
    </v-row>
    <v-row no-gutters>
      <v-col cols="12" class="my-1">
        <user-transactions
          title="Historia transakcji sprzedaży"
          :transactions="sellingTransactions"
          colorClass="error--text"
          :headers="headersSellingTransactions"
          :paginationEnum="1"
          :totalPages="pagesSellingTrans"
          @paginationByEnum="paginationByEnum($event)"
        ></user-transactions>
      </v-col>
    </v-row>
    <v-row no-gutters>
      <v-col cols="12" class="my-1">
        <user-transactions
          title="Zlecenia aktywne"
          :transactions="activeOrders"
          :headers="headersActiveOrders"
          :paginationEnum="3"
          :totalPages="pagesActiveOrders"
          @paginationByEnum="paginationByEnum($event)"
          @cancelOrder="cancelOrder($event)"
        ></user-transactions>
      </v-col>
    </v-row>
    <v-row no-gutters>
      <v-col cols="12" class="mt-1 mb-2">
        <user-transactions
          title="Zlecenia zamknięte"
          :transactions="closedOrders"
          :headers="headersClosedOrders"
          :paginationEnum="4"
          :totalPages="pagesClosedOrders"
          @paginationByEnum="paginationByEnum($event)"
        ></user-transactions>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import UserTransactions from '../components/UserTransactions.vue';
import UserDialogChangeUserData from '../components/UserDialogChangeUserData.vue';
import { StocksService } from '../API/stocks';
import { TransactionsService } from '../API/transactions';
import { OrdersService } from '../API/orders';
import { OrderType } from '../models/OrderModel';
import { formatDate } from '../helpers';
import { ChartData, Content } from '@/models/StockModel';

enum PaginationEnum {
  SellingTrans = 1,
  BuyingTrans = 2,
  ActiveOrders = 3,
  ClosedOrders = 4,
}

@Component({
  components: {
    UserTransactions,
    UserDialogChangeUserData,
  },
})
export default class User extends Vue {
  private stocksService!: StocksService;
  private transactionsService!: TransactionsService;
  private ordersService!: OrdersService;

  public _formatDate(date: string) {
    return formatDate(date);
  }

  private beforeCreate() {
    this.stocksService = new StocksService();
    this.transactionsService = new TransactionsService();
    this.ordersService = new OrdersService();
  }

  private created() {
    this.getUserStocks({
      page: 0,
      size: this.$data.pageSize,
    });
    this.getUserSellingTransactions({
      page: 0,
      size: this.$data.pageSizeTrans,
    });
    this.getUserBuyingTransactions({
      page: 0,
      size: this.$data.pageSizeTrans,
    });
    this.getUserActiveOrders({
      page: 0,
      size: this.$data.pageSizeTrans,
    });
    this.getUserClosedOrders({
      page: 0,
      size: this.$data.pageSizeTrans,
    });
  }

  private paginationClicked(pageNumber: number) {
    if (this.$data.searchStocks) {
      this.getUserStocks({
        page: pageNumber - 1,
        name: this.$data.searchStocks,
        size: this.$data.pageSize,
      });
    } else {
      this.getUserStocks({
        page: pageNumber - 1,
        size: this.$data.pageSize,
      });
    }
  }

  private paginationByEnum(params: { page: number; paginationEnum: number }) {
    switch (params.paginationEnum) {
      case PaginationEnum.SellingTrans:
        this.paginationSellingTransClicked(params.page);
        break;
      case PaginationEnum.BuyingTrans:
        this.paginationBuyingTransClicked(params.page);
        break;
      case PaginationEnum.ActiveOrders:
        this.paginationActiveOrdersClicked(params.page);
        break;
      case PaginationEnum.ClosedOrders:
        this.paginationClosedOrdersClicked(params.page);
        break;
    }
  }

  private paginationSellingTransClicked(pageNumber: number) {
    this.getUserSellingTransactions({
      page: pageNumber - 1,
      size: this.$data.pageSizeTrans,
    });
  }

  private paginationBuyingTransClicked(pageNumber: number) {
    this.getUserBuyingTransactions({
      page: pageNumber - 1,
      size: this.$data.pageSizeTrans,
    });
  }

  private paginationActiveOrdersClicked(pageNumber: number) {
    this.getUserActiveOrders({
      page: pageNumber - 1,
      size: this.$data.pageSizeTrans,
    });
  }

  private paginationClosedOrdersClicked(pageNumber: number) {
    this.getUserClosedOrders({
      page: pageNumber - 1,
      size: this.$data.pageSizeTrans,
    });
  }

  private getUserStocks(params: object) {
    this.stocksService
      .getUserStocks(params)
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

  private getUserSellingTransactions(params: object) {
    this.transactionsService
      .getUserTransactions(params)
      .then((res) => {
        this.$data.sellingTransactions = [];
        this.$data.pagesSellingTrans = res.data.totalPages;
        for (const transaction of res.data.content) {
          this.$data.sellingTransactions.push({
            price: transaction.sellingOrder.price,
            amount: transaction.sellingOrder.amount,
            sum: (
              transaction.sellingOrder.price * transaction.sellingOrder.amount
            ).toFixed(2),
            dateCreated: this._formatDate(
              transaction.sellingOrder.dateCreation,
            ),
            dateExpiring: this._formatDate(
              transaction.sellingOrder.dateExpiration,
            ),
            dateClosing: transaction.sellingOrder.dateClosing
              ? this._formatDate(transaction.sellingOrder.dateClosing)
              : '',
            stock: transaction.sellingOrder.stock.abbreviation,
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

  private getUserBuyingTransactions(params: object) {
    this.transactionsService
      .getUserTransactions(params)
      .then((res) => {
        this.$data.buyingTransactions = [];
        this.$data.pagesBuyingTrans = res.data.totalPages;
        for (const transaction of res.data.content) {
          this.$data.buyingTransactions.push({
            price: transaction.buyingOrder.price,
            amount: transaction.buyingOrder.amount,
            sum: (
              transaction.buyingOrder.price * transaction.buyingOrder.amount
            ).toFixed(2),
            dateCreated: this._formatDate(transaction.buyingOrder.dateCreation),
            dateExpiring: this._formatDate(
              transaction.buyingOrder.dateExpiration,
            ),
            dateClosing: transaction.buyingOrder.dateClosing
              ? this._formatDate(transaction.buyingOrder.dateClosing)
              : '',
            stock: transaction.buyingOrder.stock.abbreviation,
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

  private getUserActiveOrders(params: object) {
    this.ordersService
      .getUserOrders({ ...params, active: true })
      .then((res) => {
        this.$data.activeOrders = [];
        this.$data.pagesActiveOrders = res.data.totalPages;
        for (const order of res.data.content) {
          this.$data.activeOrders.push({
            id: order.id,
            price: order.price,
            amount: order.amount,
            traded: order.amount - order.remainingAmount,
            remainingAmount: order.remainingAmount,
            sum: (order.price * order.amount).toFixed(2),
            dateCreated: this._formatDate(order.dateCreation),
            dateExpiring: this._formatDate(order.dateExpiration),
            dateClosing: '',
            stock: order.stock.abbreviation,
            cancel: 'Anuluj',
            type:
              order.orderType === OrderType.BuyingOrder ? 'kupna' : 'sprzedaży',
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

  private getUserClosedOrders(params: object) {
    this.ordersService
      .getUserOrders({ ...params, active: false })
      .then((res) => {
        this.$data.closedOrders = [];
        this.$data.pagesClosedOrders = res.data.totalPages;
        for (const order of res.data.content) {
          if (order.dateClosing) {
            this.$data.closedOrders.push({
              price: order.price,
              amount: order.amount,
              traded: order.amount - order.remainingAmount,
              remainingAmount: order.remainingAmount,
              sum: (order.price * order.amount).toFixed(2),
              dateCreated: this._formatDate(order.dateCreation),
              dateExpiring: this._formatDate(order.dateExpiration),
              dateClosing: this._formatDate(order.dateClosing),
              stock: order.stock.abbreviation,
              type:
                order.orderType === OrderType.BuyingOrder
                  ? 'kupna'
                  : 'sprzedaży',
            });
          }
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

  private cancelOrder(id: number) {
    this.ordersService
      .cancelUserOrder(id)
      .then(() => {
        this.getUserActiveOrders({
          page: 0,
          size: this.$data.pageSizeTrans,
        });
        this.getUserClosedOrders({
          page: 0,
          size: this.$data.pageSizeTrans,
        });
        this.$store.dispatch('setSnackbarState', {
          state: true,
          msg: 'Zlecenie zostało anulowane',
          color: 'success',
          timeout: 5000,
        });
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
    const stock: Content = this.$data.stocks.content.find(
      (el: Content) => el.id === this.$data.openedPanel,
    );
    this.getStockChart(stock.id, stock.name);
  }

  private panelOpened(val: number) {
    this.$data.openedPanel = val;
    const stock: Content = this.$data.stocks.content.find(
      (el: Content) => el.id === val,
    );
    this.getStockChart(stock.id, stock.name);
  }

  private getStockChart(id: number, name: string) {
    this.stocksService
      .getStockChart(id, {
        interval: this.$data.length,
      })
      .then((resp) => {
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
              text: 'Akcje spółki ' + name,
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

  @Watch('searchStocks')
  private queryStocks(val: string) {
    if (val) {
      this.getUserStocks({
        page: 0,
        name: val,
        size: this.$data.pageSize,
      });
    } else {
      this.getUserStocks({
        page: 0,
        size: this.$data.pageSize,
      });
    }
  }

  get user() {
    return this.$store.getters.user;
  }

  private data() {
    return {
      stocks: [],
      searchStocks: '',
      pageSize: 5,
      pageSizeTrans: 20,
      pagesSellingTrans: 1,
      pagesBuyingTrans: 1,
      pagesActiveOrders: 1,
      pagesClosedOrders: 1,
      closedOrders: [],
      activeOrders: [],
      sellingTransactions: [],
      buyingTransactions: [],
      chart: [],
      length: 5,
      openedPanel: undefined,
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
      headersSellingTransactions: [
        {
          text: 'Suma',
          value: 'sum',
          class: 'error--text',
        },
        {
          text: 'Ilość',
          value: 'amount',
          class: 'error--text',
        },
        {
          text: 'Cena',
          value: 'price',
          class: 'error--text',
        },
        {
          text: 'Spółka',
          value: 'stock',
          class: 'error--text',
        },
        {
          text: 'Data stw.',
          value: 'dateCreated',
          class: 'error--text',
        },
        {
          text: 'Data wyg.',
          value: 'dateExpiring',
          class: 'error--text',
        },
        {
          text: 'Data zam.',
          value: 'dateClosing',
          class: 'error--text',
        },
      ],
      headersBuyingTransactions: [
        {
          text: 'Suma',
          value: 'sum',
          class: 'success--text',
        },
        {
          text: 'Ilość',
          value: 'amount',
          class: 'success--text',
        },
        {
          text: 'Cena',
          value: 'price',
          class: 'success--text',
        },
        {
          text: 'Spółka',
          value: 'stock',
          class: 'success--text',
        },
        {
          text: 'Data stw.',
          value: 'dateCreated',
          class: 'success--text',
        },
        {
          text: 'Data wyg.',
          value: 'dateExpiring',
          class: 'success--text',
        },
        {
          text: 'Data zam.',
          value: 'dateClosing',
          class: 'success--text',
        },
      ],
      headersActiveOrders: [
        {
          text: 'Suma',
          value: 'sum',
          class: 'primary--text',
        },
        {
          text: 'Ilość',
          value: 'amount',
          class: 'primary--text',
        },
        {
          text: 'Skonsumowane',
          value: 'traded',
          class: 'primary--text',
        },
        {
          text: 'Pozostałe',
          value: 'remainingAmount',
          class: 'primary--text',
        },
        {
          text: 'Cena',
          value: 'price',
          class: 'primary--text',
        },
        {
          text: 'Typ',
          value: 'type',
          class: 'primary--text',
        },
        {
          text: 'Spółka',
          value: 'stock',
          class: 'primary--text',
        },
        {
          text: 'Data stw.',
          value: 'dateCreated',
          class: 'primary--text',
        },
        {
          text: 'Data wyg.',
          value: 'dateExpiring',
          class: 'primary--text',
        },
        {
          text: 'Anulacja',
          value: 'cancel',
          class: 'primary--text',
        },
      ],
      headersClosedOrders: [
        {
          text: 'Suma',
          value: 'sum',
          class: 'primary--text',
        },
        {
          text: 'Ilość',
          value: 'amount',
          class: 'primary--text',
        },
        {
          text: 'Skonsumowane',
          value: 'traded',
          class: 'primary--text',
        },
        {
          text: 'Pozostałe',
          value: 'remainingAmount',
          class: 'primary--text',
        },
        {
          text: 'Cena',
          value: 'price',
          class: 'primary--text',
        },
        {
          text: 'Typ',
          value: 'type',
          class: 'primary--text',
        },
        {
          text: 'Spółka',
          value: 'stock',
          class: 'primary--text',
        },
        {
          text: 'Data stw.',
          value: 'dateCreated',
          class: 'primary--text',
        },
        {
          text: 'Data wyg.',
          value: 'dateExpiring',
          class: 'primary--text',
        },
        {
          text: 'Data zam.',
          value: 'dateClosing',
          class: 'primary--text',
        },
      ],
      showDialog: false,
    };
  }
}
</script>
