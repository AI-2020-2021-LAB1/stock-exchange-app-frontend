<template>
  <v-card class="rounded-lg mx-auto mx-2" tile>
    <v-card-title
      class="text-h5 font-weight-bold justify-center white--text primary py-1"
      >{{ title }}</v-card-title
    >
    <v-card-text class="pt-2 pb-0"
      ><v-text-field
        class="pt-2 pb-2"
        prepend-inner-icon="mdi-link-variant-plus"
        solo-inverted
        text
        clearable
        label="Dodaj tag"
        hide-details
      ></v-text-field>
      <v-btn block color="primary">
        <v-icon left>mdi-link-variant-plus</v-icon>
        <span>Dodaj tag</span>
      </v-btn>
    </v-card-text>
    <v-card-text class="pt-12 pb-0">
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

      <v-list v-for="obj in list.content" :key="obj.id">
        <v-row no-gutters align="center" justify="start">
          <v-col cols="auto" v-if="objIcon">
            <v-icon large class="primary--text">{{ objIcon }}</v-icon>
          </v-col>
          <v-row
            v-for="el in listElements"
            :key="el.text"
            cols="auto"
            class="pa-3"
          >
            <v-col
              ><p class="my-auto text-center ">Tag:</p>
              <p class="my-auto text-center font-weight-bold">
                {{ obj[el.value] }}
              </p></v-col
            >
            <v-col>
              <v-btn @click="removeClicked(obj[el.value])" color="error">
                <span class="font-weight-bold">Usuń</span>
                <v-icon right>mdi-database-minus</v-icon>
              </v-btn></v-col
            >
          </v-row>
          <v-col> </v-col>
        </v-row>
      </v-list>
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

  private removeClicked(name: string) {
    this.$emit('remove', { name });
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
