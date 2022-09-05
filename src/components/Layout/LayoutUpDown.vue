<!-- name:上下布局 -->
<script lang="ts" setup>
import HeaderTitle from '@comps/Layout/Main/HeaderTitle.vue';
import HeaderMenu from '@comps/Layout/Main/HeaderMenu.vue';
import HeaderOption from '@comps/Layout/Main/HeaderOption.vue';
import HeaderTabs from '@comps/Layout/Main/HeaderTabs.vue';

import basicPinia from '@/pinia/storagePinia';
const basicStore = basicPinia();
const primaryHeader = ref(false); // 顶部菜单栏是否使用主题色
const primaryColor = ref('#fff'); // 系统主题色
basicStore.$subscribe(
  (mutation, state) => {
    primaryColor.value = state.systemParams.primaryColor;
    primaryHeader.value =
      state.systemParams.primaryHeader &&
      state.systemParams.layoutType === 'UpDown';
  },
  {
    immediate: true
  }
);
</script>

<template>
  <div>
    <el-container>
      <el-header height="50px">
        <div class="header">
          <div class="header-left">
            <HeaderTitle />
          </div>
          <div class="header-menu">
            <HeaderMenu
              :primary-color="primaryColor"
              :primary-aside="false"
              :primary-header="primaryHeader"
            />
          </div>
          <div
            class="header-right"
            :class="{
              'primary-bg-color': primaryHeader
            }"
          >
            <HeaderOption
              :primary-bread="false"
              :primary-header="primaryHeader"
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
  </div>
</template>

<style scoped lang="scss">
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
.el-header {
  background: white;
  padding-left: 0px;
  padding-right: 0px;
  .header {
    @include box-size(100%, 50px);
    @include flex(row, space-between, center);
    border-bottom: 1px solid #dcdfe6;
    &-left {
      @include box-size(210px, 100%);
      @include flex(row, flex-start, flex-end);
      @include primary-bg-color(1);
      padding-left: 15px;
      padding-bottom: 10px;
    }
    &-menu {
      @include box-size(calc(100% - 510px), 100%);
    }
    &-right {
      @include box-size(300px, 100%);
      padding-right: 5px;
    }
  }
}
@media screen and (max-width: 550px) {
  .header-menu {
    width: 120px !important;
  }
}

@media screen and (max-width: 700px) {
  .header-menu {
    width: calc(100% - 280px) !important;
  }
  .header-left {
    display: none !important;
  }
}

@media screen and (max-width: 2000px) {
  .header-menu {
    width: calc(100% - 510px) !important;
  }
  .header-left {
    border-right: 1px dashed #a8a8a8;
    display: initial;
  }
}
</style>

<script lang="ts">
export default {
  name: 'LayoutUpDown'
};
</script>
