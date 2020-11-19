<template>
  <v-row class="fill-height" align="center">
    <v-col cols="12" class="pa-0">
      <v-row justify="center" class="mx-2">
        <v-card class="elevation-12 ma-2" width="600">
          <v-toolbar color="primary">
            <v-toolbar-title class="white--text font-weight-bold"
              >Konfiguracja</v-toolbar-title
            >
          </v-toolbar>
          <v-form v-model="inputValidated" @submit.prevent="registerUser()">
            <v-card-text class="pb-0">
              <v-text-field></v-text-field>
              <v-row align="center" justify="center" class="mx-0">
                <v-col class="pa-0">
                  <v-text-field></v-text-field>
                </v-col>
                <v-col class="py-0 pr-0">
                  <v-text-field></v-text-field>
                </v-col>
              </v-row>
              <v-row align="center" justify="center" class="mx-0">
                <v-col class="pa-0">
                  <v-text-field></v-text-field>
                </v-col>
                <v-col class="py-0 pr-0">
                  <v-text-field></v-text-field>
                </v-col>
              </v-row>
              <div v-if="passwdFocus">
                <password-validator></password-validator>
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
    </v-col>
  </v-row>
</template>
