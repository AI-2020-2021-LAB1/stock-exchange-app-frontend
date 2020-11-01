<template>
  <v-container fluid class="fill-height pa-0">
    <v-row no-gutters class="fill-height">
      <v-col sm="3" style="background: red">
        <v-row class="fill-height" align="center">
          <v-col>
            <p class="text-center ma-0">Lista dostępnych akcji</p>
          </v-col>
        </v-row>
      </v-col>
      <v-col sm="9">
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
          <v-col cols="6" style="background: lime">
            <v-row class="fill-height" align="center">
              <v-col>
                <p class="text-center ma-0">Zlecenia kupna</p>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="6" style="background: cyan">
            <v-row class="fill-height" align="center">
              <v-col>
                <p class="text-center ma-0">Zlecenia sprzedaży</p>
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

@Component
export default class Trader extends Vue {
  private data() {
    return {};
  }
}
</script>
