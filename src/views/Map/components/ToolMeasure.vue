<script setup lang="ts">
import { map, CreateLineLayer, CreateCycleLayer } from '@/views/Map/Hooks';
import mapboxgl, { MapMouseEvent, MarkerOptions, LngLatLike } from 'mapbox-gl';
import { Ref } from 'vue';

import * as turf from '@turf/turf';

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
const measureLinePoints = [] as Array<LngLatLike>; // 测量线段的点位集合
/**
 * 功能入口
 */
const measureLine = () => {
  // 初始化数据、图层
  initMeasureLine();
  // 绑定鼠标左击事件
  map.value.on('click', measureLineLeftClick);
  // 绑定鼠标右击事件
  map.value.once('contextmenu', () => {
    map.value.off('click', measureLineLeftClick);
    map.value.setCursor('default');
  });
};

/**
 * 初始化数据、图层
 */
const MLPoint = ref() as Ref<CreateCycleLayer>;
const MLFixLine = ref() as Ref<CreateLineLayer>;
const MLMoveLine = ref() as Ref<CreateLineLayer>;
const initMeasureLine = () => {
  // 图层
  MLPoint.value = new CreateCycleLayer('MLPoint', {
    'circle-color': '#ffffff',
    'circle-radius': 3,
    'circle-stroke-width': 2,
    'circle-stroke-color': '#ff0000'
  });
  MLFixLine.value = new CreateLineLayer('MLFixLine', {
    'line-color': '#ff0000',
    'line-width': 2,
    'line-opacity': 0.65
  });
  MLMoveLine.value = new CreateLineLayer('MLMoveLine', {
    'line-color': '#ff0000',
    'line-width': 2,
    'line-opacity': 0.65
  });
};

/**
 * 鼠标左键单击，开启连线点选择功能
 */
const measureLineLeftClick = (e: MapMouseEvent) => {
  measure.value = '3'; // 消除选中状态
  const point: LngLatLike = [e.lngLat.lng, e.lngLat.lat];
  getMeasureLineRes(point);
  addPoint(point);
  measureLinePoints.push(point);
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
  ele.innerHTML = measureLinePoints.length === 0 ? '起点' : getLength(coords);
  new mapboxgl.Marker(option).setLngLat(coords).addTo(map.value);
};

/**
 * 计算直线距离
 */
const getLength = (coords: LngLatLike) => {
  const _points = measureLinePoints.concat([coords]) as Array<Array<number>>;
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
const addPoint = (coords: LngLatLike) => {
  MLPoint.value.features.push({
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: coords
    }
  });
  MLPoint.value.changeFeatures();

  if (MLFixLine.value.features.length > 0) {
    const prev = MLFixLine.value.features[MLFixLine.value.features.length - 1];
    MLFixLine.value.features.push({
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: [prev.geometry.coordinates, coords]
      }
    });
    MLFixLine.value.changeFeatures();
  }
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
