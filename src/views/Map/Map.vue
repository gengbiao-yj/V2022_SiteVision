<!-- name:地图主页 -->
<script setup lang="ts">
import { UseInitMap } from './utils';
import { busOn } from '@/utils/hooks';
import toolNav from '@/views/Map/components/ToolNav.vue';
import toolBox from '@/views/Map/components/ToolBox.vue';
import toolLoactionOrigin from '@/views/Map/components/ToolLoactionOrigin.vue';
import toolChangeStyle from '@/views/Map/components/ToolChangeStyle.vue';
import toolMeasure from '@/views/Map/components/ToolMeasure.vue';
import toolMapImg from '@/views/Map/components/ToolMapImg.vue';
import toolCreateReport from '@/views/Map/components/ToolCreateReport.vue';

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
const createReport = ref();
const toolAccordion = (index: number) => {
  const tools = [loactionOrigin, changeStyle, measure, mapImg, createReport];
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
    <!-- 地图缩放按钮 -->
    <tool-nav />
    <!-- 点位到当前所在城市 -->
    <tool-loaction-origin ref="loactionOrigin" @toolAccordion="toolAccordion" />
    <!-- 切换地图 -->
    <tool-change-style ref="changeStyle" @toolAccordion="toolAccordion" />
    <!-- 测量工具 -->
    <toolBox
      ref="measure"
      tooltip="测量"
      title="测量工具"
      :clickAway="false"
      svg="#ruler"
      :bottom="155"
      @toolAccordion="toolAccordion(2)"
    >
      <tool-measure />
    </toolBox>
    <!-- 截图工具 -->
    <toolBox
      ref="mapImg"
      tooltip="截图"
      title="截图工具"
      :clickAway="false"
      svg="#screenshot"
      :bottom="200"
      @toolAccordion="toolAccordion(3)"
    >
      <tool-map-img :map="mapContainer" />
    </toolBox>
    <!-- 评估报告 -->
    <toolBox
      ref="createReport"
      tooltip="评估"
      title="生成评估报告"
      :clickAway="false"
      svg="#slide"
      :top="200"
      striangle="left-top"
      @toolAccordion="toolAccordion(4)"
    >
      <tool-create-report />
    </toolBox>
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
