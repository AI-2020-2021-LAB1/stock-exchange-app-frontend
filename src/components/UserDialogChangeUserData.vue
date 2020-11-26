<template>
  <div class="text-center">
    <v-dialog v-model="dialog">
      <template v-slot:activator="{ on, attrs }">
        <v-btn color="error" dark v-bind="attrs" v-on="on">
          <span>Zmień swoje dane</span>
          <v-icon right>mdi-account-edit</v-icon>
        </v-btn>
      </template>
      <v-row no-gutters justify="center">
        <v-col cols="auto" class="pa-0">
          <v-card class="ma-2" width="600">
            <v-card-title class="text-h5 font-weight-bold white--text primary"
              >Zmiana danych użytkownika</v-card-title
            >
            <v-form v-model="inputValidatedName" @submit.prevent="changeName()">
              <v-card-text class="pb-0">
                <p class="text-h6 text-center">Zmiana imienia i nazwiska</p>
                <v-row align="center" justify="center" class="mx-0">
                  <v-col cols="12" sm="6" class="px-1 py-0">
                    <v-text-field
                      outlined
                      v-model="first_name"
                      prepend-icon="mdi-card-account-details"
                      :rules="[rules.required]"
                      label="Zmień imię"
                      color="primary"
                      type="text"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" class="px-1 py-0">
                    <v-text-field
                      outlined
                      v-model="last_name"
                      :rules="[rules.required]"
                      label="Zmień nazwisko"
                      color="primary"
                      type="text"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-card-text>
              <v-card-actions class="pt-0">
                <v-btn
                  block
                  :disabled="!inputValidatedName"
                  color="primary"
                  type="submit"
                >
                  <span class="font-weight-bold">Zmień imię i nazwisko</span>
                  <v-icon right>mdi-account-edit</v-icon>
                </v-btn>
              </v-card-actions>
            </v-form>
            <v-divider></v-divider>
            <v-form
              v-model="inputValidatedPassword"
              @submit.prevent="changePassword()"
            >
              <v-card-text class="pb-0">
                <p class="text-h6 text-center">Zmiana hasła</p>
                <v-row align="center" justify="center" class="mx-0">
                  <v-col cols="12" sm="6" class="px-1 py-0">
                    <v-text-field
                      outlined
                      v-model="password1"
                      prepend-icon="mdi-lock"
                      :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
                      @click:append="showPass = !showPass"
                      :rules="[rules.required, passwdValid]"
                      label="Zmień hasło"
                      color="primary"
                      :type="showPass ? 'text' : 'password'"
                      @focus="passwdFocus = true"
                      @blur="passwdFocus = false"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" class="px-1 py-0">
                    <v-text-field
                      outlined
                      v-model="password2"
                      :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
                      @click:append="showPass = !showPass"
                      :rules="[
                        rules.required,
                        rules.identical(password1, password2),
                      ]"
                      label="Powtórz hasło"
                      color="primary"
                      :type="showPass ? 'text' : 'password'"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <password-validator
                  v-if="passwdFocus"
                  ref="passwordValidator"
                  :password="password1"
                  @validation="passwdValid = $event"
                ></password-validator>
              </v-card-text>
              <v-card-actions class="pt-0">
                <v-btn
                  block
                  :disabled="!inputValidatedPassword"
                  color="primary"
                  type="submit"
                >
                  <span class="font-weight-bold">Zmień hasło</span>
                  <v-icon right>mdi-lock-reset</v-icon>
                </v-btn>
              </v-card-actions>
            </v-form>
          </v-card>
        </v-col>
      </v-row>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class DialogChangeUserData extends Vue {
  private data() {
    return {
      dialog: false,
      inputValidatedName: false,
      inputValidatedPassword: false,
      first_name: '',
      last_name: '',
      password1: '',
      password2: '',
      showPass: false,
      passwdFocus: false,
      passwdValid: false,
      rules: {
        required: (value: string) => !!value || 'Pole wymagane',
        identical: (value1: string, value2: string) =>
          value1 === value2 || 'Hasła nie są identyczne',
      },
    };
  }

  private changeName() {
    this.$store.dispatch('changeName', {
      firstName: this.$data.first_name,
      lastName: this.$data.lastName,
    });
    this.$data.dialog = false;
  }

  private changePassword() {
    this.$data.dialog = false;
  }
}
</script>
