<template>
  <v-autocomplete
    v-model="selected"
    :items="users"
    :clearable="clearable"
    chips
    hide-selected
    :hide-details="!rules"
    :rules="rules ? [required] : []"
    :label="label"
    item-text="text"
    item-value="value"
    prepend-icon="mdi-account-search"
    :multiple="multiple"
    :search-input.sync="Search"
  >
    <template v-slot:selection="data">
      <v-chip small close @click:close="remove(data.item)">{{
        data.item.text
      }}</v-chip>
    </template>
    <template v-slot:item="data">
      <v-list-item-content>
        <v-list-item-title>{{ data.item.text }}</v-list-item-title>
      </v-list-item-content>
    </template>
    <template v-slot:no-data>
      <v-alert type="info" class="mx-2 my-0">Brak wyników!</v-alert>
    </template>
  </v-autocomplete>
</template>

<script lang="ts">
import { Component, Prop, Watch, Vue } from 'vue-property-decorator';

@Component
export default class UserSelector extends Vue {
  @Prop({ default: '' }) public readonly label!: string;
  @Prop({ required: true }) public readonly value!: any;
  @Prop({ required: true }) public readonly search!: string;
  @Prop({ required: true }) public readonly users!: any[];
  @Prop({ default: false }) public readonly rules!: any;
  @Prop({ default: false }) public readonly multiple!: boolean;
  @Prop({ default: false }) public readonly clearable!: boolean;

  get selected() {
    return this.value;
  }

  set selected(data: any) {
    this.$emit('input', data);
  }

  get Search() {
    return this.search;
  }

  set Search(val: string) {
    this.$emit('search', val);
  }

  private remove(item: any) {
    if (this.multiple) {
      const index = this.selected.indexOf(item.value);
      if (index >= 0) {
        this.selected.splice(index, 1);
      }
    } else {
      this.selected = undefined;
    }
  }

  private data() {
    return {
      required: (value: any) => {
        if (this.multiple) {
          return value.length > 0 || 'Pole wymagane';
        } else {
          return value ? true : 'Pole wymagane';
        }
      },
    };
  }
}
</script>