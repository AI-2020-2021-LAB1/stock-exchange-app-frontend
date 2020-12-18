<template>
  <div>
    <configuration-editor></configuration-editor>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import ConfigurationEditor from '../components/BenchmarkConfigurationEditor.vue';

@Component({
  components: {
    ConfigurationEditor,
  },
})
export default class BenchmarkConfigurations extends Vue {
  private data() {
    return {};
  }
}
</script>
