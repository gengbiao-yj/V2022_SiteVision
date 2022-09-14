<!-- name: 单张图标展示与上传替换 -->
<script setup lang="ts">
import { ElImageViewer } from 'element-plus';
import basicPinia from '@/pinia/storagePinia';
import { uploadImage } from '@/apis/user';
import { ElMessage } from 'element-plus';
import type { UploadRequestOptions } from 'element-plus';

const props = defineProps({
  edit: {
    type: Boolean,
    required: true
  },
  src: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    default: 90
  }
});
const emits = defineEmits(['success']);
const basicStore = basicPinia();
const BASE_URL = basicStore.getBaseUrl();
// const slotFail = ref(Boolean(useSlots().fail)); // 判断是否使用了图片回退插槽
// 图片上传
const uploadImg = async (file: UploadRequestOptions) => {
  try {
    let formData = new FormData();
    formData.append('file', file.file);
    const { data } = await uploadImage(formData);
    if (data) {
      ElMessage.success(data.message);
      emits('success', data.url);
    } else {
      ElMessage.success('上传失败');
    }
  } catch (error) {
    ElMessage.success('上传失败');
  }
};

// 删除图片
const deleteUrl = () => {
  emits('success', '');
};

// 图片预览
const showImgPreview = ref(false);
const imgLst = computed(() => [`${BASE_URL}/${props.src}`]);
const previewImg = () => {
  showImgPreview.value = true;
};
const closeImgViewer = () => {
  showImgPreview.value = false;
};
</script>
<script lang="ts">
export default {
  name: 'SvReplaceImg'
};
</script>

<template>
  <div class="root">
    <el-upload
      :multiple="false"
      :limit="1"
      :show-file-list="false"
      :http-request="uploadImg"
      accept="image/*"
    >
      <el-image
        fit="fill"
        :src="`${BASE_URL}/${props.src}`"
        :style="{ width: props.size + 'px', height: props.size + 'px' }"
        @click.stop="previewImg"
      >
        <template #error>
          <svg
            v-show="props.src"
            style="color: #8a8a8a"
            class="icon svg-fill"
            aria-hidden="true"
          >
            <use href="#icon-image-fail"></use>
          </svg>
          <svg
            v-show="!props.src"
            style="color: #8a8a8a"
            class="icon svg-fill"
            aria-hidden="true"
          >
            <use href="#icon-upload"></use>
          </svg>
        </template>
      </el-image>
      <div v-show="props.edit && props.src" :class="{ edit: props.edit }">
        <CircleCloseFilled class="svg-18 delete" @click.stop="deleteUrl" />
        <div class="edit-btns">
          <span>修改</span>
          <span class="mg-l-5 mg-r-5">|</span>
          <span @click.stop="previewImg">查看</span>
        </div>
      </div>
    </el-upload>
    <el-image-viewer
      v-if="props.src && props.edit && showImgPreview"
      :url-list="imgLst"
      @close="closeImgViewer"
    />
  </div>
</template>

<style scoped lang="scss">
.root:deep(.el-image) {
  //overflow: auto;
}
.root:deep(.el-upload) {
  position: relative;
  .edit {
    height: 100%;
    width: 100%;
    position: absolute;
    cursor: pointer;
    border-radius: 5px;
    opacity: 0;
    top: 0px;
    right: 0px;
    bottom: 0px;
    left: 0px;
    .edit-btns {
      height: 35%;
      width: 100%;
      position: absolute;
      bottom: 0;
      border-radius: 5px;
      @include flex(row, center, center);
    }
    .delete {
      position: absolute;
      top: -9px;
      right: -9px;
      color: #ff6767;
    }
  }
  &:hover {
    .edit {
      opacity: 1;
      .edit-btns {
        background: rgba(0, 0, 0, 0.6);
        > span {
          color: white;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
