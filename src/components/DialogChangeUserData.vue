<template>
  <div class="text-center">
    <v-dialog v-model="dialog" width="500">
      <template v-slot:activator="{ on, attrs }">
        <v-btn color="red lighten-2" dark v-bind="attrs" v-on="on">
          Zmień dane
        </v-btn>
      </template>
      <v-row class="fill-height" align="center">
        <v-col cols="12" class="pa-0">
          <v-row justify="center" class="mx-2">
            <v-card class="elevation-12 ma-2" width="600">
              <v-toolbar color="primary">
                <v-toolbar-title class="white--text font-weight-bold"
                  >Zmień dane</v-toolbar-title
                >
              </v-toolbar>
              <v-form v-model="inputValidated" @submit.prevent="ChangeData()">
                <v-card-text class="pb-0">
                  <v-row align="center" justify="center" class="mx-0">
                    <v-col class="pa-0">
                      <v-text-field
                        id="first_name"
                        outlined
                        v-model="first_name"
                        prepend-icon="mdi-card-account-details"
                        :rules="[rules.required]"
                        label="Zmień imię"
                        color="primary"
                        type="text"
                      ></v-text-field>
                    </v-col>
                    <v-col class="py-0 pr-0">
                      <v-text-field
                        id="last_name"
                        outlined
                        v-model="last_name"
                        :rules="[rules.required]"
                        label="Zmień nazwisko"
                        color="primary"
                        type="text"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row align="center" justify="center" class="mx-0">
                    <v-col class="pa-0">
                      <v-text-field
                        id="password1"
                        outlined
                        v-model="password1"
                        prepend-icon="mdi-lock"
                        :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
                        @click:append="showPass = !showPass"
                        :rules="[rules.required, passwdValid]"
                        label="Zmień hasło"
                        color="primary"
                        :type="showPass ? 'text' : 'password'"
                        class="my-2"
                        @focus="passwdFocus = true"
                        @blur="passwdFocus = false"
                      ></v-text-field>
                    </v-col>
                    <v-col class="py-0 pr-0">
                      <v-text-field
                        id="password2"
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
                      ref="passwordValidator"
                      :password="password1"
                      @validation="passwdValid = $event"
                    ></password-validator>
                  </div>
                </v-card-text>
                <v-card-actions class="pt-0">
                  <v-spacer></v-spacer>
                  <v-btn
                    :disabled="!inputValidated"
                    color="primary"
                    type="submit"
                  >
                    <span class="font-weight-bold">Zmień</span>
                    <v-icon right>mdi-account-check</v-icon>
                  </v-btn>
                </v-card-actions>
              </v-form>
            </v-card>
          </v-row>
        </v-col>
      </v-row>

      <v-divider></v-divider>
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
      inputValidated: false,
      login: '',
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
        counter: (value: string, num: number, end: string) =>
          value.length >= num || 'Minimum ' + num + ' znak' + end,
      },
    };
  }

  private ChangeData() {
    this.$data.dialog = false;
    // if (this.$data.inputValidated) {
    //   this.$store.dispatch('register', {
    //     email: this.$data.email,
    //     password: this.$data.password1,
    //     firstName: this.$data.first_name,
    //     lastName: this.$data.last_name,
    //   });
    // }
  }
}
</script>
