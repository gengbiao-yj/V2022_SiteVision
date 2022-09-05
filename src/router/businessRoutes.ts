import { RouteRecordRaw } from 'vue-router';

const routes = [
  {
    path: `/Login`,
    name: `Login`,
    component: () => import('@/views/Login.vue'),
    meta: {}
  },
  {
    path: `/Main`,
    name: `Main`,
    component: () => import('@/views/Main.vue'),
    meta: {},
    children: [
      /*  数据表格
      ------------------------------------------------ */
      {
        path: 'DataList',
        name: 'DataListIndex',
        component: () => import('@/views/DataTable/index.vue'),
        meta: {
          title: '数据管理',
          requireAuth: true
        },
        children: [
          {
            path: 'Pipeline',
            name: 'ListPipeline',
            component: () => import('@/views/DataTable/ListPipeline.vue'),
            meta: {
              title: '机会项目列表',
              requireAuth: true
            }
          },
          {
            path: 'Store',
            name: 'ListStore',
            component: () => import('@/views/DataTable/ListStore.vue'),
            meta: {
              title: '已开门店列表',
              requireAuth: true
            }
          },
          {
            path: 'Competitor',
            name: 'ListCompetitor',
            component: () => import('@/views/DataTable/ListCompetitor.vue'),
            meta: {
              title: '关注竞品列表',
              requireAuth: true
            }
          },
          {
            path: 'BusinessCircle',
            name: 'ListBusinessCircle',
            component: () => import('@/views/DataTable/ListBusinessCircle.vue'),
            meta: {
              title: '已有商圈列表',
              requireAuth: true
            }
          }
        ]
      },
      /*  系统维护
      ------------------------------------------------ */
      {
        path: '/Main/SystemManagement',
        name: 'SystemManagement',
        component: () => import('@/views/SystemManagement/Index.vue'),
        meta: {
          title: '系统维护',
          requireAuth: true
        }
      },
      {
        path: '/Main/AccountSetting',
        name: 'AccountSetting',
        component: () => import('@/views/AccountSetting/index.vue'),
        meta: {
          title: '个人信息',
          requireAuth: true
        }
      },
      /*  地图页面
      ------------------------------------------------ */
      {
        path: 'MainMap',
        name: 'MainMap',
        component: () => import('@/views/Map/Map.vue'),
        meta: {
          title: '地图主页',
          requireAuth: true
        }
      },
      /*  功能页面
      ------------------------------------------------ */
      {
        path: '404',
        name: '404',
        component: () => import('@/views/FunctionPage/404.vue'),
        meta: {
          title: '404',
          requireAuth: true
        }
      },
      {
        path: 'Refresh', // 空页面，用于业务页面强制刷新
        name: 'Refresh',
        component: () => import('@/views/FunctionPage/Refresh.vue'),
        meta: {
          title: '',
          requireAuth: true
        }
      }
    ]
  }
] as RouteRecordRaw[];

export default routes;
