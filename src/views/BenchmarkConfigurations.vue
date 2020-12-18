<template>
  <v-row class="fill-height" align="center">
    <v-col cols="12" class="pa-0">
      <v-row justify="center" class="mx-2">
        <v-card class="elevation-12 ma-2" width="900">
          <v-toolbar color="primary">
            <v-toolbar-title class="white--text font-weight-bold"
              >Nowa konfiguracja</v-toolbar-title
            >
          </v-toolbar>
          <v-card-text class="p-3">
            <v-form @submit.prevent="createConfiguration()">
              <v-text-field
                outlined
                dense
                v-model="nameConfiguration"
                label="Nazwa konfigurcji"
                color="primary"
                class="my-0"
              ></v-text-field>
              <v-card v-for="group in groups" :key="group.text" class="my-2">
                <v-card-title class="text-h5 font-weight-bold white--text secondary py-1">{{ group.text }}</v-card-title>
                <v-card-text class="pa-2">
                  <v-card
                    outlined
                    v-for="slider in group.sliders"
                    :key="slider.model"
                    class="rounded-lg my-1"
                  >
                    <v-card-text>
                      <p>{{ slider.label }}</p>
                      <v-slider
                        v-model="$data[slider.model]"
                        :track-color="slider.color"
                        :color="slider.color"
                        thumb-label
                        hide-details
                      ></v-slider>
                    </v-card-text>
                  </v-card>
                </v-card-text>
              </v-card>
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
      groups: [
        {
          text: 'Przejścia z procesu logowania',
          sliders: [
            {
              model: 'loginAllStocks',
              label:
                'Prawdopodobieństwo przejścia z procesu logowania do procesu pobrania wszystkich stocków',
              color: 'yellow darken-2',
            },
            {
              model: 'loginOwnedStocks',
              label:
                'Prawdopodobieństwo przejścia z procesu logowania do procesu pobrania posiadanych stocków',
              color: 'yellow darken-2',
            },
            {
              model: 'loginUserOrders',
              label:
                'Prawdopodobieństwo przejścia z procesu logowania do procesu pobrania posiadanych zleceń',
              color: 'yellow darken-2',
            },
            {
              model: 'loginMakeOrder',
              label:
                'Prawdopodobieństwo przejścia z procesu logowania do procesu tworzenia zlecenia',
              color: 'yellow darken-2',
            },
          ],
        },
        {
          text: 'Przejścia z procesu pobrania posiadanych stocków',
          sliders: [
            {
              model: 'allStocksMakeOrder',
              label:
                'Prawdopodobieństwo przejścia z procesu pobrania posiadanych stocków do procesu tworzenia zlecenia',
              color: 'green',
            },
            {
              model: 'allStocksEnd',
              label:
                'Prawdopodobieństwo przejścia z procesu pobrania posiadanych stocków do zakończenia',
              color: 'green',
            },
          ],
        },
        {
          text: 'Przejścia z procesu pobrania posiadanych stocków',
          sliders: [
            {
              model: 'ownedStocksMakeOrder',
              label:
                'Prawdopodobieństwo przejścia z procesu pobrania posiadanych stocków do stworzenia zlecenia',
              color: 'blue',
            },
            {
              model: 'ownedStocksEnd',
              label:
                'Prawdopodobieństwo przejścia z procesu pobrania posiadanych stocków do zakończenia',
              color: 'blue',
            },
          ],
        },
        {
          text: 'Przejścia z procesu pobrania posiadanych zleceń',
          sliders: [
            {
              model: 'userOrdersMakeOrder',
              label:
                'Prawdopodobieństwo przejścia z procesu pobrania posiadanych zleceń do stworzenia zlecenia',
              color: 'brown',
            },
            {
              model: 'userOrdersEnd',
              label:
                'Prawdopodobieństwo przejścia z procesu pobrania posiadanych zleceń do zakończenia',
              color: 'brown',
            },
            {
              model: 'userOrderDeleteOrder',
              label:
                'Prawdopodobieństwo przejścia z procesu pobrania posiadanych zleceń do usunięcia zlecenia',
              color: 'brown',
            },
          ],
        },
        {
          text: 'Przejścia z procesu procesu stworzenia zlecenia',
          sliders: [
            {
              model: 'makeOrderBuyOrder',
              id: 12,
              label:
                'Prawdopodobieństwo przejścia z procesu stworzenia zlecenia do stworzenia zlecenia kupna',
              color: 'red',
            },
            {
              model: 'makeOrderSellOrder',
              id: 13,
              label:
                'Prawdopodobieństwo przejścia z procesu stworzenia zlecenia do stworzenia zlecenia sprzedaży',
              color: 'red',
            },
          ],
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
