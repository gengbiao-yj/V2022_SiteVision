/**
 * 业务组件涉及类型的集合
 */

/*  components 》 businessSelf 》 headerMenu
------------------------------------------------ */
interface MenuItem {
  label: string;
  value?: string;
  path?: string;
}
interface POIItem {
  name: string;
  title: string;
  items: Array<MenuItem>;
}

interface SystemSetType {
  primaryColor: string; // 当前主题色
  historyPrimaryCol: Array<string>; // 历史主题色, max: 5
  layoutType: 'UpDown' | 'LeftRight', // 导航栏布局
  primaryAside: boolean, // 侧边导航栏主题色
  primaryHeader: boolean, // 顶部导航栏主题色
}

interface TabsItem {
  title: string,
  name: string,
  path: string
}

export type { POIItem, SystemSetType, MenuItem, TabsItem };
