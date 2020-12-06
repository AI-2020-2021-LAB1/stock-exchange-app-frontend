<template>
  <v-card class="mt-2">
    <v-card-title
      class="text-h5 font-weight-bold white--text primary py-1"
      style="word-break: break-word"
      >Edycja danych akcji</v-card-title
    >
    <v-card-text class="pt-2 pb-0">
      <v-form
        v-model="inputValidated"
        @submit.prevent="editStock()"
        id="stock-edit-form"
      >
        <v-row align="center" justify="center" class="mx-0">
          <v-col class="pa-0">
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
          </v-col>
          <v-col class="py-0 pr-0">
            <v-text-field
              outlined
              v-model="abbreviation"
              :rules="[
                rules.required,
                rules.counter(abbreviation, 3, 'i'),
                rules.counterMax(abbreviation, 3, 'i'),
              ]"
              label="Skrót"
              color="primary"
              type="text"
              class="my-2"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>
    <v-card-actions class="py-0">
      <v-row justify="end" no-gutters>
        <v-col cols="12" md="auto" class="pa-2">
          <v-btn block class="error" @click="removeClicked()">
            <span>Usuń akcję</span>
            <v-icon right>mdi-briefcase-remove</v-icon>
          </v-btn>
        </v-col>
        <v-col cols="12" md="auto" class="pa-2">
          <v-btn block class="error" @click="resetForm()">
            <span>Resetuj formularz</span>
            <v-icon right>mdi-reload</v-icon>
          </v-btn>
        </v-col>
        <v-col cols="12" md="auto" class="pa-2">
          <v-btn
            block
            :disabled="!inputValidated || !anyEdits"
            class="success"
            type="submit"
            form="stock-edit-form"
          >
            <span>Edytuj akcję</span>
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
export default class AdminEditStock extends Vue {
  @Prop({ required: true }) private stockData!: Content;

  private mounted() {
    this.$data.name = this.stockData.name;
    this.$data.abbreviation = this.stockData.abbreviation;
  }

  private resetForm() {
    this.$data.name = this.stockData.name;
    this.$data.abbreviation = this.stockData.abbreviation;
  }

  private editStock() {
    this.$emit('stockEdited', {
      id: this.stockData.id,
      name: this.$data.name,
      abbreviation: this.$data.abbreviation,
      currentPrice: this.stockData.currentPrice,
      amount: this.stockData.amount,
    });
  }

  private removeClicked() {
    this.$emit('remove', this.stockData.id);
  }

  get anyEdits() {
    return (
      this.$data.name !== this.stockData.name ||
      this.$data.abbreviation !== this.stockData.abbreviation
    );
  }

  @Watch('stockData', { deep: true })
  private newData(data: Content) {
    this.$data.name = data.name;
    this.$data.abbreviation = data.abbreviation;
  }

  private data() {
    return {
      name: '',
      abbreviation: '',
      inputValidated: false,
      rules: {
        required: (value: string) => !!value || 'Pole wymagane',
        counter: (value: string, num: number, end: string) =>
          value.length >= num || 'Minimum ' + num + ' znak' + end,
        counterMax: (value: string, num: number, end: string) =>
          value.length <= num || 'Maximum ' + num + ' znak' + end,
      },
    };
  }
}
</script>
