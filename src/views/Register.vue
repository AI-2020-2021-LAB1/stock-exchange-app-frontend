<template>
  <v-row class="fill-height" align="center">
    <v-col cols="12" class="pa-0">
      <v-row justify="center" class="mx-2">
        <v-card class="elevation-12 ma-2" width="600">
          <v-toolbar color="primary">
            <v-toolbar-title class="white--text font-weight-bold"
              >Zarejestruj się</v-toolbar-title
            >
          </v-toolbar>
          <v-form v-model="inputValidated" @submit.prevent="registerUser()">
            <v-card-text class="pb-0">
              <v-row align="center" justify="center" class="mx-0">
                <v-col class="pa-0 pr-3">
                  <v-text-field
                    label="Imię"
                    v-model="first_name"
                    color="primary"
                    type="text"
                    :rules="[rules.required, rules.first_name]"
                    class="my-2"
                    outlined
                  >
                  </v-text-field>
                </v-col>
                <v-col v-col class="pa-0 pr-0">
                  <v-text-field
                    v-model="last_name"
                    label="Nazwisko"
                    :rules="[rules.required, rules.last_name]"
                    color="primary"
                    type="text"
                    class="my-2"
                    outlined
                  >
                  </v-text-field>
                </v-col>
              </v-row>
              <v-text-field
                outlined
                v-model="email"
                prepend-icon="mdi-at"
                :rules="[rules.required, rules.email]"
                label="E-mail"
                color="primary"
                type="text"
                class="my-2"
              ></v-text-field>
              <v-text-field
                outlined
                v-model="login"
                prepend-icon="mdi-account"
                :rules="[rules.required, rules.counter(login, 3, 'i')]"
                label="Login"
                color="primary"
                type="text"
                class="my-2"
              ></v-text-field>
              <v-row align="center" justify="center" class="mx-0">
                <v-col class="pa-0">
                  <v-text-field
                    outlined
                    v-model="password1"
                    prepend-icon="mdi-lock"
                    :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
                    @click:append="showPass = !showPass"
                    :rules="[rules.required, passwdValid]"
                    label="Hasło"
                    color="primary"
                    :type="showPass ? 'text' : 'password'"
                    class="my-2"
                    @focus="passwdFocus = true"
                    @blur="passwdFocus = false"
                  ></v-text-field>
                </v-col>
                <v-col class="py-0 pr-0">
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
                    class="my-2"
                  ></v-text-field>
                </v-col>
              </v-row>
              <div v-if="passwdFocus">
                <password-validator
                  :password="password1"
                  @validation="passwdValid = $event"
                ></password-validator>
              </div>
            </v-card-text>
            <v-card-actions class="pt-0">
              <v-spacer></v-spacer>
              <v-btn :disabled="!inputValidated" color="primary" type="submit">
                <span class="font-weight-bold">Zarejestruj się</span>
                <v-icon right>mdi-database-plus</v-icon>
              </v-btn>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-row>
      <v-row align="center" justify="center">
        <v-col cols="auto">
          <p class="my-auto">Masz już konto?</p>
        </v-col>
        <v-col cols="auto">
          <v-btn outlined text color="primary" @click="$router.push('/login')">
            <v-icon left>mdi-login</v-icon>
            <span>Zaloguj się!</span>
          </v-btn>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class Register extends Vue {
  private data() {
    return {
      inputValidated: false,
      email: "",
      login: "",
      first_name: "",
      last_name: "",
      password1: "",
      password2: "",
      showPass: false,
      passwdFocus: false,
      passwdValid: false,
      rules: {
        required: (value: string) => !!value || "Pole wymagane",
        identical: (value1: string, value2: string) =>
          value1 === value2 || "Hasła nie są identyczne",
        counter: (value: string, num: number, end: string) =>
          value.length >= num || "Minimum " + num + " znak" + end,
        email: (value: string) => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          return pattern.test(value) || "Adres e-mail nie jest poprawny";
        },
      },
    };
  }

  private registerUser() {
    return;
  }
}
</script>
