<!-- name:版权标注 -->
<script setup>
/*  import
------------------------------------------------ */
import { ref } from 'vue';

const year = ref(new Date().getFullYear());
</script>

<template>
  <div>
    <span>Copyright© SitesVision X {{ year }}</span>
  </div>
</template>

<style scoped lang="scss">
div {
  width: 100%;
  height: 35px;
  //position: absolute;
  //bottom: 5px;
  //left: 5px;
  margin: 4px auto;
  background: white;
  border-radius: 5px;
  border: 1px dashed #d0d0d0;
  @include flex(row, center, center);
  font-size: 13px;
  color: #333;
}
</style>

<script>
export default {
  name: 'SvCopyrightLine'
};
</script>
