<template>
  <v-card class="mx-auto" max-width="300" tile>
    <v-text-field
      solo-inverted
      text
      clearable
      hide-details
      v-model="Search"
      color="primary"
      label="Wyszukaj użytkownika"
      prepend-inner-icon="mdi-database-search"
    ></v-text-field>
    <v-list dense class="pt-0">
      <v-subheader>Lista użytkowników</v-subheader>
      <v-list-item-group v-model="selectedItem" color="primary">
        <v-list-item
          v-for="user in users.content"
          :key="user.id"
          @click="stockClicked(user.id)"
        >
          <v-list-item-icon>
            <v-icon color="green">mdi-account-circle</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{
              user.firstName + ' ' + user.lastName
            }}</v-list-item-title>
            <v-list-item-subtitle>{{ user.email }} </v-list-item-subtitle>

            <v-list-item-subtitle>{{ user.money }} PLN</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>
    <v-pagination
      v-model="currentPage"
      :length="users.totalPages"
      @input="paginationClicked"
    ></v-pagination>
  </v-card>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class UsersList extends Vue {
  @Prop({ required: true }) private users!: object[];
  @Prop({ required: true }) private search!: string;

  get Users() {
    return this.users;
  }

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

  private userClicked(name: string) {
    this.$emit('selected', name);
  }

  private data() {
    return {
      selectedItem: null,
      currentPage: 1,
    };
  }
}
</script>
