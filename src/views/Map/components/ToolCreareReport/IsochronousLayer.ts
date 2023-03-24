/**
 * 等时圈
 */
import {
  CreateFillLayer,
  CreateImgMarkerLayer,
  CreateLineLayer,
  getArea,
  map,
  startZoom
} from '@/views/Map/utils';
import type { MapMouseEvent } from 'mapbox-gl';
import { calculateCenter, CoordinateTransform } from '@/utils';
import { mapBoxIsochrone } from '@/apis/amap';
import type { Position } from 'geojson';
import { ElMessageBox } from 'element-plus/es';
import { Marker, MarkerOptions } from 'mapbox-gl';

type Type = 'walking' | 'cycling' | 'driving';
export const isochronousType = ref<Type>('walking'); // 类型
export const isochronousTime = ref<number>(5); // 时间
export const isochronousOption = ref<'reset' | 'draw' | ''>(''); // 操作
type Marks = '1min' | '5min' | '10min' | '30min';
export const isochronousMarks = ref<Record<number, Marks>>({
  1: '1min',
  30: '30min'
});
export const isochronousMin = ref<1 | 5>(1);
export const isochronousMax = ref<10 | 30>(30);
export const isochronousDrawer = ref(false); // 商圈分析弹窗
export const isochronousCoordinates = ref<Position[][]>([]); // 被点击商圈的坐标数据集

// 修改等时圈范围
export const changeIsochronousType = (val: Type) => {
  if (val === 'walking' || val === 'cycling') {
    isochronousMarks.value = {
      1: '1min',
      30: '30min'
    };
    isochronousTime.value = 5;
    isochronousMin.value = 1;
    isochronousMax.value = 30;
  } else if (val === 'driving') {
    isochronousMarks.value = {
      5: '5min',
      10: '10min'
    };
    isochronousTime.value = 10;
    isochronousMin.value = 5;
    isochronousMax.value = 10;
  }
};

// 创建等时圈图层
let isochronousFillLayer: CreateFillLayer | null; // 多边形填充图层
let isochronousLineLayer: CreateLineLayer | null; // 多边形边框图层
let isochronousMarkerLayer: CreateImgMarkerLayer | null; // 多边形指示图标图层
const isochronousDeleteMarkers: Array<Marker | null> = []; // 多边形删除图标
const createIsochronousLayer = () => {
  isochronousFillLayer = new CreateFillLayer('isochronousFillLayer', {
    'fill-color': '#cb45fe',
    'fill-opacity': 0.3
  });
  isochronousLineLayer = new CreateLineLayer('isochronousLineLayer', {
    'line-color': '#cb45fe',
    'line-width': 2,
    'line-opacity': 0.8
  });
  isochronousMarkerLayer = new CreateImgMarkerLayer(
    'isochronousMarkerLayer',
    { 'icon-opacity': 1 },
    require('@/assets/img/map/slmcom.png'),
    0.5
  );
  map.value.on('mouseenter', ['isochronousMarkerLayer'], () => {
    map.value.setCursor('pointer');
  });
  map.value.on('mouseleave', ['isochronousMarkerLayer'], () => {
    map.value.setCursor('');
  });
  map.value.on('click', 'isochronousFillLayer', (e: any) => {
    isochronousCoordinates.value = e.features[0].geometry.coordinates;
    isochronousDrawer.value = true;
  });
};

// 调用 mapbox api 计算等时圈数据
export const calculateIsochronousData = () => {
  map.value.setCursor('crosshair');
  if (
    !isochronousFillLayer &&
    !isochronousLineLayer &&
    !isochronousMarkerLayer
  ) {
    createIsochronousLayer();
  }
  const mapClick = async (e: MapMouseEvent) => {
    try {
      isochronousOption.value = '';
      map.value.setCursor('default');
      const filterType = isochronousType.value;
      const minutes = isochronousTime.value;
      // 坐标转换，将点击地图获取的 GCJ-02 坐标转为 WGS-84
      const { lat, lon } = CoordinateTransform.gcj_decrypt(
        e.lngLat.lat,
        e.lngLat.lng
      );
      const { features } = await mapBoxIsochrone(filterType, lon, lat, minutes);
      // 图层添加数据
      if (Array.isArray(features) && features.length > 0) {
        // 坐标转换，将mapBox 返回的 WGS-84 坐标转为 GCJ-02
        features.forEach(e => {
          e.geometry.coordinates[0].forEach(j => {
            const { lat, lon } = CoordinateTransform.gcj_encrypt(j[1], j[0]);
            j[0] = lon;
            j[1] = lat;
          });
          if (e.properties) {
            const centerPoint = calculateCenter(
              e.geometry.coordinates[0]
            ) as any;
            isochronousMarkerLayer?.features.push({
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: centerPoint
              },
              properties: {}
            });
            isochronousMarkerLayer?.changeFeatures();

            // 创建删除图标
            const area = getArea(e.geometry.coordinates[0]);
            let el: HTMLDivElement | null = document.createElement('div');
            el.setAttribute('class', 'measure-area-close font-13-500');
            el.innerText = `S:${area} ✘`;
            const option: MarkerOptions = {
              element: el,
              anchor: 'top',
              offset: [0, 10]
            };
            const marker = new Marker(option)
              .setLngLat(centerPoint)
              .addTo(map.value);

            // 绑定删除事件
            const index = isochronousMarkerLayer!.features.length - 1;
            const delFunc = (event: Event) => {
              event.stopPropagation();
              isochronousDeleteMarkers[index]!.remove();
              isochronousDeleteMarkers.splice(index, 1, null);

              isochronousMarkerLayer!.clearIndexFeature(index);
              isochronousFillLayer!.clearIndexFeature(index);
              isochronousLineLayer!.clearIndexFeature(index);

              el?.removeEventListener('click', delFunc);
              el = null;
            };
            el.addEventListener('click', delFunc);
            isochronousDeleteMarkers.push(marker);
          }
        });
        isochronousFillLayer?.features.push(...features);
        isochronousFillLayer?.changeFeatures();
        isochronousLineLayer?.features.push(...features);
        isochronousLineLayer?.changeFeatures();
        map.value.flyTo({
          center: [e.lngLat.lng, e.lngLat.lat],
          zoom: 14
        });
        startZoom.value = 14;
        document.getElementsByClassName('mapboxgl-ctrl-zoom')[0].innerHTML =
          '缩放级别:' + startZoom.value;
      }
      map.value.off('click', mapClick);
    } catch (e) {
      console.log(e);
      map.value.off('click', mapClick);
    }
  };
  map.value.once('click', mapClick);
};

// 清除等时圈图层
export const clearIsochronousLayer = () => {
  ElMessageBox.confirm('确认清除所有已选取的等时圈嘛？')
    .then(() => {
      isochronousOption.value = '';
      isochronousFillLayer?.removeLayer();
      isochronousLineLayer?.removeLayer();
      isochronousMarkerLayer?.removeLayer();
      isochronousFillLayer = null;
      isochronousLineLayer = null;
      isochronousMarkerLayer = null;
      isochronousDeleteMarkers.forEach(e => e?.remove());
      isochronousDeleteMarkers.length = 0;
    })
    .catch(err => {
      console.log(err);
    });
};
