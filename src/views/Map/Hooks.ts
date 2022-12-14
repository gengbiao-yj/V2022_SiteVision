import { ref, Ref, onMounted } from 'vue';
import mapboxgl, {
  Map,
  MapWheelEvent,
  MapMouseEvent,
  LngLat,
  AnySourceData,
  LinePaint,
  CirclePaint,
  GeoJSONSource,
  FillPaint
} from 'mapbox-gl';
import { basicStore } from '@/pinia';
import { AMAP } from '@/plugin/Axios/config';
import { amapIP } from '@/apis/amap';
import { throttle } from '@/utils';
import {
  Feature,
  FeatureCollection,
  GeoJsonProperties,
  Geometry,
  Position
} from 'geojson';

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
        startZoom.value = Math.floor(startZoom.value - 1);
        if (startZoom.value <= minZoom) startZoom.value = minZoom;
        mapFly(latlng);
      } else if (wheelDelta < 0) {
        // 放大处理
        startZoom.value = startZoom.value + 1;
        if (startZoom.value >= maxZoom) startZoom.value = maxZoomCorrection;
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
  protected paint: LinePaint | CirclePaint | FillPaint;
  public features = [] as Feature<Geometry, GeoJsonProperties>[]; // Geo 数据池
  constructor(key: string, paint: LinePaint | CirclePaint | FillPaint) {
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
    // 清除标记
    const properties = this.features[index].properties as GeoJsonProperties;
    if (properties && 'marker' in properties) {
      if ('remove' in properties.marker) {
        properties.marker.remove();
        properties.marker = null;
      }
    }
    this.changeFeatures();
  }

  // 清除所有feature数据
  public clearAllFeature() {
    this.features.forEach(feature => {
      const properties = feature.properties as GeoJsonProperties;
      if (properties && 'marker' in properties) {
        if ('remove' in properties.marker) {
          properties.marker.remove();
          properties.marker = null;
        }
      }
    });
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
