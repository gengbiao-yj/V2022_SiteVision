<!-- 徽标组件 -->
<script lang="ts" setup>
import { defineProps } from 'vue';

const props = defineProps({
  // 徽标内容
  content: {
    type: Number,
    required: true
  },
  // 徽标偏移
  offsetX: {
    type: Number,
    default: 0
  },
  offsetY: {
    type: Number,
    default: 0
  }
});

// 徽标内容单向数据流
const selfContent = ref<number>(props.content);
watch(
  () => props.content,
  (newV: number) => {
    selfContent.value = newV;
  }
);

// 徽标偏移处理
const badge = ref();
onMounted(() => {
  if (props.offsetX) {
    badge.value.style.right = props.offsetX + 'px';
  }
  if (props.offsetY) {
    badge.value.style.top = props.offsetY + 'px';
  }
});
</script>

<template>
  <div class="slm-badge">
    <slot></slot>
    <span ref="badge" class="slm-badge-num">{{
      selfContent > 99 ? '99+' : selfContent
    }}</span>
  </div>
</template>

<style scoped lang="scss">
.slm-badge {
  position: relative;
  &-num {
    min-width: 25px;
    height: 15px;
    border-radius: 999px;
    background: #f56c6c;
    font-size: 12px;
    position: absolute;
    text-align: center;
    line-height: 15px;
    color: white;
    top: 0;
    right: 0px;
  }
}
</style>

<script lang="ts">
export default {
  name: 'SvBadge'
};
</script>
