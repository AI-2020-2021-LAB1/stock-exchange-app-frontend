<template>
  <v-card class="mx-auto" max-width="300" tile>
    <v-text-field
      solo-inverted
      id="searchStocks"
      clearable
      hide-details
      v-model="search"
      color="primary"
      label="Wyszukaj akcje"
      prepend-inner-icon="mdi-database-search"
    ></v-text-field>
    <v-list dense class="pt-0">
      <v-subheader>Lista dostępnych akcji</v-subheader>
      <v-list-item-group v-model="selectedItem" color="primary">
        <v-list-item
          v-for="stock in stocks.content"
          :key="stock.id"
          @click="stockClicked(stock.name)"
          :id="stock.id"
        >
          <v-list-item-icon>
            <v-icon color="green">mdi-cash-usd-outline</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ stock.name }}</v-list-item-title>
            <v-list-item-subtitle
              >{{ stock.currentPrice.toFixed(2) }} PLN</v-list-item-subtitle
            >
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>
    <v-pagination
      v-model="currentPage"
      :length="stocks.totalPages"
      @input="paginationClicked"
    ></v-pagination>
  </v-card>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

@Component
export default class TraderStocksList extends Vue {
  @Prop({ required: true }) private stocks!: object[];
  // @Prop({ required: true }) private search!: string;

  get Stocks() {
    return this.stocks;
  }

  // get Search() {
  //   return this.search;
  // }

  // set Search(val: string) {
  //   this.$emit('search', val);
  // }

  @Watch('search')
  private searchChanged(newVal: string, oldVal: string) {
    if (newVal !== oldVal) {
      this.$emit('search', newVal);
      this.$data.currentPage = 1;
    }
  }

  private paginationClicked(page: number) {
    this.$emit('pagination', { page, searchStocks: this.$data.search });
  }

  private stockClicked(name: string) {
    this.$emit('selected', name);
  }

  private data() {
    return {
      selectedItem: null,
      currentPage: 1,
      search: '',
    };
  }
}
</script>
