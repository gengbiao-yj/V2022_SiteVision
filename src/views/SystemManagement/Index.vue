<!-- 系统维护 -->
<script lang="ts" setup>
import type { _HTMLDivElement } from '@/types';

const isAsideCollapse = ref(false);
const arg = [0, 160, 0];

const tag = ref() as _HTMLDivElement;
const asideMenu = ref() as _HTMLDivElement;
// '#f1f1f1'
let manageType = ref(0);
const asideMenuChange = (i: number) => {
  if (asideMenu.value && tag.value) {
    manageType.value = i;
    let currentLi = asideMenu.value.children[i] as HTMLDivElement;
    tag.value.style.transform = `translateY(${currentLi.offsetTop - 20}px)`;
  }
};
</script>
<template>
  <div class="Sys-Mg-root">
    <div class="Sys-Mg-content">
      <div
        class="content-aside"
        v-collapseW:[arg]="!isAsideCollapse"
        :class="{ 'aside-collapse': isAsideCollapse }"
      >
        <ul ref="asideMenu" class="aside-menu">
          <li @click="asideMenuChange(0)">
            <SetUp class="svg-16" />
            <span :class="{ 'primary-color': manageType == 0 }">企业维护</span>
          </li>
          <li @click="asideMenuChange(1)">
            <SetUp class="svg-16" />
            <span :class="{ 'primary-color': manageType == 1 }">品牌维护</span>
          </li>
          <li @click="asideMenuChange(2)">
            <SetUp class="svg-16" />
            <span :class="{ 'primary-color': manageType == 2 }">用户维护</span>
          </li>
          <li @click="asideMenuChange(3)">
            <SetUp class="svg-16" />
            <span :class="{ 'primary-color': manageType == 3 }"
              >数据项维护</span
            >
          </li>
          <li @click="asideMenuChange(4)">
            <SetUp class="svg-16" />
            <span :class="{ 'primary-color': manageType == 4 }">字段管理</span>
          </li>
          <li @click="asideMenuChange(5)">
            <SetUp class="svg-16" />
            <span :class="{ 'primary-color': manageType == 5 }"
              >自定义图层维护</span
            >
          </li>
          <li @click="asideMenuChange(6)">
            <SetUp class="svg-16" />
            <span :class="{ 'primary-color': manageType == 6 }">城市维护</span>
          </li>
          <li @click="asideMenuChange(7)">
            <SetUp class="svg-16" />
            <span :class="{ 'primary-color': manageType == 7 }">竞品维护</span>
          </li>
          <li @click="asideMenuChange(8)">
            <SetUp class="svg-16" />
            <span :class="{ 'primary-color': manageType == 8 }">报告统计</span>
          </li>
          <li @click="asideMenuChange(9)">
            <SetUp class="svg-16" />
            <span :class="{ 'primary-color': manageType == 9 }">日志统计</span>
          </li>
          <li ref="tag"></li>
        </ul>
      </div>
      <div class="content-main">
        <!-- content-aside 侧边工具栏展开折叠按钮 -->
        <svg
          class="icon svg-40"
          aria-hidden="true"
          v-rotateY:180="isAsideCollapse"
          @click="isAsideCollapse = !isAsideCollapse"
        >
          <use href="#icon-zuohua"></use>
        </svg>
        <!-- 系统设置项 -->
        <div>系统设置项</div>
      </div>
    </div>
    <sv-copyright-line />
  </div>
</template>

<style lang="scss" scoped>
.Sys-Mg-root {
  @include box-size(100%, 100%);
  background: #f1f1f1;
  .Sys-Mg-content {
    @include box-size(calc(100%), calc(100% - 43px));
    @include flex(row, flex-start, flex-start);
    margin: 0 auto;
    > div {
      border-radius: 5px;
      background: white;
      border: 1px #e1e1e1 solid;
    }
    .content-aside {
      @include box-size(160px, 100%);
      position: relative;
      overflow: hidden;
      .aside-menu {
        @include box-size(160px, 100%);
        padding: 20px 0px;
        position: relative;
        li {
          cursor: pointer;
          padding-left: 15px;
          height: 48px;
          font-size: 13px;
          color: #646464;
          @include flex(row, flex-start, center);
          > span {
            margin-left: 5px;
          }
        }
        li:last-child {
          @include box-size(calc(100% - 2px), 28px);
          @include primary-bg-color(0.2);
          border-left: 3px solid var(--primary-color);
          position: absolute;
          top: 30px;
          transition: all 0.3s ease-in-out;
        }
      }
    }

    .aside-collapse {
      margin-left: 8px;
      border-color: #f1f1f1;
    }

    .content-main {
      height: 100%;
      margin-left: 5px;
      flex: 1;
      position: relative;
      > svg {
        position: absolute;
        left: -32px;
        top: calc(50% - 20px);
        cursor: pointer;
      }
    }
  }
}
</style>

<script lang="ts">
export default {
  name: 'SystemManagement'
};
</script>
