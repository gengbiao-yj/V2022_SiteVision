<script lang="ts" setup>
import { Ref } from 'vue';
// 定义事件
const emits = defineEmits(['toolAccordion']);
// 定义传参
const props = defineProps({
  tooltip: {
    type: String,
    require: true
  },
  title: {
    type: String,
    require: true
  },
  clickAway: {
    default: true,
    type: Boolean
  },
  svg: {
    type: String,
    require: true
  },
  top: {
    type: Number
  },
  bottom: {
    type: Number
  },
  position: {
    default: 'left',
    validator(value: string) {
      return ['left', 'right'].includes(value);
    }
  },
  striangle: {
    default: 'left-bottom',
    validator(value: string) {
      return [
        'left-bottom',
        'left-top',
        'right-bottom',
        'right-top',
        'top-left',
        'top-right',
        'bottom-left',
        'bottom-right'
      ].includes(value);
    }
  }
});
// 抛出组件数据
const visibleStyleBox = ref(false); // 切换弹窗状态
defineExpose({
  visible: visibleStyleBox
});
// 弹窗打开、关闭
const mapStyleBox = ref() as Ref<HTMLDivElement>;
const toolItemBtn = ref() as Ref<HTMLDivElement>;
const openContentBox = () => {
  emits('toolAccordion');
  visibleStyleBox.value = true;
};
const closeStyleBox = () => {
  visibleStyleBox.value = false;
};
onMounted(() => {
  if (props.position === 'left') {
    mapStyleBox.value.style.left = '50px';
    toolItemBtn.value.style.left = '10px';
  } else if (props.position === 'right') {
    mapStyleBox.value.style.right = '50px';
    toolItemBtn.value.style.right = '10px';
  } else if (props.position !== 'right' && props.position !== 'left') {
    mapStyleBox.value.style.left = '50px';
    toolItemBtn.value.style.left = '10px';
  }

  if (props.top && !props.bottom) {
    mapStyleBox.value.style.top = `${props.top}px`;
    toolItemBtn.value.style.top = `${props.top}px`;
  } else if (props.bottom && !props.top) {
    mapStyleBox.value.style.bottom = `${props.bottom}px`;
    toolItemBtn.value.style.bottom = `${props.bottom}px`;
  } else if (props.bottom && props.top) {
    mapStyleBox.value.style.bottom = `${props.bottom}px`;
    toolItemBtn.value.style.bottom = `${props.bottom}px`;
  }
});
if (props.clickAway) {
  onMounted(() => {
    document.body.addEventListener('click', closeStyleBox);
  });
  onBeforeUnmount(() => {
    document.body.removeEventListener('click', closeStyleBox);
  });
}
</script>
<script lang="ts">
export default {
  name: 'ToolBox'
};
</script>

<template>
  <el-tooltip effect="dark" :content="props.tooltip" placement="right-start">
    <div
      ref="toolItemBtn"
      class="tool-item-btn cur-pointer"
      @click.stop="openContentBox"
    >
      <svg class="icon svg-20" aria-hidden="true">
        <use :href="props.svg"></use>
      </svg>
    </div>
  </el-tooltip>
  <transition name="fromLeft">
    <div
      v-show="visibleStyleBox"
      ref="mapStyleBox"
      class="map-style-box"
      :class="[props.striangle]"
    >
      <header>
        <span>{{ props.title }}</span>
        <Close class="svg-18 cur-pointer" @click.stop="closeStyleBox" />
      </header>
      <main @click.stop>
        <slot></slot>
      </main>
    </div>
  </transition>
</template>

<style lang="scss" scoped>
@import 'style';
.map-style-box {
  $bgc: #f6f5f5;
  @include box-size(280px, auto);
  @include pseudo-element-striangle(12px, $bgc);
  position: absolute;
  background: $bgc;
  border-radius: 5px;
  padding: 0 0 8px;
  box-shadow: 0px 0px 5px 2px #a6a6a6;
  > header {
    @include flex(row, space-between, center);
    height: 40px;
    width: 100%;
    border-bottom: 1px #d3d3d3 solid;
    padding: 0 8px;
    > span {
      font-size: 16px;
      font-weight: 600;
      color: #8f8989;
    }
  }
  > main {
    padding: 0 8px;
  }
}
</style>
