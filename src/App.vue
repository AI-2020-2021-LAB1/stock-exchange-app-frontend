<template>
  <v-app>
    <Navbar />
    <v-main>
      <router-view :key="$route.fullPath" />
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";

import Navbar from "./components/Navbar.vue";

@Component({
  components: { Navbar },
})
export default class App extends Vue {}
</script>
