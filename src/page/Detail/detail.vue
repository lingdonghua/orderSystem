<template>
  <div class="main">
    <div class="box">
      <NavTop name="订单确认"></NavTop>
      <!-- 头部 -->
      <div class="title">
        <div class="info" @click="$router.push('/address')">
          <div class="adress">{{ defaultAddress.detail }}</div>
          <div class="user">
            {{ defaultAddress.consignee }}{{ defaultAddress.sex==='1'?'先生':'女士' }}
            {{ defaultAddress.phone }}
          </div>
          <div class="right">></div>
        </div>
        <div class="time">预计09：35送达</div>
      </div>
      <!-- 订单明细 -->
      <div class="order">
        <div>订单明细</div>
        <div class="goods" v-for="goods in cartList" :key="goods.id">
          <img v-lazy="imgPath(goods.image)" />
          <div class="name">{{ goods.name }}</div>
          <div class="num">x{{ goods.number }}</div>
          <div class="price">￥{{ goods.amount }}</div>
        </div>
      </div>
      <!-- 备注 -->
      <div class="desc">
        <div>备注</div>
        <div class="text">
          <textarea name id cols="30" rows="2" placeholder="请输入您需要备注的信息" v-model="desc"></textarea>
        </div>
      </div>
    </div>
    <!-- 购物车 -->
    <div class="shopCart">
      <img src="../Home/images/cart_active.png" alt />
      <div class="totalPrice">￥{{ totalPrice }}</div>
      <button @click="submitOrder">去支付</button>
      <div class="num">{{ shopCartNum }}</div>
    </div>
  </div>
</template>

<script>
  import {
    Notify
  } from 'vant';
  export default {
    name: 'Detail',
    data() {
      return {

        //默认地址
        defaultAddress: {},
        //购物车列表
        cartList: [],
        desc:''

      }
    },
    mounted() {
      this.getDefaultAddress()
      this.getList()
    },
    methods: {
      //提交订单
     async submitOrder(){
      try {
        const result= await this.$API.reqSubmitOrderApi({addressBookId:this.defaultAddress.id,payMethod:1,remark:this.desc})
      if(result.status===200){
        //提交订单成功，路由跳转
        this.$router.push('/paysuccess')
      }
      } catch (error) {
        Notify({
            type: 'warning',
            message: error.message
          });
      }

      },
      //封装imgReq函数，根据服务器返回的img名称发请求
      imgPath(imgName) {
        return `/api/common/download?name=${imgName}`
      },
      async getDefaultAddress() {
        try {
          const result = await this.$API.getDefaultAddressApi()
          if (result.status === 200) {
            //请求成功
            this.defaultAddress = result.data.data
          }
        } catch (error) {
          Notify({
            type: 'warning',
            message: error.message
          });
        }

      },
      async getList() {
        try {
          const result = await this.$API.reqShopCartApi()
          if (result.status === 200) {
            //请求成功
            this.cartList = result.data.data
          }
        } catch (error) {
          Notify({
            type: 'warning',
            message: '服务器异常'
          });
        }

      }
    },
    computed:{
      //计算总价格
      totalPrice() {
        let sum = 0
        this.cartList.forEach((item) => {
          sum += item.amount * item.number
        })
        return sum
      },
      //计算总数
      shopCartNum() {
        let num = 0
        this.cartList.forEach((item) => {
          num += item.number
        })
        return num
      }
    }
  }
</script>

<style lang="less" scoped>
.main {
  width: 100%;
  background-color: #f3f2f7;
  box-sizing: border-box;

  .title {
    width: (355/3.75vw);
    height: (131/3.75vw);
    background-color: #fff;
    margin: (10/3.75vw) auto;
    border-radius: (8/3.75vw);
    padding: (10/3.75vw) (10/3.75vw);
    box-sizing: border-box;

    .info {
      width: 100%;
      height: (70/3.75vw);
      position: relative;
      border-bottom: (2/3.75vw) solid #f3f2f7;

      .adress {
        position: absolute;
        left: 0;
        top: 0;
        color: #20232a;
        font-size: (20/3.75vw);
      }

      .user {
        position: absolute;
        left: 0;
        top: (29/3.75vw);
        color: #333333;
        font-size: (14/3.75vw);
      }

      .right {
        position: absolute;
        right: (6/3.75vw);
        top: (22/3.75vw);
      }
    }

    .time {
      margin-top: (10/3.75vw);
      font-size: (13/3.75vw);
      color: #333333;
    }
  }

  .order {
    box-sizing: border-box;
    width: (355/3.75vw);
    margin: 0 auto;
    background-color: #fff;
    border-radius: (8/3.75vw);
    padding: (20/3.75vw) (10/3.75vw) (30/3.75vw) (15/3.75vw);

    .goods {
      position: relative;
      box-sizing: border-box;
      margin-top: (20/3.75vw);
      border-top: (2/3.75vw) solid #f3f2f7;
      padding-top: (15/3.75vw);

      img {
        width: (64/3.75vw);
        height: (64/3.75vw);
      }

      .name {
        position: absolute;
        left: (70/3.75vw);
        top: (17/3.75vw);
        font-family: PingFangSC, PingFangSC-Semibold;
        font-weight: 600;
        text-align: left;
        color: #20232a;
      }

      .num {
        position: absolute;
        left: (70/3.75vw);
        top: (50/3.75vw);
      }

      .price {
        position: absolute;
        right: 0;
        top: (50/3.75vw);
        font-family: DIN, DIN-Medium;
        font-weight: 600;
        color: #e94e3c;
      }
    }
  }

  .desc {
    width: (355/3.75vw);
    margin: 0 auto;
    background-color: #fff;
    border-radius: (8/3.75vw);
    margin-top: (20/3.75vw);
    box-sizing: border-box;
    padding: (15/3.75vw) (10/3.75vw) (15/3.75vw) (10/3.75vw);

    .text {
      margin-top: (20/3.75vw);
      border-top: (2/3.75vw) solid #f3f2f7;
      padding: (10/3.75vw);

      textarea {
        width: 100%;
        border: 0;
        height: (100/3.75vw);
      }
    }
  }

  .shopCart {
    width: (355/3.75vw);
    height: (44/3.75vw);
    background: #000;
    margin: 0 auto;
    border-radius: (15/3.75vw);
    position: fixed;
    left: (10/3.75vw);
    line-height: (44/3.75vw);

    bottom: (58/3.75vw);

    img {
      position: absolute;
      left: (17/3.75vw);
      bottom: 0;
      width: (60/3.75vw);
      height: (60/3.75vw);
    }

    .totalPrice {
      color: white;
      margin-left: (80/3.75vw);
      font-family: DIN, DIN-Medium;
      font-weight: 600;
    }

    button {
      position: absolute;
      right: 0;
      top: 0;
      height: (44/3.75vw);
      border-radius: (20/3.75vw);
      width: (90/3.75vw);
      background: #ffc200;
    }

    .num {
      width: (18/3.75vw);
      height: (18/3.75vw);
      opacity: 1;
      background: #e94e3c;
      border-radius: 50%;
      text-align: center;
      font-size: (12/3.75vw);
      font-family: PingFangSC, PingFangSC-Regular;
      font-weight: 500;
      color: #ffffff;
      line-height: (18/3.75vw);
      position: absolute;
      left: (56/3.75vw);
      top: (-15/3.75vw);
    }
  }
}
</style>