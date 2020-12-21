<template>
  <div>
    <div class="ma-2">
      <v-btn large block link to="/admin/benchmark" class="primary">
        <span>Przejdź do panelu benchmarka</span>
      </v-btn>
    </div>
    <tests-table
      title="Lista testów"
      :tests="tests"
      :headers="headersTests"
      :totalPages="totalPages"
      @pagination="paginationClicked($event)"
      class="ma-2"
    ></tests-table>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import TestsTable from '../components/TestsTable.vue';
import { TestsService } from '../API/tests';
import { formatNumericDate } from '../helpers';

@Component({
  components: {
    TestsTable,
  },
})
export default class BenchmarkTests extends Vue {
  private testsService!: TestsService;

  public _formatNumericDate(date: number) {
    return formatNumericDate(date);
  }

  private beforeCreate() {
    this.testsService = new TestsService();
  }

  private created() {
    this.getTests({
      page: 0,
      size: this.$data.pageSize,
    });
  }

  private paginationClicked(pageNumber: number) {
    this.getTests({
      page: pageNumber - 1,
      size: this.$data.pageSize,
    });
  }

  private getTests(params: object) {
    this.testsService
      .getTests(params)
      .then((res) => {
        this.$data.tests = [];
        this.$data.totalPages = res.data.totalPages;
        for (const test of res.data.content) {
          this.$data.tests.push({
            id: test.id,
            startDate: this._formatNumericDate(test.startDate * 1000),
            configuration: test.configuration.name,
            userCount: test.userCount,
            stockCount: test.stockCount,
            iterations: test.iterations,
            status: test.status,
            goToCharts: 'Pokaż wykresy',
          });
        }
      })
      .catch((err) => {
        this.$store.dispatch('setSnackbarState', {
          state: true,
          msg: 'Error ' + err.response.status,
          color: 'error',
          timeout: 7500,
        });
      });
  }

  private data() {
    return {
      tests: [],
      totalPages: 1,
      pageSize: 20,
      headersTests: [
        {
          text: 'Id',
          value: 'id',
          class: 'primary--text',
        },
        {
          text: 'Data rozpoczęcia',
          value: 'startDate',
          class: 'primary--text',
        },
        {
          text: 'Konfiguracja',
          value: 'configuration',
          class: 'primary--text',
        },
        {
          text: 'Liczba użytkowników',
          value: 'userCount',
          class: 'primary--text',
        },
        {
          text: 'Liczba akcji',
          value: 'stockCount',
          class: 'primary--text',
        },
        {
          text: 'Iteracje',
          value: 'iterations',
          class: 'primary--text',
        },
        {
          text: 'Status',
          value: 'status',
          class: 'primary--text',
        },
        {
          text: 'Wykresy',
          value: 'goToCharts',
          class: 'primary--text',
        },
      ],
    };
  }
}
</script>
