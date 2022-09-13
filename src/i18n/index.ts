import { createI18n } from 'vue-i18n';
import zh_CN from './zh_CN';
import en from './en';
import { storage } from '@/utils';

const systemSettings = storage.getLocal('systemSetting').value;

const messages = {
  zhCn: zh_CN,
  en
};

// 创建i18n实例
const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: systemSettings.language || 'zhCn',
  messages
});

export default i18n;
