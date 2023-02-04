<template>
  <div id="app">
    <router-view></router-view>
    <!-- 底部导航栏 -->
    <van-tabbar
      v-model="active"
      placeholder
      active-color="#ffc200"
      route
      v-show="$route.path!=='/login'"
    >
      <van-tabbar-item icon="home-o" to="/home">首页</van-tabbar-item>
      <van-tabbar-item icon="todo-list-o" to="/address">地址</van-tabbar-item>
      <van-tabbar-item icon="orders-o" to="/order">订单</van-tabbar-item>
      <van-tabbar-item icon="contact" to="/myinfo">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
import Login from '@/page/Login/Login.vue'
export default {
  name: 'App',
  data(){
    return {
      active:0
    }
   },
 components:{
  Login,
 }
}
</script>

<style >
#app {
  height: 100%;
}
.van-tabbar {
  height: (41/3.75vw);
  z-index: 5000;
}
.van-icon {
  font-size: (15/3.75vw);
}
</style>
