<!-- 操作按钮 -->
<script setup lang="ts">
import basicPinia from '@/pinia/storagePinia';
import { fullScreen } from '@/utils/hooks';
import SystemSetting from './SystemSetting.vue';
import { ElMessageBox } from 'element-plus';
import { defineProps } from 'vue';

const props = defineProps({
  // 上下布局，顶栏是否采用主题背景色
  primaryHeader: {
    type: Boolean,
    required: true
  },
  // 左右布局，面包屑栏是否采用主题背景色
  primaryBread: {
    type: Boolean,
    required: true
  }
});
const isPrimary = computed(() => props.primaryHeader || props.primaryBread); // 是否设置主题背景色

const router = useRouter();
// 获取用户信息
const basicStore = basicPinia();
const { getUserInfo } = basicStore;
const userInfo = getUserInfo();
const userName = ref(userInfo.userName);
const setRestFullScreen = fullScreen();
const clickFullScreen = () => {
  setRestFullScreen(document.documentElement);
};
const optionDrawer = ref<boolean>(false);
const refresh = () => {
  router.replace(`/Main/Refresh`);
};

// 退出系统
const quitSystem = () => {
  ElMessageBox.confirm('是否要退出登录？', '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      router.replace(`/Login`);
    })
    .catch(e => {
      console.log(e);
    });
};
</script>
<template>
  <div class="header-option-root">
    <!-- 通知 -->
    <el-popover
      placement="bottom-end"
      title=""
      :width="110"
      trigger="click"
      :hide-after="120"
      transition="el-zoom-in-top"
    >
      <template #reference>
        <sv-badge :content="11">
          <span class="svg-item">
            <Bell class="svg-20" :class="{ 'color-white': isPrimary }" />
          </span>
        </sv-badge>
      </template>
      <div>~~~~~~~~~~~</div>
    </el-popover>
    <!-- 刷新 -->
    <span class="svg-item" @click="refresh">
      <Refresh class="svg-20" :class="{ 'color-white': isPrimary }" />
    </span>
    <!-- 全屏 -->
    <span class="svg-item" @click="clickFullScreen">
      <FullScreen class="svg-20" :class="{ 'color-white': isPrimary }" />
    </span>
    <!-- 设置 -->
    <span class="svg-item" @click="optionDrawer = true">
      <Setting class="svg-20" :class="{ 'color-white': isPrimary }" />
    </span>
    <!-- 用户操作 -->
    <el-popover
      placement="bottom-end"
      title=""
      :width="160"
      trigger="hover"
      :hide-after="120"
      transition="el-zoom-in-top"
      popper-class="header-option-popover"
    >
      <template #reference>
        <span class="svg-item svg-bg"
          ><img
            src="../../../../public/resource/imgs/schoolboy.png"
            class="svg-38"
        /></span>
      </template>
      <div class="user-option">
        <div class="user-option-header">
          <span class="avatar-box"
            ><img
              src="../../../../public/resource/imgs/schoolboy.png"
              class="svg-38"
          /></span>
          <span class="user-name">{{ userName }}</span>
        </div>
        <div class="user-option-list">
          <div @click.stop="router.push('/Main/AccountSetting')">
            <User class="svg-16" />
            <span>个人信息</span>
          </div>
          <div>
            <VideoCamera class="svg-16" />
            <span>帮助视频</span>
          </div>
          <div @click="quitSystem">
            <SwitchButton class="svg-16" />
            <span>退出登录</span>
          </div>
        </div>
      </div>
    </el-popover>

    <SystemSetting v-model="optionDrawer" />
  </div>
</template>

<style scoped lang="scss">
.header-option-root {
  @include box-size(100%, 100%);
  @include flex(row, flex-end, center);
  .svg-item {
    @include box-size(35px, 35px);
    @include flex(row, center, center);
    border-radius: 999px;
    cursor: pointer;
    position: relative;
    margin-right: 10px;
    transition: all 0.2s ease-in-out;
    cursor: pointer;
    color: #070707;

    &:hover {
      transition: all 0.3s ease;
      transform: rotate(15deg);
    }

    &:last-child {
      margin-right: 5px;
    }
  }

  .svg-bg {
    background: #e5e5e5;
    overflow: hidden;
  }
}

.user-option {
  border-radius: 5px;
  overflow: hidden;
  .user-option-header {
    background: #fafafa;
    padding-left: 10px;
    @include box-size(100%, 45px);
    @include flex(row, flex-start, center);
    .avatar-box {
      border-radius: 999px;
      background: #e9e5e5;
      border-radius: 6px;
      overflow: hidden;
      @include box-size(36px, 36px);
      @include flex(row, center, center);
    }
    .user-name {
      margin-left: 8px;
      height: 36px;
      text-align: left;
      line-height: 36px;
      color: #333;
      font-weight: bold;
    }
  }
}

.user-option-list {
  width: 100%;
  min-height: 100px;
  background: white;
  padding: 8px 0;
  @include flex(column, flex-start, center);
  > div {
    height: 35px;
    width: 100%;
    padding: 0 15px;
    cursor: pointer;
    color: #666;
    position: relative;
    &:hover {
      color: var(--primary-color);
      transition: all 0.3s ease-in-out;
    }
    &:hover::after {
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      background: var(--primary-color);
      opacity: 0.18;
      transition: all 0.3s ease-in-out;
    }

    @include flex(row, flex-start, center);
    > svg {
      margin-right: 5px;
    }
    > span {
      width: calc(100% - 30px);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-size: 14px;
      letter-spacing: 1px;
    }
  }
}
</style>

<script lang="ts">
export default {
  name: 'HeaderOptions'
};
</script>
