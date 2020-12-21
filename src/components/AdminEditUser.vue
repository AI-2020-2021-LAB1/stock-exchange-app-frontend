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
              v-model="firstName"
              prepend-icon="mdi-rename-box"
              :rules="[rules.required, rules.counter(firstName, 2, 'i')]"
              label="Imię"
              color="primary"
              type="text"
              class="my-2"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6" class="py-0">
            <v-text-field
              outlined
              v-model="lastName"
              :rules="[rules.required, rules.counter(lastName, 2, 'i')]"
              label="Nazwisko"
              color="primary"
              type="text"
              class="my-2"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-select
          outlined
          v-model="role"
          prepend-icon="mdi-clipboard-account"
          :items="['USER', 'ADMIN']"
          label="Rola użytkownika"
          color="primary"
          type="text"
          class="my-2"
        ></v-select>
      </v-form>
    </v-card-text>
    <v-card-actions class="py-0">
      <v-row justify="end" no-gutters>
        <v-col cols="12" md="auto" class="pa-2">
          <v-btn
            block
            :class="isActive ? 'error' : 'warning'"
            @click="isActive = !isActive"
          >
            <span>{{
              isActive ? 'Zbanuj użytkownika' : 'Odbanuj użytkownika'
            }}</span>
            <v-icon right>mdi-gavel</v-icon>
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
            @click="editUser()"
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

  private mounted() {
    this.$data.firstName = this.userData.firstName;
    this.$data.lastName = this.userData.lastName;
    this.$data.role = this.userData.role;
    this.$data.isActive = this.userData.isActive;
  }

  private resetForm() {
    this.$data.firstName = this.userData.firstName;
    this.$data.lastName = this.userData.lastName;
    this.$data.role = this.userData.role;
    this.$data.isActive = this.userData.isActive;
  }

  private editUser() {
    this.$emit('userEdited', {
      firstName: this.$data.firstName,
      lastName: this.$data.lastName,
      role: this.$data.role,
      isActive: this.$data.isActive,
    });
  }

  get anyEdits() {
    return (
      this.$data.firstName !== this.userData.firstName ||
      this.$data.lastName !== this.userData.lastName ||
      this.$data.role !== this.userData.role ||
      this.$data.isActive !== this.userData.isActive
    );
  }

  @Watch('userData', { deep: true })
  private newData(data: User) {
    this.$data.firstName = data.firstName;
    this.$data.lastName = data.lastName;
    this.$data.role = data.role;
    this.$data.isActive = data.isActive;
  }

  private data() {
    return {
      firstName: '',
      lastName: '',
      role: 'USER',
      isActive: false,
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
