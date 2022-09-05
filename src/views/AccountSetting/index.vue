<!-- name: 个人设置 -->
<script setup lang="ts">
import PersonInfo from '@/views/AccountSetting/components/PersonInfo.vue';
import SecuritySet from '@/views/AccountSetting/components/SecuritySet.vue';

const activeName = ref('1');
</script>

<template>
  <div style="height: 100%">
    <el-tabs v-model="activeName" class="tabs-root">
      <el-tab-pane label="个人信息" name="1">
        <person-info />
      </el-tab-pane>
      <el-tab-pane label="安全设置" name="2">
        <security-set />
      </el-tab-pane>
    </el-tabs>
    <sv-copyright-line />
  </div>
</template>

<style scoped lang="scss">
.tabs-root {
  @include box-size(100%, calc(100% - 45px));
  background: white;
  padding: 8px 10px;
  border-radius: 6px;
}
</style>
<script lang="ts">
export default {
  name: 'AccountSetting'
};
</script>
