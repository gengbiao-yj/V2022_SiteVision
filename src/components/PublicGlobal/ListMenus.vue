<!-- 操作菜单 - 选项列表 -->
<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import type { PropType } from 'vue';

const props = defineProps({
  list: {
    type: Array as PropType<
      Array<{ label: string; value: string; icon: string }>
    >,
    required: true
  }
});

const emit = defineEmits(['select']);
</script>

<template>
  <div class="list-menus-root">
    <div
      class="type-item"
      v-for="(e, i) in props.list"
      :key="i"
      @click="emit('select', e)"
    >
      <svg fill="currentColor" class="icon svg-14" aria-hidden="true">
        <use :href="e.icon" fill=""></use>
      </svg>
      {{ e.label }}
    </div>
  </div>
</template>

<style scoped lang="scss">
.list-menus-root {
  position: absolute;
  padding: 0px 0px;
  border-radius: 6px;
  min-width: 120px;
  background: white;
  .type-item {
    padding: 0px 5px;
    width: 100%;
    height: 36px;
    font-size: 14px;
    letter-spacing: 2px;
    cursor: pointer;
    position: relative;
    color: var(--primary-color);
    @include flex(row, center, center);
    svg {
      color: var(--primary-color);
      margin-right: 5px;
    }
    &:hover {
      @include primary-bg-color(0.1);
      transition: all 0.1s ease-in-out;
    }
  }
  &:before {
    content: '';
    display: block;
    position: absolute;
    width: 10px;
    height: 10px;
    background: white;
    top: -5px;
    right: calc(65%);
    transform: rotate(45deg);
  }
}
</style>

<script lang="ts">
export default {
  name: 'ListMenus'
};
</script>
