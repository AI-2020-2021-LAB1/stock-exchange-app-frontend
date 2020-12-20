<template>
  <v-row class="fill-height ma-1" align="center" justify="center">
    <v-col cols="12" md="10" lg="8" xl="6">
      <v-row no-gutters>
        <v-col class="pa-0" cols="12">
          <v-alert prominent :type="status.type">
            <v-row align="center">
              <v-col cols="12" sm="">{{ status.text }}</v-col>
              <v-col cols="12" sm="auto">
                <v-btn
                  outlined
                  :block="!$vuetify.breakpoint.smAndUp"
                  @click="getTestStatus()"
                >
                  <span>Odśwież</span>
                  <v-icon right>mdi-reload</v-icon>
                </v-btn>
              </v-col>
            </v-row>
            <v-progress-linear
              v-if="status.showProgress"
              color="secondary"
              class="rounded-xl"
              height="20"
              :value="status.progress"
              striped
            >
              <strong> {{ Math.ceil(status.progress) }}%</strong>
            </v-progress-linear>
          </v-alert>
        </v-col>
        <v-col class="pa-0" cols="12">
          <v-card class="elevation-12">
            <v-toolbar color="primary">
              <v-toolbar-title class="white--text font-weight-bold"
                >Konfiguracja</v-toolbar-title
              >
            </v-toolbar>
            <v-form @submit.prevent="startTest()">
              <v-card-text class="pb-0">
                <v-row align="center" justify="center" class="mx-0 mb-2">
                  <v-col class="pl-0 pr-1 py-0">
                    <v-menu
                      ref="startDatePickerRef"
                      v-model="startDatePicker"
                      :close-on-content-click="false"
                      :return-value.sync="startDate"
                      transition="scale-transition"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          v-model="startDate"
                          label="Wybierz datę"
                          prepend-icon="mdi-calendar-edit"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-if="startDatePicker"
                        v-model="startDate"
                        full-width
                        :min="new Date().toISOString()"
                        @click:date="$refs.startDatePickerRef.save(startDate)"
                      ></v-date-picker>
                    </v-menu>
                  </v-col>
                  <v-col class="pl-1 pr-0 py-0">
                    <v-menu
                      ref="startTimePickerRef"
                      v-model="startTimePicker"
                      :close-on-content-click="false"
                      :return-value.sync="timeTest"
                      transition="scale-transition"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          v-model="timeTest"
                          label="Wybierz godzinę"
                          prepend-icon="mdi-clock-time-four-outline"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-time-picker
                        v-model="timeTest"
                        class="mt-4"
                        format="24hr"
                        @click:minute="$refs.startTimePickerRef.save(timeTest)"
                      ></v-time-picker>
                    </v-menu>
                  </v-col>
                </v-row>
                <v-row align="center" justify="center" class="ma-0">
                  <v-col class="pa-1" cols="12" sm="6">
                    <v-select
                      outlined
                      :items="configurationsArray"
                      item-text="text"
                      item-value="value"
                      v-model="selectedConfiguration"
                      color="primary"
                      label="Wybierz konfiguracje"
                    ></v-select>
                  </v-col>
                  <v-col class="pa-1" cols="12" sm="6">
                    <v-text-field
                      outlined
                      v-model.number="numberOfIterations"
                      label="Wybierz liczbę iteracji"
                      color="primary"
                      type="number"
                      class="my-2"
                      :rules="[rules.integer]"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row align="center" justify="center" class="ma-0">
                  <v-col class="pa-1" cols="12" sm="6">
                    <v-text-field
                      outlined
                      v-model.number="numberOfStocks"
                      label="Wybierz liczbę akcji"
                      color="primary"
                      type="number"
                      class="my-2"
                      :rules="[rules.integer]"
                    ></v-text-field>
                  </v-col>
                  <v-col class="pa-1" cols="12" sm="6">
                    <v-text-field
                      outlined
                      v-model.number="numberOfUsers"
                      label="Wybierz liczbę użytkowników"
                      color="primary"
                      type="number"
                      class="my-2"
                      :rules="[rules.integer]"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-card-text>
              <v-card-actions class="pt-0">
                <v-row align="center" justify="center" class="ma-0">
                  <v-col class="pa-1" cols="12" sm="6">
                    <v-btn
                      block
                      link
                      to="/admin/benchmark/configurations"
                      color="primary"
                    >
                      <span class="font-weight-bold">Manager konfiguracji</span>
                      <v-icon right>mdi-database</v-icon>
                    </v-btn>
                  </v-col>
                  <v-col class="pa-1" cols="12" sm="6">
                    <v-btn
                      block
                      color="primary"
                      type="submit"
                      :disabled="
                        !selectedConfiguration > 0 ||
                        !numberOfIterations > 0 ||
                        !numberOfStocks > 0 ||
                        !numberOfUsers > 0
                      "
                    >
                      <span class="font-weight-bold">Zaplanuj test</span>
                      <v-icon right>mdi-database-check</v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
              </v-card-actions>
            </v-form>
          </v-card>
        </v-col>
        <v-col class="mt-4">
          <v-btn large block link to="/admin/benchmark/tests" class="primary">
            <span>Przejdź do historii testów</span>
            <v-icon right>mdi-chart-bar</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { formatTime, formatDateBenchmark } from '../helpers';
