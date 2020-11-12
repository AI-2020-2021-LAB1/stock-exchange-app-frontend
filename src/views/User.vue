<template>
  <v-row class="fill-height" align="center">
    <v-card-actions class="mr-auto ml-auto" justify="center">
      <UserInformation />
    </v-card-actions>
  </v-row>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import UserInformation from '../components/UserInformation.vue';

@Component({
  components: {
    UserInformation,
  },
})
export default class User extends Vue {}
</script>
