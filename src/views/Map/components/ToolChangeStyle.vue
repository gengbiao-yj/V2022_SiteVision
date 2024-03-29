<!-- 组件：地图切换 - 卫星路网图、矢量路网图 -->
<script setup lang="ts">
import { map } from '@/views/Map/utils';
import { AMAP } from '@/plugin/Axios/config';

const emits = defineEmits(['toolAccordion']);
const visibleStyleBox = ref(false); // 地图切换弹窗状态
defineExpose({
  visible: visibleStyleBox
});
// 关闭地图切换弹窗
const closeStyleBox = () => {
  visibleStyleBox.value = false;
};
// 展示地图切换弹窗
const showStyleBox = () => {
  visibleStyleBox.value = !visibleStyleBox.value;
  /**
   * 侧边工具展示与隐藏为手风琴效果，通知父组件关闭其他工具框
   *    底图切换【*,_】
   */
  emits('toolAccordion', 1);
};

/**
 * 更换地图
 */
type AmapType = 'AMAP_VECTORNROAD' | 'AMAP_SATELLITE';
const changeStyle = (type: AmapType) => {
  // 地图切换
  ['AMAP_VECTORNROAD', 'AMAP_SATELLITE'].forEach(e => {
    const showState = e === type ? 'visible' : 'none';
    map.value.setLayoutProperty(e, 'visibility', showState);
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
    <div v-show="visibleStyleBox" class="map-style-box left-bottom">
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
  @include pseudo-element-striangle(12px, $bgc);
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
