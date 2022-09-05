<!-- name: form 组件内部用省市区联动框 -->
<script lang="ts" setup>
import { DataArea } from '@/types';
import { getDataArea } from '@/apis/common';
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  // 省份
  province: {
    type: String,
    required: true
  },
  // 城市
  city: {
    type: String,
    required: true
  },
  // 区县
  county: {
    type: String,
    required: true
  },
  size: {
    type: String,
    default: 'default'
  }
});

const emit = defineEmits(['update:province', 'update:city', 'update:county']);

/*  省市区查询
------------------------------------------------ */
const province = computed(() => props.province);
const city = computed(() => props.city);
const county = computed(() => props.county);

const provinceList = reactive<Array<DataArea>>([]); // 省
const cityList = reactive<Array<DataArea>>([]); // 市
const countyList = reactive<Array<DataArea>>([]); // 区

// 选项变更
const formItemChange = (val: string, type: number) => {
  if (type === 101) {
    emit('update:province', val);
    getAreaList(val, 102);
  } else if (type === 102) {
    emit('update:city', val);
    getAreaList(val, 103);
  } else if (type === 103) {
    emit('update:county', val);
  }
};

/**
 * 省市区列表查询
 * @param JoinCOde  关联编码
 * @param TypeID
 */
const getAreaList = async (JoinCOde: string, TypeID: number) => {
  const res = await getDataArea(JoinCOde, TypeID);
  if (res) {
    if (TypeID === 101) {
      provinceList.length = 0;
      res.forEach(e => provinceList.push(e));
    } else if (TypeID === 102) {
      cityList.length = 0;
      res.forEach(e => cityList.push(e));
    } else if (TypeID === 103) {
      countyList.length = 0;
      res.forEach(e => countyList.push(e));
    }
  }
};

/*  生命周期
------------------------------------------------ */
onBeforeMount(() => {
  // 省份列表
  getAreaList('0', 101);
});
</script>

<template>
  <!-- 省份 -->
  <el-form-item label="省份">
    <el-select
      v-model="province"
      placeholder=""
      clearable
      :size="props.size"
      @change="val => formItemChange(val, 101)"
    >
      <el-option
        :label="e.cnName"
        :value="e.code"
        v-for="(e, i) in provinceList"
        :key="i"
      />
    </el-select>
  </el-form-item>
  <!-- 城市 -->
  <el-form-item label="城市">
    <el-select
      v-model="city"
      placeholder=""
      clearable
      :size="props.size"
      @change="val => formItemChange(val, 102)"
    >
      <el-option
        :label="e.cnName"
        :value="e.code"
        v-for="(e, i) in cityList"
        :key="i"
      />
    </el-select>
  </el-form-item>
  <!-- 区县 -->
  <el-form-item label="区县">
    <el-select
      v-model="county"
      placeholder=""
      clearable
      :size="props.size"
      @change="val => formItemChange(val, 103)"
    >
      <el-option
        :label="e.cnName"
        :value="e.code"
        v-for="(e, i) in countyList"
        :key="i"
      />
    </el-select>
  </el-form-item>
</template>

<style scoped lang="scss"></style>

<script lang="ts">
export default {
  name: 'SvAreaData'
};
</script>
