<template>
  <v-row class="fill-height" align="center">
    <v-col cols="12" class="pa-0">
      <v-row justify="center" class="mx-2">
        <v-card class="elevation-12 ma-2" width="900">
          <v-toolbar color="primary">
            <v-toolbar-title class="white--text font-weight-bold"
              >Konfiguracja</v-toolbar-title
            >
          </v-toolbar>
          <v-card-text class="p-3">
            <v-form @submit.prevent="createConfiguration()">
              <v-text-field
                outlined
                v-model="nameConfiguration"
                label="Nazwa konfigurcji"
                color="primary"
                class="my-2"
              ></v-text-field>
              <div v-bind:key="slide.id" v-for="slide in sliders">
                <v-card
                  class="d-flex align-center justify-center pa-4 mx-auto"
                  min-height="30"
                >
                  <div>
                    {{ slide.label }}
                  </div>
                </v-card>

                <v-slider
                  class="mt-10"
                  :v-model="slide.model"
                  :track-color="slide.color"
                  :color="slide.color"
                  thumb-label
                ></v-slider>
              </div>
              <v-row align="center" justify="center" class="ma-0">
                <v-spacer></v-spacer>

                <v-btn type="submit" color="primary">
                  <span class="font-weight-bold">Utwórz konfiguracje</span>
                </v-btn>
              </v-row>
            </v-form>
          </v-card-text>
        </v-card>
      </v-row>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class BenchmarkConfigurations extends Vue {
  private data() {
    return {
      sliders: [
        {
          model: 'loginAllStocks',
          id: 1,
          label:
            'prawdopodobieństwo przejścia z procesu logowania do procesu pobrania wszystkich stocków',
          val: 0,
          color: 'yellow darken-2',
        },
        {
          model: 'loginOwnedStocks',
          id: 2,
          label:
            'prawdopodobieństwo przejścia z procesu logowania do procesu pobrania posiadanych stocków',
          val: 0,
          color: 'yellow darken-2',
        },
        {
          model: 'loginUserOrders',
          id: 3,
          label:
            'prawdopodobieństwo przejścia z procesu logowania do procesu pobrania posiadanych zleceń',
          val: 0,
          color: 'yellow darken-2',
        },
        {
          model: 'loginMakeOrder',
          id: 4,
          label:
            'prawdopodobieństwo przejścia z procesu logowania do procesu tworzenia zlecenia',
          val: 0,
          color: 'yellow darken-2',
        },
        {
          model: 'allStocksMakeOrder',
          id: 5,
          label:
            'prawdopodobieństwo przejścia z procesu pobrania posiadanych stocków do procesu tworzenia zlecenia',
          val: 0,
          color: 'green',
        },
        {
          model: 'allStocksEnd',
          id: 6,
          label:
            'prawdopodobieństwo przejścia z procesu pobrania posiadanych stocków do zakończenia',
          val: 0,
          color: 'green',
        },
        {
          model: 'ownedStocksMakeOrder',
          id: 7,
          label:
            'prawdopodobieństwo przejścia z procesu pobrania posiadanych stocków do stworzenia zlecenia',
          val: 0,
          color: 'blue',
        },
        {
          model: 'ownedStocksEnd',
          id: 8,
          label:
            'prawdopodobieństwo przejścia z procesu pobrania posiadanych stocków do zakończenia',
          val: 0,
          color: 'blue',
        },
        {
          model: 'userOrdersMakeOrder',
          id: 9,
          label:
            'prawdopodobieństwo przejścia z procesu pobrania posiadanych zleceń do stworzenia zlecenia',
          val: 0,
          color: 'brown',
        },
        {
          model: 'userOrdersEnd',
          id: 10,
          label:
            'prawdopodobieństwo przejścia z procesu pobrania posiadanych zleceń do zakończenia',
          val: 0,
          color: 'brown',
        },
        {
          model: 'userOrderDeleteOrder',
          id: 11,
          label:
            'prawdopodobieństwo przejścia z procesu pobrania posiadanych zleceń do usunięcia zlecenia',
          val: 0,
          color: 'brown',
        },
        {
          model: 'makeOrderBuyOrder',
          id: 12,
          label:
            'prawdopodobieństwo przejścia z procesu zrobienia zlecenia do stworzenia zlecenia kupna',
          val: 0,
          color: 'red',
        },
        {
          model: 'makeOrderSellOrder',
          id: 13,
          label:
            'prawdopodobieństwo przejścia z procesu zrobienia zlecenia do stworzenia zlecenia sprzedaży',
          val: 0,
          color: 'red',
        },
      ],

      nameConfiguration: '',
      loginAllStocks: 0,
      loginOwnedStocks: 0,
      loginUserOrders: 0,
      loginMakeOrder: 0,
      allStocksMakeOrder: 0,
      allStocksEnd: 0,
      ownedStocksMakeOrder: 0,
      ownedStocksEnd: 0,
      userOrdersMakeOrder: 0,
      userOrdersEnd: 0,
      userOrderDeleteOrder: 0,
      makeOrderBuyOrder: 0,
      makeOrderSellOrder: 0,
    };
  }
}
</script>
