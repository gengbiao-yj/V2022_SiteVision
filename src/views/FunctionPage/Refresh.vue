<!-- 页面刷新 -->
<template>
  <div></div>
</template>

<script>
export default {
  name: 'BaseRefresh',
  beforeRouteEnter(to, from, next) {
    next(vm => {
      let i = to.fullPath.indexOf('?');
      if (i !== -1) {
        vm.$router.replace(from.path + to.fullPath.slice(i));
      } else {
        vm.$router.replace(from.path);
      }
    });
  }
};
</script>

<style scoped></style>
