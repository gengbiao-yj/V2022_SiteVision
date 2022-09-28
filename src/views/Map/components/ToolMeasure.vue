<script setup lang="ts">
// import { map } from '@/views/Map/Hooks';

const visibleStyleBox = ref(false); // 切换弹窗状态
// 关闭弹窗
const closeStyleBox = () => {
  visibleStyleBox.value = false;
};
// 展示弹窗
const showStyleBox = () => {
  visibleStyleBox.value = !visibleStyleBox.value;
};

const measure = ref<'1' | '2'>('1'); // 测量工具类别：1- 测距离 2- 测面积
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
        <el-radio-group v-model="measure" size="large">
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
