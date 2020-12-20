<template>
  <v-card class="rounded-lg">
    <v-card-title
      class="text-h5 font-weight-bold justify-center white--text primary py-1"
       style="word-break: break-word;">{{ title }}</v-card-title
    >
    <v-card-text class="pb-0">
      <v-data-table
        dense
        :headers="headers"
        :items="tests"
        :items-per-page="20"
        hide-default-footer
      >
        <template v-slot:[`item.goToCharts`]="{ item }">
          <div>
            <v-btn
              color="primary"
              @click="showResults(item.id)"
            >
              {{item.goToCharts}}
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
  @Prop({ required: true }) private tests!: object[];
  @Prop({ required: true }) private headers!: object[];
  @Prop({ required: true }) private totalPages!: number;

  get Tests() {
    return this.tests;
  }

  private paginationClicked(page: number) {
    this.$emit('pagination', page);
  }

  private data() {
    return {
      currentPage: 1,
    };
  }

  private showResults(id: number) {
    this.$router.push('/admin/benchmark/test/' + id + '/result');
  }
}
</script>
