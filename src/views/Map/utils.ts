import { ref, Ref, onMounted } from 'vue';
import mapboxgl, { LngLatLike, Map } from 'mapbox-gl';
import { basicStore } from '@/pinia';
import { AMAP } from '@/plugin/Axios/config';
import { amapIP } from '@/apis/amap';
import { throttle } from '@/utils';
import type {
  MapWheelEvent,
  MapMouseEvent,
  LngLat,
  AnySourceData,
  LinePaint,
  CirclePaint,
  GeoJSONSource,
  FillPaint,
  SymbolPaint
} from 'mapbox-gl';
import type {
  Feature,
  FeatureCollection,
  GeoJsonProperties,
  Geometry,
  Position
} from 'geojson';
import * as turf from '@turf/turf';

/**
 * 继承 MapBox 的 Map 类，并增加封装方法
 */
class IMap extends Map {
  // 设置鼠标样式
  public setCursor(type: CSSStyleDeclaration['cursor']) {
    this.getCanvas().style.cursor = type;
  }
}

/*  变量
------------------------------------------------ */
const mapContainer = ref() as Ref<HTMLDivElement>; // 地图容器
export const map = ref() as Ref<IMap>; // 地图实例
export const initZoom = 9.0; // 初始缩放等级
export const minZoom = 9.0;
export const maxZoom = 18.0;
export const maxZoomCorrection = 17.4;

/**
 * 高德 IP 定位获取浏览器环境所在地址定位
 * @author GengBiao
 * @constructor
 */
const IPPosition = async () => {
  try {
    const data = await amapIP();
    const rectangle = data.rectangle.split(';');
    const diagonal1 = rectangle[0].split(',');
    const diagonal2 = rectangle[1].split(',');
    data.centerLngLat = {
      lng: (parseFloat(diagonal1[0]) + parseFloat(diagonal2[0])) / 2,
      lat: (parseFloat(diagonal1[1]) + parseFloat(diagonal2[1])) / 2
    };
    basicStore.setLoactionData(data);
  } catch (error) {
    console.log(error);
  }
};

/**
 * 增加地图控件：比例尺
 * @author GengBiao
 * @param map
 */
const createScale = (map: Map) => {
  const scale = new mapboxgl.ScaleControl({
    maxWidth: 100,
    unit: 'metric'
  });
  map.addControl(scale);
};

/**
 * 增加地图控件：缩放按钮控件
 * @author GengBiao
 * @param map
 *
 * note: 取消地图自带控件，改为自定义组件
 */
/*const createNav = (map: Map) => {
  const nav = new mapboxgl.NavigationControl({
    showCompass: false
  });
  map.addControl(nav, 'bottom-right');
};*/

/**
 * 增加地图控件：缩放级别显示
 * @author GengBiao
 * @param map
 */
class ZoomControl {
  _map: Map | undefined;
  _container: HTMLDivElement;
  constructor(m: Map, h: HTMLDivElement) {
    this._map = m;
    this._container = h;
  }
  onAdd(map: Map) {
    this._map = map;
    this._container.className = 'mapboxgl-ctrl mapboxgl-ctrl-zoom';
    this._container.textContent = `缩放级别:${initZoom}`;
    return this._container;
  }

  onRemove() {
    if (this._container.parentNode) {
      this._container.parentNode.removeChild(this._container);
    }
    this._map = undefined;
  }
}
const createZoom = (map: Map) => {
  map.addControl(
    new ZoomControl(map, document.createElement('div')),
    'bottom-right'
  );
};

/**
 * 绑定地图滚轮事件
 * @author GengBiao
 * @param map
 */
export const startZoom = ref(initZoom);
const mapOnWheel = (map: Map) => {
  map.on(
    'wheel',
    throttle((event: MapWheelEvent) => {
      /**
       * BUG:地图缩放等级为小数时，高德自带标注模糊
       * 解决:这里强行设置zoom为整数,利用 flyTo() 模拟地图缩放
       */
      const wheelDelta: number = event.originalEvent.deltaY;
      const latlng = map.getCenter();
      function mapFly(center: LngLat) {
        map.flyTo({
          center,
          zoom: startZoom.value,
          speed: 0.8
        });
      }
      if (wheelDelta > 0) {
        // 缩小处理
        startZoom.value = Math.floor(startZoom.value - 0.5);
        if (startZoom.value <= minZoom) startZoom.value = minZoom;
        mapFly(latlng);
      } else if (wheelDelta < 0) {
        // 放大处理
        startZoom.value = startZoom.value + 0.5;
        if (startZoom.value >= maxZoomCorrection) {
          startZoom.value = maxZoomCorrection;
        }
        mapFly(mouseCurrentLatlng);
      }

      document.getElementsByClassName('mapboxgl-ctrl-zoom')[0].innerHTML =
        '缩放级别:' + startZoom.value;
    }, 50)
  );
};

