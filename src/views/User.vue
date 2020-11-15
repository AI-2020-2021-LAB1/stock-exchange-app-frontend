<template>
  <div>
    <v-col>
      <v-container>
        <v-row justify="space-around">
          <v-card width="600">
            <v-img
              height="300px"
              src="https://images.pexels.com/photos/241544/pexels-photo-241544.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
            >
              <v-card-title class="white--text mt-8">
                <v-avatar>
                  <v-icon class="white--text">mdi-account-circle</v-icon>
                </v-avatar>
                <p class="my-auto">John Doe</p>
              </v-card-title>
            </v-img>
          </v-card>
        </v-row>
      </v-container>
    </v-col>
    <v-col align="center">
      <DialogChangeUserData />
    </v-col>
    <v-col>
      <v-row>
        <user-stocks-list
          :stocks="stocks"
          :search="searchStocks"
          @search="searchStocks = $event"
          @pagination="paginationClicked($event)"
          @selected="stockSelectionChanged($event)"
        ></user-stocks-list>
      </v-row>
      <v-row no-gutters>
        <v-col :sm="$vuetify.breakpoint.mdAndUp ? 6 : 12">
          <v-row align="start">
            <v-col class="py-0">
              <user-transactions
                title="Oferty kupna"
                :transactions="buyingTransactions"
                colorClass="success--text"
                :headers="headersBuyingTransactions"
              ></user-transactions>
            </v-col>
          </v-row>
        </v-col>
        <v-col :sm="$vuetify.breakpoint.mdAndUp ? 6 : 12">
          <v-row align="start">
            <v-col class="py-0">
              <user-transactions
                title="Oferty sprzedaży"
                :transactions="sellingTransactions"
                colorClass="error--text"
                :headers="headersSellingTransactions"
              ></user-transactions>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col :sm="$vuetify.breakpoint.mdAndUp ? 6 : 12">
          <v-row align="start">
            <v-col class="py-0">
              <user-transactions
                title="Zlecenia aktywne"
                :transactions="activeOrders"
                :headers="headersActiveOrders"
              ></user-transactions>
            </v-col>
          </v-row>
        </v-col>
        <v-col :sm="$vuetify.breakpoint.mdAndUp ? 6 : 12">
          <v-row align="start">
            <v-col class="py-0">
              <user-transactions
                title="Zlecenia zamknięte"
                :transactions="closedOrders"
                :headers="headersClosedOrders"
              ></user-transactions>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-col>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import UserStocksList from '../components/UserStocksList.vue';
import UserTransactions from '../components/UserTransactions.vue';
import DialogChangeUserData from '../components/DialogChangeUserData.vue';
import { StocksService } from '../API/stocks';
import { TransactionsService } from '../API/transactions';
import { OrdersService } from '../API/orders';
import { OrderType } from '../models/OrderModel';

@Component({
  components: {
    UserStocksList,
    UserTransactions,
    DialogChangeUserData,
  },
})
export default class User extends Vue {
  private stocksService!: StocksService;
  private transactionsService!: TransactionsService;
  private ordersService!: OrdersService;

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
    this.getUserTransactions({ page: 0 });
    this.getUserOrders({ page: 0 });
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

