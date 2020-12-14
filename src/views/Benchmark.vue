<template>
  <v-row class="fill-height" align="center">
    <v-col cols="12" class="pa-0">
      <v-row justify="center" class="mx-2">
        <v-card class="elevation-12 ma-2" width="600">
          <v-toolbar color="primary">
            <v-toolbar-title class="white--text font-weight-bold"
              >Konfiguracja</v-toolbar-title
            >
          </v-toolbar>
          <v-form @submit.prevent="startTest()">
            <v-card-text class="pb-0">
              <v-row align="center" justify="center" class="mx-0 my-4">
                <v-col class="pa-0">
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
                        hide-details
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
                <v-col class="py-0 pr-0">
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
                        label="Wybierz Godzine"
                        prepend-icon="mdi-clock-time-four-outline"
                        readonly
                        hide-details
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
              <v-row align="center" justify="center" class="mx-0">
                <v-col class="pa-0">
                  <v-select
                    outlined
                    :items="configurationsArray"
                    item-text="text"
                    item-value="value"
                    v-model="selectedConfiguration"
                    color="primary"
                    hide-details
                    label="Wybierz konfiguracje"
                  ></v-select>
                </v-col>
                <v-col class="py-0 pr-0">
                  <v-text-field
                    outlined
                    hide-details
                    v-model.number="numberOfIterations"
                    label="Wybierz liczbę iteracji"
                    color="primary"
                    type="number"
                    class="my-2"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row align="center" justify="center" class="mx-0">
                <v-col class="pa-0">
                  <v-text-field
                    outlined
                    hide-details
                    v-model.number="numberOfStocks"
                    label="Wybierz liczbę akcji"
                    color="primary"
                    type="number"
                    class="my-2"
                  ></v-text-field>
                </v-col>
                <v-col class="py-0 pr-0">
                  <v-text-field
                    outlined
                    hide-details
                    v-model.number="numberOfUsers"
                    label="Wybierz liczbę użytkowników"
                    color="primary"
                    type="number"
                    class="my-2"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row> </v-row>
            </v-card-text>
            <v-card-actions class="pt-0">
              <v-spacer></v-spacer>
              <v-btn color="primary" type="submit">
                <span class="font-weight-bold">rozpocznij test</span>
                <v-icon right>mdi-database-check</v-icon>
              </v-btn>
            </v-card-actions>
          </v-form>
        </v-card>
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
    this.getConfigurations();
  }

  private getConfigurations() {
    this.configurationsService
      .getConfigurations()
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

  private startTest() {
    const dataConfiguration = `${this.$data.startDate}T${this.$data.timeTest}:00.766Z`;
    const configurationObject = this.$data.configurations.content.find(
      (item: Content) => item.id === this.$data.selectedConfiguration,
    );

    const body = {
      configuration: configurationObject,
      iterations: this.$data.numberOfIterations,
      startDate: dataConfiguration,
      stockCount: this.$data.numberOfStocks,
      userCount: this.$data.numberOfUsers,
    };

    this.testService
      .startTest(body)
      .then(() => {
        this.$store.dispatch('setSnackbarState', {
          state: true,
          msg: 'Test został uruchomiony',
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
    };
  }
}
</script>
