<template>
  <q-page class="flex block">
      <div class="row justify-left">
        <div class="col-4" v-for="box in boxes" v-bind:key="box.tag">
          <atlas-box-component :box="box"></atlas-box-component>
        </div>
      </div>
  </q-page>
</template>

<style scoped>
.row, .col-4 {
  padding: 10px;
  box-sizing: border-box;
}
</style>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import AtlasBoxComponent from '../components/AtlasBoxComponent.vue';
import { AtlasAPI } from '@/modules/atlas-api';
import { Box } from '@/dto/box.interfce';
const electron = window.require('electron');
const remote = electron.remote;

@Component({
  components: {
    'atlas-box-component': AtlasBoxComponent
  }
})
export default class PageHome extends Vue {
  boxes: Box[] | null = [];
  mounted() {
    const api = AtlasAPI.getInstance(remote.process.env.TOKEN);
    api.search().subscribe((boxes) => {
      this.boxes = boxes;
    });
  }
}
</script>

