<template>
  <v-navigation-drawer
    app
    left
    disable-resize-watcher
    v-model="drawer"
    width="300px"
  >
    <v-toolbar text dark class="px-3" height="64px">
      <v-btn large block text outlined @click="drawer = !drawer">
        <v-icon left> mdi-close </v-icon>
        <span>Zamknij</span>
      </v-btn>
    </v-toolbar>

    <v-list subheader shaped>
      <v-subheader>Użytkownik</v-subheader>
      <v-list-item router @click="drawer = !drawer" to="/login" v-if="!auth">
        <v-list-item-action>
          <v-icon large class="primary--text">mdi-login</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>Login</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item router @click="drawer = !drawer" to="/register" v-if="!auth">
        <v-list-item-action>
          <v-icon large class="primary--text">mdi-database-plus</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>Rejestracja</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
@Component
export default class NavbarDrawer extends Vue {
  @Prop({ type: Array }) public readonly items!: object[];
  @Prop() public readonly auth!: boolean;
  get drawer(): boolean {
    return this.$store.getters.navDrawer;
  }

  set drawer(value: boolean) {
    this.$store.dispatch('setNavDrawerState', value);
  }

  // get user() {
  //   return this.$store.getters.user;
  // }

  // private logout() {
  //   this.$emit('logout');
  // }
}
</script>
