<template>
  <div>
    <p
      class="text-h6 white--text text-center font-weight-bold primary lighten-1 ma-0"
    >
      {{ title }}
    </p>
    <v-container class="pa-0">
      <v-data-table
        dense
        :headers="headers"
        :items="offers"
        :items-per-page="$vuetify.breakpoint.mdAndUp ? 100 : 10"
        :footer-props="footer"
      >
      </v-data-table>
    </v-container>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class TraderOffers extends Vue {
  @Prop({ required: true }) private title!: string;
  @Prop({ required: true }) private offers!: object[];

  get Offers() {
    return this.offers;
  }

  private data() {
    return {
      headers: [
        {
          text: 'Suma',
          value: 'sum',
        },
        {
          text: 'Ilość',
          value: 'amount',
        },
        {
          text: 'Cena',
          value: 'price',
        },
      ],
      footer: {
        'disable-items-per-page': true,
      },
    };
  }
}
</script>
