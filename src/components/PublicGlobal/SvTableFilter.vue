<!-- name: 表格查询栏 -->
<script lang="ts" setup>
import { defineProps } from 'vue';

const props = defineProps({
  // 标题
  title: {
    type: String,
    default: '查询条件'
  }
});

/*  筛选项目展开折叠
------------------------------------------------ */
const filterBoxClose = ref(true); // 折叠展开标志
const arg = [110, 20]; // 闭合高度、展开补偿高度（px）
</script>

<template>
  <div class="filter-box" ref="filterBox" v-collapseH:[arg]="!filterBoxClose">
    <div class="filter-title">
      <span class="ft-s-16 ft-w-6 title-color">{{ props.title }}</span>
    </div>
    <div class="filter-form">
      <!-- form -->
      <div class="form-content">
        <slot name="form"></slot>
      </div>
      <!-- btn -->
      <div class="btn-box">
        <slot name="btn"></slot>
      </div>
    </div>
    <div class="filter-fill">
      <span class="open-icon" @click.prevent="filterBoxClose = !filterBoxClose">
        <transition name="breadcrumb">
          <span v-if="filterBoxClose">展开</span>
          <span v-else>折叠</span>
        </transition>
        <svg
          v-rotateX:180="!filterBoxClose"
          ref="iconCollapse"
          class="icon svg-24"
          aria-hidden="true"
        >
          <use href="#icon-zhankai"></use>
        </svg>
      </span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.filter-box {
  @include box-size(100%, 110px);
  transition: all 0.3s ease-in-out;
  background: white;
  border-radius: 6px;
  padding: 8px 10px 0px;
  overflow: hidden;
  position: relative;
  .filter-title {
    padding-bottom: 6px;
    margin-bottom: 8px;
  }
  .filter-form {
    @include flex(row, center, flex-start);
    padding-left: 15px;

    > .btn-box {
      min-height: 30px;
      flex-wrap: wrap;
    }
  }

  .filter-fill {
    position: absolute;
    @include box-size(100%, 30px);
    background: white;
    border-bottom-left-radius: 6px;
    border-bottom-right-radius: 6px;
    bottom: 0px;
    left: 0px;
    z-index: 2;
    @include flex(row, center, center);
  }

  .open-icon {
    font-size: 12px;
    font-weight: 600;
    color: #5e6677;
    height: 24px;
    cursor: pointer;
    @include flex(row, flex-start, center);
  }

  .title-color {
    @include primary-color();
  }
}

@media screen and (min-width: 1px) {
  .filter-box {
    .form-content {
      width: calc(100% - 100px);
    }
    .btn-box {
      width: 100px;
      @include flex(column, space-around, flex-end);
      &:deep(button) {
        margin-bottom: 15px;
      }
    }
  }
}

@media screen and (min-width: 560px) {
  .filter-box {
    .form-content {
      width: calc(100% - 240px);
    }
    .btn-box {
      width: 240px;
      @include flex(row, space-around, center);
    }
  }
}
</style>

<script lang="ts">
export default {
  name: 'SvTableFilter'
};
</script>
