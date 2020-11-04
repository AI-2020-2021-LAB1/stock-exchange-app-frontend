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
            <v-list-item-title v-text="stock.name"></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-card>
</template>

<script lang="ts">
// <template>
//   <v-row class="fill-height" align="center">
//     <v-col>
//       <p class="text-center ma-0">Lista dostępnych akcji</p>
//     </v-col>
//   </v-row>
// </template>
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class TraderStocksList extends Vue {
  @Prop({ required: true }) private stocks!: object[];

  get Stocks() {
    return this.stocks;
  }

  private data() {
    return {
      selectedItem: 1,
    };
  }
}
</script>
