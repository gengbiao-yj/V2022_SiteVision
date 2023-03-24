/*  业务 - 本地代理配置与线上 BaseUrl
------------------------------------------------ */
const baseUrl = {
  uatProxy: '/uatProxy', // 本地开发(代理跨域 ：锐力对接址见测试环境)
  prodProxy: '/prodProxy', // 本地开发(代理跨域 ：锐力对接址见正式环境)
  uat: 'http://222.71.8.115:58089/api', // 锐力对接址见测试环境
  // product: 'http://pt.rls.com.cn:28089/api', // 锐力对接址见正式环境
  product: 'http://139.196.150.164:80/api', // 锐力对接址见正式环境,由我的测试服务器转发
  dev: 'http://49.4.67.0:9112', // 49演示环境API
  postMessage: '*' // Postmessage 父页面通用地址
};

export type urlKey = keyof typeof baseUrl;
export const BASE_URL = new Map<urlKey, string>();

Object.entries(baseUrl).map(([key, value]) => {
  BASE_URL.set(key as urlKey, value);
});

/*  地图 Api 相关配置数据
------------------------------------------------ */
export const AMAP = {
  // 高德地图 key
  AMAP_WEBKEY: '232be979602bea9df4ef2f8d7b4c30f5',
  // mapbox token
  AMAP_ACCESSTOKEN:
    'pk.eyJ1IjoiZnV5aXlvbmciLCJhIjoiY2s5M3U5cHl0MDJnZjNkbzBrNGI2emNycSJ9.iXNKWmed2otDqeIVchxiJw',
  //高德矢量+路网+标注
  AMAP_VECTORNROAD:
    'https://webrd03.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&scl=1&style=7&x={x}&y={y}&z={z}',
  //高德标注+路网
  AMAP_ROAD:
    'https://webst01.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scale=1&style=8',
  //高德只有标注
  AMAP_MARK:
    'https://wprd03.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=8&x={x}&y={y}&z={z}&scl=1&ltype=4',
  //高德卫星影像
  AMAP_SATELLITE:
    'https://webst01.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}'
};
