<template>
  <div>
    <v-row class="mx-1 my-2" justify="center">
      <v-col cols="12" md="10" lg="8" xl="6" class="pa-0">
        <v-card>
          <v-card-title class="text-h6 white--text font-weight-bold primary"
            >Edytuj konfigurację</v-card-title
          >
          <v-form v-model="inputValidated" @submit.prevent="editConf()">
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
                            step="1"
                            :rules="[
                              rules.percentegesCounter(
                                getValidationArray(slider.model),
                              ),
                            ]"
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
              <v-card class="my-2">
                <v-card-title
                  class="text-h5 font-weight-bold white--text black py-1"
                  >Liczba operacji</v-card-title
                >
                <v-card-text class="pa-2">
                  <v-text-field
                    v-model="numberOfOperations"
                    class="mt-0 pt-0"
                    hide-details
                    single-line
                    solo
                    dense
                    type="number"
                  ></v-text-field>
                </v-card-text>
              </v-card>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-row justify="end" no-gutters>
                <v-col cols="12" md="auto" class="pa-2">
                  <v-btn block class="error" @click="resetForm()">
                    <span>Resetuj formularz</span>
                    <v-icon right>mdi-reload</v-icon>
                  </v-btn>
                </v-col>
                <v-col cols="12" md="auto" class="pa-2">
                  <v-btn
                    :disabled="!inputValidated || !anyEdits"
                    type="submit"
                    color="primary"
                  >
                    <span class="font-weight-bold">Edytuj konfiguracje</span>
                    <v-icon right>mdi-database-edit</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { Content } from '../models/ConfigurationModel';

@Component
export default class BenchmarkConfigurationEditor extends Vue {
  @Prop({ required: true }) private confData!: Content;

  private mounted() {
    this.resetForm();
  }

  private resetForm() {
    this.$data.nameConfiguration = this.confData.name;
    this.$data.loginAllStocks = this.confData.loginAllStocks;
    this.$data.loginOwnedStocks = this.confData.loginOwnedStocks;
    this.$data.loginUserOrders = this.confData.loginUserOrders;
    this.$data.loginMakeOrder = this.confData.loginMakeOrder;
    this.$data.allStocksMakeOrder = this.confData.allStocksMakeOrder;
    this.$data.allStocksEnd = this.confData.allStocksEnd;
    this.$data.ownedStocksMakeOrder = this.confData.ownedStocksMakeOrder;
    this.$data.ownedStocksEnd = this.confData.ownedStocksEnd;
    this.$data.userOrdersMakeOrder = this.confData.userOrdersMakeOrder;
    this.$data.userOrdersEnd = this.confData.userOrdersEnd;
    this.$data.userOrderDeleteOrder = this.confData.userOrderDeleteOrder;
    this.$data.makeOrderBuyOrder = this.confData.makeOrderBuyOrder;
    this.$data.makeOrderSellOrder = this.confData.makeOrderSellOrder;
    this.$data.numberOfOperations = this.confData.noOfOperations;
  }

  private editConf() {
    this.$emit('confEdited', {
      id: this.confData.id,
      name: this.$data.nameConfiguration,
      loginAllStocks: this.$data.loginAllStocks,
      loginOwnedStocks: this.$data.loginOwnedStocks,
      loginUserOrders: this.$data.loginUserOrders,
      loginMakeOrder: this.$data.loginMakeOrder,
      allStocksMakeOrder: this.$data.allStocksMakeOrder,
      allStocksEnd: this.$data.allStocksEnd,
      ownedStocksMakeOrder: this.$data.ownedStocksMakeOrder,
      ownedStocksEnd: this.$data.ownedStocksEnd,
      userOrdersMakeOrder: this.$data.userOrdersMakeOrder,
      userOrdersEnd: this.$data.userOrdersEnd,
      userOrderDeleteOrder: this.$data.userOrderDeleteOrder,
      makeOrderBuyOrder: this.$data.makeOrderBuyOrder,
      makeOrderSellOrder: this.$data.makeOrderSellOrder,
      noOfOperations: parseInt(this.$data.numberOfOperations, 10),
      createdAt: new Date().toISOString(),
      archived: false,
    });
  }

