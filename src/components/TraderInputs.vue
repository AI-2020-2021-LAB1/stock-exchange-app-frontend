<template>
  <v-card-text class="pb-5">
    <v-row align="center" justify="center" class="mx-0">
      <v-col class="pa-0">
        <v-form @submit.prevent="buy()">
          <v-row align="center" justify="start" class="mx-0">
            <span class="success--text pa-3">Chce kupić</span>
          </v-row>
          <v-row align="center" justify="center" class="mx-0">
            <v-col>
              <v-text-field
                outlined
                v-model="howManyCourseBuy"
                label="kurs"
                :rules="[rules.min(howManyCourseBuy, 'Kurs')]"
                color="primary"
                type="number"
              ></v-text-field>
            </v-col>
            <v-col>
              <v-text-field
                outlined
                v-model="howManyBuy"
                :rules="[rules.min(howManyBuy, 'Cena')]"
                label="ilość"
                color="primary"
                type="number"
              ></v-text-field>
            </v-col>
            <v-col>
              <v-text-field
                outlined
                v-model="valueBuy"
                label="wartość"
                color="primary"
                disabled
                type="number"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row align="center" justify="end" class="mx-0">
            <v-btn class="pa-6" type="submit" depressed color="success">
              <span>Kup!</span>
            </v-btn>
          </v-row>
        </v-form>
      </v-col>

      <v-col class="py-0 pr-0">
        <v-form @submit.prevent="sell()">
          <v-row align="center" justify="start" class="mx-0">
            <span class="error--text pa-3">Chce sprzedać</span>
          </v-row>
          <v-row align="center" justify="center" class="mx-0">
            <v-col>
              <v-text-field
                outlined
                v-model="howManyCourseSell"
                :rules="[rules.min(howManyCourseSell, 'Kurs')]"
                label="kurs"
                color="primary"
                type="number"
              ></v-text-field>
            </v-col>
            <v-col>
              <v-text-field
                outlined
                v-model="howManySell"
                label="ilość"
                :rules="[rules.min(howManySell, 'Cena')]"
                color="primary"
                type="number"
              ></v-text-field>
            </v-col>
            <v-col>
              <v-text-field
                outlined
                v-model="valueSell"
                label="wartość"
                color="primary"
                disabled
                type="number"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row align="center" justify="end" class="mx-0">
            <v-btn class="pa-6" type="submit" depressed color="error">
              <span>Sprzedaj!</span>
            </v-btn>
          </v-row>
        </v-form>
      </v-col>
    </v-row>
  </v-card-text>
</template>
<script lang="ts">
import Vue from 'vue';
import { Component, Watch } from 'vue-property-decorator';

@Component
export default class TraderInputs extends Vue {
  public sell(): void {
    console.log('clicked');
  }
  public buy(): void {
    console.log('clicked');
  }

  private data() {
    return {
      howManyBuy: 0,
      howManyCourseBuy: 0,
      howManySell: 0,
      howManyCourseSell: 0,
      rules: {
        min: (value: number, field: string) => {
          if (value < 0) {
            return (
              field +
              ' ' +
              (field === 'Kurs'
                ? 'nie może być mniejsze niż zero'
                : 'nie może być mniejsza niż zero')
            );
          } else {
            return true;
          }
        },
      },
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
<style scoped>
.v-btn {
  width: 120px;
}
</style>
