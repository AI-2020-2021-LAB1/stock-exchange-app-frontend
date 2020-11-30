<template>
  <v-card class="rounded-lg mx-auto mx-2" tile>
    <v-card-title
      class="text-h5 font-weight-bold justify-center white--text primary py-1"
      >{{ title }}</v-card-title
    >
    <v-card-text class="pt-2 pb-0">
      <v-text-field
        solo-inverted
        text
        clearable
        hide-details
        v-model="Search"
        color="primary"
        :label="searchLabel"
        prepend-inner-icon="mdi-database-search"
      ></v-text-field>
      <v-expansion-panels class="mt-4" v-model="openedPanel">
        <v-expansion-panel v-for="obj in list.content" :key="obj.id">
          <v-expansion-panel-header hide-actions>
            <v-row no-gutters align="center" justify="start">
              <v-col cols="auto" v-if="objIcon">
                <v-icon large class="primary--text">{{ objIcon }}</v-icon>
              </v-col>
              <v-col>
                <v-row no-gutters>
                  <v-col
                    v-for="el in listElements"
                    :key="el.text"
                    cols="auto"
                    class="pa-3"
                  >
                    <p class="mt-auto font-weight-bold text-center mb-1">
                      {{ el.text }}
                    </p>
                    <p class="my-auto text-center">{{ obj[el.value] }}</p>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-divider></v-divider>
            <slot></slot>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
      <v-pagination
        v-model="currentPage"
        :length="list.totalPages"
        @input="paginationClicked"
      ></v-pagination>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { Users } from '@/models/UserModel';
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

@Component
export default class DetailedList extends Vue {
  @Prop({ required: true }) private title!: string;
  @Prop({ required: true }) private list!: object;
  @Prop({ required: true }) private listElements!: object[];
  @Prop({ required: true }) private search!: string;
  @Prop({ default: 'Wyszukaj' }) private searchLabel!: string;
  @Prop({ default: undefined }) private objIcon!: string;

  get Search() {
    return this.search;
  }

  set Search(val: string) {
    this.$emit('search', val);
    this.$data.currentPage = 1;
  }

  private paginationClicked(page: number) {
    this.$emit('pagination', page);
  }

  @Watch('openedPanel')
  private openPanel(val: number) {
    if (val !== undefined) {
      this.$emit('panelChanged', val);
    }
  }

  private data() {
    return {
      currentPage: 1,
      openedPanel: undefined,
    };
  }
}
</script>
