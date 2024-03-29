<!-- 系统设置 - 侧拉抽屉 -->
<script setup lang="ts">
import { basicStore } from '@/pinia';
import { useI18n } from 'vue-i18n';

const { getSystemParams, setSystemParams } = basicStore;
// 创建i18n对象
const i18n = useI18n();

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  }
});
const emit = defineEmits(['update:modelValue']);

/*  el-drawer 显示隐藏控制
------------------------------------------------ */
const showDraw = ref<boolean>(props.modelValue || false);
watch(
  () => props.modelValue,
  newV => {
    showDraw.value = newV;
  }
);
const updateState = () => {
  emit('update:modelValue', false);
};

/*  存储设置数据
------------------------------------------------ */
const systemSettings = computed<SystemSetType>(() => {
  return getSystemParams();
});

// 设置系统语言
const selectLanguage = (e: '#zhCn' | '#en') => {
  systemSettings.value.language = e.slice(1) as 'zhCn' | 'en';
  i18n.locale.value = systemSettings.value.language;
  setSystemParams(systemSettings.value);
};

// 设置新主题
const newPrimaryColor = () => {
  systemSettings.value.historyPrimaryCol.unshift(
    systemSettings.value.primaryColor
  );
  if (systemSettings.value.historyPrimaryCol.length > 24) {
    systemSettings.value.historyPrimaryCol.splice(23);
  }
  setSystemParams(systemSettings.value);
};

// 选择历史主题
const selectOldPrimary = (e: string) => {
  systemSettings.value.primaryColor = e;
  setSystemParams(systemSettings.value);
};

// 选择布局方式
const selectLayoutType = (e: 'UpDown' | 'LeftRight') => {
  if (e === 'UpDown') {
    systemSettings.value.primaryHeader = true;
  }
  systemSettings.value.layoutType = e;
  setSystemParams(systemSettings.value);
};

// 配置选择导航栏主题
const isMenuPrimary = (aside: boolean, header: boolean) => {
  if (aside && !header) {
    systemSettings.value.primaryAside = !systemSettings.value.primaryAside;
  } else if (!aside && header) {
    systemSettings.value.primaryHeader = !systemSettings.value.primaryHeader;
  } else {
    systemSettings.value.primaryAside = false;
    systemSettings.value.primaryHeader = false;
  }
  setSystemParams(systemSettings.value);
};
</script>
<script lang="ts">
export default {
  name: 'SystemSetting'
};
</script>

