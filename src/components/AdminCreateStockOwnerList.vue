<template>
  <v-card class="rounded-lg" tile>
    <v-card-title
      class="text-h5 font-weight-bold justify-center white--text primary py-1"
      >{{ title }}</v-card-title
    >
    <v-card-text class="pa-2">
      <div v-if="list.length > 0">
        <v-list v-for="obj in list" :key="obj.user.id">
          <v-row no-gutters align="center" justify="start">
            <v-col
              ><p class="my-auto text-center">Właściciel:</p>
              <p class="my-auto text-center font-weight-bold">
                {{ obj.user.firstName }} {{ obj.user.lastName }}
                {{ obj.user.email }}
              </p></v-col
            >
            <v-col
              ><p class="my-auto text-center">Ilość:</p>
              <p class="my-auto text-center font-weight-bold">
                {{ obj.amount }}
              </p></v-col
            >
            <v-col>
              <v-btn @click="removeClicked(obj.user.id)" color="error">
                <span class="font-weight-bold">Usuń</span>
                <v-icon right>mdi-account-remove</v-icon>
              </v-btn></v-col
            >
          </v-row>
        </v-list>
      </div>
      <v-alert type="error" class="ma-0" v-else>Brak właścicieli</v-alert>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { Users } from '@/models/UserModel';
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
@Component
export default class AdminCreateStockOwnerList extends Vue {
  @Prop({ required: true }) private title!: string;
  @Prop({ required: true }) private list!: object;

  private removeClicked(id: number) {
    this.$emit('remove', id);
  }
}
</script>