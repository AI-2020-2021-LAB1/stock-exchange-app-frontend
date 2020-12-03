<template>
  <v-row no-gutters align="center" justify="center" class="ma-2 fill-height">
    <v-col lg="9" xl="6">
      <detailed-list
        title="Lista akcji"
        :list="stocks"
        :listElements="stockElems"
        :search="searchStocks"
        searchLabel="Wyszukaj akcje po nazwie"
        objIcon="mdi-cash-usd-outline"
        @search="searchStocks = $event"
        @pagination="paginationClicked($event)"
      >
      </detailed-list>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Component, Prop, Watch, Vue } from 'vue-property-decorator';
import { StocksService } from '../API/stocks';

@Component
export default class AdminManageStocks extends Vue {
  private stocksService!: StocksService;

  private beforeCreate() {
    this.stocksService = new StocksService();
  }

  private created() {
    this.getStocks({ page: 0 });
  }

  private paginationClicked(pageNumber: number) {
    if (this.$data.searchStocks) {
      this.getStocks({ page: pageNumber - 1, name: this.$data.searchStocks });
    } else {
      this.getStocks({ page: pageNumber - 1 });
    }
  }

  @Watch('searchStocks')
  private queryStocks(val: string) {
    if (val) {
      this.getStocks({ page: 0, name: val });
    } else {
      this.getStocks({ page: 0 });
    }
  }

  private getStocks(params: object) {
    this.stocksService
      .getStocks(params)
      .then((res) => {
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

  private data() {
    return {
      stocks: [],
      searchStocks: '',
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
          text: 'Ilość',
          value: 'amount',
        },
      ],
    };
  }
}
</script>
