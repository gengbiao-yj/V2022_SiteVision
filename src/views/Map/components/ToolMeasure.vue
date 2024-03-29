<!-- 组件：测量线段、面积 -->
<script setup lang="ts">
import {
  map,
  CreateLineLayer,
  CreateCycleLayer,
  CreateFillLayer,
  getLength,
  getArea
} from '@/views/Map/utils';
import { MapMouseEvent, MarkerOptions, LngLatLike, Marker } from 'mapbox-gl';
import { Position } from 'geojson';

const measure = ref<'1' | '2' | '3'>('3'); // 测量工具类别：1- 测距离 2- 测面积 3- 初始状态

/**
 * 选择测量工具
 */
const selectMeasure = () => {
  map.value.setCursor('crosshair');
  if (measure.value === '1') {
    measureLine();
  } else if (measure.value === '2') {
    measureArea();
  }
};

/*  测量距离
------------------------------------------------ */
const MLTooltips = [] as Array<Array<Marker>>; // 历史测量线的tip集合 【【】】
let MLCurrentPoints = [] as Array<Position>; // 当前测量线段的点位集合【】
let MLPreCurrentPoints = [] as Array<Position>; // 当前测量线段的已选点位与预选点位集合【】
let MLCurrentTooltips = [] as Array<Marker>; // 当前测量线段的tip集合【】
let MLPoint: CreateCycleLayer;
let MLFixLine: CreateLineLayer;
let MLTooltip: Marker; // 拖拽线指示标签
const MLTooltipEl = document.createElement('div');
MLTooltipEl.setAttribute('class', 'measure-line-result');
/**
 * 功能入口
 */
const measureLine = () => {
  // 初始化数据、图层
  initMeasureLine();

  // 单击鼠标左键增加测量点
  map.value.on('click', measureLineLeftClick);

  // 滑动鼠标显示下一个预选测量点的连线距离 tip
  MLTooltip = new Marker({
    element: MLTooltipEl,
    anchor: 'left',
    offset: [8, 0]
  })
    .setLngLat([0, 0])
    .addTo(map.value);
  map.value.on('mousemove', measureMoveLine);

  // 单击鼠标右键关闭测量功能
  map.value.once('contextmenu', () => {
    // 取消事件关联
    map.value.off('click', measureLineLeftClick);
    map.value.off('mousemove', measureMoveLine);
    // 恢复鼠标样式
    map.value.setCursor('default');
    // 移除拖拽线相关
    MLTooltip.remove();
    // 增加删除tips
    addDeleteTip();
    if (MLPreCurrentPoints.length > MLCurrentPoints.length) {
      const index = MLFixLine.features.length - 1;
      const newFixLinePoints = computeFixedLinePoints(MLCurrentPoints);
      MLFixLine.changeIndexFeature(index, newFixLinePoints);
    }
    // 清空缓存数据
    MLCurrentPoints = [];
    MLPreCurrentPoints = [];
    MLCurrentTooltips = [];
  });
};

/**
 * 初始化数据、图层
 */
const initMeasureLine = () => {
  if (!MLPoint && !MLFixLine) {
    MLPoint = new CreateCycleLayer('MLPointLayer', {
      'circle-color': '#ffffff',
      'circle-radius': 4.5,
      'circle-stroke-width': 2,
      'circle-stroke-color': '#ff0000'
    });

    MLFixLine = new CreateLineLayer('MLFixLineLayer', {
      'line-color': '#ff0000',
      'line-width': 2,
      'line-opacity': 0.65
    });
  }
  MLTooltips.push([] as Array<Marker>);
};

/**
 * 鼠标左键单击，开启连线点选择功能
 */
const measureLineLeftClick = (e: MapMouseEvent) => {
  measure.value = '3'; // 消除选中状态
  MLCurrentTooltips = MLTooltips[MLTooltips.length - 1];
  const point: LngLatLike = [e.lngLat.lng, e.lngLat.lat];
  getMeasureLineRes(point);
  MLCurrentPoints.push(point);
  addPoint(point as Position);
};

/**
 * 获取线段长度标签
 */
const getMeasureLineRes = (coords: LngLatLike) => {
  const ele = document.createElement('div');
  ele.setAttribute('class', 'measure-line-result');
  const option: MarkerOptions = {
    element: ele,
    anchor: 'left',
    offset: [8, 0]
  };
  ele.innerHTML =
    MLCurrentPoints.length === 0 ? '起点' : getLength(MLCurrentPoints, coords);
  const marker = new Marker(option).setLngLat(coords).addTo(map.value);
  MLCurrentTooltips.push(marker);
};

