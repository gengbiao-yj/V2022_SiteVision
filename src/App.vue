<template>
  <el-config-provider :locale="locale">
    <router-view />
  </el-config-provider>
</template>

<script lang="ts" setup>
import { BASE_URL, urlKey } from '@/plugin/Axios/config';
import { ElConfigProvider } from 'element-plus';
import zhCn from 'element-plus/lib/locale/lang/zh-cn';
import en from 'element-plus/lib/locale/lang/en';
import { basicStore } from '@/pinia';
import { colorTransition } from '@/utils';

const { getSystemParams } = basicStore;
const baseURL = BASE_URL.get(process.env.NODE_ENV as urlKey) as string;
basicStore.setBaseUrl(baseURL);

/*  初始化系统设置
------------------------------------------------ */
// 主题色初始化
const systemSettings = getSystemParams();
const rgb = colorTransition(systemSettings.primaryColor, 'rgb') as rgbType;
// header 深色背景色
document.documentElement.style.setProperty(
  '--dark-header-color',
  systemSettings.darkHeaderColor
);
// 主题色
document.documentElement.style.setProperty('--primary-color-r', rgb.r + '');
document.documentElement.style.setProperty('--primary-color-g', rgb.g + '');
document.documentElement.style.setProperty('--primary-color-b', rgb.b + '');
document.documentElement.style.setProperty(
  '--primary-color',
  systemSettings.primaryColor
);

/*  element plus 中英文切换
------------------------------------------------ */
const languages = ref({
  zhCn,
  en
});
const locale = ref();
basicStore.$subscribe(
  (mutation, state) => {
    const currentLanguage = state.systemParams.language;
    locale.value = languages.value[currentLanguage];
  },
  {
    immediate: true
  }
);

// 阻止浏览器右键默然弹出框
document.oncontextmenu = () => {
  return false;
};
</script>

<style lang="scss">
@import 'scss/public.scss';
#app,
body {
  @include box-size(100vw, 100vh);
  overflow: hidden;
}
</style>
