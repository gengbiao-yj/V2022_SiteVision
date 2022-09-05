import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import type { App } from 'vue';
import utilsRoutes from '@/router/utilsRoutes';
import businessRoutes from '@/router/businessRoutes';
import { storage } from '@/utils/index';

import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

/*  路由切换进度条配置
------------------------------------------------ */
NProgress.configure({
  easing: 'ease', // 动画方式
  speed: 200, // 递增进度条的速度
  showSpinner: false, // 是否显示加载 icon
  trickleSpeed: 100, // 自动递增间隔
  minimum: 0.3 // 初始化时的最小百分比
});

const routes: Array<RouteRecordRaw> = [...utilsRoutes, ...businessRoutes];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

router.beforeEach((to, from, next) => {
  // 进度条开始
  NProgress.start();
  // 登录验证
  if (to.meta.requireAuth) {
    // 登录返回的用户信息包含了 token
    if (storage.getLocal('userInfo')) {
      if (to.meta.title) {
        // document.title = to.meta.title as string;
        document.title = '址见-智慧选址';
      }
      next();
    } else {
      document.title = '址见-智慧选址';
      next('/Login');
    }
  } else {
    if (to.meta.title) {
      document.title = to.meta.title as string;
    }
    next();
  }
});

router.afterEach(() => {
  NProgress.done(); // 进度条结束
});

export default router;
export function setupRouter(app: App) {
  app.use(router);
}