import { ConfigurationsService } from '../API/configurations';
import { TestsService } from '../API/tests';
import { Content } from '../models/ConfigurationModel';

@Component
export default class Benchmark extends Vue {
  private configurationsService!: ConfigurationsService;
  private testService!: TestsService;

  private beforeCreate() {
    this.configurationsService = new ConfigurationsService();
    this.testService = new TestsService();
  }

  private created() {
    this.getConfigurations({ page: 0 });
    this.getTestStatus();
  }

  private getConfigurations(params: object) {
    this.configurationsService
      .getConfigurations(params)
      .then((res) => {
        this.$data.configurations = res.data;
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

  private getTestStatus() {
    this.testService
      .getTestStatus()
      .then((res) => {
        this.$data.testStatus = res.data[0];
      })
      .catch((err) => {
        this.$data.testStatus = undefined;
        this.$store.dispatch('setSnackbarState', {
          state: true,
          msg: 'Error ' + err.response.status,
          color: 'error',
          timeout: 7500,
        });
      });
  }

  private startTest() {
    const dt = new Date(this.$data.startDate + ', ' + this.$data.timeTest);
    if (Date.now() >= dt.getTime()) {
      this.$store.dispatch('setSnackbarState', {
        state: true,
        msg: 'Wprowadzono nieprawidłową datę lub czas uruchomienia testu!',
        color: 'error',
        timeout: 7500,
      });
      return;
    }

    const body = {
      status: 'NEW',
      iterations: this.$data.numberOfIterations,
      startDate: dt.toISOString(),
      stockCount: this.$data.numberOfStocks,
      userCount: this.$data.numberOfUsers,
      configuration: {
        id: this.$data.selectedConfiguration,
      },
    };

    this.testService
      .startTest(body)
      .then(() => {
        this.$store.dispatch('setSnackbarState', {
          state: true,
          msg: 'Test został zaplanowany',
          color: 'success',
          timeout: 5000,
        });
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

  get configurationsArray(): Array<{ value: number; text: string }> {
    if (this.$data.configurations.content) {
      const arrayOfConfigurations: Content[] = this.$data.configurations
        .content;

      return arrayOfConfigurations.map((configuration: Content) => ({
        value: configuration.id,
        text: configuration.name,
      }));
    } else {
      return [];
    }
  }

  get status() {
    if (!this.$data.testStatus) {
      return {
        type: 'error',
        text: 'Brak danych o aktualnych testach',
        showProgress: false,
      };
    }

    let type;
    let text;
    let showProgress = false;
    const progress = this.$data.testStatus.progress * 100;
    const id = this.$data.testStatus.id;
    if (
      this.$data.testStatus.status === 'NEW' ||
      this.$data.testStatus.status === 'INIT'
    ) {
      type = 'info';
      if (this.$data.testStatus.status === 'NEW') {
        text = 'Test ' + id + ' niedługo się rozpocznie.';
      } else {
        text =
          'Uruchomiono test ' +
          id +
          '. Aktualnie trwa rejestracja użytkowników i tworzenie spółek.';
      }
    } else if (this.$data.testStatus.status === 'RUNNING') {
      type = 'warning';
      text =
        'Test ' + id + ' jest w trakcie. Poniżej możesz sprawdzić jego postęp.';
      showProgress = true;
    } else if (this.$data.testStatus.status === 'ERROR') {
      type = 'error';
      text = 'Test ' + id + ' zakończył się niepowodzeniem!';
    } else if (this.$data.testStatus.status === 'FINISHED') {
      type = 'success';
      text = 'Test ' + id + ' został zakończony.';
    }

    return {
      type,
      text,
      showProgress,
      progress,
    };
  }

  private data() {
    return {
      startDate: formatDateBenchmark(),
      timeTest: formatTime(),
      selectedConfiguration: 0,
      numberOfIterations: 0,
      numberOfStocks: 0,
      numberOfUsers: 0,
      startDatePicker: false,
      startTimePicker: false,
      selectConfiguration: null,
      configurations: [],
      testStatus: undefined,
      links: [
        {
          text: 'Edytor konfiguracji',
          link: '/admin/benchmark/configurations',
        },
        {
          text: 'Wyniki testów',
          link: '/admin/benchmark/charts',
        },
      ],
      rules: {
        integer: (value: number) =>
          !value.toString().includes('.') || 'Liczba musi być całkowita',
      },
    };
  }
}
</script>
