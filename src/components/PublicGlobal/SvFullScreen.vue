<!-- name: 设置全屏 -->
<script lang="ts" setup>
import { fullScreen } from '@/utils/hooks';

const props = defineProps({
  // 表格实例
  instance: {
    required: true,
    type: Object
  }
});

const instance = computed(() => props.instance);
const setRestFullScreen = fullScreen();
const clickFullScreen = () => {
  setRestFullScreen(instance.value);
};
</script>
<script lang="ts">
export default {
  name: 'SvFullScreen'
};
</script>

<template>
  <!-- 全屏 -->
  <el-tooltip
    effect="dark"
    :content="$t(`tooltip.fullScreen`)"
    placement="top-start"
  >
    <FullScreen class="svg-18" @click="clickFullScreen" />
  </el-tooltip>
</template>

<style scoped></style>
