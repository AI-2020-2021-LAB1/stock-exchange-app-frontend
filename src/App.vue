<template>
  <v-app>
    <Navbar />
    <v-main>
      <router-view :key="$route.fullPath" />
    </v-main>
    <Snackbar />
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component } from 'vue-property-decorator';

import Navbar from './components/Navbar.vue';
import Snackbar from './components/Snackbar.vue';

@Component({
  components: { Navbar, Snackbar },
})
export default class App extends Vue {}
</script>
