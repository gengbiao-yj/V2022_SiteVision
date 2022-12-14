<!-- 系统维护 -->
<script lang="ts" setup>
import CompanyMaintain from '@/views/SystemManagement/components/CompanyMaintain.vue';
import BrandMaintenance from '@/views/SystemManagement/components/BrandMaintenance.vue';
import LayerMaintenance from '@/views/SystemManagement/components/LayerMaintenance.vue';
import CityMaintenance from '@/views/SystemManagement/components/CityMaintenance.vue';
import { getCompanyInfo } from '@/apis/user';
import { basicStore } from '@/pinia';

// 侧边菜单栏展开、折叠
const isAsideCollapse = ref(false);
const arg = [0, 160, 0];

// 侧边菜单项选中样式过渡
const tag = ref() as _HTMLDivElement;
const asideMenu = ref() as _HTMLDivElement;
let manageType = ref(0);
const asideMenuChange = (i: number) => {
  if (asideMenu.value && tag.value) {
    manageType.value = i;
    let currentLi = asideMenu.value.children[i] as HTMLDivElement;
    tag.value.style.transform = `translateY(${currentLi.offsetTop - 20}px)`;
  }
};

// 子组件集合
const isComponent = [
  CompanyMaintain,
  BrandMaintenance,
  null,
  null,
  null,
  LayerMaintenance,
  CityMaintenance
];

/*  获取企业、品牌信息
------------------------------------------------ */
const userInfo = basicStore.userInfo;
const companyInfo = ref<CompanyInfo>(); // 企业信息
const brandList = ref<Array<BrandInfo>>(); // 品牌信息

const init = async () => {
  try {
    const { data, code } = await getCompanyInfo({
      cusNo: userInfo.cusNo
    });
    if (code === 200) {
      companyInfo.value = data.companyInfo;
      brandList.value = data.brandList;
    }
  } catch (e) {
    console.log(e);
  }
};
init();
</script>
<script lang="ts">
export default {
  name: 'SystemManagement'
};
</script>

<template>
  <div class="Sys-Mg-root">
    <div class="Sys-Mg-content">
      <div
        v-collapseW:[arg]="!isAsideCollapse"
        class="content-aside"
        :class="{ 'aside-collapse': isAsideCollapse }"
      >
        <ul ref="asideMenu" class="aside-menu">
          <li @click="asideMenuChange(0)">
            <SetUp class="svg-16" />
            <span :class="{ 'primary-color': manageType === 0 }">{{
              $t(`SMS.enterpriseInfo`)
            }}</span>
          </li>
          <li @click="asideMenuChange(1)">
            <SetUp class="svg-16" />
            <span :class="{ 'primary-color': manageType === 1 }">{{
              $t(`SMS.brandMaintenance`)
            }}</span>
          </li>
          <li @click="asideMenuChange(2)">
            <SetUp class="svg-16" />
            <span :class="{ 'primary-color': manageType === 2 }">{{
              $t(`SMS.userMaintenance`)
            }}</span>
          </li>
          <li @click="asideMenuChange(3)">
            <SetUp class="svg-16" />
            <span :class="{ 'primary-color': manageType === 3 }">{{
              $t(`SMS.dataMaintenance`)
            }}</span>
          </li>
          <li @click="asideMenuChange(4)">
            <SetUp class="svg-16" />
            <span :class="{ 'primary-color': manageType === 4 }">{{
              $t(`SMS.fieldMaintenance`)
            }}</span>
          </li>
          <li @click="asideMenuChange(5)">
            <SetUp class="svg-16" />
            <span :class="{ 'primary-color': manageType === 5 }">{{
              $t(`SMS.layerMaintenance`)
            }}</span>
          </li>
          <li @click="asideMenuChange(6)">
            <SetUp class="svg-16" />
            <span :class="{ 'primary-color': manageType === 6 }">{{
              $t(`SMS.cityMaintenance`)
            }}</span>
          </li>
          <li @click="asideMenuChange(7)">
            <SetUp class="svg-16" />
            <span :class="{ 'primary-color': manageType === 7 }">{{
              $t(`SMS.cometitorMaintenance`)
            }}</span>
          </li>
          <li @click="asideMenuChange(8)">
            <SetUp class="svg-16" />
            <span :class="{ 'primary-color': manageType === 8 }">{{
              $t(`SMS.reportStatistics`)
            }}</span>
          </li>
          <li @click="asideMenuChange(9)">
            <SetUp class="svg-16" />
            <span :class="{ 'primary-color': manageType === 9 }">{{
              $t(`SMS.logStatistics`)
            }}</span>
          </li>
          <li ref="tag"></li>
        </ul>
      </div>
      <div class="content-main">
        <!-- content-aside 侧边工具栏展开折叠按钮 -->
        <svg
          v-rotateY:180="isAsideCollapse"
          class="icon svg-40"
          aria-hidden="true"
          @click="isAsideCollapse = !isAsideCollapse"
        >
          <use href="#icon-zuohua"></use>
        </svg>
        <!-- 系统设置项 -->
        <transition name="inOut" mode="out-in" appear>
          <component
            :is="isComponent[manageType]"
            :company-info="companyInfo"
            :brand-list="brandList"
            :cus-no="userInfo.cusNo"
            @on-success="init"
          />
        </transition>
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