  get anyEdits() {
    return (
      this.$data.nameConfiguration !== this.confData.name ||
      this.$data.loginAllStocks !== this.confData.loginAllStocks ||
      this.$data.loginOwnedStocks !== this.confData.loginOwnedStocks ||
      this.$data.loginUserOrders !== this.confData.loginUserOrders ||
      this.$data.loginMakeOrder !== this.confData.loginMakeOrder ||
      this.$data.allStocksMakeOrder !== this.confData.allStocksMakeOrder ||
      this.$data.allStocksEnd !== this.confData.allStocksEnd ||
      this.$data.ownedStocksMakeOrder !== this.confData.ownedStocksMakeOrder ||
      this.$data.ownedStocksEnd !== this.confData.ownedStocksEnd ||
      this.$data.userOrdersMakeOrder !== this.confData.userOrdersMakeOrder ||
      this.$data.userOrdersEnd !== this.confData.userOrdersEnd ||
      this.$data.userOrderDeleteOrder !== this.confData.userOrderDeleteOrder ||
      this.$data.makeOrderBuyOrder !== this.confData.makeOrderBuyOrder ||
      this.$data.makeOrderSellOrder !== this.confData.makeOrderSellOrder ||
      this.$data.numberOfOperations !== this.confData.noOfOperations
    );
  }

  @Watch('confData', { deep: true })
  private newData(data: Content) {
    this.$data.nameConfiguration = data.name;
    this.$data.loginAllStocks = data.loginAllStocks;
    this.$data.loginOwnedStocks = data.loginOwnedStocks;
    this.$data.loginUserOrders = data.loginUserOrders;
    this.$data.loginMakeOrder = data.loginMakeOrder;
    this.$data.allStocksMakeOrder = data.allStocksMakeOrder;
    this.$data.allStocksEnd = data.allStocksEnd;
    this.$data.ownedStocksMakeOrder = data.ownedStocksMakeOrder;
    this.$data.ownedStocksEnd = data.ownedStocksEnd;
    this.$data.userOrdersMakeOrder = data.userOrdersMakeOrder;
    this.$data.userOrdersEnd = data.userOrdersEnd;
    this.$data.userOrderDeleteOrder = data.userOrderDeleteOrder;
    this.$data.makeOrderBuyOrder = data.makeOrderBuyOrder;
    this.$data.makeOrderSellOrder = data.makeOrderSellOrder;
    this.$data.numberOfOperations = data.noOfOperations;
  }

  private getValidationArray(model: string): number[] {
    if (
      [
        'loginAllStocks',
        'loginOwnedStocks',
        'loginUserOrders',
        'loginMakeOrder',
      ].includes(model)
    ) {
      return [
        this.$data.loginAllStocks,
        this.$data.loginOwnedStocks,
        this.$data.loginUserOrders,
        this.$data.loginMakeOrder,
      ];
    } else if (['allStocksMakeOrder', 'allStocksEnd'].includes(model)) {
      return [this.$data.allStocksMakeOrder, this.$data.allStocksEnd];
    } else if (['ownedStocksMakeOrder', 'ownedStocksEnd'].includes(model)) {
      return [this.$data.ownedStocksMakeOrder, this.$data.ownedStocksEnd];
    } else if (
      ['userOrdersMakeOrder', 'userOrdersEnd', 'userOrderDeleteOrder'].includes(
        model,
      )
    ) {
      return [
        this.$data.userOrdersMakeOrder,
        this.$data.userOrdersEnd,
        this.$data.userOrderDeleteOrder,
      ];
    } else {
      return [this.$data.makeOrderBuyOrder, this.$data.makeOrderSellOrder];
    }
  }

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
          text: 'Przejścia z procesu stworzenia zlecenia',
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
      numberOfOperations: 0,
      inputValidated: false,
      rules: {
        percentegesCounter: (values: number[]) => {
          let percentege = 0;

          for (const v of values) {
            percentege += v;
          }

          if (percentege === 100) {
            return true;
          } else {
            return 'Liczba procentów nie jest równa 100%';
          }
        },
      },
    };
  }
}
</script>
