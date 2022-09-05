import { createApp } from 'vue';
import App from './App.vue';
import router, { setupRouter } from './router';
import { setupAllIcon } from '@/plugin/ElementPlus';
import { setupGlobalDirective } from '@/directives/index';
import setupComponents from '@/components/PublicGlobal/index';
import { createPinia } from 'pinia';
import 'element-plus/theme-chalk/el-loading.css';
import 'element-plus/theme-chalk/el-message.css';
import 'element-plus/theme-chalk/el-message-box.css';

async function bootstrap() {
  const app = createApp(App);
  setupRouter(app); // 挂载路由
  setupAllIcon(app); // 全量注册 element plus 图标
  setupGlobalDirective(app); // 注册全局指令
  setupComponents(app); // 注册全局组件
  app.use(createPinia());
  await router.isReady(); // 路由挂载完成再渲染页面
  app.mount('#app');
}

bootstrap();
