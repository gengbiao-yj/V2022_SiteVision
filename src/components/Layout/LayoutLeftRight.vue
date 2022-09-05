<!-- name:左右布局 -->
<script lang="ts" setup>
import HeaderTitle from '@comps/Layout/Main/HeaderTitle.vue';
import HeaderMenu from '@comps/Layout/Main/HeaderMenu.vue';
import HeaderOption from '@comps/Layout/Main/HeaderOption.vue';
import HeaderTabs from '@comps/Layout/Main/HeaderTabs.vue';
import Breadcrumb from '@comps/Layout/Main/Breadcrumb.vue';

import basicPinia from '@/pinia/storagePinia';
const basicStore = basicPinia();
const primaryAside = ref(false); // 侧边菜单栏是否使用主题色
const primaryBreadcrum = ref(false); // 顶部面包屑是否使用主题色
const primaryColor = ref('#fff'); // 系统主题色
basicStore.$subscribe(
  (mutation, state) => {
    primaryColor.value = state.systemParams.primaryColor;
    primaryAside.value =
      state.systemParams.primaryAside &&
      state.systemParams.layoutType === 'LeftRight';
    primaryBreadcrum.value =
      state.systemParams.primaryHeader &&
      state.systemParams.layoutType === 'LeftRight';
  },
  {
    immediate: true
  }
);

import { busOn, busEmit } from '@/utils/hooks';
/*  订阅总线事件
------------------------------------------------ */
const isAsideDrawer = ref(false); // aside 是否隐藏，并转为侧滑抽屉
const showAsideDrawer = ref(false); // 侧滑抽屉状态
const isAsideMenuCollapse = ref<boolean>(false); // aside 是否跟随 menu 折叠变宽
// 事件-- aside menu折叠状态通知
busOn('menuCollapse', (param: boolean) => {
  isAsideMenuCollapse.value = param;
  if (isAsideDrawer.value) showAsideDrawer.value = param;
});
// 事件-- 屏宽800px界限，menu 折叠、展开状态交替
busOn('leftRightWidth800', (param: boolean) => {
  isAsideMenuCollapse.value = param;
});
// 事件-- 屏宽700px界限，aside隐藏、转侧滑抽屉状态交替
busOn('leftRightWidth700', (param: boolean) => {
  isAsideDrawer.value = param;
});
const drawClosed = () => {
  showAsideDrawer.value = false;
  busEmit('menuCollapse', showAsideDrawer.value);
};
</script>

<template>
  <div>
    <el-container>
      <el-aside
        v-show="!isAsideDrawer"
        :class="{
          asideCollapse: isAsideMenuCollapse,
          asideOpen: !isAsideMenuCollapse
        }"
      >
        <div class="aside-title">
          <HeaderTitle />
        </div>
        <div
          class="aside-menu"
          :class="{
            'primary-bg-color': primaryAside
          }"
        >
          <HeaderMenu
            is-aside="vertical"
            :primary-color="primaryColor"
            :primary-aside="primaryAside"
            :primary-header="false"
          />
        </div>
      </el-aside>
      <el-container style="width: 100%">
        <el-header height="50px">
          <div
            class="header"
            :class="{
              'primary-bg-color': primaryBreadcrum
            }"
          >
            <div class="header-left">
              <Breadcrumb :primary-header="primaryBreadcrum" />
            </div>
            <div class="header-right">
              <HeaderOption
                :primary-bread="primaryBreadcrum"
                :primary-header="false"
              />
            </div>
          </div>
        </el-header>
        <el-main>
          <div class="tabs">
            <HeaderTabs />
          </div>
          <div class="main-container">
            <router-view v-slot="{ Component }">
              <transition name="fade-transform" mode="out-in" appear>
                <component :is="Component"></component>
              </transition>
            </router-view>
          </div>
        </el-main>
      </el-container>
    </el-container>
    <div class="menu-draw">
      <el-drawer
        v-if="isAsideDrawer"
        v-model="showAsideDrawer"
        :with-header="false"
        direction="ltr"
        :destroy-on-close="true"
        @close="drawClosed"
      >
        <el-aside class="asideOpen">
          <div class="aside-title">
            <HeaderTitle />
          </div>
          <div class="aside-menu">
            <HeaderMenu is-aside="vertical" />
          </div>
        </el-aside>
      </el-drawer>
    </div>
  </div>
</template>

<style scoped lang="scss">
.el-aside {
  height: 100vh;
  //width: 210px;
  padding: 0px;
  background: white;
  box-shadow: 2px 5px 10px rgb(0 0 0 / 12%);
  transition: all 0.3s ease;
  z-index: 10;
  .aside-title {
    @include box-size(100%, 50px);
    @include flex(row, flex-start, flex-end);
    @include primary-bg-color(1);
    overflow: hidden;
    border-bottom: 1px dashed #a8a8a8;
    padding-left: 15px;
    padding-bottom: 10px;
  }
  .aside-menu {
    overflow: hidden;
    @include box-size(100%, calc(100% - 50px));
  }
}

// 左右布局时，menu菜单折叠，aside 侧边宽度也跟随折叠
.el-aside.asideCollapse {
  will-change: width;
  width: 64px;
}

.el-aside.asideOpen {
  will-change: width;
  width: 210px;
}

.el-header {
  background: white;
  padding-left: 0px;
  padding-right: 0px;
  .header {
    @include box-size(100%, 50px);
    @include flex(row, space-between, center);
    border-bottom: 1px solid #dcdfe6;
    &-left {
      @include box-size(calc(100% - 300px), 100%);
      @include flex(row, flex-start, center);
      padding-left: 15px;
    }
    &-right {
      @include box-size(300px, 100%);
      padding-right: 5px;
    }
  }
}

.el-main {
  padding: 0px;
  position: relative;

  .tabs {
    @include box-size(100%, 40px);
    box-shadow: 0 4px 4px rgba(124, 121, 121, 0.12);
    position: relative;
  }

  .main-container {
    @include box-size(100%, calc(100vh - 90px));
    background: #f1f1f1;
    padding: 4px 5px 0px;
  }
}

.menu-draw {
  &::v-deep {
    .el-drawer {
      width: 210px !important;
    }
    .el-drawer__body {
      padding: 0px !important;
    }
  }
}
</style>

<script lang="ts">
export default {
  name: 'LayoutLeftRight'
};
</script>
