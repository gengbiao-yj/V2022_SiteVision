<!-- name:地图主页 -->
<script setup lang="ts">
import { UseInitMap } from './Hooks';
import { busOn } from '@/utils/hooks';
import toolLoactionOrigin from '@/views/Map/components/ToolLoactionOrigin.vue';
import toolChangeStyle from '@/views/Map/components/ToolChangeStyle.vue';
import toolMeasure from '@/views/Map/components/ToolMeasure.vue';
import toolMapImg from '@/views/Map/components/ToolMapImg.vue';

const { map, mapContainer } = UseInitMap();
/*  菜单折叠展开，变更地图尺寸
------------------------------------------------ */
busOn('menuCollapse', (param: boolean) => {
  // 容器宽度变化结束后再 resize 变更地图尺寸
  let ti = setTimeout(() => {
    map.value.resize();
    clearTimeout(ti);
  }, 300);
});

/*  侧边工具栏展示隐藏手风琴效果
------------------------------------------------ */
const loactionOrigin = ref();
const changeStyle = ref();
const measure = ref();
const mapImg = ref();
const toolAccordion = (index: number) => {
  const tools = [loactionOrigin, changeStyle, measure, mapImg];
  tools.forEach((e, i) => {
    if (i !== index) {
      e.value.visible = false;
    }
  });
};
</script>
<script lang="ts">
export default {
  name: 'MainMap'
};
</script>

<template>
  <div class="map-root">
    <div class="map" ref="mapContainer"></div>
    <tool-loaction-origin ref="loactionOrigin" @toolAccordion="toolAccordion" />
    <tool-change-style ref="changeStyle" @toolAccordion="toolAccordion" />
    <tool-measure ref="measure" @toolAccordion="toolAccordion" />
    <tool-map-img
      :map="mapContainer"
      ref="mapImg"
      @toolAccordion="toolAccordion"
    />
  </div>
</template>

<style scoped lang="scss">
.map-root {
  width: 100%;
  height: 100%;
  position: relative;
  > .map {
    @include box-size(100%, 100%);
  }

  &:deep(.mapboxgl-ctrl-logo) {
    display: none !important;
  }

  &:deep(.measure-line-result) {
    background-color: white;
    border-radius: 2px;
    height: 18px;
    line-height: 18px;
    padding: 0 3px;
    font-size: 12px;
    box-shadow: 0 0 0 1px #ccc;
  }
  &:deep(.measure-line-close) {
    @include box-size(16px, 18px);
    @include flex(row, center, center);
    background-color: white;
    border-radius: 4px;
    box-shadow: 0 0 0 1px #ccc;
    cursor: pointer;
    font-size: 16px;
    color: red;
  }
  &:deep(.measure-area-close) {
    @include box-size(auto, 18px);
    @include flex(row, center, center);
    background-color: white;
    border-radius: 4px;
    box-shadow: 0 0 0 1px #ccc;
    cursor: pointer;
    font-size: 15px;
    font-weight: 600;
    padding: 2px;
    color: red;
  }
}
</style>
