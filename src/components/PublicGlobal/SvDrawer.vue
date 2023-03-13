<!-- 右侧弹出模态框，默认无蒙层 -->
<script setup lang="ts">
const props = defineProps({
  title: {
    type: String,
    default: '分析报告'
  }
});

const show = shallowRef(false);
const arg = [0, 360, 0];

defineExpose({
  show: (val: boolean) => (show.value = val)
});
</script>
<template>
  <teleport to="body">
    <div
      v-collapseW:[arg]="show"
      class="content-aside"
      :class="{ 'aside-collapse': !show }"
    >
      <svg
        v-rotateY:180="true"
        class="icon svg-40 collapse-icon"
        aria-hidden="true"
        @click="show = !show"
      >
        <use href="#icon-zuohua"></use>
      </svg>

      <div class="content-title">
        {{ props.title }}
      </div>
      <slot name="default"></slot>
    </div>
  </teleport>
</template>

<script lang="ts">
export default {
  name: 'SvDrawer'
};
</script>

<style scoped lang="scss">
.content-aside {
  height: calc(100vh - 90px);
  position: fixed;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.85);
  z-index: 100;
  box-shadow: 0px 12px 32px 4px rgba(0, 0, 0, 0.12),
    0px 8px 20px rgba(0, 0, 0, 0.2);
  padding: 10px;
  border-top-left-radius: 8px;
  border-bottom-left-radius: 8px;
  overflow: hidden;

  > .collapse-icon {
    position: absolute;
    left: -15px;
    top: calc(50% - 20px);
    cursor: pointer;
  }

  > .content-title {
    font-size: 18px;
    font-weight: bolder;
    color: #666666;
    height: 30px;
    line-height: 20px;
    border-bottom: 1px solid #cccccc;
  }
}

.aside-collapse {
  padding: 0 !important;
}
</style>
