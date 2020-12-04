<template>
  <v-row no-gutters align="center" justify="center" class="ma-2 fill-height">
    <v-col lg="9" xl="6">
      <AdminTagsList
        title="Lista Tagów"
        :list="tags"
        :listElements="tagElems"
        :search="searchTags"
        searchLabel="Wyszukaj tag po nazwie"
        objIcon="mdi-database"
        @search="searchTags = $event"
        @remove="deleteTag($event)"
        @pagination="paginationClicked($event)"
        >Test</AdminTagsList
      >
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Component, Prop, Watch, Vue } from 'vue-property-decorator';
import { TagsService } from '../API/tags';
import AdminTagsList from '../components/AdminTagsList.vue';

@Component({
  components: {
    AdminTagsList,
  },
})
export default class AdminManageTags extends Vue {
  private tagService!: TagsService;

  private beforeCreate() {
    this.tagService = new TagsService();
  }

  private created() {
    this.getTags({ page: 0 });
  }

  private paginationClicked(pageNumber: number) {
    if (this.$data.searchTags) {
      this.getTags({ page: pageNumber - 1, name: this.$data.searchTags });
    } else {
      this.getTags({ page: pageNumber - 1 });
    }
  }

  @Watch('searchTags')
  private queryTags(val: string) {
    if (val) {
      this.getTags({ page: 0, name: val });
    } else {
      this.getTags({ page: 0 });
    }
  }

  private getTags(params: object) {
    this.tagService
      .getTags(params)
      .then((res) => {
        this.$data.tags = [];
        this.$data.tags = res.data;
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

  private deleteTag(params: string) {
    this.tagService
      .deleteTag(params)
      .then(() => {
        if (this.$data.searchTags) {
          this.getTags({ page: 0, name: this.$data.searchTags });
        } else {
          this.getTags({ page: 0 });
        }
        this.$store.dispatch('setSnackbarState', {
          state: true,
          msg: 'Tag został usunięty',
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

  private data() {
    return {
      tags: [],
      searchTags: '',
      tagElems: [
        {
          text: 'Nazwa',
          value: 'name',
        },
      ],
    };
  }
}
</script>
