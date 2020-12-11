<template>
  <v-row no-gutters align="center" justify="center" class="ma-2 fill-height">
    <v-col lg="9" xl="6">
      <admin-create-stock @stockCreated="createStock($event)" />
      <detailed-list
        title="Lista akcji"
        :list="stocks"
        :listElements="stockElems"
        :search="searchStocks"
        searchLabel="Wyszukaj akcje po nazwie"
        objIcon="mdi-cash-usd-outline"
        @search="searchStocks = $event"
        @pagination="paginationClicked($event)"
        @panelChanged="panelChanged($event)"
      >
        <admin-edit-stock
          :stockData="editedStockData"
          @stockEdited="editStock($event)"
          @remove="deleteStock($event)"
        />
      </detailed-list>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Content } from '@/models/StockModel';
import { Component, Prop, Watch, Vue } from 'vue-property-decorator';
import { StocksService } from '../API/stocks';
import AdminEditStock from '../components/AdminEditStock.vue';
import AdminCreateStock from '../components/AdminCreateStock.vue';

@Component({
  components: {
    AdminEditStock,
    AdminCreateStock,
  },
})
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

  private editStock(data: Content) {
    this.stocksService
      .editStockById(this.$data.stocks.content[this.$data.editedStock].id, data)
      .then((res) => {
        this.$store.dispatch('setSnackbarState', {
          state: true,
          msg: 'Dane zostaly zmienione',
          color: 'success',
          timeout: 7500,
        });
        this.$data.editedStockData.name = data.name;
        this.$data.editedStockData.abbreviation = data.abbreviation;
        this.$data.editedStockData.currentPrice = data.currentPrice;
        this.$data.editedStockData.amount = data.amount;
        this.$data.stocks.content[this.$data.editedStock].name = data.name;
        this.$data.stocks.content[this.$data.editedStock].abbreviation =
          data.abbreviation;
        this.$data.stocks.content[this.$data.editedStock].currentPrice =
          data.currentPrice;
        this.$data.stocks.content[this.$data.editedStock].amount = data.amount;
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

  private createStock(data: {
    abbreviation: string;
    amount: number;
    currentPrice: number;
    name: string;
    owners: Array<{ amount: number; user: Content }>;
  }) {
    this.stocksService
      .createStock(data)
      .then((res) => {
        this.$store.dispatch('setSnackbarState', {
          state: true,
          msg: 'Akcja została dodana',
          color: 'success',
          timeout: 7500,
        });
        if (this.$data.searchStocks) {
          this.getStocks({ page: 0, name: this.$data.searchStocks });
        } else {
          this.getStocks({ page: 0 });
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

  private deleteStock(id: number) {
    this.stocksService
      .deleteStock(id)
      .then(() => {
        if (this.$data.searchStocks) {
          this.getStocks({ page: 0, name: this.$data.searchStocks });
        } else {
          this.getStocks({ page: 0 });
        }
        this.$store.dispatch('setSnackbarState', {
          state: true,
          msg: 'Akcja została usunięta',
          color: 'success',
          timeout: 5000,
        });
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
    this.$data.editedStock = panelId;
    this.$data.editedStockData = this.$data.stocks.content[panelId];
  }

  private data() {
    return {
      stocks: [],
      searchStocks: '',
      editedStock: 0,
      editedStockData: {
        id: 0,
        name: '',
        abbreviation: '',
        currentPrice: 0,
        amount: 0,
      },
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
