<template>
  <v-snackbar
    v-model="snackbar"
    :color="$store.getters.snackbarColor"
    multi-line
    :timeout="$store.getters.snackbarTimeout"
  >
    <v-row align="center" class="mx-0">
      <v-col class="pa-0">
        <p class="text-body-1 my-auto pr-2">{{ $store.getters.snackbarMsg }}</p>
      </v-col>
      <v-col cols="auto" class="pa-0">
        <v-btn outlined fab x-small @click="snackbar = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-col>
    </v-row>
  </v-snackbar>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component } from 'vue-property-decorator';

@Component
export default class Snackbar extends Vue {
  get snackbar(): boolean {
    return this.$store.getters.snackbarState;
  }
  set snackbar(value: boolean) {
    this.$store.dispatch('setSnackbarState', value);
  }
}
</script>