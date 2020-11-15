<template>
  <v-row no-gutters>
    <v-col cols="12" :sm="$vuetify.breakpoint.mdAndUp ? 6 : 12">
      <v-card class="ma-1" outlined>
        <v-card-title class="success white--text font-weight-bold py-1"
          >Chcę kupić</v-card-title
        >
        <v-card-text class="pa-0">
          <p class="text-h6 text-center mb-0">
            Dostępne: {{ stock.stockInfo.amount }}
          </p>
          <v-row align="center" justify="center" class="mx-0">
            <v-col class="px-1 pb-0">
              <v-text-field
                outlined
                hide-details
                v-model.number="howManyCourseBuy"
                label="kurs"
                color="primary"
                type="number"
              ></v-text-field>
            </v-col>
            <v-col class="px-1 pb-0">
              <v-text-field
                outlined
                hide-details
                v-model.number="howManyBuy"
                label="ilość"
                color="primary"
                type="number"
              ></v-text-field>
            </v-col>
            <v-col class="px-1 pb-0">
              <v-text-field
                outlined
                hide-details
                v-model.number="valueBuy"
                label="wartość"
                color="primary"
                disabled
                type="number"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row no-gutters class="mx-2 mt-2">
            <v-col cols="12">
              <v-select
                dense
                outlined
                hide-details
                label="Typ zlecenia"
                :items="buyTypeLabels"
                item-text="text"
                item-value="index"
                v-model="buyType"
              ></v-select>
            </v-col>
            <v-col cols="12" class="pt-2">
              <v-card>
                <v-card-title class="primary white--text font-weight-bold py-1"
                  >Ustaw ważność zlecenia</v-card-title
                >
                <v-card-text>
                  <v-menu
                    ref="buyDatePickerRef"
                    v-model="buyDatePicker"
                    :close-on-content-click="false"
                    :return-value.sync="buyDate"
                    transition="scale-transition"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="buyDate"
                        label="Wybierz datę"
                        prepend-icon="mdi-calendar-edit"
                        readonly
                        hide-details
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-if="buyDatePicker"
                      v-model="buyDate"
                      full-width
                      :min="new Date().toISOString()"
                      @click:date="$refs.buyDatePickerRef.save(buyDate)"
                    ></v-date-picker>
                  </v-menu>
                  <v-menu
                    ref="buyTimePickerRef"
                    v-model="buyTimePicker"
                    :close-on-content-click="false"
                    :return-value.sync="buyTime"
                    transition="scale-transition"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="buyTime"
                        label="Wybierz godzinę"
                        prepend-icon="mdi-clock-time-four-outline"
                        readonly
                        hide-details
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-time-picker
                      v-if="buyTimePicker"
                      v-model="buyTime"
                      full-width
                      format="24hr"
                      @click:minute="$refs.buyTimePickerRef.save(buyTime)"
                    ></v-time-picker>
                  </v-menu>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-btn
            block
            depressed
            :disabled="valueBuy === 0 || buyType === 0"
            color="success"
            @click="buy"
          >
            <span>Kup</span>
            <v-icon right>mdi-cart</v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
    <v-col cols="12" :sm="$vuetify.breakpoint.mdAndUp ? 6 : 12">
      <v-card class="ma-1" outlined>
        <v-card-title class="error white--text font-weight-bold py-1"
          >Chcę sprzedać</v-card-title
        >
        <v-card-text class="pa-0">
          <p class="text-h6 text-center mb-0">
            Możesz sprzedać: {{ stock.userPossession.amountAvailableForSale }}
          </p>
          <v-row align="center" justify="center" class="mx-0">
            <v-col class="px-1 pb-0">
              <v-text-field
                outlined
                hide-details
                v-model.number="howManyCourseSell"
                label="kurs"
                color="primary"
                type="number"
              ></v-text-field>
            </v-col>
            <v-col class="px-1 pb-0">
              <v-text-field
                outlined
                hide-details
                v-model.number="howManySell"
                label="ilość"
                color="primary"
                type="number"
              ></v-text-field>
            </v-col>
            <v-col class="px-1 pb-0">
              <v-text-field
                outlined
                hide-details
                v-model.number="valueSell"
                label="wartość"
                color="primary"
                disabled
                type="number"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row no-gutters class="mx-2 mt-2">
            <v-col cols="12">
              <v-select
                dense
                outlined
                hide-details
                label="Typ zlecenia"
                :items="sellTypeLabels"
                item-text="text"
                item-value="index"
                v-model="sellType"
              ></v-select>
            </v-col>
            <v-col cols="12" class="pt-2">
              <v-card>
                <v-card-title class="primary white--text font-weight-bold py-1"
                  >Ustaw ważność zlecenia</v-card-title
                >
                <v-card-text>
                  <v-menu
                    ref="sellDatePickerRef"
                    v-model="sellDatePicker"
                    :close-on-content-click="false"
                    :return-value.sync="sellDate"
                    transition="scale-transition"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="sellDate"
                        label="Wybierz datę"
                        prepend-icon="mdi-calendar-edit"
                        readonly
                        hide-details
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-if="sellDatePicker"
                      v-model="sellDate"
                      full-width
                      :min="new Date().toISOString()"
                      @click:date="$refs.sellDatePickerRef.save(sellDate)"
                    ></v-date-picker>
                  </v-menu>
                  <v-menu
                    ref="sellTimePickerRef"
                    v-model="sellTimePicker"
                    :close-on-content-click="false"
                    :return-value.sync="sellTime"
                    transition="scale-transition"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="sellTime"
                        label="Wybierz godzinę"
                        prepend-icon="mdi-clock-time-four-outline"
                        readonly
                        hide-details
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-time-picker
                      v-if="sellTimePicker"
                      v-model="sellTime"
                      full-width
                      format="24hr"
                      @click:minute="$refs.sellTimePickerRef.save(sellTime)"
                    ></v-time-picker>
                  </v-menu>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-btn
            block
            depressed
            :disabled="valueSell === 0 || sellType === 0"
            color="error"
            @click="sell"
          >
            <span>Sprzedaj</span>
            <v-icon right>mdi-cash-usd</v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>
