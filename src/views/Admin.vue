<template>
  <v-row no-gutters align="center" justify="center" class="fill-height">
    <v-col>
      <v-row no-gutters>
        <v-col
          :sm="$vuetify.breakpoint.lgAndUp ? 4 : 12"
          lg="3"
          class="pa-2"
          v-for="el in links"
          :key="el.name"
        >
          <v-card
            class="primary mx-auto"
            height="125"
            width="400"
            link
            :to="el.link"
          >
            <v-row no-gutters align="center" class="fill-height">
              <v-col>
                <v-card-title
                  class="white--text font-weight-black justify-center py-auto"
                  style="word-break: break-word"
                  >{{ el.name }}</v-card-title
                >
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Component, Prop, Watch, Vue } from 'vue-property-decorator';

@Component
export default class Admin extends Vue {
  private data() {
    return {
      links: [
        {
          name: 'Zarządzanie użytkownikami',
          link: '/admin/users',
        },
        {
          name: 'Zarządzanie akcjami',
          link: '/admin/stocks',
        },
        {
          name: 'Zarządzanie tagami',
          link: '/admin/tags',
        },
        {
          name: 'Panel benchmarka',
          link: '/admin/benchmark',
        },
      ],
    };
  }
}
</script>
