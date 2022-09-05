<!-- name: 个人设置 -->
<script setup lang="ts">
import PersonInfo from '@/views/AccountSetting/components/PersonInfo.vue';
import SecuritySet from '@/views/AccountSetting/components/SecuritySet.vue';

const activeName = ref('0');

const isComponent = [PersonInfo, SecuritySet];
</script>

<template>
  <div class="account-set-root">
    <div class="set-content">
      <el-tabs v-model="activeName">
        <el-tab-pane label="个人信息" name="0"> </el-tab-pane>
        <el-tab-pane label="安全设置" name="1"> </el-tab-pane>
      </el-tabs>
      <transition name="inOut" mode="out-in" appear>
        <component :is="isComponent[activeName]" />
      </transition>
    </div>
    <sv-copyright-line />
  </div>
</template>

<style scoped lang="scss">
.account-set-root {
  @include box-size(100%, 100%);
  .set-content {
    padding: 8px 10px;
    background: white;
    border-radius: 6px;
    height: calc(100% - 45px);
  }
}
.tabs-root {
}
</style>
<script lang="ts">
export default {
  name: 'AccountSetting'
};
</script>
