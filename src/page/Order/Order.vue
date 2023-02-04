<template>
  <div>
    <NavTop name="历史订单"></NavTop>
    <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
      <div class="order" v-for="order in orderList" :key="order.id">
        <van-card :desc="status(order)" :title="order.checkoutTime">
          <template #footer>
            <van-button icon="delete-o" size="mini" @click="deleteOrder"></van-button>
          </template>
        </van-card>
        <!-- 再来一单按钮 -->
        <van-button
          plain
          type="primary"
          color="#ffc200"
          v-show="status(order)==='已完成'"
          @click="again(order.id)"
        >再来一单</van-button>
        <span class="desc">共{{ order.sumNum }}件商品，实付￥{{ order.amount }}</span>
        <div class="xian"></div>
      </div>
    </van-list>
  </div>
</template>

<script>
  //通知框
  import {
    Notify
  } from 'vant';
export default {
name:'Order',
data(){
return {
  page:1,
  pageSize:5,
  //服务器返回的订单数据,订单状态 1待付款，2待派送，3已派送，4已完成，5已取消
  orderList:[],
  //当组件滚动到底部时，会触发 load 事件并将 loading 设置成 true
  loading: false,
  //加载完毕（没有更多数据）
  finished: false,
}
},
mounted(){
this.getList()
},
computed:{

},
methods:{
  //再来一单
 async again(id){
    try {
    const result= await this.$API.reqAgainApi({id:id})
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
  //删除订单
  deleteOrder(){
    Notify({
            type: 'warning',
            message: '接口未完善呢，嘻嘻🤭'
          });
  },
  //计算出订单状态
  status(order){
    switch(order.status){
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
  //滚动上拉触发事件
  onLoad() {
    this.page++
    this.getList()
  },
 async getList(){
  try {
    const result= await this.$API.reqOrderListApi(this.page,this.pageSize)
    console.log(result);
    if(result.status===200){
      //请求成功保存数据
       this.orderList=[...this.orderList,...result.data.data.records]
       this.loading=false

       if(result.data.data.records.length===0){
          this.finished=true
       }
    }
  } catch (error) {
    Notify({
            type: 'warning',
            message: '服务器异常'
          });
  }

  }
}
}
</script>
<style lang="less" scoped>
.order {
  position: relative;
  margin-top: (10 / 3.75vw);
}
.van-card__desc {
  position: absolute;
  right: (15/3.75vw);
  top: 0;
}
.desc {
  position: absolute;
  right: (34/3.75vw);
  top: (58/3.75vw);
  color: #646566;
}
.xian {
  position: absolute;
  left: 0;
  top: (35/3.75vw);
  width: 100%;
  height: 0;
  border-bottom: 2px dashed #efefef;
}
.van-button--normal {
  position: absolute;
  left: (6/3.75vw);
  top: (50/3.75vw);
  border-radius: 10rem;
}
.van-button--mini {
  position: absolute;
  right: (5/3.75vw);
  bottom: 0;
}
</style>