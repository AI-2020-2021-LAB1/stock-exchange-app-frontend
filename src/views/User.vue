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

  private beforeCreate() {
    this.stocksService = new StocksService();
    this.transactionsService = new TransactionsService();
  }

  private created() {
    this.getUserStocks({
      page: 0,
      size: this.$data.pageSize,
    });
    this.getUserTransactions({ page: 0 });
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
            stock: transaction.sellingOrder.stock.abbreviation,
            cancel: 'Anuluj',
          });
          const dateCreatedBuy = transaction.buyingOrder.dateCreation;
          const dateExpiringBuy = transaction.buyingOrder.dateExpiration;
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
            stock: transaction.buyingOrder.stock.abbreviation,
            cancel: 'Anuluj',
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

  private data() {
    return {
      stocks: [],
      searchStocks: '',
      pageSize: 5,
      sellingTransactions: [],
      buyingTransactions: [],
      transTotalElements: 0,
      showDialog: false,
    };
  }
}
</script>
