<template>
  <div>
    <v-row class="mx-1 my-2" justify="center">
      <v-col class="pa-0" cols="12" md="10" lg="8" xl="6">
        <v-expansion-panels dark>
          <v-expansion-panel class="warning">
            <v-expansion-panel-header class="text-h6 font-weight-bold pa-4"
              >Instrukcja obsługi edytora</v-expansion-panel-header
            >
            <v-expansion-panel-content>
              <p>
                <b>
                  Konfiguracja oparta jest o logikę drzewa decyzyjnego co
                  oznacza, iż algorytm obciążnika dokonuje kolejnych wyborów
                  symulujących działania użytkownika. Wartości poszczególnych
                  ustawień o tym samym kolorze reprezentują opcje dostępne w
                  ramach konkretnego wyboru. Suma wartości procentowych o tym
                  samym kolorze musi być równa 100%.
                </b>
              </p>
              <ul>
                <li>
                  Pierwsze cztery wartości reprezentują opcje możliwe do
                  podjęcia przez użytkownika (w tym przypadku symulowanego przez
                  obciążnik) po zalogowaniu. Są to kolejno: sprawdzenie listy
                  dostępnych akcji, sprawdzenie listy posiadanych akcji,
                  sprawdzenie aktualnych zleceń lub przejście bezpośrednio do
                  utworzenia zlecenia. Opcje z tej grupy oznaczone są kolorem
                  żółtym.
                </li>
                <li>
                  Kolejne dwie wartości oznaczają opcje, które użytkownik może
                  podjąć po sprawdzeniu listy wszystkich dostępnych aukcji. Są
                  to: utworzenie zlecenia lub powrót do strony głównej.
                  Oznaczone są kolorem zielonym.
                </li>
                <li>
                  Kolejne dwie wartości dotyczą działań, które symulowany
                  użytkownik może podjąć po sprawdzeniu listy posiadanych akcji.
                  Ponownie są to: utworzenie zlecenia lub powrót do strony
                  głównej. Oznaczone są kolorem niebieskim.
                </li>
                <li>
                  Kolejne trzy wartości dotyczą opcji dostępnych po sprawdzeniu
                  aktualnych zleceń. W tym przypadku obciążnik może utworzyć
                  nowe zlecenie, usunąć jedno z już istniejących lub wrócić do
                  strony głównej. Oznaczone są kolorem brązowym.
                </li>
                <li>
                  Ostatnie dwa parametry dotyczą sytuacji w której symulowany
                  użytkownik zdecyduje się na utworzenie zlecenia. Dostępne są
                  tu dwie opcje: zlecenie kupna oraz zlecenie sprzedaży.
                  Oznaczone są kolorem czerwonym.
                </li>
              </ul>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
    </v-row>
    <v-row class="mx-1 my-2" justify="center">
      <v-col cols="12" md="10" lg="8" xl="6" class="pa-0">
        <v-card>
          <v-card-title class="text-h6 white--text font-weight-bold primary"
            >Nowa konfiguracja</v-card-title
          >
          <v-form @submit.prevent="createConfiguration()">
            <v-card-text class="pt-1 pb-0 px-2">
              <v-text-field
                outlined
                dense
                v-model="nameConfiguration"
                label="Nazwa konfigurcji"
                color="primary"
                class="mt-2 mb-0"
              ></v-text-field>
              <v-card v-for="group in groups" :key="group.text" class="my-2">
                <v-card-title
                  class="text-h5 font-weight-bold white--text py-1"
                  :class="group.color"
                  >{{ group.text }}</v-card-title
                >
                <v-card-text class="pa-2">
                  <v-card
                    outlined
                    v-for="slider in group.sliders"
                    :key="slider.model"
                    class="rounded-lg my-1"
                  >
                    <v-card-text>
                      <p>{{ slider.label }}</p>
                      <v-row no-gutters>
                        <v-col class="my-auto">
                          <v-slider
                            v-model="$data[slider.model]"
                            :track-color="group.color"
                            :color="group.color"
                            thumb-label
                            thumb-size="25"
                            hide-details
                            step="1"
                          >
                          </v-slider>
                        </v-col>
                        <v-col cols="auto" class="pl-2">
                          <v-text-field
                            :value="$data[slider.model]"
                            class="mt-0 pt-0"
                            hide-details
                            single-line
                            solo
                            dense
                            disabled
                            style="width: 55px"
                          ></v-text-field>
                        </v-col>
                      </v-row>
                    </v-card-text>
                  </v-card>
                </v-card-text>
              </v-card>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn type="submit" color="primary">
                <span class="font-weight-bold">Utwórz konfiguracje</span>
              </v-btn>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </div>
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
          color: 'yellow darken-2',
          sliders: [
            {
              model: 'loginAllStocks',
              label:
                'Prawdopodobieństwo przejścia z procesu logowania do procesu pobrania wszystkich stocków',
            },
            {
              model: 'loginOwnedStocks',
              label:
                'Prawdopodobieństwo przejścia z procesu logowania do procesu pobrania posiadanych stocków',
            },
            {
              model: 'loginUserOrders',
              label:
                'Prawdopodobieństwo przejścia z procesu logowania do procesu pobrania posiadanych zleceń',
            },
            {
              model: 'loginMakeOrder',
              label:
                'Prawdopodobieństwo przejścia z procesu logowania do procesu tworzenia zlecenia',
            },
          ],
        },
        {
          text: 'Przejścia z procesu pobrania wszystkich stocków',
          color: 'green',
          sliders: [
            {
              model: 'allStocksMakeOrder',
              label:
                'Prawdopodobieństwo przejścia z procesu pobrania wszystkch stocków do procesu tworzenia zlecenia',
            },
            {
              model: 'allStocksEnd',
              label:
                'Prawdopodobieństwo przejścia z procesu pobrania wszystkich stocków do zakończenia',
            },
          ],
        },
        {
          text: 'Przejścia z procesu pobrania posiadanych stocków',
          color: 'blue',
          sliders: [
            {
              model: 'ownedStocksMakeOrder',
              label:
                'Prawdopodobieństwo przejścia z procesu pobrania posiadanych stocków do tworzenia zlecenia',
            },
            {
              model: 'ownedStocksEnd',
              label:
                'Prawdopodobieństwo przejścia z procesu pobrania posiadanych stocków do zakończenia',
            },
          ],
        },
        {
          text: 'Przejścia z procesu pobrania posiadanych zleceń',
          color: 'brown',
          sliders: [
            {
              model: 'userOrdersMakeOrder',
              label:
                'Prawdopodobieństwo przejścia z procesu pobrania posiadanych zleceń do stworzenia zlecenia',
            },
            {
              model: 'userOrdersEnd',
              label:
                'Prawdopodobieństwo przejścia z procesu pobrania posiadanych zleceń do zakończenia',
            },
            {
              model: 'userOrderDeleteOrder',
              label:
                'Prawdopodobieństwo przejścia z procesu pobrania posiadanych zleceń do usunięcia zlecenia',
            },
          ],
        },
        {
          text: 'Przejścia z procesu procesu stworzenia zlecenia',
          color: 'red',
          sliders: [
            {
              model: 'makeOrderBuyOrder',
              label:
                'Prawdopodobieństwo przejścia z procesu stworzenia zlecenia do stworzenia zlecenia kupna',
            },
            {
              model: 'makeOrderSellOrder',
              label:
                'Prawdopodobieństwo przejścia z procesu stworzenia zlecenia do stworzenia zlecenia sprzedaży',
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
