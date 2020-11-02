<template>
  <v-container class="py-0">
    <v-row no-gutters>
      <v-col
        
        v-for="n in 3"
        :key="n"
        cols="12"
        sm="4"
      >
        <v-card
          class="pa-2"
          outlined
          tile
        >
          One of three columns
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class TraderOffers extends Vue {
  private data() {
    return {};
  }
}
</script>
