<template>
  <div>
    <p class="text-h6 white--text text-center font-weight-bold primary ma-0">
      {{ title }}
    </p>
    <v-container class="pa-0">
      <v-data-table
        dense
        :headers="headers"
        :items="transactions"
        :items-per-page="$vuetify.breakpoint.mdAndUp ? 20 : 10"
        :footer-props="footer"
      >
        <template v-slot:[`item.sum`]="{ item }">
          <div 
          :class="colorClass ? colorClass 
          : item.type === 'sprzedaży' ? 'error--text' : 'success--text'" 
          class="font-weight-bold">
          {{ item.sum }}
          </div>
        </template>
        <template v-slot:[`item.type`]="{ item }">
          <div 
          :class="colorClass ? colorClass 
          : item.type === 'sprzedaży' ? 'error--text' : 'success--text'" 
          class="font-weight-bold">
          {{ item.type }}
          </div>
        </template>
        <template v-slot:[`item.cancel`]="{ item }">
          <div>
            <v-btn small color="error">
              <span>{{ item.cancel }}</span>
              <v-icon right>mdi-cancel</v-icon>
            </v-btn>
          </div>
        </template>
      </v-data-table>
    </v-container>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class UserTransactions extends Vue {
  @Prop({ required: true }) private title!: string;
  @Prop({ required: true }) private transactions!: object[];
  @Prop({ required: true }) private headers!: object[];
  @Prop({}) private colorClass!: string;

  get Transactions() {
    return this.transactions;
  }

  private data() {
    return {
      footer: {
        'disable-items-per-page': true,
      },
    };
  }
}
</script>
