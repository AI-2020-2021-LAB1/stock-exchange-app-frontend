<template>
  <v-card class="rounded-lg" tile>
    <v-card-title
      class="text-h5 font-weight-bold justify-center white--text primary py-1"
      >{{ title }}</v-card-title
    >
    <v-card-text class="pa-2">
      <div v-if="list.length > 0">
        <v-list v-for="obj in list" :key="obj.user.id">
          <v-row align="center">
            <v-col>
              <p class="my-auto text-center">Właściciel:</p>
              <p class="my-auto text-center font-weight-bold">
                {{ obj.user.firstName }} {{ obj.user.lastName }}
                {{ obj.user.email }}
              </p>
            </v-col>
            <v-col>
              <v-text-field
                dense
                outlined
                v-model.number="obj.amount"
                :rules="[minValue(obj.amount, 1)]"
                label="Ilość akcji"
                color="primary"
                type="number"
              ></v-text-field>
            </v-col>
            <v-col>
              <v-btn @click="removeClicked(obj.user.id)" color="error">
                <span class="font-weight-bold">Usuń</span>
                <v-icon right>mdi-account-remove</v-icon>
              </v-btn></v-col
            >
          </v-row>
          <v-divider></v-divider>
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
  @Prop({ required: true }) private value!: object;

  get list() {
    return this.value;
  }

  set list(data: any) {
    this.$emit('input', data);
  }

  private removeClicked(id: number) {
    this.$emit('remove', id);
  }

  private data() {
    return {
      minValue: (value: number, min: number) =>
        value >= min || 'Minimalna wartość to ' + min,
    };
  }
}
</script>