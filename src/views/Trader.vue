<template>
  <v-container fluid class="fill-height pa-0">
    <v-row no-gutters class="fill-height">
      <v-col sm="2" style="background: red">
        <v-row class="fill-height" align="center">
          <v-col>
            <p class="text-center ma-0">Lista dostępnych akcji</p>
          </v-col>
        </v-row>
      </v-col>
      <v-col sm="10">
        <v-row no-gutters align="center" style="background: blue; height: 45%">
          <v-col>
            <p class="text-center ma-0">Wykres</p>
          </v-col>
        </v-row>
        <v-row
          no-gutters
          align="center"
          style="background: yellow; height: 10%"
        >
          <v-col>
            <p class="text-center ma-0">Panel kupna-sprzedaży</p>
          </v-col>
        </v-row>
        <v-row no-gutters style="height: 45%">
          <v-col cols="6">
            <v-row class="fill-height" align="start">
              <v-col class="py-0">
                <trader-offers
                  title="Oferty kupna"
                  :offers="offers"
                ></trader-offers>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="6">
            <v-row class="fill-height" align="start">
              <v-col class="py-0">
                <trader-offers
                  title="Oferty sprzedaży"
                  :offers="offers"
                ></trader-offers>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import TraderOffers from '../components/TraderOffers.vue';

@Component({
  components: {
    TraderOffers,
  },
})
export default class Trader extends Vue {
  private created() {
    for (let i = 1; i <= 1000; i++) {
      this.$data.offers.push({
        sum: i,
        amount: i,
        price: i,
      });
    }
  }
  private data() {
    return {
      offers: [],
    };
  }
}
</script>
