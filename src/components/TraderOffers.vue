<template>
  <div>
    <p class="text-h6 white--text text-center font-weight-bold primary ma-0">
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
        <template v-slot:[`item.sum`]="{ item }">
          <div
            :class="colorClass"
            :style="{ fontWeight: 'bold' }"
          >
            {{ item.sum }}
          </div>
        </template>
      </v-data-table>
    </v-container>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

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
          text: "Suma",
          value: "sum",
          class: this.colorClass,
        },
        {
          text: "Ilość",
          value: "amount",
          class: this.colorClass,
        },
        {
          text: "Cena",
          value: "price",
          class: this.colorClass,
        },
      ],
      footer: {
        "disable-items-per-page": true,
      },
    };
  }
}
</script>
