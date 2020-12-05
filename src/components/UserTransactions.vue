<template>
  <v-card class="rounded-lg">
    <v-card-title
      class="text-h5 font-weight-bold justify-center white--text primary py-1"
      >{{ title }}</v-card-title
    >
    <v-card-text class="pb-0">
      <v-data-table
        dense
        :headers="headers"
        :items="transactions"
        :items-per-page="20"
        hide-default-footer
      >
        <template v-slot:[`item.sum`]="{ item }">
          <div
            :class="
              colorClass
                ? colorClass
                : item.type === 'sprzedaży'
                ? 'error--text'
                : 'success--text'
            "
            class="font-weight-bold"
          >
            {{ item.sum }}
          </div>
        </template>
        <template v-slot:[`item.type`]="{ item }">
          <div
            :class="
              colorClass
                ? colorClass
                : item.type === 'sprzedaży'
                ? 'error--text'
                : 'success--text'
            "
            class="font-weight-bold"
          >
            {{ item.type }}
          </div>
        </template>
        <template v-slot:[`item.cancel`]="{ item }">
          <div>
            <v-btn
              small
              depressed
              fab
              color="error"
              @click="cancelOrder(item.id)"
            >
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </div>
        </template>
        <template v-slot:footer>
          <div>
            <v-pagination
              v-model="currentPage"
              :length="totalPages"
              @input="paginationClicked"
            ></v-pagination>
          </div>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

@Component
export default class UserTransactions extends Vue {
  @Prop({ required: true }) private title!: string;
  @Prop({ required: true }) private transactions!: object[];
  @Prop({ required: true }) private headers!: object[];
  @Prop({ required: true }) private paginationEnum!: number;
  @Prop({ required: true }) private totalPages!: number;
  @Prop() private colorClass!: string;

  get Transactions() {
    return this.transactions;
  }

  private paginationClicked(page: number) {
    this.$emit('paginationByEnum', {
      page,
      paginationEnum: this.paginationEnum,
    });
  }

  private data() {
    return {
      currentPage: 1,
    };
  }

  private cancelOrder(id: number) {
    this.$emit('cancelOrder', id);
    this.$data.currentPage = 1;
  }
}
</script>
