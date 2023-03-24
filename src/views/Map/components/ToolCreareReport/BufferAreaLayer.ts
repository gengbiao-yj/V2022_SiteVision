/**
 * 缓冲区
 */
import {
  CreateFillLayer,
  CreateImgMarkerLayer,
  CreateLineLayer,
  map,
  startZoom,
  createGeoJSONCircle,
  getArea
} from '@/views/Map/utils';
import type { MapMouseEvent } from 'mapbox-gl';
import { calculateCenter } from '@/utils';
import type { Position } from 'geojson';
import { ElMessageBox } from 'element-plus/es';
import { Marker, MarkerOptions } from 'mapbox-gl';
import type { Feature, GeoJsonProperties, Polygon } from 'geojson';

export const bufferAreaRadius = ref<number>(100); // 缓冲区半径
export const bufferAreaOption = ref<'reset' | 'draw' | ''>(''); // 操作
export const bufferAreaMin = ref<number>(100); // 半径最小值
export const bufferAreaMax = ref<number>(5000); // 半径最大值
export const bufferAreaMarks = ref({
  100: '100m',
  5000: '5000m'
});
export const bufferDrawer = ref(false); // 商圈分析弹窗
export const bufferCoordinates = ref<Position[][]>([]); // 被点击商圈的坐标数据集

// 创建缓冲区图层
let bufferAreaFillLayer: CreateFillLayer | null; // 多边形填充图层
let bufferAreaLineLayer: CreateLineLayer | null; // 多边形边框图层
let bufferAreaMarkerLayer: CreateImgMarkerLayer | null; // 多边形指示图标图层
const bufferAreaDeleteMarkers: Array<Marker | null> = []; // 多边形删除图标
const createBufferAreaLayer = () => {
  bufferAreaFillLayer = new CreateFillLayer('bufferAreaFillLayer', {
    'fill-color': '#cb45fe',
    'fill-opacity': 0.3
  });
  bufferAreaLineLayer = new CreateLineLayer('bufferAreaLineLayer', {
    'line-color': '#cb45fe',
    'line-width': 2,
    'line-opacity': 0.8
  });
  bufferAreaMarkerLayer = new CreateImgMarkerLayer(
    'bufferAreaMarkerLayer',
    { 'icon-opacity': 1 },
    require('@/assets/img/map/slmcom.png'),
    0.5
  );
  map.value.on('mouseenter', ['bufferAreaMarkerLayer'], () => {
    map.value.setCursor('pointer');
  });
  map.value.on('mouseleave', ['bufferAreaMarkerLayer'], () => {
    map.value.setCursor('');
  });
  map.value.on('click', 'bufferAreaFillLayer', (e: any) => {
    bufferCoordinates.value = e.features[0].geometry.coordinates;
    bufferDrawer.value = true;
  });
};

// 调用 mapbox api 计算缓冲区数据
export const calculateBufferAreaData = () => {
  map.value.setCursor('crosshair');
  if (!bufferAreaFillLayer && !bufferAreaLineLayer && !bufferAreaMarkerLayer) {
    createBufferAreaLayer();
  }
  const mapClick = async (e: MapMouseEvent) => {
    try {
      bufferAreaOption.value = '';
      map.value.setCursor('default');
      const ret = createGeoJSONCircle(
        [e.lngLat.lng, e.lngLat.lat],
        bufferAreaRadius.value / 1000,
        64
      );
      const features = [
        {
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [ret]
          },
          properties: {}
        }
      ] as Feature<Polygon, GeoJsonProperties>[];
      // 图层添加数据
      features.forEach(e => {
        const centerPoint = calculateCenter(e.geometry.coordinates[0]) as any;
        bufferAreaMarkerLayer?.features.push({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: centerPoint
          },
          properties: {}
        });
        bufferAreaMarkerLayer?.changeFeatures();

        // 创建删除图标
        const area = getArea(ret);
        let el: HTMLDivElement | null = document.createElement('div');
        el.setAttribute('class', 'measure-area-close font-13-500');
        el.innerText = `R:${bufferAreaRadius.value / 1000}km / S:${area} ✘`;
        const option: MarkerOptions = {
          element: el,
          anchor: 'top',
          offset: [0, 10]
        };
        const marker = new Marker(option)
          .setLngLat(centerPoint)
          .addTo(map.value);

        // 绑定删除事件
        const index = bufferAreaMarkerLayer!.features.length - 1;
        const delFunc = (event: Event) => {
          event.stopPropagation();
          bufferAreaDeleteMarkers[index]!.remove();
          bufferAreaDeleteMarkers.splice(index, 1, null);

          bufferAreaMarkerLayer!.clearIndexFeature(index);
          bufferAreaFillLayer!.clearIndexFeature(index);
          bufferAreaLineLayer!.clearIndexFeature(index);

          el?.removeEventListener('click', delFunc);
          el = null;
        };
        el.addEventListener('click', delFunc);
        bufferAreaDeleteMarkers.push(marker);
      });
      bufferAreaFillLayer?.features.push(...features);
      bufferAreaFillLayer?.changeFeatures();
      bufferAreaLineLayer?.features.push(...features);
      bufferAreaLineLayer?.changeFeatures();
      map.value.flyTo({
        center: [e.lngLat.lng, e.lngLat.lat],
        zoom: 14
      });
      startZoom.value = 14;
      document.getElementsByClassName('mapboxgl-ctrl-zoom')[0].innerHTML =
        '缩放级别:' + startZoom.value;
      map.value.off('click', mapClick);
    } catch (e) {
      console.log(e);
      map.value.off('click', mapClick);
    }
  };
  map.value.once('click', mapClick);
};

// 清除缓冲区图层
export const clearBufferAreaLayer = () => {
  ElMessageBox.confirm('确认清除所有已选取的缓冲区嘛？')
    .then(() => {
      bufferAreaOption.value = '';
      bufferAreaFillLayer?.removeLayer();
      bufferAreaLineLayer?.removeLayer();
      bufferAreaMarkerLayer?.removeLayer();
      bufferAreaFillLayer = null;
      bufferAreaLineLayer = null;
      bufferAreaMarkerLayer = null;
      bufferAreaDeleteMarkers.forEach(e => e?.remove());
      bufferAreaDeleteMarkers.length = 0;
    })
    .catch(err => {
      console.log(err);
    });
};
