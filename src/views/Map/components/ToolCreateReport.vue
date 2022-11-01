<script setup lang="ts">
const activeName = ref<'Isochronous' | 'bufferArea' | 'custom'>('Isochronous');

/*  等时圈相关
------------------------------------------------ */
type Type = 'walking' | 'cycling' | 'driving';
const isochronousType = ref<Type>('walking'); // 类型
const isochronousTime = ref<number>(5); // 时间
const isochronousOption = ref<'reset' | 'draw' | ''>(''); // 操作
type Marks = '1min' | '5min' | '10min' | '30min';
const isochronousMarks = ref<Record<number, Marks>>({
  1: '1min',
  30: '30min'
});
const isochronousMin = ref<1 | 5>(1);
const isochronousMax = ref<10 | 30>(30);
const changeIsochronousType = (val: Type) => {
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

/*  缓冲区相关
------------------------------------------------ */
const bufferAreaRadius = ref<number>(5); // 缓冲区半径
const bufferAreaOption = ref<'reset' | 'draw' | ''>(''); // 操作
const bufferAreaMin = ref<number>(100); // 操作
const bufferAreaMax = ref<number>(5000); // 操作
const bufferAreaMarks = ref({
  100: '100m',
  5000: '5000m'
});

/*  自定义相关
------------------------------------------------ */
const customOption = ref<'reset' | 'draw' | ''>(''); // 操作
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
        <el-radio-group v-model="isochronousOption">
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
        <el-radio-group v-model="bufferAreaOption">
          <el-radio-button label="reset">清除</el-radio-button>
          <el-radio-button label="draw">选取</el-radio-button>
        </el-radio-group>
      </div>
    </el-tab-pane>
    <el-tab-pane label="自定义" name="custom">
      <!-- 操作 -->
      <div class="option-btn">
        <el-radio-group v-model="customOption">
          <el-radio-button label="reset">清除</el-radio-button>
          <el-radio-button label="draw">选取</el-radio-button>
        </el-radio-group>
      </div>
    </el-tab-pane>
  </el-tabs>
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
