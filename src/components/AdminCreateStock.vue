<template>
  <v-card class="mb-2">
    <v-card-title
      class="text-h5 font-weight-bold justify-center white--text primary py-1"
      style="word-break: break-word"
      >Dodaj akcję</v-card-title
    >
    <v-card-text class="pt-2 pb-0">
      <v-form
        v-model="inputValidated"
        @submit.prevent="createStock()"
        id="stock-create-form"
      >
        <v-row align="center" justify="center" class="mx-0">
          <v-col class="pa-0">
            <v-text-field
              outlined
              v-model="name"
              prepend-icon="mdi-rename-box"
              :rules="[rules.required, rules.counter(name, 3, 'i')]"
              label="Nazwa"
              color="primary"
              type="text"
              class="my-1"
            ></v-text-field>
          </v-col>
          <v-col class="py-0 pr-0">
            <v-text-field
              outlined
              v-model="abbreviation"
              :rules="[
                rules.required,
                rules.counter(abbreviation, 3, 'i'),
                rules.counterMax(abbreviation, 3, 'i'),
              ]"
              label="Skrót"
              color="primary"
              type="text"
              class="my-1"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-text-field
          outlined
          v-model.number="currentPrice"
          prepend-icon="mdi-cash-usd"
          :rules="[rules.minValue(currentPrice, 1)]"
          label="Aktualna cena"
          color="primary"
          type="number"
          class="my-1"
        ></v-text-field>
        <v-text-field
          outlined
          v-model.number="amount"
          prepend-icon="mdi-counter"
          :rules="[
            rules.required,
            rules.minValue(amount, 1),
            rules.amountsEqual(amount, ownersAmountsSum),
          ]"
          label="Ilość"
          color="primary"
          type="number"
          class="mt-1"
        ></v-text-field>
        <v-card tile class="rounded-lg">
          <v-card-title
            class="text-h5 font-weight-bold justify-center white--text primary py-1"
            >Właściciele</v-card-title
          >
          <v-card-text class="pa-2">
            <v-row align="center" class="mx-0">
              <v-col>
                <user-selector
                  v-model="selectedUser"
                  :users="foundUsers"
                  :search="search"
                  @search="search = $event"
                  label="Wyszukaj i wybierz właścicieli"
                ></user-selector>
              </v-col>
              <v-col cols="12" sm="auto" class="px-2">
                <v-btn
                  block
                  :disabled="selectedUser === 0"
                  class="success"
                  @click="addOwner()"
                >
                  <span>Dodaj właściciela</span>
                  <v-icon right>mdi-account-cash</v-icon>
                </v-btn>
              </v-col>
            </v-row>
            <v-row
              no-gutters
              align="center"
              justify="center"
              class="ma-2 fill-height"
            >
              <v-col lg="9" xl="6">
                <admin-create-stock-owner-list
                  title="List właścicieli"
                  v-model="owners"
                  @remove="removeOwner($event)"
                />
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-row justify="end" no-gutters>
        <v-col cols="12" md="auto" class="px-2 py-1">
          <v-btn block class="error" @click="resetForm()">
            <span>Resetuj formularz</span>
            <v-icon right>mdi-reload</v-icon>
          </v-btn>
        </v-col>
        <v-col cols="12" md="auto" class="px-2 py-1">
          <v-btn
            block
            :disabled="!inputValidated"
            class="success"
            type="submit"
            form="stock-create-form"
          >
            <span>Dodaj akcję</span>
            <v-icon right>mdi-briefcase-plus</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { User } from '../models/UserModel';
import { UsersService } from '../API/users';
import AdminCreateStockOwnerList from './AdminCreateStockOwnerList.vue';

@Component({
  components: {
    AdminCreateStockOwnerList,
  },
})
export default class AdminCreateStock extends Vue {
  private usersService!: UsersService;

  private beforeCreate() {
    this.usersService = new UsersService();
  }

  private created() {
    this.getUsers({ page: 0, role: 'USER' }, false);
  }

  private resetForm() {
    this.$data.name = '';
    this.$data.abbreviation = '';
    this.$data.currentPrice = 0;
    this.$data.amount = 1;
    this.$data.amountOwner = 1;
    this.$data.selectedUser = 0;
    this.$data.owners = [];
  }

  get ownersAmountsSum(): number {
    if (this.$data.owners) {
      let amountSum: number = 0;

      for (const owner of this.$data.owners) {
        amountSum += owner.amount;
      }

      return amountSum;
    } else {
      return -1;
    }
  }

  private addOwner() {
    const owner: User = this.$data.fetchedUsers.find(
      (user: User) => user.id === this.$data.selectedUser,
    );
    this.$data.owners.push({
      amount: 1,
      user: owner,
    });

    this.$data.selectedUser = 0;
  }

  private removeOwner(id: number) {
    this.$data.owners = this.$data.owners.filter(
      (owner: { amount: number; user: User }) => owner.user.id !== id,
    );
  }

  private createStock() {
    this.$emit('stockCreated', {
      abbreviation: this.$data.abbreviation,
      amount: this.$data.amount,
      currentPrice: this.$data.currentPrice,
      name: this.$data.name,
      owners: this.$data.owners,
    });
    this.resetForm();
  }

  get ownersIDs(): number[] {
    if (this.$data.owners) {
      return this.$data.owners.map(
        (owner: { amount: number; user: User }) => owner.user.id,
      );
    } else {
      return [];
    }
  }

  get foundUsers() {
    if (this.$data.fetchedUsers) {
      let users: User[] = this.$data.fetchedUsers;
      if (this.ownersIDs) {
        users = users.filter((user: User) => !this.ownersIDs.includes(user.id));
      }
      return users.map((user: User) => ({
        value: user.id,
        text: `${user.firstName} ${user.lastName} ${user.email}`,
      }));
    } else {
      return [];
    }
  }

  @Watch('search')
  private searchUsers(val: string) {
    if (this.$data.selectedUser !== 0) {
      return;
    }
    this.getUsers({
      page: 0,
      role: 'USER',
      email: val,
    });
  }

  private getUsers(params: object, search: boolean = true) {
    this.usersService
      .getUsers({ ...params })
      .then((res) => {
        if (search) {
          this.$data.fetchedUsers = res.data.content;
        } else {
          this.$data.users = res.data.content;
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

  private data() {
    return {
      name: '',
      abbreviation: '',
      currentPrice: 0,
      amount: 1,
      users: [],
      selectedUser: 0,
      owners: [],
      ownersId: [],
      inputValidated: false,
      fetchedUsers: [],
      search: '',
      rules: {
        required: (value: string) => !!value || 'Pole wymagane',
        counter: (value: string, num: number, end: string) =>
          value.length >= num || 'Minimum ' + num + ' znak' + end,
        counterMax: (value: string, num: number, end: string) =>
          value.length <= num || 'Maximum ' + num + ' znak' + end,
        minValue: (value: number, min: number) =>
          value >= min || 'Minimalna wartość to ' + min,
        amountsEqual: (stockAmount: number, ownersAmount: number) => {
          if (stockAmount === ownersAmount) {
            return true;
          } else if (stockAmount < ownersAmount) {
            return 'Wprowadzono mniejszą ilość akcji niż rozdzielono właścicielom';
          } else {
            return 'Ilość akcji musi być rozdzielona właścicielom';
          }
        },
      },
    };
  }
}
</script>
