/*  业务 - 本地代理配置与线上 BaseUrl
------------------------------------------------ */
const baseUrl = {
  uatProxy: '/uatProxy', // 本地开发(代理跨域 ：锐力对接址见测试环境)
  prodProxy: '/prodProxy', // 本地开发(代理跨域 ：锐力对接址见正式环境)
  uat: 'http://222.71.8.115:58089/api', // 锐力对接址见测试环境
  product: 'http://pt.rls.com.cn:28089/api', // 锐力对接址见正式环境
  dev: 'http://49.4.67.0:9112', // 49演示环境API
  postMessage: '*' // Postmessage 父页面通用地址
};

export type urlKey = keyof typeof baseUrl;
export const BASE_URL = new Map<urlKey, string>();

Object.entries(baseUrl).map(([key, value]) => {
  BASE_URL.set(key as urlKey, value);
});

/*  高德地图 Api 相关配置数据
------------------------------------------------ */
export const AMAP = {
  AMAP_WEBKEY: '083275edac4010a5c6013c093826bd02',
  AMAP_ACCESSTOKEN:
    'pk.eyJ1IjoiZnV5aXlvbmciLCJhIjoiY2s5M3U5cHl0MDJnZjNkbzBrNGI2emNycSJ9.iXNKWmed2otDqeIVchxiJw'
};
