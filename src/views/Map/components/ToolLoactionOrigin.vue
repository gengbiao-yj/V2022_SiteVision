<script setup lang="ts">
import { map, initZoom, resetStartZoom } from '@/views/Map/Hooks';
import { basicStore } from '@/pinia';

const locationOrigin = () => {
  const {
    centerLngLat: { lng, lat }
  } = basicStore.getLoactionData();

  map.value.flyTo({
    center: [lng, lat],
    zoom: initZoom,
    speed: 1
  });

  resetStartZoom();
};
</script>
<script lang="ts">
export default {
  name: 'ToolLoactionOrigin'
};
</script>

<template>
  <el-tooltip effect="dark" content="定位到当前位置" placement="right-start">
    <div class="tool-item-btn cur-pointer" @click.stop="locationOrigin">
      <svg class="icon svg-20" aria-hidden="true">
        <use href="#radar"></use>
      </svg>
    </div>
  </el-tooltip>
</template>

<style scoped lang="scss">
@import 'style';
.tool-item-btn {
  left: 10px;
  bottom: 65px;
}
</style>
