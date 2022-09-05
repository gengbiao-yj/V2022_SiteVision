/*  组件自动化全局注册
------------------------------------------------ */
import type { App } from 'vue';

const components = require.context('./', true, /\.vue$/);
export default (app: App) => {
  components.keys().forEach(fileName => {
    const config = components(fileName);
    // console.log(config);
    if (config.default.name) {
      app.component(config.default.name, config.default);
    }
  });
};
