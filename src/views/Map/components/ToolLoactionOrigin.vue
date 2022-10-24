<!-- 组件：回到当前所在城市定位 -->
<script setup lang="ts">
import { map, initZoom, resetStartZoom } from '@/views/Map/Hooks';
import { basicStore } from '@/pinia';

const emits = defineEmits(['toolAccordion']);
const visibleStyleBox = ref(false); // 切换弹窗状态
defineExpose({
  visible: visibleStyleBox
});
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
  /**
   * 侧边工具展示与隐藏为手风琴效果，通知父组件关闭其他工具框
   *    测量工具【_,*】
   */
  emits('toolAccordion', 0);
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
