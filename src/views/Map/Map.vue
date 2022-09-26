<!-- name:地图主页 -->
<script setup lang="ts">
import { UseInitMap } from './Hooks';
import { busOn } from '@/utils/hooks';

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
</script>
<script lang="ts">
export default {
  name: 'MainMap'
};
</script>

<template>
  <div class="map-root" ref="mapContainer"></div>
</template>

<style scoped lang="scss">
.map-root {
  width: 100%;
  height: 100%;

  &:deep(.mapboxgl-ctrl-logo) {
    display: none !important;
  }
}
</style>
