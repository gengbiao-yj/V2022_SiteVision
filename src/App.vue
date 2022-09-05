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
import basicPinia from '@/pinia/storagePinia';
import { colorTransition } from '@/utils';
import type { rgbType } from '@/types/index';

const basicStore = basicPinia();
const { getSystemParams } = basicStore;

const baseURL = BASE_URL.get(process.env.NODE_ENV as urlKey) as string;
basicStore.setBaseUrl(baseURL);

/*  初始化系统设置
------------------------------------------------ */
// 主题色初始化
const systemSettings = getSystemParams();
const rgb = colorTransition(systemSettings.primaryColor, 'rgb') as rgbType;
document.documentElement.style.setProperty('--primary-color-r', rgb.r + '');
document.documentElement.style.setProperty('--primary-color-g', rgb.g + '');
document.documentElement.style.setProperty('--primary-color-b', rgb.b + '');
document.documentElement.style.setProperty(
  '--primary-color',
  systemSettings.primaryColor
);

/*  element plus 中英文切换
------------------------------------------------ */
// const languages = ref([zhCn, en, pt, fr, ja, ko]);
const languages = ref([zhCn, en]);
const locale = ref(
  languages.value[Math.floor(Math.random() * languages.value.length)]
);
</script>

<style lang="scss">
@import 'scss/public.scss';
#app,
body {
  @include box-size(100vw, 100vh);
  overflow: hidden;
}
</style>
