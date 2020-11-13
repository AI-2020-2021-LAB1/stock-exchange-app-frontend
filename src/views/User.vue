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
      <user-stocks-list
        :stocks="stocks"
        :search="searchStocks"
        @search="searchStocks = $event"
        @pagination="paginationClicked($event)"
        @selected="stockSelectionChanged($event)"
      ></user-stocks-list>
    </v-col>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import UserStocksList from '../components/UserStocksList.vue';
import DialogChangeUserData from '../components/DialogChangeUserData.vue';
import { StocksService } from '../API/stocks';

@Component({
  components: {
    UserStocksList,
    DialogChangeUserData,
  },
})
export default class User extends Vue {
  private stocksService!: StocksService;

  private beforeCreate() {
    this.stocksService = new StocksService();
  }

  private created() {
    this.getUserStocks({
      page: 0,
      size: this.$data.pageSize,
    });
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

  private data() {
    return {
      stocks: [],
      searchStocks: '',
      pageSize: 5,
      showDialog: false,
    };
  }
}
</script>
