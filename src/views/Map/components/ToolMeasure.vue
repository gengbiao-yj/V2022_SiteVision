<script setup lang="ts">
import { map } from '@/views/Map/Hooks';
import { Feature, GeoJsonProperties, Geometry } from 'geojson';
import { AnySourceData } from 'mapbox-gl';
// import * as turf from '@turf/turf';

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
  } else {
    measureArea();
  }
  measure.value = '3'; // 消除选中状态
};

/*  测量距离
------------------------------------------------ */
/**
 * 功能入口
 */
const measureLine = () => {
  // 清除历史数据、图层
  clearMeasureLine();
  // 初始化数据、图层
  initMeasureLine();
  // 绑定鼠标左击事件
  map.value.on('click', measureLineLeftClick);
  // 绑定鼠标右击事件
  map.value.once('contextmenu', () => {
    map.value.off('click', measureLineLeftClick);
    map.value.setCursor('pointer');
  });
};

/**
 * 清除数据、图层
 */
const clearMeasureLine = () => {
  if (map.value.getSource('ML-source-points')) {
    // 数据清除
    map.value.removeSource('ML-source-points');
    map.value.removeSource('ML-source-fixLine');
    map.value.removeSource('ML-source-moveLine');
    // 图层清除
    map.value.removeLayer('ML-layer-points');
    map.value.removeLayer('ML-layer-fixLine');
    map.value.removeLayer('ML-layer-moveLine');
  }
};

/**
 * 初始化数据、图层
 */
const MLSourcePoints = [] as Feature<Geometry, GeoJsonProperties>[];
const MLSourceLine = [] as Feature<Geometry, GeoJsonProperties>[];
const initMeasureLine = () => {
  map.value.addSource('ML-source-points', {
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features: MLSourcePoints
    }
  } as AnySourceData);
  map.value.addSource('ML-layer-fixLine', {
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features: MLSourceLine
    }
  } as AnySourceData);
};

/**
 * 鼠标左键单击，开启连线点选择功能
 */
const measureLineLeftClick = () => {
  console.log(11);
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