  private getUserStocks(params: object) {
    this.stocksService
      .getUserStocks(params)
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

  private getUserTransactions(params: object) {
    this.transactionsService
      .getTransactions(params)
      .then((res) => {
        this.$data.sellingTransactions = [];
        this.$data.buyingTransactions = [];
        this.$data.transTotalElements = res.data.totalElements;
        for (const transaction of res.data.content) {
          const dateCreatedSell = transaction.sellingOrder.dateCreation;
          const dateExpiringSell = transaction.sellingOrder.dateExpiration;
          let dateClosingSell = '';
          if (transaction.sellingOrder.dateClosing) {
            dateClosingSell = transaction.sellingOrder.dateClosing;
          }
          this.$data.sellingTransactions.push({
            price: transaction.sellingOrder.price,
            amount: transaction.sellingOrder.amount,
            sum: (
              transaction.sellingOrder.price * transaction.sellingOrder.amount
            ).toFixed(2),
            dateCreated: `${dateCreatedSell.substring(
              0,
              10,
            )} ${dateCreatedSell.substring(11, 19)}`,
            dateExpiring: `${dateExpiringSell.substring(
              0,
              10,
            )} ${dateExpiringSell.substring(11, 19)}`,
            dateClosing: dateClosingSell
              ? `${dateClosingSell.substring(
                  0,
                  10,
                )} ${dateClosingSell.substring(11, 19)}`
              : '',
            stock: transaction.sellingOrder.stock.abbreviation,
          });
          const dateCreatedBuy = transaction.buyingOrder.dateCreation;
          const dateExpiringBuy = transaction.buyingOrder.dateExpiration;
          let dateClosingBuy = '';
          if (transaction.buyingOrder.dateClosing) {
            dateClosingBuy = transaction.buyingOrder.dateClosing;
          }
          this.$data.buyingTransactions.push({
            price: transaction.buyingOrder.price,
            amount: transaction.buyingOrder.amount,
            sum: (
              transaction.buyingOrder.price * transaction.buyingOrder.amount
            ).toFixed(2),
            dateCreated: `${dateCreatedBuy.substring(
              0,
              10,
            )} ${dateCreatedBuy.substring(11, 19)}`,
            dateExpiring: `${dateExpiringBuy.substring(
              0,
              10,
            )} ${dateExpiringBuy.substring(11, 19)}`,
            dateClosing: dateClosingBuy
              ? `${dateClosingBuy.substring(0, 10)} ${dateClosingBuy.substring(
                  11,
                  19,
                )}`
              : '',
            stock: transaction.buyingOrder.stock.abbreviation,
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

  private getUserOrders(params: object) {
    this.ordersService
      .getUserOrders(params)
      .then((res) => {
        this.$data.closedOrders = [];
        this.$data.activeOrders = [];
        this.$data.ordersTotalElements = res.data.totalElements;
        for (const order of res.data.content) {
          const dateCreated = order.dateCreation;
          const dateExpiring = order.dateExpiration;
          if (order.dateClosing) {
            const dateClosing = order.dateClosing;
            this.$data.closedOrders.push({
              price: order.price,
              amount: order.amount,
              sum: (order.price * order.amount).toFixed(2),
              dateCreated: `${dateCreated.substring(
                0,
                10,
              )} ${dateCreated.substring(11, 19)}`,
              dateExpiring: `${dateExpiring.substring(
                0,
                10,
              )} ${dateExpiring.substring(11, 19)}`,
              dateClosing: `${dateClosing.substring(
                0,
                10,
              )} ${dateClosing.substring(11, 19)}`,
              stock: order.stock.abbreviation,
              type:
                order.orderType === OrderType.BuyingOrder
                  ? 'kupna'
                  : 'sprzedaży',
            });
          } else {
            this.$data.activeOrders.push({
              price: order.price,
              amount: order.amount,
              sum: (order.price * order.amount).toFixed(2),
              dateCreated: `${dateCreated.substring(
                0,
                10,
              )} ${dateCreated.substring(11, 19)}`,
              dateExpiring: `${dateExpiring.substring(
                0,
                10,
              )} ${dateExpiring.substring(11, 19)}`,
              dateClosing: '',
              stock: order.stock.abbreviation,
              cancel: 'Anuluj',
              type:
                order.orderType === OrderType.BuyingOrder
                  ? 'kupna'
                  : 'sprzedaży',
            });
          }
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

  @Watch('transTotalElements')
  private transTotalElementsChanged(newVal: number, oldVal: number) {
    if (newVal !== oldVal) {
      this.getUserTransactions({
        page: 0,
        size: newVal,
      });
    }
  }

  @Watch('ordersTotalElements')
  private ordersTotalElementsChanged(newVal: number, oldVal: number) {
    if (newVal !== oldVal) {
      this.getUserOrders({
        page: 0,
        size: newVal,
      });
    }
  }

  private data() {
    return {
      stocks: [],
      searchStocks: '',
      pageSize: 5,
      closedOrders: [],
      activeOrders: [],
      sellingTransactions: [],
      buyingTransactions: [],
      transTotalElements: 0,
      ordersTotalElements: 0,
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
