<!-- name: -->
<script lang="ts" setup>
import { busOn, getWatchBrowserWidth } from '@/utils/hooks';
const props = defineProps({
  darkHeader: {
    type: Boolean,
    default: true
  }
});

/*  订阅总线事件
------------------------------------------------ */
const isAsideMenuCollapse = ref<boolean>(false); // 左右布局时 menu 折叠、展开状态
const time = (val: boolean) => {
  let ti: any = null;
  return () => {
    if (!val) {
      if (ti) clearTimeout(ti);
      ti = setTimeout(() => {
        isAsideMenuCollapse.value = val;
        clearTimeout(ti);
      }, 250);
    } else {
      isAsideMenuCollapse.value = val;
    }
  };
};
// 事件-- 左右布局时 menu 折叠、展开状态交替
busOn('menuCollapse', (param: boolean) => {
  time(param)();
});
getWatchBrowserWidth((val: number) => {
  if (val <= 800 && val > 700) {
    isAsideMenuCollapse.value = true; // 折叠
  } else if (val > 800) {
    isAsideMenuCollapse.value = false; // 展开
  } else if (val < 700) {
    isAsideMenuCollapse.value = false; // 展开
  }
});
</script>
<script lang="ts">
export default {
  name: 'HeaderTitle'
};
</script>

<template>
  <img src="@/assets/img/logo2.png" />
  <span
    v-show="!isAsideMenuCollapse"
    :style="{ color: props.darkHeader ? '#fff' : '#000' }"
  >
    {{ $t(`system.systemName`) }}
  </span>
</template>

<style scoped lang="scss">
img {
  height: 30px;
}
span {
  margin-left: 10px;
  font-size: 15px;
}
</style>
