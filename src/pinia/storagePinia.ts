import { defineStore } from 'pinia';
import { ref, Ref } from 'vue';
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
    primaryColor: '#3861c8',
    historyPrimaryCol: [
      '#3861c8',
      '#EC5A69',
      '#EC5A90',
      '#EC5ABE',
      '#EC5AE5',
      '#CF5AEC',
      '#AD5AEC',
      '#815AEC',
      '#5C5AEC',
      '#5A83EC',
      '#5AAAEC',
      '#5AD4EC',
      '#5AECD9',
      '#5AECAA',
      '#5AEC7A',
      '#66EC5A',
      '#94EC5A',
      '#C0EC5A',
      '#EAEC5A',
      '#ECCC5A',
      '#ECAA5A',
      '#EC815A',
      '#EC5A5A',
      '#5aa3ec'
    ],
    layoutType: 'UpDown',
    primaryAside: false,
    primaryHeader: false,
    language: 'zhCn',
    languageIcons: ['#zhCn', '#en']
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
      title: 'metaTitle.mainMap',
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

  /*  当前用户定位数据存储存储
  ------------------------------------------------ */
  const loactionData = ref() as Ref<AmapV3IP>;
  function setLoactionData(data: AmapV3IP) {
    loactionData.value = data;
    storage.setSession('currentPosition', data);
  }
  function getLoactionData() {
    loactionData.value = storage.getSession('currentPosition').value;
    return loactionData.value;
  }

  /*  地图截图暂存照片数据存储
  ------------------------------------------------ */
  const screenshot = ref<SavingScreenshot[]>([]);
  function setScreenshotLst(data: SavingScreenshot[]) {
    screenshot.value = data;
    storage.setSession('screenshotLst', data);
  }

  function getScreenshotLst() {
    const historyLst = storage.getSession('screenshotLst');
    if (historyLst.value) screenshot.value = historyLst.value;
    return screenshot;
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
    getBaseUrl,
    setLoactionData,
    getLoactionData,
    setScreenshotLst,
    getScreenshotLst
  };
});
