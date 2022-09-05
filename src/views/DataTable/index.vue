<!-- name:数据管理主页 -->
<script setup lang="ts"></script>

<template>
  <router-view v-slot="{ Component }">
    <transition name="fade-transform" mode="out-in" appear>
      <component :is="Component"></component>
    </transition>
  </router-view>
</template>

<style scoped lang="scss"></style>

<script lang="ts">
export default {
  name: 'DataListIndex'
};
</script>
