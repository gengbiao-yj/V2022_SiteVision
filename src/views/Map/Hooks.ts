import { ref, Ref, onMounted } from 'vue';
import mapboxgl from 'mapbox-gl';
import { basicStore } from '@/pinia';
import { AMAP } from '@/plugin/Axios/config';
import { amapIP } from '@/apis/amap';

// IP 定位
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

export function UseInitMap() {
  // 声明变量
  const mapConatiner = ref() as Ref<HTMLDivElement>;
  const map = ref();
  // 初始化地图
  onMounted(async () => {
    await IPPosition();
    const AmapV3IP = basicStore.getLoactionData();
    const {
      centerLngLat: { lng, lat }
    } = AmapV3IP;
    mapboxgl.accessToken = AMAP.AMAP_ACCESSTOKEN;
    map.value = new mapboxgl.Map({
      container: mapConatiner.value, // container ID
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
      zoom: 9, // starting zoom
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
  });

  return {
    mapConatiner,
    map
  };
}
