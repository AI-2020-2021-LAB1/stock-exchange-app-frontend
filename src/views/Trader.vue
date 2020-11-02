<template>
  <v-container fluid class="fill-height pa-0">
    <v-row no-gutters class="fill-height">
      <v-col v-if="$vuetify.breakpoint.mdAndUp" sm="2" style="background: red">
        <v-row class="fill-height" align="center">
          <v-col>
            <p class="text-center ma-0">Lista dostępnych akcji</p>
          </v-col>
        </v-row>
      </v-col>
      <v-col :sm="$vuetify.breakpoint.mdAndUp ? 10 : 12">
        <div v-if="!$vuetify.breakpoint.mdAndUp" class="ma-2">
          <v-btn block class="primary" @click="drawer = true">Pokaż inną akcję</v-btn>
        </div>
        <v-row no-gutters align="center" style="background: blue;">
          <v-col>
            <p class="text-center ma-0">Wykres</p>
          </v-col>
        </v-row>
        <v-row
          no-gutters
          align="center"
          style="background: yellow;"
        >
          <v-col>
            <p class="text-center ma-0">Panel kupna-sprzedaży</p>
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col :sm="$vuetify.breakpoint.mdAndUp ? 6 : 12">
            <v-row align="start">
              <v-col class="py-0">
                <trader-offers
                  title="Oferty kupna"
                  :offers="offers"
                ></trader-offers>
              </v-col>
            </v-row>
          </v-col>
          <v-col :sm="$vuetify.breakpoint.mdAndUp ? 6 : 12">
            <v-row align="start">
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
    <v-navigation-drawer app left disable-resize-watcher v-model="drawer" width="300px">
      <v-row class="fill-height" align="center">
          <v-col>
            <p class="text-center ma-0">Lista dostępnych akcji</p>
          </v-col>
        </v-row>
    </v-navigation-drawer>
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
      drawer: false,
    };
  }
}
</script>
