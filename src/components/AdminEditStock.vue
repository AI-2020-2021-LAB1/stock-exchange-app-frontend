<template>
  <v-card class="mt-2">
    <v-card-title
      class="text-h5 font-weight-bold white--text primary py-1"
      style="word-break: break-word"
      >Edycja danych akcji</v-card-title
    >
    <v-card-text class="pt-2 pb-0">
      <v-form v-model="inputValidated" @submit.prevent="editUser()">
        <v-text-field
          autofocus
          outlined
          v-model="name"
          prepend-icon="mdi-rename-box"
          :rules="[rules.required, rules.counter(name, 3, 'i')]"
          label="Nazwa"
          color="primary"
          type="text"
          class="my-2"
        ></v-text-field>
        <v-text-field
          outlined
          v-model.number="currentPrice"
          prepend-icon="mdi-cash-usd"
          :rules="[rules.required]"
          label="Aktualna cena"
          color="primary"
          type="number"
          class="my-2"
        ></v-text-field>
        <v-text-field
          outlined
          v-model.number="amount"
          prepend-icon="mdi-counter"
          :rules="[rules.required]"
          label="Ilość"
          color="primary"
          type="number"
          class="my-2"
        ></v-text-field>
      </v-form>
    </v-card-text>
    <v-card-actions class="py-0">
      <v-row justify="end" no-gutters>
        <v-col cols="12" md="auto" class="pa-2">
          <v-btn block class="error" @click="resetForm()">
            <span>Resetuj formularz</span>
            <v-icon right>mdi-reload</v-icon>
          </v-btn>
        </v-col>
        <v-col cols="12" md="auto" class="pa-2">
          <v-btn
            block
            :disabled="!inputValidated"
            class="success"
            type="submit"
          >
            <span>Edytuj użytkownika</span>
            <v-icon right>mdi-briefcase-edit</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { Content } from '../models/StockModel';

@Component
export default class AdmineditUser extends Vue {
  @Prop({ required: true }) private stockData!: Content;

  private mounted() {
    this.$data.name = this.stockData.name;
    this.$data.currentPrice = this.stockData.currentPrice;
    this.$data.amount = this.stockData.amount;
  }

  private resetForm() {
    this.$data.name = this.stockData.name;
    this.$data.currentPrice = this.stockData.currentPrice;
    this.$data.amount = this.stockData.amount;
  }

  @Watch('stockData', { deep: true })
  private newData(data: Content) {
    this.$data.name = data.name;
    this.$data.currentPrice = data.currentPrice;
    this.$data.amount = data.amount;
  }

  private data() {
    return {
      name: '',
      currentPrice: 0,
      amount: 0,
      inputValidated: false,
      rules: {
        required: (value: string) => !!value || 'Pole wymagane',
        counter: (value: string, num: number, end: string) =>
          value.length >= num || 'Minimum ' + num + ' znak' + end,
      },
    };
  }
}
</script>
