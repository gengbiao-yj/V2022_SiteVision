import { ref, Ref, onMounted } from 'vue';
import mapboxgl, {
  Map,
  MapWheelEvent,
  MapMouseEvent,
  LngLat,
  AnySourceData,
  LinePaint,
  CirclePaint,
  GeoJSONSource
} from 'mapbox-gl';
import { basicStore } from '@/pinia';
import { AMAP } from '@/plugin/Axios/config';
import { amapIP } from '@/apis/amap';
import { throttle } from '@/utils';
import {
  Feature,
  FeatureCollection,
  GeoJsonProperties,
  Point,
  LineString
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
 */
const createNav = (map: Map) => {
  const nav = new mapboxgl.NavigationControl({
    showCompass: false
  });
  map.addControl(nav, 'bottom-right');
};

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
let startZoom = initZoom;
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
      let zoom = 9;
      function mapFly(center: LngLat) {
        map.flyTo({
          center,
          zoom,
          speed: 0.8
        });
      }
      if (wheelDelta > 0) {
        // 缩小处理
        zoom = Math.floor(startZoom - 1);
        if (zoom <= 3) zoom = 3;
        startZoom = zoom;
        mapFly(latlng);
      } else if (wheelDelta < 0) {
        // 放大处理
        zoom = startZoom + 1;
        if (zoom >= 18) zoom = 17.4;
        startZoom = zoom;
        mapFly(mouseCurrentLatlng);
      }

      document.getElementsByClassName('mapboxgl-ctrl-zoom')[0].innerHTML =
        '缩放级别:' + startZoom;
    }, 50)
  );
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
          'osm-tiles': {
            type: 'raster',
            tiles: [AMAP.AMAP_VECTORNROAD],
            tileSize: 256
          }
        },
        layers: [
          {
            id: 'main',
            type: 'raster',
            source: 'osm-tiles',
            'source-layer': 'osmtiles'
          }
        ]
      },
      center: [lng, lat], // starting position [lng, lat]
      zoom: initZoom, // starting zoom
      scrollZoom: false,
      minZoom: 3,
      maxZoom: 18,
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
    createNav(_map.value);
    mapOnWheel(_map.value);
    mapOnMouseMove(_map.value);
  });

  return {
    mapContainer: _mapContainer,
    map: _map
  };
}

/**
 * 图层封装公共方法
 */
class CreateLayer {
  protected key: string;
  constructor(key: string) {
    this.key = key;
  }
  // 移除图层
  public removeLayer() {
    if (map.value.getLayer(`${this.key}source`)) {
      map.value.removeSource(`${this.key}source`);
    }
    if (map.value.getLayer(`${this.key}layer`)) {
      map.value.removeLayer(`${this.key}layer`);
    }
  }
}

/**
 * 线段图层
 */
export class CreateLineLayer extends CreateLayer {
  public features = [] as Feature<LineString, GeoJsonProperties>[];
  constructor(key: string, paint: LinePaint) {
    super(key);
    this.addLayer(paint);
  }

  // 创建图层
  public addLayer(paint: LinePaint) {
    if (!map.value.getLayer(`${this.key}layer`)) {
      if (!map.value.getSource(`${this.key}source`)) {
        map.value.addSource(`${this.key}source`, {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: this.features
          }
        } as AnySourceData);

        map.value.addLayer({
          id: `${this.key}layer`,
          type: 'line',
          source: `${this.key}source`,
          paint
        });
      }
    }
  }

  // 改变图层数据
  public changeFeatures() {
    const json: FeatureCollection<LineString, GeoJsonProperties> = {
      type: 'FeatureCollection',
      features: this.features
    };
    const source = map.value.getSource(`${this.key}source`) as GeoJSONSource;
    source.setData(json);
  }
}

/**
 * 点圆图层
 */
export class CreateCycleLayer extends CreateLayer {
  public features = [] as Feature<Point, GeoJsonProperties>[];
  constructor(key: string, paint: CirclePaint) {
    super(key);
    this.addLayer(paint);
  }

  // 创建图层
  public addLayer(paint: CirclePaint) {
    if (!map.value.getLayer(`${this.key}layer`)) {
      if (!map.value.getSource(`${this.key}source`)) {
        map.value.addSource(`${this.key}source`, {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: this.features
          }
        } as AnySourceData);

        map.value.addLayer({
          id: `${this.key}layer`,
          type: 'circle',
          source: `${this.key}source`,
          paint
        });
      }
    }
  }

  // 改变图层数据
  public changeFeatures() {
    const json: FeatureCollection<Point, GeoJsonProperties> = {
      type: 'FeatureCollection',
      features: this.features
    };
    const source = map.value.getSource(`${this.key}source`) as GeoJSONSource;
    source.setData(json);
  }
}
