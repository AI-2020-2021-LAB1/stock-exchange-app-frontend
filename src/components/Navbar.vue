<template>
  <div>
    <v-app-bar dark app hide-on-scroll>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-items v-if="$vuetify.breakpoint.mdAndUp">
        <v-btn
          text
          v-for="item in toolbarItems"
          :key="item.link"
          :to="item.link"
          >{{ item.title }}</v-btn
        >
      </v-toolbar-items>
      <v-toolbar-title v-else>Giełda-Bench</v-toolbar-title>
      <v-spacer />
      <v-toolbar-items v-if="$vuetify.breakpoint.mdAndUp">
        <v-btn text to="/login" v-if="!auth">Login</v-btn>
        <v-btn text to="/register" v-if="!auth">Rejestracja</v-btn>
        <v-btn text to="/user" v-if="auth && user.role === 'USER'"
          >Panel użytkownika</v-btn
        >
        <v-btn text @click="logout" v-if="auth">Wyloguj</v-btn>
      </v-toolbar-items>
    </v-app-bar>
    <nav-drawer :items="toolbarItems" :auth="auth" @logout="logout" />
  </div>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator';
import NavDrawer from './NavbarDrawer.vue';
import store from '../store';
import Vue from 'vue';

@Component({
  components: {
    NavDrawer,
  },
})
export default class Navbar extends Vue {
  private toolbarItems = [
    { link: '/', title: 'Strona główna', icon: 'mdi-home' },
    { link: '/trader', title: 'Giełda', icon: 'mdi-finance' },
  ];

  get drawer(): boolean {
    return this.$store.getters.navDrawer;
  }
  set drawer(value: boolean) {
    this.$store.dispatch('setNavDrawerState', value);
  }

  get auth(): boolean {
    return this.$store.getters.isAuthenticated;
  }

  get user() {
    return this.$store.getters.user;
  }

  private logout() {
    this.$store.dispatch('logout');
  }
}
</script>
