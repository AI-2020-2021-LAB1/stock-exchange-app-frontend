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
                v-model.number="buyPrice"
                label="kurs"
                color="primary"
                type="number"
              ></v-text-field>
            </v-col>
            <v-col class="px-1 pb-0">
              <v-text-field
                outlined
                hide-details
                v-model.number="buyAmount"
                label="ilość"
                color="primary"
                type="number"
                :rules="[rules.integer]"
              ></v-text-field>
            </v-col>
            <v-col class="px-1 pb-0">
              <v-text-field
                outlined
                hide-details
                v-model.number="buyValue"
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
                item-value="value"
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
            :disabled="buyValue <= 0 || buyType === 0"
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
                v-model.number="sellPrice"
                label="kurs"
                color="primary"
                type="number"
              ></v-text-field>
            </v-col>
            <v-col class="px-1 pb-0">
              <v-text-field
                outlined
                hide-details
                v-model.number="sellAmount"
                label="ilość"
                color="primary"
                type="number"
                :rules="[rules.integer]"
              ></v-text-field>
            </v-col>
            <v-col class="px-1 pb-0">
              <v-text-field
                outlined
                hide-details
                v-model.number="sellValue"
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
                item-value="value"
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
            :disabled="sellValue <= 0 || sellType === 0"
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
import { OrdersService } from '../API/orders';

@Component
export default class TraderInputs extends Vue {
  private orderService!: OrdersService;
  @Prop({ required: true }) private selectedStock!: SelectedStock;

  public buy() {
    const dt = new Date(this.$data.buyDate + ' ' + this.$data.buyTime);
    this.orderService
      .placeOrder({
        amount: this.$data.buyAmount,
        dateExpiration: dt.toISOString(),
        orderType: 'BUYING_ORDER',
        price: this.$data.buyPrice,
        priceType: this.$data.buyType,
        stock: {
          id: this.$data.stock.stockInfo.id,
        },
      })
      .then((res) => {
        if (res.status === 200) {
          this.$store.dispatch('setSnackbarState', {
            state: true,
            msg: 'Zlecenie zakupu zostało dodane',
            color: 'success',
            timeout: 7500,
          });
          this.reloadStock();
        } else {
          this.$store.dispatch('setSnackbarState', {
            state: true,
            msg: 'Error ' + res.status,
            color: 'error',
            timeout: 7500,
          });
        }
      })
      .catch((err) => {
        this.$store.dispatch('setSnackbarState', {
          state: true,
          msg: 'Error ' + err.response.status,
          color: 'error',
          timeout: 7500,
        });
      });
  }

  public sell() {
    const dt = new Date(this.$data.sellDate + ' ' + this.$data.sellTime);
    this.orderService
      .placeOrder({
        amount: this.$data.sellAmount,
        dateExpiration: dt.toISOString(),
        orderType: 'SELLING_ORDER',
        price: this.$data.sellPrice,
        priceType: this.$data.sellType,
        stock: {
          id: this.$data.stock.stockInfo.id,
        },
      })
      .then((res) => {
        if (res.status === 200) {
          this.$store.dispatch('setSnackbarState', {
            state: true,
            msg: 'Zlecenie sprzedaży zostało dodane',
            color: 'success',
            timeout: 7500,
          });
          this.reloadStock();
        } else {
          this.$store.dispatch('setSnackbarState', {
            state: true,
            msg: 'Error ' + res.status,
            color: 'error',
            timeout: 7500,
          });
        }
      })
      .catch((err) => {
        this.$store.dispatch('setSnackbarState', {
          state: true,
          msg: 'Error ' + err.response.status,
          color: 'error',
          timeout: 7500,
        });
      });
  }

  private reloadStock() {
    this.$emit('reload', this.$data.stock.stockInfo.name);
    this.clearInputs();
  }

  @Watch('buyAmount')
  @Watch('buyPrice')
  @Watch('sellAmount')
  @Watch('sellPrice')
  private valueChanged(val: number) {
    if (val < 0) {
      this.$data.buyAmount = Math.abs(this.$data.buyAmount);
      this.$data.buyPrice = Math.abs(this.$data.buyPrice);
      this.$data.sellAmount = Math.abs(this.$data.sellAmount);
      this.$data.sellPrice = Math.abs(this.$data.sellPrice);
    } else {
      if (this.$data.buyAmount > this.$data.stock.stockInfo.amount) {
        this.$data.buyAmount = this.$data.stock.stockInfo.amount;
      }
      if (
        this.$data.sellAmount >
        this.$data.stock.userPossession.amountAvailableForSale
      ) {
        this.$data.sellAmount = this.$data.stock.userPossession.amountAvailableForSale;
      }
    }
  }

  @Watch('stock', { deep: true })
  private stockChanged() {
    this.clearInputs();
  }

  private clearInputs() {
    const dt = new Date();
    const month = dt.getMonth() + 1;
    const day = dt.getDate() + 1;
    const date =
      dt.getFullYear() +
      '-' +
      (month > 9 ? month : '0' + month.toString()) +
      '-' +
      (day > 9 ? day : '0' + day.toString());
    const hours = dt.getHours();
    const minutes = dt.getMinutes();
    const time =
      (hours > 9 ? hours : '0' + hours.toString()) +
      ':' +
      (minutes > 9 ? minutes : '0' + minutes.toString());
    this.$data.buyAmount = 0;
    this.$data.buyPrice = 0;
    this.$data.buyType = 0;
    this.$data.buyTimePicker = false;
    this.$data.buyTime = time;
    this.$data.buyDatePicker = false;
    this.$data.buyDate = date;
    this.$data.sellAmount = 0;
    this.$data.sellPrice = 0;
    this.$data.sellType = 0;
    this.$data.sellTimePicker = false;
    this.$data.sellTime = time;
    this.$data.sellDatePicker = false;
    this.$data.sellDate = date;
  }

  private beforeCreate() {
    this.orderService = new OrdersService();
  }

  private created() {
    this.clearInputs();
  }

  private data() {
    return {
      buyAmount: 0,
      buyPrice: 0,
      buyType: 0,
      buyTypeLabels: [
        { value: 'LESS_OR_EQUAL', text: 'Cena maksymalna' },
        { value: 'EQUAL', text: 'Stała cena' },
      ],
      buyTimePicker: false,
      buyTime: null,
      buyDatePicker: false,
      buyDate: null,
      sellAmount: 0,
      sellPrice: 0,
      sellType: 0,
      sellTypeLabels: [
        { value: 'GREATER_OR_EQUAL', text: 'Cena minimalna' },
        { value: 'EQUAL', text: 'Stała cena' },
      ],
      sellTimePicker: false,
      sellTime: null,
      sellDatePicker: false,
      sellDate: null,
      stock: this.selectedStock,
      rules: {
        integer: (value: number) =>
          !value.toString().includes('.') || 'Liczba musi być całkowita',
      },
    };
  }
  get buyValue() {
    return this.$data.buyAmount * this.$data.buyPrice;
  }

  get sellValue() {
    return this.$data.sellAmount * this.$data.sellPrice;
  }
}
</script>