export const resetStartZoom = () => {
  startZoom.value = initZoom;
  document.getElementsByClassName('mapboxgl-ctrl-zoom')[0].innerHTML =
    '缩放级别:' + startZoom.value;
};

/**
 * 绑定地图鼠标移动事件
 * @author GengBiao
 * @param map
 */
let mouseCurrentLatlng: LngLat;
const mapOnMouseMove = (map: Map) => {
  map.on('mousemove', (event: MapMouseEvent) => {
    mouseCurrentLatlng = event.lngLat;
  });
};

/**
 * 初始化地图
 * @constructor
 */
export function UseInitMap() {
  const _mapContainer = mapContainer; // 地图容器
  const _map = map; // 地图实例
  // 初始化地图
  onMounted(async () => {
    await IPPosition();
    const AmapV3IP = basicStore.getLoactionData();
    const {
      centerLngLat: { lng, lat }
    } = AmapV3IP;
    mapboxgl.accessToken = AMAP.AMAP_ACCESSTOKEN;
    _map.value = new IMap({
      container: _mapContainer.value, // container ID
      style: {
        version: 8,
        name: 'Mapbox Streets',
        sources: {
          VECTORNROAD: {
            type: 'raster',
            tiles: [AMAP.AMAP_VECTORNROAD],
            scheme: 'xyz',
            tileSize: 256
          },
          SATELLITE: {
            type: 'raster',
            tiles: [AMAP.AMAP_SATELLITE],
            tileSize: 256
          }
        },
        layers: [
          {
            id: 'AMAP_VECTORNROAD',
            type: 'raster',
            source: 'VECTORNROAD',
            layout: {
              visibility: 'visible'
            }
          },
          {
            id: 'AMAP_SATELLITE',
            type: 'raster',
            source: 'SATELLITE',
            layout: {
              visibility: 'none'
            }
          }
        ]
      },
      center: [lng, lat], // starting position [lng, lat]
      zoom: initZoom, // starting zoom
      scrollZoom: false,
      minZoom: 3,
      maxZoom,
      maxBounds: new mapboxgl.LngLatBounds(
        [59.55988452620085, 12.957610757272292],
        [142.95624044533258, 53.95034432047234]
      ),
      doubleClickZoom: false, // 禁止双击缩放
      localIdeographFontFamily: "'Noto Sans', 'Noto Sans CJK SC', sans-serif", //字体
      preserveDrawingBuffer: true,
      dragRotate: false
    });

    createScale(_map.value);
    createZoom(_map.value);
    // createNav(_map.value);
    mapOnWheel(_map.value);
    mapOnMouseMove(_map.value);
  });

  return {
    mapContainer: _mapContainer,
    map: _map
  };
}

/*  封装图层
------------------------------------------------ */
/**
 * 图层封装公共方法
 */
class CreateLayer {
  protected key: string;
  protected paint: LinePaint | CirclePaint | FillPaint | SymbolPaint;
  public features = [] as Feature<Geometry, GeoJsonProperties>[]; // Geo 数据池
  constructor(
    key: string,
    paint: LinePaint | CirclePaint | FillPaint | SymbolPaint
  ) {
    this.key = key;
    this.paint = paint;
  }
  // 移除图层
  public removeLayer() {
    this.clearAllFeature();
    if (map.value.getLayer(`${this.key}`)) {
      map.value.removeLayer(`${this.key}`);
    }
    if (map.value.getSource(`${this.key}`)) {
      map.value.removeSource(`${this.key}`);
    }
  }

  // 改变图层数据
  public changeFeatures() {
    const json: FeatureCollection<Geometry, GeoJsonProperties> = {
      type: 'FeatureCollection',
      features: this.features
    };
    const source = map.value.getSource(`${this.key}`) as GeoJSONSource;
    source.setData(json);
  }

  // 改变单个feature数据
  public changeIndexFeature(
    index: number,
    coordinates: Position | Position[] | Position[][] | Position[][][]
  ) {
    const geometry = this.features[index].geometry as Geometry;
    if ('coordinates' in geometry) {
      geometry.coordinates = coordinates;
    }
    this.changeFeatures();
  }

  // 清除单个feature数据
  public clearIndexFeature(index: number) {
    // 清除数据
    const geometry = this.features[index].geometry as Geometry;
    if ('coordinates' in geometry) {
      geometry.coordinates.length = 0;
    }
    this.changeFeatures();
  }

  // 清除所有feature数据
  public clearAllFeature() {
    this.features.length = 0;
    this.changeFeatures();
  }

  // 创建source源
  protected createFeatureCollectionSource() {
    map.value.addSource(`${this.key}`, {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: this.features
      }
    } as AnySourceData);
  }
}

/**
 * 线段图层
 */
export class CreateLineLayer extends CreateLayer {
  constructor(key: string, paint: LinePaint) {
    super(key, paint);
    this.createLayer();
  }