<template>
  <!-- 设置 -->
  <el-drawer
    v-model="showDraw"
    :title="$t(`system.title`)"
    direction="rtl"
    custom-class="setting-draw"
    :size="270"
    @close="updateState"
  >
    <div class="setting-draw-content">
      <el-divider> {{ $t(`system.language`) }} </el-divider>
      <div class="primary-box">
        <div v-for="(e, i) in systemSettings.languageIcons" :key="i">
          <svg
            class="icon svg-24 cur-pointer"
            aria-hidden="true"
            @click="selectLanguage(e)"
          >
            <use :href="e"></use>
          </svg>
          <span
            v-if="e === `#${systemSettings.language}`"
            class="circle-tip"
          ></span>
        </div>
      </div>
      <el-divider> {{ $t(`system.primaryColor`) }} </el-divider>
      <el-color-picker
        v-model="systemSettings.primaryColor"
        @change="newPrimaryColor"
      />
      <div class="primary-box">
        <div v-for="(e, i) in systemSettings.historyPrimaryCol" :key="i">
          <span
            class="primary-box-item"
            :style="{ background: e }"
            @click="selectOldPrimary(e)"
          ></span>
          <span
            v-if="e === systemSettings.primaryColor"
            class="circle-tip"
          ></span>
        </div>
      </div>
      <el-divider> {{ $t(`system.layOut`) }} </el-divider>
      <div class="layout-type-box">
        <!-- 左右 -->
        <div class="layout-type">
          <div @click="selectLayoutType('LeftRight')">
            <div class="layout-aside"></div>
          </div>
          <span>{{ $t(`system.leftRight`) }}</span>
          <span
            v-if="systemSettings.layoutType === 'LeftRight'"
            class="circle-tip"
          ></span>
        </div>
        <!-- 上下 -->
        <div class="layout-type">
          <div @click="selectLayoutType('UpDown')">
            <div class="layout-header"></div>
          </div>
          <span>{{ $t(`system.upDown`) }}</span>
          <span
            v-if="systemSettings.layoutType === 'UpDown'"
            class="circle-tip"
          ></span>
        </div>
      </div>
      <el-divider> {{ $t(`system.layOutPrimary`) }} </el-divider>
      <div class="layout-type-box">
        <!-- 侧边栏主题色 -->
        <div
          v-show="systemSettings.layoutType == 'LeftRight'"
          class="layout-type"
        >
          <div @click="isMenuPrimary(true, false)">
            <div class="layout-aside primary-bg-color"></div>
          </div>
          <span>{{ $t(`system.sideBar`) }}</span>
          <span v-if="systemSettings.primaryAside" class="circle-tip"></span>
        </div>
        <!-- 顶栏主题色 -->
        <div v-show="systemSettings.layoutType == 'UpDown'" class="layout-type">
          <div @click="isMenuPrimary(false, true)">
            <div
              class="layout-header"
              :style="{ 'background-color': systemSettings.darkHeaderColor }"
            ></div>
          </div>
          <span>{{ $t(`system.topBar`) }}</span>
          <span v-if="systemSettings.primaryHeader" class="circle-tip"></span>
        </div>
        <!-- 侧栏+顶栏白色 -->
        <div class="layout-type layout-primary-cancel">
          <div @click="isMenuPrimary(false, false)">
            <div class="layout-header"></div>
            <div class="layout-aside"></div>
          </div>
          <span>{{ $t(`system.cancel`) }}</span>
          <span
            v-if="
              (!systemSettings.primaryHeader &&
                systemSettings.layoutType == 'UpDown') ||
              (!systemSettings.primaryAside &&
                systemSettings.layoutType == 'LeftRight')
            "
            class="circle-tip"
          ></span>
        </div>
      </div>
    </div>
  </el-drawer>
</template>

<style scoped lang="scss">
.setting-draw {
  &-content {
    width: 100%;
    height: 100%;
    @include flex(column, flex-start, center);
  }
}

.el-divider:deep(.el-divider__text) {
  white-space: nowrap;
}

.circle-tip {
  margin-top: 5px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #03be32;
}

// 主题盒子
.primary-box {
  width: 100%;
  margin-top: 10px;
  height: auto;
  @include flex(row, space-around, center);
  flex-wrap: wrap;
  > div {
    width: 26px;
    height: 40px;
    @include flex(column, flex-start, center);
    > .primary-box-item {
      width: 22px;
      height: 22px;
      border-radius: 4px;
      padding: 1px;
      border: 1px solid #afafaf;
      cursor: pointer;
    }
  }
}

// 导航栏布局、主题盒子
.layout-type-box {
  width: 100%;
  height: auto;
  @include flex(row, space-around, center);
  > .layout-type {
    height: 80px;
    @include flex(column, flex-start, center);
    > div {
      width: 50px;
      height: 40px;
      position: relative;
      background: #dedede;
      border-radius: 5px;
      overflow: hidden;
      box-shadow: 0px 0px 10px 2px #ededed;
      .layout-aside {
        width: 15px;
        height: 100%;
        background: #ffffff;
        //background: #1a1a1a;
        position: absolute;
        left: 0px;
      }
      .layout-header {
        height: 10px;
        width: 100%;
        background: #ffffff;
        position: absolute;
        top: 0px;
      }
    }
    > span:nth-child(2) {
      font-size: 12px;
      color: #333333;
    }
  }
  .layout-primary-cancel {
    position: relative;
    &::before {
      display: block;
      content: '';
      width: 1px;
      height: 26px;
      position: absolute;
      top: 7px;
      left: -14px;
      background: #cecece;
    }
  }
}
</style>
