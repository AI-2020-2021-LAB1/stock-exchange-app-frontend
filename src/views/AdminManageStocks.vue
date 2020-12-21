<template>
  <v-row no-gutters align="center" justify="center" class="ma-2 fill-height">
    <v-col lg="9" xl="6">
      <admin-create-stock @stockCreated="createStock($event)" />
      <detailed-list
        title="Lista akcji"
        :list="stocks"
        :listElements="stockElems"
        :search="searchStocks"
        searchLabel="Wyszukaj akcje po nazwie"
        objIcon="mdi-cash-usd-outline"
        @search="searchStocks = $event"
        @pagination="paginationClicked($event)"
        @panelChanged="panelChanged($event)"
      >
        <admin-edit-stock
          :stockData="editedStockData"
          @stockEdited="editStock($event)"
          @remove="deleteStock($event)"
        />
        <v-row no-gutters v-if="buyingTransactions.length">
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
        <v-row no-gutters v-if="sellingTransactions.length">
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
        <v-row no-gutters v-if="activeOrders.length">
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
        <v-row no-gutters v-if="closedOrders.length">
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
      </detailed-list>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Content } from '@/models/StockModel';
import { Component, Prop, Watch, Vue } from 'vue-property-decorator';
import { StocksService } from '../API/stocks';
import { TransactionsService } from '../API/transactions';
import { OrdersService } from '../API/orders';
import { OrderType } from '../models/OrderModel';
import AdminEditStock from '../components/AdminEditStock.vue';
import AdminCreateStock from '../components/AdminCreateStock.vue';
import UserTransactions from '../components/UserTransactions.vue';
import { formatDate } from '../helpers';

enum PaginationEnum {
  SellingTrans = 1,
  BuyingTrans = 2,
  ActiveOrders = 3,
  ClosedOrders = 4,
}

@Component({
  components: {
    AdminEditStock,
    AdminCreateStock,
    UserTransactions,
  },
})
export default class AdminManageStocks extends Vue {
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
    this.getStocks({ page: 0 });
  }

  private getUserSellingTransactions(params: object) {
    this.transactionsService
      .getTransactions({
        ...params,
        abbreviation: this.$data.editedStockData.abbreviation,
      })
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
            user: transaction.sellingOrder.user.id,
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
      .getTransactions({
        ...params,
        abbreviation: this.$data.editedStockData.abbreviation,
      })
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
            user: transaction.buyingOrder.user.id,
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
      .getOrders({
        ...params,
        active: true,
        abbreviation: this.$data.editedStockData.abbreviation,
      })
      .then((res) => {
        this.$data.activeOrders = [];
        this.$data.pagesActiveOrders = res.data.totalPages;
        for (const order of res.data.content) {
          this.$data.activeOrders.push({
            id: order.id,
            price: order.price,
            amount: order.amount,
            sum: (order.price * order.amount).toFixed(2),
            dateCreated: this._formatDate(order.dateCreation),
            dateExpiring: this._formatDate(order.dateExpiration),
            dateClosing: '',
            stock: order.stock.abbreviation,
            cancel: 'Anuluj',
            type:
              order.orderType === OrderType.BuyingOrder ? 'kupna' : 'sprzedaży',
            user: order.user.id,
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
      .getOrders({
        ...params,
        active: false,
        abbreviation: this.$data.editedStockData.abbreviation,
      })
      .then((res) => {
        this.$data.closedOrders = [];
        this.$data.pagesClosedOrders = res.data.totalPages;
        for (const order of res.data.content) {
          if (order.dateClosing) {
            this.$data.closedOrders.push({
              price: order.price,
              amount: order.amount,
              sum: (order.price * order.amount).toFixed(2),
              dateCreated: this._formatDate(order.dateCreation),
              dateExpiring: this._formatDate(order.dateExpiration),
              dateClosing: this._formatDate(order.dateClosing),
              stock: order.stock.abbreviation,
              type:
                order.orderType === OrderType.BuyingOrder
                  ? 'kupna'
                  : 'sprzedaży',
              user: order.user.id,
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

  private paginationClicked(pageNumber: number) {
    if (this.$data.searchStocks) {
      this.getStocks({ page: pageNumber - 1, name: this.$data.searchStocks });
    } else {
      this.getStocks({ page: pageNumber - 1 });
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

  private getStocks(params: object) {
    this.stocksService
      .getStocks(params)
      .then((res) => {
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

  private editStock(data: Content) {
    this.stocksService
      .editStockById(this.$data.stocks.content[this.$data.editedStock].id, data)
      .then((res) => {
        this.$store.dispatch('setSnackbarState', {
          state: true,
          msg: 'Dane zostały zmienione',
          color: 'success',
          timeout: 7500,
        });
        this.$data.editedStockData.name = data.name;
        this.$data.editedStockData.abbreviation = data.abbreviation;
        this.$data.editedStockData.currentPrice = data.currentPrice;
        this.$data.editedStockData.amount = data.amount;
        this.$data.stocks.content[this.$data.editedStock].name = data.name;
        this.$data.stocks.content[this.$data.editedStock].abbreviation =
          data.abbreviation;
        this.$data.stocks.content[this.$data.editedStock].currentPrice =
          data.currentPrice;
        this.$data.stocks.content[this.$data.editedStock].amount = data.amount;
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

  private createStock(data: {
    abbreviation: string;
    amount: number;
    currentPrice: number;
    name: string;
    owners: Array<{ amount: number; user: Content }>;
  }) {
    this.stocksService
      .createStock(data)
      .then((res) => {
        this.$store.dispatch('setSnackbarState', {
          state: true,
          msg: 'Akcja została dodana',
          color: 'success',
          timeout: 7500,
        });
        if (this.$data.searchStocks) {
          this.getStocks({ page: 0, name: this.$data.searchStocks });
        } else {
          this.getStocks({ page: 0 });
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

  private deleteStock(id: number) {
    this.stocksService
      .deleteStock(id)
      .then(() => {
        if (this.$data.searchStocks) {
          this.getStocks({ page: 0, name: this.$data.searchStocks });
        } else {
          this.getStocks({ page: 0 });
        }
        this.$store.dispatch('setSnackbarState', {
          state: true,
          msg: 'Akcja została usunięta',
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

  private panelChanged(panelId: number) {
    this.$data.editedStock = panelId;
    this.$data.editedStockData = this.$data.stocks.content.find(
      (stock: Content) => stock.id === panelId,
    );
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

  private data() {
    return {
      stocks: [],
      pagesSellingTrans: 1,
      pagesBuyingTrans: 1,
      pagesActiveOrders: 1,
      pagesClosedOrders: 1,
      closedOrders: [],
      activeOrders: [],
      sellingTransactions: [],
      buyingTransactions: [],
      pageSizeTrans: 20,
      searchStocks: '',
      editedStock: 0,
      editedStockData: {
        id: 0,
        name: '',
        abbreviation: '',
        currentPrice: 0,
        amount: 0,
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
          text: 'Ilość',
          value: 'amount',
        },
      ],
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
          text: 'Użytkownik',
          value: 'user',
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
          text: 'Użytkownik',
          value: 'user',
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
          text: 'Użytkownik',
          value: 'user',
          class: 'primary--text',
        },
        {
          text: 'Typ',
          value: 'type',
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
          text: 'Użytkownik',
          value: 'user',
          class: 'primary--text',
        },
        {
          text: 'Typ',
          value: 'type',
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
    };
  }
}
</script>
