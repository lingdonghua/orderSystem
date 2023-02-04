<template>
  <div class="main">
    <NavTop name="南方人"></NavTop>
    <img src="../Home/images/success.png" alt />
    <div class="title">下单成功</div>
    <div class="time">预计09：35送达</div>
    <div class="dec">后厨正在加紧制作中，请耐心等待~</div>
    <div class="order" @click="order">查看订单</div>
    <span class="iconfont icon-home" @click="goHome"></span>
  </div>
</template>
 
<script>
export default {
   name:'PaySuccess',
   methods:{
    goHome(){
      this.$router.push('/home')
    },
    order(){
      this.$router.push('/order')
    }
   }

}
</script>

<style lang="less" scoped>
.main {
  text-align: center;
  position: relative;
  img {
    height: (100/3.75vw);
    width: (100/3.75vw);
    margin-top: (152/3.75vw);
    padding-left: (21/3.75vw);
  }
  .title {
    margin-top: (40/3.75vw);
    font-size: (20/3.75vw);
    font-weight: 600;
    margin-bottom: (20/3.75vw);
  }
  .time {
    color: #7d7273;
  }
  .dec {
    color: #7d7273;
  }
  .iconfont {
    position: absolute;
    right: (15/3.75vw);
    top: (22/3.75vw);
    z-index: 1000;
    color: white;
  }
  .order {
    width: 96%;
    margin: 0 auto;
    background: #ffc200;
    margin-top: (18/3.75vw);
    padding: (10/3.75vw) 0;
    border-radius: (8/3.75vw);
  }
}
</style>