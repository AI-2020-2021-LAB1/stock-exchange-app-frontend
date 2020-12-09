<template>
  <v-card outlined class="rounded-lg">
    <v-card-title class="text-h4 white--text justify-center font-weight-bold primary pa-0">Lista tagów</v-card-title>
    <v-card-text class="pt-2 pb-0">
      <v-text-field
        solo-inverted
        text
        clearable
        hide-details
        v-model="Search"
        color="primary"
        label="Wyszukaj tag po nazwie"
        prepend-inner-icon="mdi-database-search"
      ></v-text-field>
      <v-row class="fill-height" align="center" justify="center">
        <v-col
          cols="12"
          sm="6"
          lg="4"
          xl="3"
          v-for="el in list.content"
          :key="el.id"
        >
          <v-hover>
            <template v-slot:default="{ hover }">
              <v-card height="auto">
                <v-row class="fill-height" align="center" justify="center">
                  <v-col cols="auto">
                    <v-icon x-large class="primary--text">mdi-tag</v-icon>
                  </v-col>
                  <v-col cols="auto">
                    <v-card-title
                      class="text-h4 font-weight-thin justify-center"
                      >{{ el.name }}</v-card-title
                    >
                  </v-col>
                </v-row>
                <v-fade-transition>
                  <v-overlay
                    v-if="hover"
                    absolute
                    color="error"
                    opacity="0.8"
                    @click.native="removeClicked(el.name)"
                    style="cursor: pointer"
                  >
                    <v-row
                      no-gutters
                      class="fill-height"
                      align="center"
                      justify="center"
                    >
                      <v-col cols="auto">
                        <v-icon x-large class="white--text pa-0 ma-0"
                          >mdi-delete</v-icon
                        >
                      </v-col>
                    </v-row>
                  </v-overlay>
                </v-fade-transition>
              </v-card>
            </template>
          </v-hover>
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-pagination
        v-model="currentPage"
        :length="list.totalPages"
        @input="paginationClicked"
      ></v-pagination>
      <v-spacer></v-spacer>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { Users } from '@/models/UserModel';
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

@Component
export default class AdminTagsList extends Vue {
  @Prop({ required: true }) private list!: object;
  @Prop({ required: true }) private search!: string;

  get Search() {
    return this.search;
  }

  set Search(val: string) {
    this.$emit('search', val);
    this.$data.currentPage = 1;
  }

  private removeClicked(name: string) {
    this.$emit('remove', name);
  }

  private paginationClicked(page: number) {
    this.$emit('pagination', page);
  }

  private data() {
    return {
      currentPage: 1,
    };
  }
}
</script>
