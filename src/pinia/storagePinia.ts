import { defineStore } from 'pinia';
import { ref } from 'vue';
import type {
  UserLogin,
  SystemSetType,
  rgbType,
  TabsItem
} from '@/types/index';
import { storage, colorTransition } from '@/utils';

export default defineStore('basicPinia', () => {
  /*  用户信息存取
  ------------------------------------------------ */
  const userInfo = ref({} as UserLogin);
  function getUserInfo() {
    userInfo.value = storage.getLocal('userInfo').value;
    return userInfo.value;
  }
  function setUserInfo(data: UserLogin) {
    userInfo.value = data;
    storage.setLocal('userInfo', data, 1000 * 60 * 60 * 12);
  }
  function resetUserInfo() {
    userInfo.value = {} as UserLogin;
    storage.removeLocal('userInfo');
  }

  /*  系统设置存取
  ------------------------------------------------ */
  const systemParams = ref<SystemSetType>({
    primaryColor: '#5aa3ec',
    historyPrimaryCol: ['#5aa3ec'],
    layoutType: 'UpDown',
    primaryAside: false,
    primaryHeader: false
  });
  function getSystemParams() {
    const storageValue = storage.getLocal('systemSetting').value;
    if (storageValue) {
      systemParams.value = storageValue;
    }
    return systemParams.value;
  }
  function setSystemParams(data: SystemSetType) {
    // 设置主题颜色
    const rgb = colorTransition(data.primaryColor, 'rgb') as rgbType;
    document.documentElement.style.setProperty('--primary-color-r', rgb.r + '');
    document.documentElement.style.setProperty('--primary-color-g', rgb.g + '');
    document.documentElement.style.setProperty('--primary-color-b', rgb.b + '');
    document.documentElement.style.setProperty(
      '--primary-color',
      data.primaryColor
    );
    systemParams.value = data;
    storage.setLocal('systemSetting', data, 1000 * 60 * 60 * 24 * 7);
  }

  /*  header tabs 导航标签页持久化存储
  ------------------------------------------------ */
  const tabs = ref<Array<TabsItem>>([
    {
      title: '地图主页',
      name: '/Main/MainMap',
      path: '/Main/MainMap'
    }
  ]);

  function setTabs(data: Array<TabsItem>) {
    tabs.value = data;
    storage.setLocal('routerTabs', data, 1000 * 60 * 60 * 24 * 7);
  }

  function getTabs() {
    const storageValue = storage.getLocal('routerTabs').value;
    if (storageValue) {
      tabs.value = storageValue;
    }
    return tabs.value;
  }

  /*  BASE_URL 存储
  ------------------------------------------------ */
  const BASE_URL = ref<string>('');
  function setBaseUrl(data: string) {
    BASE_URL.value = data;
    storage.setSession('baseUrl', data);
  }
  function getBaseUrl() {
    BASE_URL.value = storage.getSession('baseUrl').value;
    return BASE_URL.value;
  }

  return {
    getUserInfo,
    setUserInfo,
    resetUserInfo,
    userInfo,
    systemParams,
    getSystemParams,
    setSystemParams,
    tabs,
    setTabs,
    getTabs,
    BASE_URL,
    setBaseUrl,
    getBaseUrl
  };
});
