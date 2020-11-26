<template>
  <v-row no-gutters>
    <v-col>
      <v-card class="rounded-0">
        <v-card-title
          class="text-h6 white--text justify-center font-weight-bold primary pa-0"
          >{{ title }}</v-card-title
        >
        <v-card-text class="pa-0">
          <v-data-table
            dense
            :headers="headers"
            :items="offers"
            :items-per-page="$vuetify.breakpoint.mdAndUp ? 20 : 10"
            :footer-props="footer"
          >
            <template v-slot:[`item.sum`]="{ item }">
              <div :class="colorClass" class="font-weight-bold">
                {{ item.sum }}
              </div>
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class TraderOffers extends Vue {
  @Prop({ required: true }) private title!: string;
  @Prop({ required: true }) private offers!: object[];
  @Prop({ required: true }) private colorClass!: string;

  get Offers() {
    return this.offers;
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
      ],
      footer: {
        'disable-items-per-page': true,
      },
    };
  }
}
</script>
