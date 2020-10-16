<template>
  <v-app>
    <Navbar />
    <v-main>
      <router-view :key="$route.fullPath" />
    </v-main>
  </v-app>
</template>

<script>
import Navbar from '@/components/Navbar.vue';

export default {
  name: 'App',
  components: {
    Navbar
  },

  data: () => ({
    //
  }),
};
</script>
