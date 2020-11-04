<template>
  <v-card class="mx-auto" max-width="300" tile>
    <v-list dense>
      <v-subheader>Lista dostępnych akcji</v-subheader>
      <v-list-item-group v-model="selectedItem" color="primary">
        <v-list-item v-for="stock in stocks" :key="stock.id">
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
  </v-card>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class TraderStocksList extends Vue {
  @Prop({ required: true }) private stocks!: object[];

  get Stocks() {
    return this.stocks;
  }

  private data() {
    return {
      selectedItem: 0,
    };
  }
}
</script>
