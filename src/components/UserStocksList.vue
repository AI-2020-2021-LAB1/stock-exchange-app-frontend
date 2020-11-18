<template>
  <v-card class="rounded-lg mx-auto mx-2" tile>
    <v-card-title
      class="text-h5 font-weight-bold justify-center white--text primary py-1"
      >Lista posiadanych akcji</v-card-title
    >
    <v-card-text class="pt-2 pb-0">
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
      <v-expansion-panels :inset="$vuetify.breakpoint.mdAndUp" class="mt-4">
        <v-expansion-panel v-for="stock in stocks.content" :key="stock.id">
          <v-expansion-panel-header>
            <v-row no-gutters align="center" justify="start">
              <v-col cols="auto">
                <v-icon left class="primary--text">mdi-wallet</v-icon>
              </v-col>
              <v-col cols="auto" class="pa-3">
                <p class="mt-auto font-weight-bold text-center mb-1">Nazwa</p>
                <p class="my-auto text-center">{{ stock.name }}</p>
              </v-col>
              <v-col cols="auto" class="pa-3">
                <p class="mt-auto font-weight-bold text-center mb-1">Skrót</p>
                <p class="my-auto text-center">{{ stock.abbreviation }}</p>
              </v-col>
              <v-col cols="auto" class="pa-3">
                <p class="mt-auto font-weight-bold text-center mb-1">
                  Aktualna cena
                </p>
                <p class="my-auto text-center">
                  {{ stock.currentPrice.toFixed(2) }}
                </p>
              </v-col>
            </v-row>
          </v-expansion-panel-header>
          <v-expansion-panel-content> Dummy content </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>

      <v-pagination
        v-model="currentPage"
        :length="stocks.totalPages"
        @input="paginationClicked"
      ></v-pagination>
    </v-card-text>
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