<script lang="ts">
import { Vue, Component, Watch, Prop } from 'vue-property-decorator';
import { SelectedStock } from '../models/SelectedStockModel';

@Component
export default class TraderInputs extends Vue {
  @Prop({ required: true }) private selectedStock!: SelectedStock;

  public sell() {
    return;
  }
  public buy() {
    return;
  }

  @Watch('howManyBuy')
  @Watch('howManyCourseBuy')
  @Watch('howManySell')
  @Watch('howManyCourseSell')
  private valueChanged(val: number) {
    if (val < 0) {
      this.$data.howManyBuy = Math.abs(this.$data.howManyBuy);
      this.$data.howManyCourseBuy = Math.abs(this.$data.howManyCourseBuy);
      this.$data.howManySell = Math.abs(this.$data.howManySell);
      this.$data.howManyCourseSell = Math.abs(this.$data.howManyCourseSell);
    } else {
      if (this.$data.howManyBuy > this.$data.stock.stockInfo.amount) {
        this.$data.howManyBuy = this.$data.stock.stockInfo.amount;
      }
      if (
        this.$data.howManySell >
        this.$data.stock.userPossession.amountAvailableForSale
      ) {
        this.$data.howManySell = this.$data.stock.userPossession.amountAvailableForSale;
      }
    }
  }

  @Watch('stock', { deep: true })
  private stockChanged() {
    this.clearInputs();
  }

  private clearInputs() {
    const dt = new Date();
    const date = dt.getFullYear() + '-' + (dt.getMonth() + 1) + '-' + (dt.getDate() + 1);
    const time = dt.getHours() + ':' + dt.getMinutes();
    this.$data.howManyBuy = 0;
    this.$data.howManyCourseBuy = 0;
    this.$data.buyType = 0;
    this.$data.buyTimePicker = false;
    this.$data.buyTime = time;
    this.$data.buyDatePicker = false;
    this.$data.buyDate = date;
    this.$data.howManySell = 0;
    this.$data.howManyCourseSell = 0;
    this.$data.sellType = 0;
    this.$data.sellTimePicker = false;
    this.$data.sellTime = time;
    this.$data.sellDatePicker = false;
    this.$data.sellDate = date;
  }

  private created() {
    this.clearInputs();
  }

  private data() {
    return {
      howManyBuy: 0,
      howManyCourseBuy: 0,
      buyType: 0,
      buyTypeLabels: [
        { index: 1, text: 'Cena maksymalna' },
        { index: 2, text: 'Stała cena' },
      ],
      buyTimePicker: false,
      buyTime: null,
      buyDatePicker: false,
      buyDate: null,
      howManySell: 0,
      howManyCourseSell: 0,
      sellType: 0,
      sellTypeLabels: [
        { index: 1, text: 'Cena minimalna' },
        { index: 2, text: 'Stała cena' },
      ],
      sellTimePicker: false,
      sellTime: null,
      sellDatePicker: false,
      sellDate: null,
      stock: this.selectedStock,
    };
  }
  get valueSell() {
    return this.$data.howManySell * this.$data.howManyCourseSell;
  }
  get valueBuy() {
    return this.$data.howManyCourseBuy * this.$data.howManyBuy;
  }
}
</script>
