<template>
  <v-card class="mt-2">
    <v-card-title
      class="text-h5 font-weight-bold white--text primary py-1"
      style="word-break: break-word"
      >Edycja danych użytkownika</v-card-title
    >
    <v-card-text class="pt-2 pb-0">
      <v-form v-model="inputValidated" @submit.prevent="editUser()">
        <v-row>
          <v-col cols="12" md="6" class="py-0">
            <v-text-field
              autofocus
              outlined
              v-model="data.firstName"
              prepend-icon="mdi-rename-box"
              :rules="[rules.required, rules.counter(data.firstName, 2, 'i')]"
              label="Imię"
              color="primary"
              type="text"
              class="my-2"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6" class="py-0">
            <v-text-field
              outlined
              v-model="data.lastName"
              :rules="[rules.required, rules.counter(data.lastName, 2, 'i')]"
              label="Nazwisko"
              color="primary"
              type="text"
              class="my-2"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-text-field
          outlined
          v-model="data.email"
          prepend-icon="mdi-at"
          :rules="[rules.required, rules.counter(data.email, 3, 'i')]"
          label="E-mail"
          color="primary"
          type="text"
          class="my-2"
        ></v-text-field>
        <v-text-field
          outlined
          v-model.number="data.money"
          prepend-icon="mdi-cash-multiple"
          :rules="[rules.required]"
          label="Saldo"
          color="primary"
          type="text"
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
            <v-icon right>mdi-account-edit</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { User } from '../models/UserModel';

@Component
export default class AdmineditUser extends Vue {
  @Prop({ required: true }) private userData!: User;

  private created() {
    this.$data.data = this.userData;
  }

  private resetForm() {
    this.$data.data = this.userData;
  }

  @Watch('userData', { deep: true })
  private newData(data: User) {
    this.$data.data = data;
  }

  private data() {
    return {
      data: {},
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
