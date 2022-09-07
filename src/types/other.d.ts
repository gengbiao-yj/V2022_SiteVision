/**
 * 未分类的 TS 类型集合
 */

/*  事件总线名称
------------------------------------------------ */
const names = [
  'menuCollapse', // menu 菜单折叠状态
  'leftRightWidth800', // 左右布局，浏览器宽度800px判定
  'leftRightWidth700' // 左右布局，浏览器宽度700px判定
] as const;
declare type eventBusName = typeof names[number];

/*  storage 封装浏览器存储涉及的类型集合
------------------------------------------------ */
// storage 键值集合
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

/*  util 方法中使用的类型
------------------------------------------------ */
// 转rgb颜色
interface rgbType {
  r: number;
  b: number;
  g: number;
}

/*  DOM ref
------------------------------------------------ */
interface _HTMLDivElement {
  value: HTMLDivElement;
}

interface _SVGElement {
  value: SVGElement;
}
