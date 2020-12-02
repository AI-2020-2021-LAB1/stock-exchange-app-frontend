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
        <admin-edit-user :userData="editedUserData"></admin-edit-user>
      </detailed-list>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Component, Prop, Watch, Vue } from 'vue-property-decorator';
import AdminEditUser from '../components/AdminEditUser.vue';
import { UsersService } from '../API/users';
import { Role } from '../models/UserModel';

@Component({
  components: {
    AdminEditUser,
  },
})
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

  private panelChanged(panelId: number) {
    this.$data.editedUser = panelId;
    this.$data.editedUserData = this.$data.users.content[panelId];
  }

  @Watch('searchUsers')
  private queryUsers(val: string) {
    if (val) {
      this.getUsers({ page: 0, email: val });
    } else {
      this.getUsers({ page: 0 });
    }
  }

  private data() {
    return {
      users: [],
      searchUsers: '',
      editedUser: undefined,
      editedUserData: undefined,
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
