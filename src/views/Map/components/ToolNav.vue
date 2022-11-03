<!-- 组件：地图放大缩小按钮 -->
<script lang="ts" setup>
import {
  minZoom,
  maxZoom,
  maxZoomCorrection,
  startZoom,
  map
} from '@/views/Map/Hooks';

// 地图放大
const mapZoomMax = () => {
  startZoom.value = startZoom.value + 1;
  if (startZoom.value >= maxZoom) startZoom.value = maxZoomCorrection;
  map.value.setZoom(startZoom.value);
  document.getElementsByClassName('mapboxgl-ctrl-zoom')[0].innerHTML =
    '缩放级别:' + startZoom.value;
};

// 地图缩小
const mapZoomMin = () => {
  startZoom.value = Math.floor(startZoom.value - 1);
  if (startZoom.value <= minZoom) startZoom.value = minZoom;
  map.value.setZoom(startZoom.value);
  document.getElementsByClassName('mapboxgl-ctrl-zoom')[0].innerHTML =
    '缩放级别:' + startZoom.value;
};
</script>
<script lang="ts">
export default {
  name: 'ToolNav'
};
</script>
<template>
  <div class="tool-nav-root">
    <div @click.stop="mapZoomMax">
      <svg class="icon svg-20" aria-hidden="true">
        <use href="#plus"></use>
      </svg>
    </div>
    <div @click.stop="mapZoomMin">
      <svg class="icon svg-20" aria-hidden="true">
        <use href="#minus"></use>
      </svg>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.tool-nav-root {
  $borderColor: #d5d5d5;
  @include box-size(30px, 61px);
  position: absolute;
  right: 10px;
  bottom: 35px;
  border-radius: 10px;
  overflow: hidden;
  background: #fff;
  border: 1px solid $borderColor;
  > div {
    @include flex(row, center, center);
    width: 100%;
    height: 30px;
    position: relative;
    cursor: pointer;
    &:hover {
      background-color: #ddd;
    }
  }
  > div:nth-child(1)::after {
    display: block;
    content: '';
    width: 100%;
    height: 1px;
    background-color: $borderColor;
    position: absolute;
    bottom: -1px;
  }
  > div:nth-child(2) {
    margin-top: 1px;
  }
}
</style>
