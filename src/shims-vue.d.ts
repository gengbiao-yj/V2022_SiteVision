/* eslint-disable */
declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component; // 定义.vue文件，解决引入sfc文件报错的问题
}
/* eslint-disable */
declare module '*.json' {
  const value: any;
  export default value; // 定义.json文件，解决sfc文件引入json文件报错的问题
}