  // 创建图层
  public createLayer() {
    if (!map.value.getLayer(`${this.key}`)) {
      if (!map.value.getSource(`${this.key}`)) {
        const _paint = this.paint as LinePaint;
        this.createFeatureCollectionSource();
        map.value.addLayer({
          id: `${this.key}`,
          type: 'line',
          source: `${this.key}`,
          paint: _paint
        });
      }
    }
  }
}

/**
 * 点圆图层
 */
export class CreateCycleLayer extends CreateLayer {
  constructor(key: string, paint: CirclePaint) {
    super(key, paint);
    this.createLayer();
  }

  // 创建图层
  public createLayer() {
    if (!map.value.getLayer(`${this.key}`)) {
      if (!map.value.getSource(`${this.key}`)) {
        const _paint = this.paint as CirclePaint;
        this.createFeatureCollectionSource();
        map.value.addLayer({
          id: `${this.key}`,
          type: 'circle',
          source: `${this.key}`,
          paint: _paint
        });
      }
    }
  }
}

/**
 * 图片 marker 图层
 */
export class CreateImgMarkerLayer extends CreateLayer {
  protected imgPath: string;
  protected iconSize: number;
  constructor(key: string, paint: SymbolPaint, img: string, iconSize = 1) {
    super(key, paint);
    this.imgPath = img;
    this.iconSize = iconSize;
    this.createMapImage();
    this.createLayer();
  }
  // 地图增加图片
  public createMapImage() {
    if (map.value.hasImage(this.key + 'image')) return;
    map.value.loadImage(this.imgPath, (err, img) => {
      if (err) throw err;
      if (img) {
        map.value.addImage(this.key + 'image', img);
      } else {
        throw new Error('image is undefined');
      }
    });
  }

  // 创建图层
  public createLayer() {
    if (!map.value.getLayer(`${this.key}`)) {
      if (!map.value.getSource(`${this.key}`)) {
        const _paint = this.paint as SymbolPaint;
        this.createFeatureCollectionSource();
        map.value.addLayer({
          id: `${this.key}`,
          type: 'symbol',
          source: `${this.key}`,
          paint: _paint,
          layout: {
            'icon-image': `${this.key}image`,
            'icon-size': this.iconSize,
            'icon-offset': [0, -20],
            'icon-allow-overlap': true
          }
        });
      }
    }
  }
}

/**
 * 填充图层
 */
export class CreateFillLayer extends CreateLayer {
  constructor(key: string, paint: FillPaint) {
    super(key, paint);
    this.createLayer();
  }

  // 创建图层
  public createLayer() {
    if (!map.value.getLayer(`${this.key}`)) {
      if (!map.value.getSource(`${this.key}`)) {
        const _paint = this.paint as FillPaint;
        this.createFeatureCollectionSource();
        map.value.addLayer({
          id: `${this.key}`,
          type: 'fill',
          source: `${this.key}`,
          paint: _paint
        });
      }
    }
  }
}

/*  工具函数
------------------------------------------------ */
/**
 * 计算圆圈坐标genjson数据
 * @param {Array} center 中心点 [lng,lat]
 * @param {Number} radiusInKm 半径 Km
 * @param {Number} points 圆圈的等分顶点数
 */
export const createGeoJSONCircle = (
  center: [number, number],
  radiusInKm: number,
  points = 32
) => {
  const coords = {
    latitude: center[1],
    longitude: center[0]
  };
  const km = radiusInKm;
  const ret = [];
  const distanceX = km / (111.32 * Math.cos((coords.latitude * Math.PI) / 180));
  const distanceY = km / 110.574;
  let theta, x, y;
  for (let i = 0; i < points; i++) {
    theta = (i / points) * (2 * Math.PI);
    x = distanceX * Math.cos(theta);
    y = distanceY * Math.sin(theta);
    ret.push([coords.longitude + x, coords.latitude + y]);
  }
  ret.push(ret[0]);
  return ret;
};

/**
 *  测量面积
 * @param coords
 * @param points
 */
export const getArea = (points: Position[], coords?: LngLatLike) => {
  let pts = coords ? points.concat([coords] as Position[]) : [...points];
  pts = pts.concat([pts[0]]);
  const polygon = turf.polygon([pts]);
  const area: number = turf.area(polygon);
  if (Math.floor(area) < 1000) {
    return Math.round(area) + 'm²';
  } else {
    return (area / 1000000).toFixed(2) + 'km²';
  }
};

/**
 * 测量距离
 * @param points
 * @param coords
 */
export const getLength = (points: Position[], coords: LngLatLike) => {
  const _points = points.concat([coords] as Position[]);
  const line = turf.lineString(_points);
  let len: number | string = turf.length(line);
  if (len < 1) {
    len = Math.round(len * 1000) + 'm';
  } else {
    len = len.toFixed(2) + 'km';
  }
  return len;
};
