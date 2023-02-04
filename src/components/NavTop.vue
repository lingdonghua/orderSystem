<template>
  <van-nav-bar :title="name" left-arrow @click-left="$router.back()" />
</template>

<script>
export default {
  name:'NavTop',
  props:['name']
}
</script>

<style lang="less" scoped>
/deep/.van-nav-bar__content {
  height: (67/3.75vw);
  background: #333333;
  overflow: visible;
  .van-nav-bar__title {
    color: white;
    font-size: (16/3.75vw);
    overflow: visible;
  }
  .van-icon {
    color: white;
    font-size: (16/3.75vw);
  }
}
</style>