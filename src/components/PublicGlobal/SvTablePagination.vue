<!-- name: 表格翻页 -->
<script lang="ts" setup>
import { defineProps, defineEmits } from 'vue';
import { getWatchBrowserWidth } from '@/utils/hooks';
const props = defineProps({
  // 当前页码
  currentPage: {
    type: Number,
    required: true
  },
  // 每页数量
  pageSize: {
    type: Number,
    required: true
  },
  // 每页数量可选项
  pageSizeOption: {
    type: Array,
    required: true
  },
  // 总数
  total: {
    type: Number,
    required: true
  }
});

const emit = defineEmits(['update:currentPage', 'update:pageSize', 'change']);

const currentPage = computed(() => props.currentPage);
const pageSize = computed(() => props.pageSize);
const pageSizeOption = computed(() => props.pageSizeOption);
const total = computed(() => props.total);

const handleSizeChange = (val: number) => {
  emit('update:pageSize', val);
  emit('change');
};

const handleCurrentChange = (val: number) => {
  emit('update:currentPage', val);
  emit('change');
};

const layout = ref('total, sizes, prev, pager, next, jumper'); // 操作项配置
// 由浏览器宽度适配操作项
getWatchBrowserWidth((val: number) => {
  if (val >= 1024) {
    layout.value = 'total, sizes, prev, pager, next, jumper';
  } else if (val >= 990) {
    layout.value = 'total, prev, pager, next, jumper';
  } else if (val >= 840) {
    layout.value = 'prev, pager, next, jumper';
  } else if (val >= 560) {
    layout.value = 'prev, pager, next';
  } else if (val < 560) {
    layout.value = 'pager';
  }
});
</script>

<template>
  <el-pagination
    v-model:currentPage="currentPage"
    v-model:page-size="pageSize"
    :page-sizes="pageSizeOption"
    background
    :layout="layout"
    :total="total"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
  />
</template>

<style scoped lang="scss"></style>

<script lang="ts">
export default {
  name: 'SvTablePagination'
};
</script>
