<!-- 操作菜单 -->
<script setup lang="ts">
import { busOn } from '@/utils/hooks';
import { defineProps } from 'vue';

/*  props
------------------------------------------------ */
const props = defineProps({
  // 侧边栏、顶栏切换
  isAside: {
    type: String,
    default: 'horizontal',
    validator(value: string) {
      return ['horizontal', 'vertical'].includes(value);
    }
  },
  // 系统主题色
  primaryColor: {
    type: String,
    required: true
  },
  // 为顶烂时，是否采用主题色
  primaryHeader: {
    type: Boolean,
    required: true
  },
  // 为侧栏时，是否使用主题色
  primaryAside: {
    type: Boolean,
    required: true
  }
});

/*  订阅总线事件
------------------------------------------------ */
const menuCollapseState = ref(false); // menu 折叠展开状态
const isShowAsideDraw = ref(false);
// 事件-- 左右布局时 menu 折叠、展开状态交替
busOn('menuCollapse', (param: boolean) => {
  if (!isShowAsideDraw.value) menuCollapseState.value = param;
});
// 事件-- 左右布局时屏宽800px界限，menu 折叠、展开状态交替
busOn('leftRightWidth800', (param: boolean) => {
  menuCollapseState.value = param;
});

// 事件-- 屏宽700px界限，aside隐藏、转侧滑抽屉状态交替
busOn('leftRightWidth700', (param: boolean) => {
  isShowAsideDraw.value = param;
});

/*  主题设置
------------------------------------------------ */
const textColor = ref(''); // menu 文字颜色
const activeTextColor = ref(''); // menu 选中项文字颜色
const menuBgColor = ref(''); // menu 背景颜色
const menuId = ref('defaultMenu');

/**
 * menu 主题判断逻辑
 * @param val
 */
const judgeMenuPrimary = (color: string, aside: boolean, header: boolean) => {
  if (aside || header) {
    setMenuPrimary('#e8e8e8', '#fff', color);
  } else {
    setMenuPrimary('#303133', color, '#fff');
  }
};

/**
 * 设置 menu 主题颜色
 * @param tc  文字颜色
 * @param atc 激活项文字颜色
 * @param mbc 背景色
 */
const setMenuPrimary = (tc: string, atc: string, mbc: string) => {
  textColor.value = tc;
  activeTextColor.value = atc;
  menuBgColor.value = mbc;
};

// 监控设置变化
watch(
  [
    () => props.primaryColor,
    () => props.primaryAside,
    () => props.primaryHeader
  ],
  ([color, aside, header]) => {
    menuId.value = aside || header ? 'primaryMenu' : 'defaultMenu';
    judgeMenuPrimary(color, aside, header);
  },
  {
    immediate: true
  }
);

/*  界面渲染
------------------------------------------------ */
// 细分组件
import SmartRecommend from './SmartRecommend.vue';
import { DataTableType } from '@/data/headerMenu';

// 智能推荐下拉，展开收缩标志位
const smartRecommendShow = ref<boolean>(false);

// 菜单栏激活状态
const activeIndex = ref('0');
const menuSelect = (e: any) => {
  activeIndex.value = e;
};

// 路由刷新，动态激活默认选项 systemSet.primaryColor
const router = useRouter();
const route = useRoute();
const defaultActive = ref<string>('');
onBeforeMount(() => {
  defaultActive.value = router.currentRoute.value.path;
});
watch(route, newV => {
  defaultActive.value = newV.path;
});
</script>

<template>
  <div class="header-menu-root">
    <el-menu
      :mode="props.isAside"
      :collapse="menuCollapseState"
      router
      :default-active="defaultActive"
      :text-color="textColor"
      :active-text-color="activeTextColor"
      :background-color="menuBgColor"
      :id="menuId"
      :class="{
        'header-height': props.isAside === 'horizontal',
        'aside-height': props.isAside === 'vertical',
        'aside-width': props.isAside === 'vertical' && !menuCollapseState,
        'remove-border': props.isAside === 'vertical'
      }"
      @select="menuSelect"
      :collapse-transition="true"
    >
      <el-menu-item v-if="false">
        <el-popover
          title=""
          :width="700"
          trigger="hover"
          :hide-after="120"
          @before-enter="smartRecommendShow = true"
          @before-leave="smartRecommendShow = false"
          transition="el-zoom-in-top"
        >
          <template #reference>
            <div
              class="select-menu"
              :class="{ 'select-menu-asside': props.isAside === 'vertical' }"
              :style="{
                color: '#303133'
              }"
            >
              <Guide class="svg-16 mg-r-5" />
              <span>智能推荐</span>
              <ArrowDown class="svg-12" v-rotate:180="smartRecommendShow" />
            </div>
          </template>
          <SmartRecommend />
        </el-popover>
      </el-menu-item>

      <el-sub-menu index="3">
        <template #title
          ><Coin class="svg-18 mg-r-5" /><span>数据管理</span></template
        >
        <el-menu-item
          :index="e.path"
          v-for="(e, i) in DataTableType"
          :key="`3-${i}`"
        >
          <template #title>
            <Operation class="svg-16 mg-r-10" />
            <span>{{ e.label }}</span>
          </template>
        </el-menu-item>
      </el-sub-menu>

      <el-menu-item index="/Main/SystemManagement">
        <SetUp class="svg-18 mg-r-5" />
        <template #title><span>系统维护</span></template>
      </el-menu-item>

      <el-menu-item index="/Main/ManagementCockpit">
        <DataLine class="svg-18 mg-r-5" />
        <template #title><span>企业驾驶舱</span></template>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<style lang="scss" scoped>
.header-menu-root {
  height: 100%;
  .select-menu {
    height: 100%;
    min-width: 85px;
    position: relative;
    @include flex(row, flex-start, center);
    color: #303133;
    cursor: pointer;
    span {
      font-size: 15px;
      margin-right: 5px;
    }
  }
}
.header-height {
  height: 50px;
}
.aside-height {
  //height: calc(100% - 50px);
  height: 100%;
}
.remove-border {
  border: none !important;
}
.select-menu-asside {
  width: 100% !important;
  > svg:nth-child(3) {
    position: absolute;
    right: 1px;
  }
}

.aside-width {
  width: 210px;
}

//.aside-width.el-aside {
//  //background: $primary-color;
//  transition: width 0.15s ease-in-out;
//}
</style>

<script lang="ts">
export default {
  name: 'HeaderMenu'
};
</script>
