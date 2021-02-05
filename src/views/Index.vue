<template>
  <div>
    <p class="text-center ma-5">
      Strona główna aplikacji do handlowania akcjami, w ramach projektu z
      przedmiotu Aplikacje Internetowe<br />Opiekun: dr. inż. Tomasz Rak
    </p>
    <div class="text-center">
      <div v-if="!auth">
        <v-btn color="primary" class="ma-1" to="/trader">Giełda</v-btn>
        <v-btn color="primary" class="ma-1" to="/login" v-if="!auth">Login</v-btn>
        <v-btn color="primary" class="ma-1" to="/register" v-if="!auth">Rejestracja</v-btn>
      </div>
      <div v-if="auth && user.role === 'USER'">
        <v-btn color="primary" class="ma-1" to="/trader">Giełda</v-btn>
        <v-btn color="primary" class="ma-1" to="/user">Panel użytkownika</v-btn>
      </div>
      <div v-if="auth && user.role === 'ADMIN'">
        <v-btn color="primary" class="ma-1" to="/trader">Giełda</v-btn>
        <v-btn color="primary" class="ma-1" to="/admin/users">Zarządzanie użytkownikami</v-btn>
        <v-btn color="primary" class="ma-1" to="/admin/stocks">Zarządzanie akcjami</v-btn>
        <v-btn color="primary" class="ma-1" to="/admin/tags">Zarządzanie tagami</v-btn>
        <v-btn color="primary" class="ma-1" to="/admin/benchmark">Panel benchmarka</v-btn>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
import { Component } from 'vue-property-decorator';

@Component
export default class IndexHomePage extends Vue {
  get auth(): boolean {
    return this.$store.getters.isAuthenticated;
  }

  get user() {
    return this.$store.getters.user;
  }
}
</script>
