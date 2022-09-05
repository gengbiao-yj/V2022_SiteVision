<!-- name: 表格布局 -->
<script setup lang="ts"></script>

<template>
  <div class="table-box">
    <div class="table-setting">
      <div class="pd-l-10">
        <slot name="btnsBox"></slot>
      </div>
      <div class="tools-box">
        <slot name="toolsBox"></slot>
      </div>
    </div>
    <div class="table-content">
      <slot name="table"></slot>
      <div class="table-pagination">
        <slot name="pagination"></slot>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.table-box {
  @include box-size(100%, 100%);
  flex: 1;
  margin-top: 10px;
  background: white;
  border-radius: 6px;
  overflow: hidden;

  .table-setting {
    @include box-size(100%, 40px);
    @include flex(row, space-between, center);
    @include primary-bg-color(0.5);
    .tools-box {
      @include box-size(auto, 100%);
      @include flex(row, flex-end, center);
      padding-right: 10px;
      svg,
      &:deep(> svg),
      &:deep(.el-tooltip__trigger > svg) {
        margin-left: 16px;
        cursor: pointer;
        color: white;
        transition: all 0.2s ease-in-out;
        &:hover {
          transform: rotate(20deg);
        }
        &:focus {
          outline: none;
        }
      }
    }
  }

  .table-content {
    height: calc(100% - 40px);

    // 表边框重写
    &:deep(.el-table) {
      width: 100%;
      border-radius: 0 0 5px 5px;
      border: 1px solid;
      @include primary-border-color(0.5);
    }

    // 标题行样式
    &:deep(.table-header-cell) {
      color: #333333;
    }

    // 单元格排布
    &:deep(.table-cell .cell) {
      font-size: 13px;
      position: relative;
      > svg {
        width: 28px;
        position: absolute;
      }

      > span:nth-child(2) {
        margin-left: 32px;
      }
    }
  }

  .table-pagination {
    @include box-size(100%, 60px);
    @include flex(row, flex-end, center);
    overflow-x: auto;
  }
}
</style>

<script lang="ts">
export default {
  name: 'SvTableBox'
};
</script>
