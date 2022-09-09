<!-- name: 单张图标展示与上传替换 -->
<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import basicPinia from '@/pinia/storagePinia';
import { uploadImage } from '@/apis/user';
import { ElMessage } from 'element-plus';
import type { UploadRequestOptions } from 'element-plus';

const props = defineProps({
  edit: {
    type: Boolean,
    required: true
  },
  shape: {
    type: String,
    default: 'square'
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
const slotFail = ref(Boolean(useSlots().fail)); // 判断是否使用了图片回退插槽
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
      :disabled="!props.edit"
      :show-file-list="false"
      :http-request="uploadImg"
      accept="image/*"
    >
      <el-avatar
        :size="props.size"
        :class="{ edit: props.edit }"
        :src="`${BASE_URL}/${props.src}`"
        :shape="props.shape"
      >
        <slot name="fail"></slot>
        <svg v-if="!slotFail" class="icon svg-80" aria-hidden="true">
          <use href="#icon-tupianquesun"></use>
        </svg>
      </el-avatar>
    </el-upload>
  </div>
</template>

<style scoped lang="scss">
.edit {
  position: relative;
  margin-bottom: 3px;
}

.edit:hover::after {
  content: '点击上传';
  display: block;
  cursor: pointer;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.4);
  color: white;
  font-size: 13px;
  font-weight: bold;
  line-height: 30px;
}
</style>
