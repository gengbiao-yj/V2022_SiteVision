<script setup lang="ts">
import SvDrawer from '@comps/PublicGlobal/SvDrawer.vue';
const activeName = ref<'Isochronous' | 'bufferArea' | 'custom'>('Isochronous');

/**
 * 等时圈相关
 */
import {
  calculateIsochronousData,
  clearIsochronousLayer,
  changeIsochronousType,
  isochronousTime,
  isochronousType,
  isochronousMin,
  isochronousMax,
  isochronousMarks,
  isochronousOption,
  isochronousCoordinates,
  isochronousDrawer
} from '@/views/Map/components/ToolCreareReport/IsochronousLayer';

const isochronousBtnChange = (val: 'reset' | 'draw' | '') => {
  if (val === 'draw') {
    calculateIsochronousData();
  } else if (val === 'reset') {
    clearIsochronousLayer();
  }
};

/**
 * 缓冲区相关
 */
import {
  bufferAreaRadius,
  bufferAreaOption,
  bufferAreaMin,
  bufferAreaMax,
  bufferAreaMarks,
  bufferDrawer,
  bufferCoordinates,
  calculateBufferAreaData,
  clearBufferAreaLayer
} from '@/views/Map/components/ToolCreareReport/BufferAreaLayer';
const bufferBtnChange = (val: 'reset' | 'draw' | '') => {
  if (val === 'draw') {
    calculateBufferAreaData();
  } else if (val === 'reset') {
    clearBufferAreaLayer();
  }
};

/**
 * 自定义相关
 */
import {
  measureArea,
  customDrawer,
  customCoordinates,
  clearCustomLayer,
  customOption,
  btnDisabled
} from '@/views/Map/components/ToolCreareReport/CustomLayer';
const customBtnChange = (val: 'reset' | 'draw' | '') => {
  if (val === 'draw') {
    measureArea();
  } else if (val === 'reset') {
    clearCustomLayer();
  }
};
/**
 * 查看报告
 */
const reportDrawer = ref<boolean>(false);
const reportCoordinates = ref<any>(); // 被点击商圈的坐标集合
watch(
  [
    () => isochronousDrawer.value,
    () => bufferDrawer.value,
    () => customDrawer.value
  ],
  ([v1, v2, v3]) => {
    reportDrawer.value = v1 || v2 || v3;
    v1 && (reportCoordinates.value = isochronousCoordinates.value);
    v2 && (reportCoordinates.value = bufferCoordinates.value);
    v3 && (reportCoordinates.value = customCoordinates.value);
  }
);
</script>
<script lang="ts">
export default {
  name: 'ToolCreateReport'
};
</script>

<template>
  <el-tabs
    v-model="activeName"
    tabPosition="left"
    class="report-tabs"
    style="height: 215px"
  >
    <el-tab-pane label="等时圈" name="Isochronous">
      <!-- 等时圈类型 -->
      <div class="option-row">
        <span class="mg-b-5">等时圈类型</span>
        <el-radio-group
          v-model="isochronousType"
          size="small"
          class="mg-l-10"
          @change="changeIsochronousType"
        >
          <el-radio-button label="walking">步行</el-radio-button>
          <el-radio-button label="cycling">骑行</el-radio-button>
          <el-radio-button label="driving">驾车</el-radio-button>
        </el-radio-group>
      </div>
      <!-- 等时圈范围 -->
      <div class="option-row">
        <span>等时圈范围</span>
        <el-input-number
          v-model="isochronousTime"
          :min="isochronousMin"
          :max="isochronousMax"
          class="mg-l-10 mg-t-5"
        />
        <el-slider
          v-model="isochronousTime"
          style="width: 145px"
          :step="1"
          :min="isochronousMin"
          :max="isochronousMax"
          :marks="isochronousMarks"
          class="mg-l-15"
        />
      </div>
      <!-- 操作 -->
      <div class="option-btn">
        <el-radio-group
          v-model="isochronousOption"
          @change="isochronousBtnChange"
        >
          <el-radio-button label="reset">清除</el-radio-button>
          <el-radio-button label="draw">选取</el-radio-button>
        </el-radio-group>
      </div>
    </el-tab-pane>
    <el-tab-pane label="缓冲区" name="bufferArea">
      <!-- 缓冲区半径 -->
      <div class="option-row">
        <span>缓冲区半径</span>
        <el-input-number
          v-model="bufferAreaRadius"
          :min="bufferAreaMin"
          :max="bufferAreaMax"
          class="mg-l-10 mg-t-5"
        />
        <el-slider
          v-model="bufferAreaRadius"
          style="width: 145px"
          :step="10"
          :min="bufferAreaMin"
          :max="bufferAreaMax"
          :marks="bufferAreaMarks"
          class="mg-l-15"
        />
      </div>
      <!-- 操作 -->
      <div class="option-btn">
        <el-radio-group v-model="bufferAreaOption" @change="bufferBtnChange">
          <el-radio-button label="reset">清除</el-radio-button>
          <el-radio-button label="draw">选取</el-radio-button>
        </el-radio-group>
      </div>
    </el-tab-pane>
    <el-tab-pane label="自定义" name="custom">
      <!-- 操作 -->
      <div class="option-btn">
        <el-radio-group
          v-model="customOption"
          :disabled="btnDisabled"
          @change="customBtnChange"
        >
          <el-radio-button label="reset">清空</el-radio-button>
          <el-radio-button label="draw">选取</el-radio-button>
        </el-radio-group>
      </div>
    </el-tab-pane>
  </el-tabs>
  <SvDrawer v-model="reportDrawer">
    {{ reportCoordinates }}
  </SvDrawer>
</template>

<style scoped lang="scss">
.report-tabs {
  &:deep(.el-tabs--left),
  &:deep(.el-tabs__content),
  &:deep(.el-tabs__header) {
    height: 100%;
  }

  &:deep(.el-tabs__item) {
    padding-left: 10px;
    padding-right: 18px;
  }
}

.option-row {
  margin: 10px 0;

  > span {
    font-size: 13px;
    color: #5e6677;
  }
}

.option-btn {
  @include box-size(100%, 35px);
  @include flex(row, center, center);
  padding-right: 15px;
  position: absolute;
  bottom: 0px;
}
</style>
