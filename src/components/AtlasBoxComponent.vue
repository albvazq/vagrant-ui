<style lang="scss" scoped>
.atlas__box {
  border: 1px solid rgb(0, 0, 0);
  height: 180px;
  position: relative;
  box-sizing: border-box;

  &__header {
    background: #0f4c89;
    width: 100%;
    height: 40px;
    color: #fff;

    h4, h5 {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      padding-left: 10px;
    }

    h4 {
      font-size: 16px;
      height: 22px;
      line-height: 22px;
    }

    h5 {
      font-size: 12px;
      height: 18px;
      line-height: 18px;
    }
  }

  &__description {
    height: 60px;
    overflow: hidden;
    text-align: center;
    box-sizing: border-box;
    padding: 10px;
    font-size: 12px;
  }

  &__providers {
    padding-top: 5px;
    box-sizing: border-box;
    .q-chip--dense {
      height: 16px;
      font-size: 10px;
    }
  }

  &__actions {
    position: absolute;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.3);
    top: 0;
    left: 0;
    opacity: 0;
    transition:all 0.3s ease-in;

    &.visible {
      opacity: 1;
    }

    .row {
      width: 100%;
    }
  }
}
</style>

<template>
  <div class="atlas__box" @mouseover="hover = true" @mouseleave="hide()">
    <div class="flex atlas__box__header">
        <div>
          <q-avatar square size="40px" font-size="36px" color="teal" text-color="white">
            <div v-if="image === null">v</div>
            <img v-if="image === ''" src="https://cdn.quasar.dev/img/avatar.png">
          </q-avatar>
        </div>
        <div>
          <h4>{{ box.username }}/{{ box.name }}</h4>
          <h5>{{ box.version }}</h5>
        </div>
    </div>
    <div class="atlas__box__description" v-html="box.description"></div>
    <div class="atlas__box__providers flex justify-center">
      <q-chip v-for="p in box.providers" v-bind:key="p" dense size="6px">{{ p }}</q-chip>
    </div>
    <div class="atlas__box__actions flex" v-bind:class="{visible: hover | focus}">
      <div class="row justify-center">
        <q-select ref="select" @mouseover="hover = true" bg-color="white" outlined v-model="provider" :options="box.providers" label="Provider" :dense="true" :options-dense="true">
          <!--<template v-slot:option="scope">
            <div @mouseover="optionsHover = true" @mouseleave="optionsHover = false">
              {{scope.opt}}
            </div>
          </template>-->
        </q-select>
        <q-btn
          round
          color="primary"
          size="md"
          icon="get_app"
          @click="loadImage()"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Box } from '@/dto/box.interfce';
import { QSelect } from 'quasar';
const electron = window.require('electron');
// Module path must be relative to the dist folder content.
const Vagrant = electron.remote.require('../modules/vagrant/vagrant');

@Component
export default class AtlasBoxComponent extends Vue {
  protected provider: string = '';
  protected hover: boolean = false;
  protected focus: boolean = false;
  protected image: any = null;
  @Prop() private box!: Box;

  public mounted() {
    // Check if the image for this organization is already
    // on the system, otherwise retreive it from the API.

    (this.$refs.select as any).$on('focus', () => {
      this.focus = true;
    });

    (this.$refs.select as any).$on('blur', () => {
      this.focus = false;
    });
  }

  protected hide() {
    this.hover = false;
  }

  protected loadImage() {
    this.image = '';
  }
}
</script>
