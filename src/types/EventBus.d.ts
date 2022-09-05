/*  事件总线名称
------------------------------------------------ */
const names = [
  'menuCollapse', // menu 菜单折叠状态
  'leftRightWidth800', // 左右布局，浏览器宽度800px判定
  'leftRightWidth700' // 左右布局，浏览器宽度700px判定
] as const;
type eventBusName = typeof names[number];

export type { eventBusName };
