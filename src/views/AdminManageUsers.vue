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
        @panelChanged="editedUser = users.content[$event].id"
      >
        <v-card class="mt-2">
          <v-card-title
            class="text-h5 font-weight-bold white--text primary py-1"
            >Edycja danych użytkownika</v-card-title
          >
          <v-card-text>Formularz</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn class="error">
              <span>Resetuj formularz</span>
              <v-icon right>mdi-reload</v-icon>
            </v-btn>
            <v-btn class="success">
              <span>Edytuj użytkownika</span>
              <v-icon right>mdi-account-edit</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </detailed-list>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Component, Prop, Watch, Vue } from 'vue-property-decorator';
import { UsersService } from '../API/users';
import { Role } from '../models/UserModel';

@Component
export default class AdminManageUsers extends Vue {
  private usersService!: UsersService;

  private beforeCreate() {
    this.usersService = new UsersService();
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

  @Watch('searchUsers')
  private queryUsers(val: string) {
    if (val) {
      this.getUsers({ page: 0, email: val });
    } else {
      this.getUsers({ page: 0 });
    }
  }

  private getUsers(params: object) {
    this.usersService
      .getUsers({ ...params, role: Role.User })
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

  private data() {
    return {
      users: [],
      searchUsers: '',
      editedUser: undefined,
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
          text: 'Konto aktywne?',
          value: 'isActive',
        },
      ],
    };
  }
}
</script>
