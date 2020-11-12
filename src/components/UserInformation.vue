<template>
  <div>
    <v-row>
      <v-card-text class="pb-0">
        <v-icon x-large color="primary">{{ 'mdi-account-circle' }}</v-icon>
      </v-card-text>
      <v-card-text class="pb-0">
        <p>Witaj, XYXZ XYZ</p>
      </v-card-text>
    </v-row>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import Axios from 'axios';

@Component
export default class UserInformation extends Vue {}
</script>
