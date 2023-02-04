<template>
  <div class="main">
    <van-nav-bar title="个人中心" left-arrow @click-left="router.go(-1)" />
    <div class="info">
      <img src="./headPage.png" />
      <div class="name">用户{{ userPhone.slice(-4) }}</div>
      <span class="iconfont icon-nan"></span>
      <div class="phone">{{ userPhone}}</div>
    </div>
    <van-cell-group>
      <van-cell title="地址管理" is-link to="/address" />
      <van-cell title="历史订单" is-link to="/order" />
    </van-cell-group>
    <div class="newOrder">
      <div style="border-bottom: 2px dashed #efefef;padding-bottom: 15px;margin-bottom: 10px;">最新订单</div>
      <div class="orderInfo">
        <span>{{ order.orderTime }}</span>
        <span>{{ status }}</span>
      </div>
      <div class="price">共一件商品，实付￥68</div>
      <div class="again" @click="again">再来一单</div>
    </div>
    <van-button type="primary" block @click="logout">退出登录</van-button>
  </div>
</template>

<script>
  //通知框
  import {
    Notify
  } from 'vant';
export default {
name:'MyInfo',
data(){
  return {
     order:{}
  }
},
mounted(){
  this.getNewOrder()
},
computed:{
  //获取用户手机号
  userPhone(){
    return sessionStorage.getItem('userPhone')
  },
  //计算出订单状态
  status(){
    switch(this.order.status){
      case 1 :
        return '待付款'
        break
        case 2 :
          return '待派送'
          break
          case 3 :
            return '已派送'
            break
            case 4 :
              return '已完成'
    }
  },
},
methods:{
  //退出登录
 async logout(){
  const result= await this.$API.reqLoginoutApi()
  if(result.status===200){
    //退出登录成功
    //清楚session，路由跳转
    sessionStorage.clear()
    this.$router.push('/login')
  }
  },
  //获取最新订单
 async getNewOrder(){
    try {
    const result= await this.$API.reqOrderListApi(1,1)
    if(result.status===200){
      this.order=result.data.data.records[0]
    }
    } catch (error) {
      Notify({
            type: 'warning',
            message: '服务器异常'
          });
    }
  },
    //再来一单
 async again(){
    try {
    const result= await this.$API.reqAgainApi({id:this.order.id})
    if(result.status===200){
      //再来一单成功，路由跳转
      this.$router.push('/home')
    }

    } catch (error) {
      Notify({
            type: 'warning',
            message: '服务器异常'
          });
    }
  },
}
}
</script>

<style lang="less" scoped>
.main {
  width: 100%;
  height: 100%;
  background: #f3f2f7;
  font-size: (13/3.75vw);
}
/deep/.van-nav-bar__content {
  height: (100/3.75vw);
  background: #ffc200;
  .van-nav-bar__title {
    color: #333;
    font-size: (16/3.75vw);
  }
  .van-icon {
    color: #333;
    font-size: (16/3.75vw);
  }
}
.info {
  position: relative;
  padding: 5px;
  box-sizing: border-box;
  width: 100%;
  height: (70/3.75vw);
  background: #ffc200;
  margin-bottom: (15/3.75vw);
  font-size: (12/3.75vw);
  img {
    width: (58/3.75vw);
    height: (58/3.75vw);
    border-radius: 50%;
    margin-right: (16/3.75vw);
  }
  .name {
    position: absolute;
    left: (83/3.75vw);
    top: (7/3.75vw);
  }
  .phone {
    position: absolute;
    left: (83/3.75vw);
    top: (35/3.75vw);
  }
  span {
    position: absolute;
    left: (138/3.75vw);
    top: (6/3.75vw);
    font-size: (18/3.75vw);
    color: #0091ff;
  }
}
.van-cell-group {
  width: 95%;
  border-radius: 8px;
  margin: 0 auto;
  margin-bottom: (15/3.75vw);
}
.van-button--block {
  width: 95%;
  border-radius: (8/3.75vw);
  margin: 0 auto;
  background: white;
  border: 0;
  color: #000;
}
.newOrder {
  width: 95%;
  position: relative;
  height: (153/3.75vw);
  padding: 15px;
  box-sizing: border-box;
  margin: 0 auto;
  margin-bottom: 15px;
  background: white;
  .orderInfo {
    display: flex;
    font-size: (13/3.75vw);
    justify-content: space-between;
    padding-bottom: (15/3.75vw);
    border-bottom: (2/3.75vw) dashed #efefef;
  }
  .price {
    position: absolute;
    right: (15/3.75vw);
    bottom: (21/3.75vw);
    font-size: (13/3.75vw);
  }
  .again {
    text-align: center;
    width: (70/3.75vw);
    padding: (5/3.75vw) (5/3.75vw);
    border: 1px solid #ffc200;
    margin-top: (10/3.75vw);
    border-radius: (8/3.75vw);
    color: #ffc200;
  }
}
.van-cell__title {
  font-size: (13/3.75vw);
}
.van-button--block {
  font-size: (13/3.75vw);
}
</style>