<!-- 主页 -->
<script setup lang="ts">
import LayoutUpDown from '@comps/Layout/LayoutUpDown.vue';
import LayoutLeftRight from '@comps/Layout/LayoutLeftRight.vue';
import { basicStore } from '@/pinia';

// 获取布局方式
const systemSettings = ref(basicStore.systemParams);
watch(
  () => basicStore.systemParams,
  val => {
    systemSettings.value = val;
  }
);
const isComponent = {
  LeftRight: LayoutLeftRight,
  UpDown: LayoutUpDown
};
</script>
<script lang="ts">
export default {
  name: 'MainMap'
};
</script>

<template>
  <!-- 过渡效果需要所有业务页面有唯一的根节点，务必使用div做包裹 -->
  <div class="main-root">
    <transition name="fade-transform" mode="out-in" appear>
      <component :is="isComponent[systemSettings.layoutType]" />
    </transition>
  </div>
</template>

<style scoped lang="scss">
.main-root {
  @include box-size(100vw, 100vh);
  overflow: hidden;
}
</style>
