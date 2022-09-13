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
          title: 'metaTitle.dataList',
          requireAuth: true
        },
        children: [
          {
            path: 'Pipeline',
            name: 'ListPipeline',
            component: () => import('@/views/DataTable/ListPipeline.vue'),
            meta: {
              title: 'metaTitle.pipeline',
              requireAuth: true
            }
          },
          {
            path: 'Store',
            name: 'ListStore',
            component: () => import('@/views/DataTable/ListStore.vue'),
            meta: {
              title: 'metaTitle.store',
              requireAuth: true
            }
          },
          {
            path: 'Competitor',
            name: 'ListCompetitor',
            component: () => import('@/views/DataTable/ListCompetitor.vue'),
            meta: {
              title: 'metaTitle.competitor',
              requireAuth: true
            }
          },
          {
            path: 'BusinessCircle',
            name: 'ListBusinessCircle',
            component: () => import('@/views/DataTable/ListBusinessCircle.vue'),
            meta: {
              title: 'metaTitle.businessCircle',
              requireAuth: true
            }
          }
        ]
      },
      /*  系统维护
      ------------------------------------------------ */
      {
        path: 'SystemManagement',
        name: 'SystemManagement',
        component: () => import('@/views/SystemManagement/Index.vue'),
        meta: {
          title: 'metaTitle.systemManagement',
          requireAuth: true
        }
      },
      {
        path: 'AccountSetting',
        name: 'AccountSetting',
        component: () => import('@/views/AccountSetting/index.vue'),
        meta: {
          title: 'metaTitle.accountSetting',
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
          title: 'metaTitle.mainMap',
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
