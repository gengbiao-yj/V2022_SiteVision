<!-- name: 表格查询栏 -->
<script lang="ts" setup>
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
<script lang="ts">
export default {
  name: 'SvTableFilter'
};
</script>

<template>
  <div ref="filterBox" v-collapseH:[arg]="!filterBoxClose" class="filter-box">
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
          <span v-if="filterBoxClose">{{ $t(`filter.unfold`) }}</span>
          <span v-else>{{ $t(`filter.fold`) }}</span>
        </transition>
        <svg
          ref="iconCollapse"
          v-rotateX:180="!filterBoxClose"
          class="icon svg-24"
          aria-hidden="true"
        >
          <use href="#icon-arrow-down"></use>
        </svg>
      </span>
    </div>
  </div>
  <div
    v-show="!filterBoxClose"
    class="fill-shade"
    @click.stop="filterBoxClose = !filterBoxClose"
  ></div>
</template>

<style scoped lang="scss">
.filter-box {
  @include box-size(100%, 110px);
  transition: all 0.3s ease-in-out;
  background: white;
  border-radius: 6px;
  padding: 8px 10px 0px;
  overflow: hidden;
  //position: relative;
  position: absolute;
  top: 0px;
  z-index: 5;
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
    z-index: 4;
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

.fill-shade {
  width: 100%;
  height: 100%;
  background: rgba(166, 167, 169, 0.4);
  position: absolute;
  z-index: 4;
  cursor: pointer;
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
