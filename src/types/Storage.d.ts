/**
 * storage 封装浏览器存储涉及的类型集合
 */

const storageKey = [
  'userInfo', // 用户信息
  'currentPosition', // 当前位置信息
  'systemSetting', // 系统设置参数
  'routerTabs', // 导航标签页
  'baseUrl' // BASE_URL
] as const;
type StorageKeyType = typeof storageKey[number];
// session 值类型
interface SessionStorageValue {
  value: any;
}

// local 值类型
interface LocalStorageValue {
  value: any;
  expirationT: number;
}

// local 提取函数，返回值类型
interface GetLocalStorage<T = any> {
  value: T;
  msg: string;
  status: 0 | 1;
}

export type {
  StorageKeyType,
  SessionStorageValue,
  LocalStorageValue,
  GetLocalStorage
};
