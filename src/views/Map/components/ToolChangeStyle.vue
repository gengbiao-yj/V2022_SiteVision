<script setup lang="ts">
import { map } from '@/views/Map/Hooks';
import { AMAP } from '@/plugin/Axios/config';

const visibleStyleBox = ref(false); // 地图切换弹窗状态
// 关闭地图切换弹窗
const closeStyleBox = () => {
  visibleStyleBox.value = false;
};
// 展示地图切换弹窗
const showStyleBox = () => {
  visibleStyleBox.value = !visibleStyleBox.value;
};

/**
 * 更换地图
 */
type AmapType = 'AMAP_VECTORNROAD' | 'AMAP_SATELLITE';
const changeStyle = (type: AmapType) => {
  // 地图切换
  map.value.setStyle({
    version: 8,
    name: 'Mapbox Streets',
    sources: {
      'osm-tiles': {
        type: 'raster',
        tiles: [AMAP[type]],
        tileSize: 256
      }
    },
    layers: [
      {
        id: 'main',
        type: 'raster',
        source: 'osm-tiles',
        'source-layer': 'osmtiles'
      }
    ]
  });
  // 判断是否需要添加路网(针对卫星图)
  if (type === 'AMAP_SATELLITE') {
    map.value.addSource('roadLayer', {
      type: 'raster',
      tiles: [AMAP.AMAP_ROAD],
      tileSize: 256
    });
    map.value.addLayer({
      id: 'roadLayer',
      type: 'raster',
      paint: {
        'raster-opacity': 1.0,
        'raster-opacity-transition': {
          duration: 0
        },
        'raster-fade-duration': 5
      },
      source: 'roadLayer'
    });
  } else {
    if (map.value.getSource('roadLayer')) {
      map.value.removeLayer('roadLayer');
      map.value.removeSource('roadLayer');
    }
  }
};

onMounted(() => {
  document.body.addEventListener('click', closeStyleBox);
});
onBeforeUnmount(() => {
  document.body.removeEventListener('click', closeStyleBox);
});
</script>
<script lang="ts">
export default {
  name: 'ToolChangeStyle'
};
</script>

<template>
  <el-tooltip effect="dark" content="切换地图" placement="right-start">
    <div class="tool-item-btn cur-pointer" @click.stop="showStyleBox">
      <svg class="icon svg-20" aria-hidden="true">
        <use href="#layers"></use>
      </svg>
    </div>
  </el-tooltip>
  <transition name="fromLeft">
    <div v-show="visibleStyleBox" class="map-style-box">
      <img
        class="cur-pointer"
        src="../../../assets/img/AMAP_VECTORNROAD.png"
        @click.stop="changeStyle('AMAP_VECTORNROAD')"
      />
      <img
        class="cur-pointer"
        src="../../../assets/img/AMAP_SATELLITE.png"
        @click.stop="changeStyle('AMAP_SATELLITE')"
      />
    </div>
  </transition>
</template>

<style scoped lang="scss">
@import 'style';
.tool-item-btn {
  left: 10px;
  bottom: 110px;
}
.map-style-box {
  $bgc: rgba(0, 0, 0, 0.38);
  @include box-size(280px, 140px);
  @include pseudo-element-striangle('left', 12px, $bgc);
  @include flex(row, flex-start, center);
  position: absolute;
  left: 50px;
  bottom: 110px;
  background: $bgc;
  border-radius: 5px;
  padding: 0 8px;
  > img {
    width: 125px;
    margin-right: 8px;
    border-radius: 5px;
    border: 1px solid #060e88;
  }
}
</style>
