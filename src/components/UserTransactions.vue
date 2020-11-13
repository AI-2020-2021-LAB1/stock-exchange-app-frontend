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
          <div :class="colorClass" class="font-weight-bold">{{ item.sum }}</div>
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
  @Prop({ required: true }) private colorClass!: string;

  get Transactions() {
    return this.transactions;
  }

  private data() {
    return {
      headers: [
        {
          text: 'Suma',
          value: 'sum',
          class: this.colorClass,
        },
        {
          text: 'Ilość',
          value: 'amount',
          class: this.colorClass,
        },
        {
          text: 'Cena',
          value: 'price',
          class: this.colorClass,
        },
        {
          text: 'Spółka',
          value: 'stock',
          class: this.colorClass,
        },
        {
          text: 'Data stw.',
          value: 'dateCreated',
          class: this.colorClass,
        },
        {
          text: 'Data wyg.',
          value: 'dateExpiring',
          class: this.colorClass,
        },
        {
          text: 'Anulacja',
          value: 'cancel',
          class: this.colorClass,
        },
      ],
      footer: {
        'disable-items-per-page': true,
      },
    };
  }
}
</script>
