<template>
  <users-list
    :users="users"
    :search="searchUsers"
    @search="searchUsers = $event"
    @pagination="paginationClicked($event)"
  ></users-list>
</template>

<script lang="ts">
import { Component, Prop, Watch, Vue } from 'vue-property-decorator';
import UsersList from '../components/UsersList.vue';
import { UsersService } from '../API/users';
import { Role } from '../models/UserModel';

@Component({
  components: {
    UsersList,
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
