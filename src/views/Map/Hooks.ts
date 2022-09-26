import { ref, Ref, onMounted } from 'vue';
import mapboxgl, { Map } from 'mapbox-gl';
import { basicStore } from '@/pinia';
import { AMAP } from '@/plugin/Axios/config';
import { amapIP } from '@/apis/amap';

/*  变量
------------------------------------------------ */
const mapContainer = ref() as Ref<HTMLDivElement>; // 地图容器
const map = ref() as Ref<Map>; // 地图实例
const initZoom = 9.0; // 初始缩放等级

/*  高德 IP 定位
------------------------------------------------ */
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

/*  控制类 - 缩放级别
------------------------------------------------ */
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

/*  显示比例尺
------------------------------------------------ */
const createScale = (map: Map) => {
  const scale = new mapboxgl.ScaleControl({
    maxWidth: 100,
    unit: 'metric'
  });
  map.addControl(scale);
};

/*  显示缩放控制
------------------------------------------------ */
const createNav = (map: Map) => {
  const nav = new mapboxgl.NavigationControl({
    showCompass: false
  });
  map.addControl(nav, 'bottom-right');
};

/*  显示缩放级别
------------------------------------------------ */
const createZoom = (map: Map) => {
  map.addControl(
    new ZoomControl(map, document.createElement('div')),
    'bottom-right'
  );
};

/*  绑定地图缩放事件
------------------------------------------------ */
const mapOnZoomed = (map: Map) => {
  map.on('zoomend', () => {
    const zoom = map.getZoom().toFixed(2); // 获取缩放级别
    document.getElementsByClassName('mapboxgl-ctrl-zoom')[0].innerHTML =
      '缩放级别:' + zoom;
  });
  map.resize();
};

/*  初始化地图
------------------------------------------------ */
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
    _map.value = new mapboxgl.Map({
      container: _mapContainer.value, // container ID
      style: {
        version: 8,
        name: 'Mapbox Streets',
        sprite: 'mapbox://sprites/mapbox/streets-v8',
        glyphs: 'mapbox://fonts/mapbox/{fontstack}/{range}.pbf',
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
      minZoom: 3,
      maxZoom: 17.3,
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
    mapOnZoomed(_map.value);
  });

  return {
    mapContainer: _mapContainer,
    map: _map
  };
}
