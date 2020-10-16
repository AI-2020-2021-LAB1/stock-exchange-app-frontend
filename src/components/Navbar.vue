<template>
  <div>
    <v-app-bar dark app hide-on-scroll>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
    </v-app-bar>
    <NavbarDrawer v-if="drawer" @close="drawer = false"></NavbarDrawer>
  </div>
</template>

<script>
import NavbarDrawer from "./NavbarDrawer";
export default {
  components: {
    NavbarDrawer,
  },

  data() {
    return {
      drawer: false,
    };
  },
};
</script>
