<!-- 操作菜单 - 智能推荐 -->
<script setup lang="ts">
import { POIs } from '@/data/headerMenu';

const selectedType = ref<'POI' | '网格'>('POI'); // 按钮选中类型

// POI 多选项动态绑定
const selectedPOI = reactive({
  traffic: [],
  mall: [],
  education: [],
  common: []
});

// 多选框绑定值发生变化时
const POIsSelectChanged = (value: Array<string>) => {
  console.log(value);
  console.log(selectedPOI);
};
</script>

<template>
  <div class="smart-recommand-root pd-l-10">
    <!-- Btn -->
    <el-row>
      <el-col :span="7">
        <el-radio-group v-model="selectedType">
          <el-radio label="POI" border>POI</el-radio>
          <el-radio label="网格" border>网格</el-radio>
        </el-radio-group>
      </el-col>
      <el-col :span="3" :offset="12">
        <el-button type="primary" style="float: right">确认</el-button>
      </el-col>
    </el-row>
    <!-- POI -->
    <div class="pd-t-15">
      <el-row style="width: 100%" v-for="(e, i) in POIs" :key="i">
        <el-col :span="2" class="middle-xy">{{ e.title }}</el-col>
        <el-col :span="22">
          <el-checkbox-group
            v-model="selectedPOI[e.name]"
            @change="POIsSelectChanged"
          >
            <el-checkbox
              style="width: 74px; margin-right: 15px"
              :label="k.value"
              v-for="(k, j) in e.items"
              :key="j"
            >
              <span style="font-size: 12px">{{ k.label }}</span>
            </el-checkbox>
          </el-checkbox-group>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<style scoped>
.smart-recommand-root {
  background: rgba(255, 255, 255, 0.8);
}
</style>

<script lang="ts">
export default {
  name: 'SmartRecommend'
};
</script>
