// 目前自动注册的路由不能启用懒加载模式，已放弃该方案
import { RouteRecordRaw } from 'vue-router';

const businessPages = require.context('../views/BusinessPage', true, /\.vue$/);
const businessRoute = [] as RouteRecordRaw[];

businessPages.keys().forEach(path => {
  const model = businessPages(path);
  getRouteByModel(path, model);
});
function getRouteByModel(filePath: string, model: { [key: string]: any }) {
  const name = filePath.split('/').pop()?.split('.')[0];
  const route = {
    path: `/${name}`,
    name: `${name}`,
    // component: () => import(`../${model.default.__file.split('src/')[1]}`),
    component: model.default,
    meta: {
      title: '登录'
    }
  };
  businessRoute.push(route);
}
export default businessRoute;
