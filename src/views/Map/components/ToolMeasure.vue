<script setup lang="ts">
import { map, CreateLineLayer, CreateCycleLayer } from '@/views/Map/Hooks';
import { MapMouseEvent, MarkerOptions, LngLatLike, Marker } from 'mapbox-gl';
import { Position } from 'geojson';

import * as turf from '@turf/turf';
import { nanoid } from 'nanoid';

const visibleStyleBox = ref(false); // 切换弹窗状态
// 关闭弹窗
const closeStyleBox = () => {
  map.value.setCursor('default');
  visibleStyleBox.value = false;
};
// 展示弹窗
const showStyleBox = () => {
  visibleStyleBox.value = !visibleStyleBox.value;
};

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
const MLPointLayers = [] as Array<CreateCycleLayer | null>; // 历史测量线的点位图层集合 【】
const MLLineLayers = [] as Array<CreateLineLayer | null>; // 历史测量线的线段图层集合 【】
const MLTooltips = [] as Array<Array<Marker>>; // 历史测量线的tip集合 【【】】
let MLCurrentPoints = [] as Array<LngLatLike>; // 当前测量线段的点位集合【】
let MLCurrentTooltips = [] as Array<Marker>; // 当前测量线段的tip集合【】
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

  // 滑动鼠标显示拖拽线
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
    // 回复鼠标样式
    map.value.setCursor('default');
    // 移除拖拽线相关
    MLTooltip.remove();
    MLMoveLine.features.length = 0;
    MLMoveLine.changeFeatures();
    // 增加删除tips
    addDeleteTip();
    // 清空缓存数据
    MLCurrentPoints = [];
    MLCurrentTooltips = [];
  });
};

/**
 * 初始化数据、图层
 */
let MLPoint: CreateCycleLayer;
let MLFixLine: CreateLineLayer;
let MLMoveLine: CreateLineLayer;
const initMeasureLine = () => {
  // 图层
  const id = nanoid();
  console.log(id);
  MLPoint = new CreateCycleLayer(`MLPoint${id}`, {
    'circle-color': '#ffffff',
    'circle-radius': 4.5,
    'circle-stroke-width': 2,
    'circle-stroke-color': '#ff0000'
  });

  MLFixLine = new CreateLineLayer(`MLFixLine${id}`, {
    'line-color': '#ff0000',
    'line-width': 2,
    'line-opacity': 0.65
  });

  if (!MLMoveLine) {
    MLMoveLine = new CreateLineLayer('MLMoveLine', {
      'line-color': '#3861c8',
      'line-width': 2,
      'line-opacity': 0.65
    });
  }
  MLTooltips.push([] as Array<Marker>);
  MLPointLayers.push(MLPoint);
  MLLineLayers.push(MLFixLine);
};

/**
 * 鼠标左键单击，开启连线点选择功能
 */
const measureLineLeftClick = (e: MapMouseEvent) => {
  measure.value = '3'; // 消除选中状态
  MLCurrentTooltips = MLTooltips[MLTooltips.length - 1];
  const point: LngLatLike = [e.lngLat.lng, e.lngLat.lat];
  getMeasureLineRes(point);
  addPoint(point as Position);
  MLCurrentPoints.push(point);
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
  ele.innerHTML = MLCurrentPoints.length === 0 ? '起点' : getLength(coords);
  const marker = new Marker(option).setLngLat(coords).addTo(map.value);
  MLCurrentTooltips.push(marker);
};

/**
 * 计算直线距离
 */
const getLength = (coords: LngLatLike) => {
  const _points = MLCurrentPoints.concat([coords]) as Array<Array<number>>;
  const line = turf.lineString(_points);
  let len: number | string = turf.length(line);
  if (len < 1) {
    len = Math.round(len * 1000) + 'm';
  } else {
    len = len.toFixed(2) + 'km';
  }
  return len;
};

/**
 * 增加 MLPoint 图层点位数据
 */
const addPoint = (coords: Position) => {
  MLPoint.features.push({
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: coords
    },
    properties: {}
  });
  MLPoint.changeFeatures();

  if (MLCurrentPoints.length > 0) {
    const prev = MLCurrentPoints[MLCurrentPoints.length - 1] as Position;
    MLFixLine.features.push({
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: [prev, coords]
      },
      properties: {}
    });
    MLFixLine.changeFeatures();
  }
};

/**
 * 显示拖拽线
 */
const measureMoveLine = (e: MapMouseEvent) => {
  const point: LngLatLike = [e.lngLat.lng, e.lngLat.lat];
  if (MLCurrentPoints.length > 0) {
    const prev = MLCurrentPoints[MLCurrentPoints.length - 1] as Position;
    MLMoveLine.features.length = 0;
    MLMoveLine.features.push({
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: [prev, point]
      },
      properties: {}
    });
    MLMoveLine.changeFeatures();
    MLTooltipEl.innerHTML = getLength(point);
  } else {
    MLTooltipEl.innerText = '点击开始测量';
  }
  MLTooltip.setLngLat(point);
};

/**
 * 测量结束，增加删除用的tip
 */
const addDeleteTip = () => {
  // 创建 tip
  let endPoint = MLCurrentPoints[MLCurrentPoints.length - 1];
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

  el.addEventListener('click', (event: Event) => {
    console.log(index);
    event.stopPropagation();
    const tooltips = MLTooltips[index];
    tooltips.forEach(e => {
      e.remove();
    });
    MLTooltips.splice(index, 1, []);

    const pointLayer = MLPointLayers[index] as CreateCycleLayer;
    pointLayer.removeLayer();
    MLPointLayers.splice(index, 1, null);

    const lineLayer = MLLineLayers[index] as CreateLineLayer;
    lineLayer.removeLayer();
    MLLineLayers.splice(index, 1, null);
    el = null;
  });
  MLCurrentTooltips.push(marker);
};

/*  测量面积
------------------------------------------------ */
/**
 * 功能入口
 */
const measureArea = () => {
  console.log('测量面积');
};
</script>
<script lang="ts">
export default {
  name: 'ToolMeasure'
};
</script>

<template>
  <el-tooltip effect="dark" content="测量工具" placement="right-start">
    <div class="tool-item-btn cur-pointer" @click.stop="showStyleBox">
      <svg class="icon svg-20" aria-hidden="true">
        <use href="#ruler"></use>
      </svg>
    </div>
  </el-tooltip>
  <transition name="fromLeft">
    <div v-show="visibleStyleBox" class="map-style-box">
      <header>
        <h4>测量工具</h4>
        <Close class="svg-18 cur-pointer" @click.stop="closeStyleBox" />
      </header>
      <main>
        <el-radio-group v-model="measure" size="large" @change="selectMeasure">
          <el-radio label="1" size="large">测量距离</el-radio>
          <el-radio label="2" size="large">测量面积</el-radio>
        </el-radio-group>
      </main>
    </div>
  </transition>
</template>

<style scoped lang="scss">
@import 'style';
.tool-item-btn {
  left: 10px;
  bottom: 155px;
}
.map-style-box {
  $bgc: #f6f5f5;
  @include box-size(280px, 70px);
  @include pseudo-element-striangle('left', 12px, $bgc);
  position: absolute;
  left: 50px;
  bottom: 155px;
  background: $bgc;
  border-radius: 5px;
  padding: 0 0 8px;
  box-shadow: 0px 0px 5px 2px #a6a6a6;
  > header {
    @include flex(row, space-between, center);
    height: 30px;
    width: 100%;
    border-bottom: 1px #d3d3d3 solid;
    padding: 0 8px;
  }
  > main {
    padding-left: 15px;
  }
}
</style>
