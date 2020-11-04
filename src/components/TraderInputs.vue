<template>
  <v-row no-gutters>
    <v-col cols="12" :sm="$vuetify.breakpoint.mdAndUp ? 6 : 12">
      <v-card class="ma-1" outlined>
        <v-card-title class="success white--text font-weight-bold py-1"
          >Chcę kupić</v-card-title
        >
        <v-card-text class="pa-0">
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
        </v-card-text>
        <v-card-actions>
          <v-btn
            block
            depressed
            :disabled="!valueBuy > 0"
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
        </v-card-text>
        <v-card-actions>
          <v-btn
            block
            depressed
            :disabled="!valueSell > 0"
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
import { Vue, Component, Watch } from 'vue-property-decorator';

@Component
export default class TraderInputs extends Vue {
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
    }
  }

  private data() {
    return {
      howManyBuy: 0,
      howManyCourseBuy: 0,
      howManySell: 0,
      howManyCourseSell: 0,
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
