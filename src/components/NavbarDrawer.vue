<template>
  <v-navigation-drawer app left disable-resize-watcher width="300px">
    <v-toolbar text dark class="px-3" height="64px">
      <v-btn large block text outlined @click="close">
        Zamknij
        <v-icon large>mdi-close</v-icon>
      </v-btn>
    </v-toolbar>
  </v-navigation-drawer>
</template>

<script>
export default {
  methods: {
    close() {
      this.$emit('close');
    }
  }
  
}
</script>
