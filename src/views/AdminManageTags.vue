<template>
  <v-row align="center" class="fill-height">
    <v-col>
      <v-dialog v-model="addNew">
        <v-text-field
          class="pt-2 pb-2"
          prepend-inner-icon="mdi-tag-plus"
          solo
          text
          clearable
          label="Dodaj tag"
          hide-details
          v-model="newTagName"
        ></v-text-field>
        <v-btn block color="primary" :disabled="!newTagName" @click="addTag">
          <v-icon left>mdi-tag-plus</v-icon>
          <span>Dodaj tag</span>
        </v-btn>
      </v-dialog>
      <v-btn fab fixed bottom right class="success" @click="addNew = true">
        <v-icon large>mdi-plus</v-icon>
      </v-btn>
      <v-row
        no-gutters
        align="center"
        justify="center"
        class="ma-2 fill-height"
      >
        <v-col lg="9">
          <admin-tags-list
            title="Lista Tagów"
            :list="tags"
            :listElements="tagElems"
            :search="searchTags"
            searchLabel="Wyszukaj tag po nazwie"
            objIcon="mdi-tag"
            @search="searchTags = $event"
            @remove="deleteTag($event)"
            @pagination="paginationClicked($event)"
            >Test</admin-tags-list
          >
        </v-col>
      </v-row>
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

  private addTag() {
    this.tagService
      .addTag({ name: this.$data.newTagName })
      .then(() => {
        this.getTags({ page: 0 });
        this.$store.dispatch('setSnackbarState', {
          state: true,
          msg: 'Tag został dodany',
          color: 'success',
          timeout: 5000,
        });
      })
      .catch((err) => {
        if (err.response.status === 409) {
          this.$store.dispatch('setSnackbarState', {
            state: true,
            msg: 'Istnieje już tag z taką nazwą!',
            color: 'error',
            timeout: 7500,
          });
        } else {
          this.$store.dispatch('setSnackbarState', {
            state: true,
            msg: 'Error ' + err.response.status,
            color: 'error',
            timeout: 7500,
          });
        }
      });
    this.$data.newTagName = '';
    this.$data.addNew = false;
  }

  private data() {
    return {
      addNew: false,
      newTagName: '',
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
