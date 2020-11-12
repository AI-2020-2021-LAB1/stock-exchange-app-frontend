<template>
  <user-stocks-list
    :stocks="stocks"
    :search="searchStocks"
    @search="searchStocks = $event"
    @pagination="paginationClicked($event)"
    @selected="stockSelectionChanged($event)"
  ></user-stocks-list>
</template>

<script lang='ts'>
import { Component, Vue, Watch } from 'vue-property-decorator';
import UserStocksList from '../components/UserStocksList.vue';
import { StocksService } from '../API/stocks';

@Component({
  components: {
    UserStocksList,
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
    };
  }
}
</script>
