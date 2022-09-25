<!-- name:地图主页 -->
<script setup lang="ts">
import { UseInitMap } from './Hooks';

const { mapConatiner } = UseInitMap();
</script>
<script lang="ts">
export default {
  name: 'MainMap'
};
</script>

<template>
  <div class="map-root" ref="mapConatiner"></div>
</template>

<style scoped lang="scss">
.map-root {
  width: 100%;
  height: 100%;
}
</style>
