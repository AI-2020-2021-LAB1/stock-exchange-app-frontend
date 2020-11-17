<template>
  <v-card class="mx-auto mx-2" tile>
    <v-text-field
      solo-inverted
      text
      clearable
      hide-details
      v-model="Search"
      color="primary"
      label="Wyszukaj akcje"
      prepend-inner-icon="mdi-database-search"
    ></v-text-field>
    <v-list dense class="pt-0">
      <v-subheader>Lista posiadanych akcji</v-subheader>
      <v-list-item-group v-model="selectedItem" color="primary">
        <v-list-item
          v-for="stock in stocks.content"
          :key="stock.id"
          @click="stockClicked(stock.name)"
        >
          <v-row no-gutters>
            <v-list-item-icon>
              <v-icon color="green">mdi-cash-usd-outline</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ stock.name }}</v-list-item-title>
              <v-list-item-subtitle>{{
                stock.abbreviation
              }}</v-list-item-subtitle>
              <v-list-item-subtitle
                >{{ stock.currentPrice.toFixed(2) }} PLN</v-list-item-subtitle
              >
            </v-list-item-content>
            <v-list-item-action>
              <v-btn small color="error">
                <span>Sprzedaj</span>
                <v-icon right>mdi-cash-usd</v-icon>
              </v-btn>
            </v-list-item-action>
          </v-row>
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
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class TraderStocksList extends Vue {
  @Prop({ required: true }) private stocks!: object[];
  @Prop({ required: true }) private search!: string;

  get Stocks() {
    return this.stocks;
  }

  get Search() {
    return this.search;
  }

  set Search(val: string) {
    this.$emit('search', val);
  }

  private paginationClicked(page: number) {
    this.$emit('pagination', page);
  }

  private stockClicked(name: string) {
    this.$emit('selected', name);
  }

  private data() {
    return {
      selectedItem: 0,
      currentPage: 1,
    };
  }
}
</script>
