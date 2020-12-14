<template>
  <v-row align="center" style="height: 100%;">
    <v-col cols="12">
      <v-img width="1000px" class="mx-auto" :src="require('../assets/notstonks.jpg')"></v-img>
      <p class="text-h2 text-center font-weight-bold mt-2">Strona nie istnieje!</p>
      <v-row align="center" justify="space-around" class="my-5">
        <v-btn class="primary my-2" router :to="{name: 'home'}">
          <v-icon left>mdi-home</v-icon>
          <span>Powrót na stronę główną</span>
        </v-btn>
        <v-btn v-if="$router.history.length > 0" class="primary my-2" @click="$router.go(-1);">
          <v-icon left>mdi-keyboard-return</v-icon>
          <span>Powrót na poprzednią stronę</span>
        </v-btn>
      </v-row>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator';
import Vue from 'vue';

@Component
export default class Page404 extends Vue {}
</script>
