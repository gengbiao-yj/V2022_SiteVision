<!-- name:面包屑导航 -->
<script lang="ts" setup>
import type { RouteLocationMatched } from 'vue-router';
import { busEmit, busOn } from '@/utils/hooks';
import { defineProps } from 'vue';

const props = defineProps({
  primaryHeader: {
    type: Boolean,
    required: true
  }
});

/*  面包屑层级信息获取
------------------------------------------------ */
// 监视路由变化
const route = useRoute();
const breadcrumbs = shallowReactive([] as Array<RouteLocationMatched>);
watch(route, newV => {
  breadcrumbs.length = 0;
  breadcrumbs.push(
    ...newV.matched.filter(it => {
      return it.meta && it.meta.title;
    })
  );
});

// 刷新初始化
breadcrumbs.push(
  ...route.matched.filter(it => {
    return it.meta && it.meta.title;
  })
);

/*  aside、aside menu 布局方式判断与事件触发
------------------------------------------------ */
const menuCollapse = ref<boolean>(false);
// 左右布局时，浏览器宽度监视
import { getWatchBrowserWidth } from '@/utils/hooks';
const browserWidth = getWatchBrowserWidth((val: number) => {
  // aside menu 展开、折叠交替
  if (val <= 800 && val > 700) {
    menuCollapse.value = true; // 折叠
    busEmit('leftRightWidth800', menuCollapse.value);
  } else if (val > 800) {
    menuCollapse.value = false; // 展开
    busEmit('leftRightWidth800', menuCollapse.value);
  }
  // aside menu 隐藏、转为抽屉侧滑交替
  if (val <= 700) {
    menuCollapse.value = false; // 折叠
    busEmit('leftRightWidth700', true); // 隐藏，转抽屉
  } else if (val > 700) {
    busEmit('leftRightWidth700', false); // 显示，转aside
  }
});

// 反转菜单的折叠状态 HeaderMenu -> menu
const reverseState = () => {
  menuCollapse.value = !menuCollapse.value;
  busEmit('menuCollapse', menuCollapse.value);
};

// 左右布局时，aside转为侧滑抽屉，同步抽屉展开收缩状态
busOn('menuCollapse', (param: boolean) => {
  menuCollapse.value = param;
});
</script>

<template>
  <Fold
    class="svg-18 mg-r-10 cur-pointer"
    :class="props.primaryHeader ? 'color-white' : 'primary-color'"
    v-rotate:180="menuCollapse"
    @click="reverseState"
  />
  <el-breadcrumb
    separator-class="el-icon-arrow-right"
    v-show="browserWidth > 500"
    :class="props.primaryHeader ? 'breadcrumb-primary' : ''"
  >
    <transition-group name="breadcrumb">
      <el-breadcrumb-item v-for="item of breadcrumbs" :key="item.path">
        <span class="breadcrumb-title">{{ item.meta?.title }}</span>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<style scoped lang="scss">
.breadcrumb-primary:deep(span) {
  color: white;
}
</style>

<script lang="ts">
export default {
  name: 'BreadcrumbTip'
};
</script>