/**
 * 计算线段图层数据【【【p1】【p2】】,【【p2】【p3】】...】
 */
const computeFixedLinePoints = (points: Position[]) => {
  const newFixLinePoints = [] as Position[][];
  if (points.length >= 2) {
    points.forEach((e: Position, i: number) => {
      if (i >= 1) {
        const pre: Position = points[i - 1];
        const current = points[i];
        newFixLinePoints.push([pre, current]);
      }
    });
  }
  return newFixLinePoints;
};

/**
 * 增加 MLPoint 图层点位数据
 */
const addPoint = (coords: Position) => {
  if (MLCurrentPoints.length <= 1) {
    MLPoint.features.push({
      type: 'Feature',
      geometry: {
        type: 'MultiPoint',
        coordinates: [...MLCurrentPoints]
      },
      properties: {}
    });
    MLPoint.changeFeatures();
    // 增加固定线段图层数据
    MLFixLine.features.push({
      type: 'Feature',
      geometry: {
        type: 'MultiLineString',
        coordinates: []
      },
      properties: {}
    });
    MLFixLine.changeFeatures();
  } else {
    const index = MLPoint.features.length - 1;
    MLPoint.changeIndexFeature(index, [...MLCurrentPoints]);
    const newFixLinePoints = computeFixedLinePoints(MLCurrentPoints);
    MLFixLine.changeIndexFeature(index, newFixLinePoints);
  }
};

/**
 * 显示拖拽线
 */
const measureMoveLine = (e: MapMouseEvent) => {
  const point: LngLatLike = [e.lngLat.lng, e.lngLat.lat];
  if (MLCurrentPoints.length > 0) {
    const index = MLFixLine.features.length - 1;
    MLPreCurrentPoints = [...MLCurrentPoints, point];
    const newFixLinePoints = computeFixedLinePoints(MLPreCurrentPoints);
    MLTooltipEl.innerText = getLength(MLCurrentPoints, point);
    MLFixLine.changeIndexFeature(index, newFixLinePoints);
  } else {
    MLTooltipEl.innerText = '点击左键开始测量，右键结束测量';
  }
  MLTooltip.setLngLat(point);
};

/**
 * 测量结束，增加删除用的tip
 */
const addDeleteTip = () => {
  // 创建 tip
  let endPoint = MLCurrentPoints[MLCurrentPoints.length - 1] as LngLatLike;
  let el: HTMLDivElement | null = document.createElement('div');
  el.setAttribute('class', 'measure-line-close');
  el.innerText = '×';
  const option: MarkerOptions = {
    element: el,
    anchor: 'top',
    offset: [0, 10]
  };
  const marker = new Marker(option).setLngLat(endPoint).addTo(map.value);

  // 绑定删除事件
  const index = MLTooltips.length - 1;
  const delFunc = (event: Event) => {
    event.stopPropagation();
    const tooltips = MLTooltips[index];
    tooltips.forEach(e => {
      e.remove();
    });
    MLTooltips.splice(index, 1, []);
    MLPoint.clearIndexFeature(index);
    MLFixLine.clearIndexFeature(index);
    el?.removeEventListener('click', delFunc);
    el = null;
  };
  el.addEventListener('click', delFunc);
  MLCurrentTooltips.push(marker);
};

/*  测量面积
------------------------------------------------ */
let MApoints = [] as Position[]; // 本次测量采集点集合
let ppPosition = [] as Position[][];
let MAPointLayer: CreateCycleLayer; // 面积测量点位图层
let MALineLayer: CreateLineLayer; // 面积测量线段图层
let MAFillLayer: CreateFillLayer; // 面积测量填充图层

// 左键采集本次测量所需点位
const measureAreaLeftClick = (e: MapMouseEvent) => {
  measure.value = '3'; // 消除选中状态
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
  let endPoint = MApoints[MApoints.length - 1] as LngLatLike;
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
const measureArea = () => {
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
};
</script>
<script lang="ts">
export default {
  name: 'ToolMeasure'
};
</script>

<template>
  <el-radio-group v-model="measure" size="large" @change="selectMeasure">
    <el-radio label="1" size="large">测量距离</el-radio>
    <el-radio label="2" size="large">测量面积</el-radio>
  </el-radio-group>
</template>

<style scoped lang="scss"></style>
