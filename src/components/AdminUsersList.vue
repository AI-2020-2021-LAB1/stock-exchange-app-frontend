<template>
  <v-card class="rounded-lg mx-auto mx-2" tile>
    <v-card-title
      class="text-h5 font-weight-bold justify-center white--text primary py-1"
      >Lista użytkowników</v-card-title
    >
    <v-card-text class="pt-2 pb-0">
      <v-text-field
        solo-inverted
        text
        clearable
        hide-details
        v-model="Search"
        color="primary"
        label="Wyszukaj użytkowników po e-mailu"
        prepend-inner-icon="mdi-database-search"
      ></v-text-field>
      <v-expansion-panels class="mt-4">
        <v-expansion-panel v-for="user in users.content" :key="user.id">
          <v-expansion-panel-header hide-actions>
            <v-row no-gutters align="center" justify="start">
              <v-col cols="auto">
                <v-icon large class="primary--text">mdi-account</v-icon>
              </v-col>
              <v-col>
                <v-row no-gutters>
                  <v-col
                    v-for="el in userElems"
                    :key="el.text"
                    cols="auto"
                    class="pa-3"
                  >
                    <p class="mt-auto font-weight-bold text-center mb-1">
                      {{ el.text }}
                    </p>
                    <p class="my-auto text-center">{{ user[el.value] }}</p>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-divider></v-divider
          ></v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
      <v-pagination
        v-model="currentPage"
        :length="users.totalPages"
        @input="paginationClicked"
      ></v-pagination>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { Users } from '@/models/UserModel';
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

@Component
export default class AdminUsersList extends Vue {
  @Prop({ required: true }) private users!: Users;
  @Prop({ required: true }) private search!: string;

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

  private data() {
    return {
      currentPage: 1,
      userElems: [
        {
          text: 'Imie',
          value: 'firstName',
        },
        {
          text: 'Nazwisko',
          value: 'lastName',
        },
        {
          text: 'E-mail',
          value: 'email',
        },
        {
          text: 'Posiadane środki',
          value: 'money',
        },
        {
          text: 'Tag',
          value: 'tag',
        },
        {
          text: 'Konto aktywne?',
          value: 'isActive',
        },
      ],
    };
  }
}
</script>
