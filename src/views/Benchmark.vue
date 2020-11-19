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
          <v-form>
            <v-card-text class="pb-0">
              <v-row align="center" justify="center" class="mx-0">
                <v-col class="pa-0">
                  <v-text-field
                    outlined
                    hide-details
                    v-model.number="opCount"
                    label="liczba operacji"
                    color="primary"
                    type="number"
                  ></v-text-field>
                </v-col>
                <v-col class="py-0 pr-0">
                  <v-text-field
                    outlined
                    hide-details
                    v-model.number="opPrice"
                    label="kwota pojedynczej operacji"
                    color="primary"
                    type="number"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-checkbox
                    color="primary"
                    v-model="checkboxUser"
                    label="czy rejestrować nowego użytkownika?"
                  ></v-checkbox>
                </v-col>
              </v-row>
            </v-card-text>
            <v-card-actions class="pt-0">
              <v-spacer></v-spacer>
              <v-btn color="primary" type="submit">
                <span class="font-weight-bold">rozpocznij test</span>
                <v-icon right>mdi-database-check</v-icon>
              </v-btn>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-row>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class Register extends Vue {
  private data() {
    return {
      opCount: 1,
      opPrice: 100,
      checkboxUser: false,
    };
  }
}
</script>
