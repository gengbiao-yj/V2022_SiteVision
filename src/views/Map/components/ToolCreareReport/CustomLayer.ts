/**
 * 自定义
 */
import { Position } from 'geojson';
import {
  CreateCycleLayer,
  CreateFillLayer,
  CreateLineLayer,
  getArea,
  map
} from '@/views/Map/utils';
import { LngLatLike, MapMouseEvent, Marker, MarkerOptions } from 'mapbox-gl';
import { ElMessageBox } from 'element-plus/es';

let MApoints = [] as Position[]; // 本次测量采集点集合
let ppPosition = [] as Position[][];
let MAPointLayer: CreateCycleLayer; // 面积测量点位图层
let MALineLayer: CreateLineLayer; // 面积测量线段图层
let MAFillLayer: CreateFillLayer; // 面积测量填充图层
let MLTooltip: Marker; // 拖拽线指示标签
const MLTooltipEl = document.createElement('div');
MLTooltipEl.setAttribute('class', 'measure-line-result');
export const customDrawer = ref(false); // 商圈分析弹窗
export const customCoordinates = ref<Position[][]>([]); // 被点击商圈的坐标数据集
export const customOption = ref<'reset' | 'draw' | ''>(''); // 操作
export const btnDisabled = ref(false);

// 左键采集本次测量所需点位
const measureAreaLeftClick = (e: MapMouseEvent) => {
  MApoints.push([e.lngLat.lng, e.lngLat.lat]);
  ppPosition = [[...MApoints, MApoints[0]]];
  if (MApoints.length === 1) {
    MAPointLayer.features.push({
      type: 'Feature',
      geometry: {
        type: 'MultiPoint',
        coordinates: MApoints
      },
      properties: {}
    });
    MALineLayer.features.push({
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: ppPosition
      },
      properties: {}
    });
    MAFillLayer.features.push({
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: ppPosition
      },
      properties: {}
    });
    MAPointLayer.changeFeatures();
    MALineLayer.changeFeatures();
    MAFillLayer.changeFeatures();
  } else {
    const index = MAPointLayer.features.length - 1;
    MAPointLayer.changeIndexFeature(index, MApoints);
    MALineLayer.changeIndexFeature(index, ppPosition);
    MAFillLayer.changeIndexFeature(index, ppPosition);
  }
};

// 右键结束测量
const measureAreaRightClick = () => {
  customOption.value = '';
  btnDisabled.value = false;
  // 消除动态更新的点
  const index = MAFillLayer.features.length - 1;
  MAFillLayer.changeIndexFeature(index, ppPosition);
  MLTooltip.remove();
  getMARes();

  MApoints = [] as Position[]; // 本次测量采集点集合
  ppPosition = [] as Position[][]; // 本次测量采集点集合
  map.value.off('click', measureAreaLeftClick);
  map.value.off('mousemove', measureMoveArea);
  map.value.setCursor('default');
};

// 鼠标拖动动态变更测量面积
const measureMoveArea = (e: MapMouseEvent) => {
  const point: LngLatLike = [e.lngLat.lng, e.lngLat.lat];
  if (MApoints.length < 1) {
    MLTooltipEl.innerText = '点击左键开始测量，右键结束测量';
  } else if (MApoints.length < 3) {
    MLTooltipEl.innerText = '请继续点击选取坐标点';
  } else {
    const fillMovePoints = [[...MApoints, point, MApoints[0]]];
    const index = MAFillLayer.features.length - 1;
    MAFillLayer.changeIndexFeature(index, fillMovePoints);
    MLTooltipEl.innerText = getArea(MApoints, point);
  }
  MLTooltip.setLngLat(point);
};

// 结束测量，增加面积结果以及删除tip
const MAResTips: Array<Marker | null> = [];
const getMARes = () => {
  // 增加 tip
  const endPoint = MApoints[MApoints.length - 1] as LngLatLike;
  let el: HTMLDivElement | null = document.createElement('div');
  el.setAttribute('class', 'measure-area-close');
  el.innerText = getArea(MApoints) + ' ×';
  const option: MarkerOptions = {
    element: el,
    anchor: 'top',
    offset: [0, 10]
  };
  const marker = new Marker(option).setLngLat(endPoint).addTo(map.value);
  MAResTips.push(marker);

  // 删除事件
  const index = MAResTips.length - 1;
  const delFnc = (event: Event) => {
    event.stopPropagation();
    // 删除结果 tip
    const delMarker = MAResTips[index];
    delMarker?.remove();
    MAResTips.splice(index, 1, null);
    // 删除对应图层数据
    MAPointLayer.clearIndexFeature(index);
    MALineLayer.clearIndexFeature(index);
    MAFillLayer.clearIndexFeature(index);
    el?.removeEventListener('click', delFnc);
    el = null;
  };
  el.addEventListener('click', delFnc);
};

// 执行入口
export const measureArea = () => {
  // 新建图层
  if (!MAPointLayer && !MALineLayer && !MAFillLayer) {
    MAPointLayer = new CreateCycleLayer('maPointLayer', {
      'circle-color': '#ffffff',
      'circle-radius': 4.5,
      'circle-stroke-width': 2,
      'circle-stroke-color': '#ff0000'
    });
    MALineLayer = new CreateLineLayer('maLineLayer', {
      'line-color': '#ff0000',
      'line-width': 2,
      'line-opacity': 0.65
    });
    MAFillLayer = new CreateFillLayer('maFillLayer', {
      'fill-color': '#ff0000',
      'fill-opacity': 0.15
    });
  }
  MLTooltip = new Marker({
    element: MLTooltipEl,
    anchor: 'left',
    offset: [8, 0]
  })
    .setLngLat([0, 0])
    .addTo(map.value);
  map.value.on('mousemove', measureMoveArea);
  map.value.on('click', measureAreaLeftClick);
  map.value.once('contextmenu', measureAreaRightClick);
  map.value.on('click', 'maFillLayer', (e: any) => {
    customCoordinates.value = e.features[0].geometry.coordinates;
    customDrawer.value = true;
  });
  btnDisabled.value = true;
};

// 清除缓冲区图层
export const clearCustomLayer = () => {
  ElMessageBox.confirm('确认清除所有自定义区域嘛？')
    .then(() => {
      customOption.value = '';
      MAPointLayer?.removeLayer();
      MALineLayer?.removeLayer();
      MAFillLayer?.removeLayer();
      // @ts-ignore
      MAPointLayer = null;
      // @ts-ignore
      MALineLayer = null;
      // @ts-ignore
      MAFillLayer = null;
      MAResTips.forEach(e => e?.remove());
      MAResTips.length = 0;
    })
    .catch(err => {
      console.log(err);
    });
};
