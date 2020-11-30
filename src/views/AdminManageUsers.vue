<template>
  <v-row no-gutters align="center" justify="center" class="ma-2 fill-height">
    <v-col lg="9" xl="6">
      <admin-users-list :users="users" :search="searchUsers" @search="searchUsers = $event" @pagination="paginationClicked($event)"></admin-users-list>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Component, Prop, Watch, Vue } from 'vue-property-decorator';
import AdminUsersList from '../components/AdminUsersList.vue';
import { UsersService } from '../API/users';
import { Role } from '../models/UserModel';

@Component({
  components: {
    AdminUsersList,
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
    };
  }
}
</script>
