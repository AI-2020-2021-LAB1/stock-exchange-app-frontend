<template>
  <v-row no-gutters align="center" justify="center" class="ma-2 fill-height">
    <v-col lg="9" xl="6">
      <detailed-list
        title="Lista użytkowników"
        :list="users"
        :listElements="userElems"
        :search="searchUsers"
        searchLabel="Wyszukaj użytkowników po e-mailu"
        objIcon="mdi-account"
        @search="searchUsers = $event"
        @pagination="paginationClicked($event)"
        @panelChanged="panelChanged($event)"
      >
        <admin-edit-user
          :userData="editedUserData"
          @userEdited="editUser($event)"
        ></admin-edit-user>
        <v-row no-gutters>
          <v-col cols="12" class="my-1">
            <data-card
              title="Lista posiadanych akcji"
              :list="userStocks"
              :listElements="stockElems"
              :search="searchStocks"
              searchLabel="Wyszukaj akcje po nazwie"
              objIcon="mdi-wallet"
              @search="searchStocks = $event"
              @pagination="paginationStocksClicked($event)"
            />
          </v-col>
        </v-row>
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
import { Component, Prop, Watch, Vue } from 'vue-property-decorator';
import AdminEditUser from '../components/AdminEditUser.vue';
import UserTransactions from '../components/UserTransactions.vue';
import { UsersService } from '../API/users';
import { StocksService } from '../API/stocks';
import { TransactionsService } from '../API/transactions';
import { OrdersService } from '../API/orders';
import { OrderType } from '../models/OrderModel';
import { Role, User } from '../models/UserModel';
import { formatDate } from '../helpers';
import { Content } from '@/models/StockModel';

enum PaginationEnum {
  SellingTrans = 1,
  BuyingTrans = 2,
  ActiveOrders = 3,
  ClosedOrders = 4,
}

@Component({
  components: {
    AdminEditUser,
    UserTransactions,
  },
})
export default class AdminManageUsers extends Vue {
  private usersService!: UsersService;
  private stocksService!: StocksService;
  private transactionsService!: TransactionsService;
  private ordersService!: OrdersService;

  public _formatDate(date: string) {
    return formatDate(date);
  }

  private beforeCreate() {
    this.usersService = new UsersService();
    this.stocksService = new StocksService();
    this.transactionsService = new TransactionsService();
    this.ordersService = new OrdersService();
  }

  private created() {
    this.getUsers({ page: 0 });
  }

  private paginationClicked(pageNumber: number) {
    if (this.$data.searchUsers) {
      this.getUsers({ page: pageNumber - 1, email: this.$data.searchUsers });
    } else {
      this.getUsers({ page: pageNumber - 1 });
    }
  }

  private paginationStocksClicked(pageNumber: number) {
    if (this.$data.searchStocks) {
      this.getUserStocksById({
        page: pageNumber - 1,
        name: this.$data.searchStocks,
        size: this.$data.stocksPageSize,
      });
    } else {
      this.getUserStocksById({
        page: pageNumber - 1,
        size: this.$data.stocksPageSize,
      });
    }
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
        if(err.response.status === 403){
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

  private getUsers(params: object) {
    this.usersService
      .getUsers({ ...params })
      .then((res) => {
        this.$data.users = res.data;
      })
      .catch((err) => {
        if(err.response.status === 403){
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

  private getUserStocksById(params: object) {
    this.stocksService
      .getUserStocksById(this.$data.editedUserData.id, params)
      .then((res) => {
        this.$data.userStocks = res.data;
      })
      .catch((err) => {
        if(err.response.status === 403){
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
      .getUserTransactionsById(this.$data.editedUserData.id, params)
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
        if(err.response.status === 403){
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
      .getUserTransactionsById(this.$data.editedUserData.id, params)
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
        if(err.response.status === 403){
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
      .getUserOrdersById(this.$data.editedUserData.id, {
        ...params,
        active: true,
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
          });
        }
      })
      .catch((err) => {
        if(err.response.status === 403){
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
      .getUserOrdersById(this.$data.editedUserData.id, {
        ...params,
        active: false,
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
            });
          }
        }
      })
      .catch((err) => {
        if(err.response.status === 403){
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
    this.$data.editedUser = panelId;
    this.$data.editedUserData = this.$data.users.content.find((user: Content) => user.id === panelId);
    this.getUserStocksById({
      page: 0,
      size: this.$data.stocksPageSize,
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

  private editUser(data: User) {
    this.usersService
      .editUserById(this.$data.editedUser, data)
      .then((res) => {
        this.$store.dispatch('setSnackbarState', {
          state: true,
          msg: 'Dane zostały zmienione',
          color: 'success',
          timeout: 7500,
        });
        this.$data.editedUserData.firstName = data.firstName;
        this.$data.editedUserData.lastName = data.lastName;
        this.$data.editedUserData.role = data.role;
        this.$data.editedUserData.isActive = data.isActive;

        this.$data.users.content[this.$data.editedUser].firstName =
          data.firstName;
        this.$data.users.content[this.$data.editedUser].lastName =
          data.lastName;
        this.$data.users.content[this.$data.editedUser].role = data.role;
        this.$data.users.content[this.$data.editedUser].isActive =
          data.isActive;
      })
      .catch((err) => {
        if(err.response.status === 403){
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

  @Watch('searchUsers')
  private queryUsers(val: string) {
    if (val) {
      this.getUsers({ page: 0, email: val });
    } else {
      this.getUsers({ page: 0 });
    }
  }

  @Watch('searchStocks')
  private queryStocks(val: string) {
    if (val) {
      this.getUserStocksById({
        page: 0,
        name: val,
        size: this.$data.stocksPageSize,
      });
    } else {
      this.getUserStocksById({
        page: 0,
        size: this.$data.stocksPageSize,
      });
    }
  }

  private data() {
    return {
      users: [],
      userStocks: [],
      pagesSellingTrans: 1,
      pagesBuyingTrans: 1,
      pagesActiveOrders: 1,
      pagesClosedOrders: 1,
      closedOrders: [],
      activeOrders: [],
      sellingTransactions: [],
      buyingTransactions: [],
      pageSizeTrans: 20,
      searchUsers: '',
      searchStocks: '',
      stocksPageSize: 5,
      editedUser: 0,
      editedUserData: {
        id: 0,
        firstName: '',
        lastName: '',
        email: '',
        role: '',
        money: 0,
        tag: '',
        isActive: false,
      },
      userElems: [
        {
          text: 'Imie',
          value: 'firstName',
        },
        {
          text: 'Nazwisko',
          value: 'lastName',
        },
        {
          text: 'E-mail',
          value: 'email',
        },
        {
          text: 'Posiadane środki',
          value: 'money',
        },
        {
          text: 'Tag',
          value: 'tag',
        },
        {
          text: 'Rola',
          value: 'role',
        },
        {
          text: 'Konto aktywne?',
          value: 'isActive',
        },
      ],
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
        {
          text: 'Akcje możliwe do sprzedania',
          value: 'amountAvailableForSale',
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
    };
  }
}
</script>
