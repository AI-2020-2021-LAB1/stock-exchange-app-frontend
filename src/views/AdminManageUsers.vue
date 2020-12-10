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
      </detailed-list>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Component, Prop, Watch, Vue } from 'vue-property-decorator';
import AdminEditUser from '../components/AdminEditUser.vue';
import { UsersService } from '../API/users';
import { StocksService } from '../API/stocks';
import { Role, User } from '../models/UserModel';

@Component({
  components: {
    AdminEditUser,
  },
})
export default class AdminManageUsers extends Vue {
  private usersService!: UsersService;
  private stocksService!: StocksService;

  private beforeCreate() {
    this.usersService = new UsersService();
    this.stocksService = new StocksService();
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

  private getUsers(params: object) {
    this.usersService
      .getUsers({ ...params })
      .then((res) => {
        this.$data.users = [];
        this.$data.users = res.data;
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

  private getUserStocksById(params: object) {
    this.stocksService
      .getUserStocksById(this.$data.editedUserData.id, params)
      .then((res) => {
        this.$data.userStocks = res.data;
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

  private panelChanged(panelId: number) {
    this.$data.editedUser = panelId;
    this.$data.editedUserData = this.$data.users.content[panelId];
    this.getUserStocksById({
      page: 0,
      size: this.$data.stocksPageSize,
    });
  }

  private editUser(data: User) {
    this.usersService
      .editUserById(this.$data.users.content[this.$data.editedUser].id, data)
      .then((res) => {
        this.$store.dispatch('setSnackbarState', {
          state: true,
          msg: 'Dane zostaly zmienione',
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
    };
  }
}
</script>
