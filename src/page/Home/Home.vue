<template>
  <div id="main">
    <div class="divHead">
      <img src="./images/user.png" class="user" @click="goUserInfo" />
    </div>
    <div class="divTitle">
      <div class="divStatic">
        <!--          <img src="./images/logo.png"  class="logo"/>-->
        <img src="./images/Mylogo.jpg" class="logo" />

        <div class="divDesc">
          <div class="divName">南方人餐厅</div>
          <div class="divSend">
            <span>
              <img src="./images/time.png" /> 距离1.5km
            </span>
            <span>
              <img src="./images/money.png" /> 配送费6元
            </span>
            <span>
              <img src="./images/location.png" /> 预计时长12min
            </span>
          </div>
        </div>
      </div>
      <div class="divDesc2">
        <!--          简介: 菩提阁中餐厅是菩提阁点餐的独立的品牌，定位“大众 化的美食外送餐饮”，旨为顾客打造专业美食。-->
        简介: 南方人中餐厅是南方学院独有的中餐厅，面向全体师生，品质优先，价格优惠，定位“大众 化的美食外送餐饮！
      </div>
    </div>
    <!-- 侧边导航 -->
    <van-sidebar v-model="activeKey">
      <van-sidebar-item
        :title="foodName.name"
        v-for="foodName in foodsList"
        :key="foodName.id"
        @click="getFoodLisById(foodName.id)"
      />
    </van-sidebar>
    <!-- 卡片 -->
    <div class="card">
      <van-card
        :price="(foodInfo.price/100).toFixed(2)"
        :desc="foodInfo.description"
        :title="foodInfo.name"
        :thumb="imgPath(foodInfo.image)"
        v-for="foodInfo in foodsListById"
        :lazy-load="true"
        :key="foodInfo.id"
      >
        <template #footer>
          <van-button
            size="mini"
            @click="showPopup(foodInfo)"
            v-show="foodInfo.flavors.length!==0"
          >选择规格</van-button>
          <van-stepper
            value="0"
            theme="round"
            button-size="30"
            disable-input
            min="0"
            v-show="foodInfo.flavors.length==0"
            @plus="addCart(1,foodInfo)"
          />
          <!-- 销量 -->
          <span class="saleNum">月销100</span>
        </template>
      </van-card>

      <!-- 规格弹出框 -->
      <van-popup v-model="show">
        <div class="guige">
          <div class="title">{{ clickFoodInfo.name }}</div>
          <div class="select" v-for="flavors in clickFoodInfo.flavors" :key="flavors.id">
            <div>{{ flavors.name }}</div>
            <button
              class="kouwei"
              :class="{active:flavors.isCheck===index}"
              @click="updateFlavors(index,flavors)"
              v-for="value,index in JSON.parse(flavors.value)"
              :key="index"
            >{{ value }}</button>
          </div>
          <div class="price">
            <span>￥{{ clickFoodInfo.price/100}}</span>
          </div>
          <van-button type="primary" @click="addCart(0)">加入购物车</van-button>
        </div>
      </van-popup>
    </div>
    <!-- 购物车 -->
    <van-submit-bar
      :price="totalPrice*100"
      button-text="提交订单"
      button-color="#ffc200"
      label=" "
      :disabled="shopCartNum===0"
      @submit="$router.push('/detail')"
    />
    <img src="./images/cart_active.png" class="cartImag" @click="cartPopup" />
    <van-popup v-model="showCart" position="bottom" :style="{ height: '60%' }">
      <div class="carTitle">
        <span class="cart">购物车</span>
        <span class="iconfont icon-shanchu" @click="clearShopCart"></span>
      </div>
      <div class="content" v-for="shopCart in shopCartList" :key="shopCart.id">
        <img :src="imgPath(shopCart.image)" class="myImg" />
        <span class="title">{{ shopCart.name }}</span>
        <div class="shopCartFlavors">
          <span
            class="decs"
            v-for="flavor,index in (shopCart.dishFlavor||'').split(',')"
            :key="index"
            v-show="shopCart.dishFlavor!==null"
          >{{ flavor }}</span>
        </div>
        <span class="price">￥{{ shopCart.amount}}</span>
        <van-stepper
          v-model="shopCart.number"
          theme="round"
          button-size="22"
          disable-input
          min="0"
          @minus="mins(shopCart)"
          @plus="add(shopCart)"
        />
      </div>
    </van-popup>
    <!-- 购物车数量图标 -->
    <div class="divGoodsNum">{{ shopCartNum }}</div>
  </div>
</template>

<script>
  //通知框
  import {
    Notify
  } from 'vant';
  //消息确认组件
  import {
    Dialog
  } from 'vant';
  export default {
    name: 'Home',
    data() {
      return {
        active: 0,
        activeKey: 0,
        //选规格的弹出框
        show: false,
        //购物车的弹出框
        showCart: false,
        //加入购物车的数量
        value: 0,
        //购物车商品数
        cartValue: 1,
        //菜品分类
        foodsList: [],
        //菜品列表
        foodsListById: [],
        //由于菜品规格和菜品卡片不在同一个盒子里，for循环规格处用不到循环先，所有保存点击的菜品信息
        clickFoodInfo: {},
        //口味
        flavors: '',
        newCFoodsListById: [],
        // //选择的口味，用来做排他
        // currentClick:0
        //购物车列表
        shopCartList: [],

      }
    },
    mounted() {
      this.getFoodList().then(() => {
        //更具ID获取菜品列表
        this.getFoodLisById(this.foodsList[0].id)
      })
      //获取购物车列表
      this.getShopCart()

    },
    methods: {
      //提交订单
      submit() {
        console.log(111);
      },
      //用户点击左上角的头像进入个人中心
      goUserInfo() {
        this.$router.push('/myinfo')
      },
      //清空购物车
      clearShopCart() {
        Dialog.confirm({
            title: '清空购物车',
            message: '你确定要清空购物车吗？',
          })
          .then(async () => {
            // on confirm
            const result = await this.$API.reqClearShopCart()
            if (result.status === 200) {
              //删除成功
              //重新获取购物车数据
              this.getShopCart()
              this.showCart = false
            }
            this.getShopCart()

          })
          .catch(() => {
            // on cancel
          });

      },
      //点击购物车的-
      async mins(shopCart) {
        //num+1才是购物车的值
        try {
          const result = await this.$API.reqSubGoodsByCart({
            amount: shopCart.amount,
            dishFlavor: shopCart.dishFlavor,
            dishId: shopCart.dishId,
            image: shopCart.image,
            name: shopCart.name,
            setmealId: shopCart.etmealId
          })
          if (result.status === 200) {
            //减少成功,重新获取购物车列表
            this.getShopCart()

          }
        } catch (error) {
          Notify({
            type: 'warning',
            message: '服务器异常'
          });
        }

      },
      //点击购物车的+
      async add(shopCart) {
        try {
          const result = await this.$API.reqAddCartGoodsApi({
            amount: shopCart.amount,
            dishFlavor: shopCart.dishFlavor,
            dishId: shopCart.dishId,
            image: shopCart.image,
            name: shopCart.name,
            setmealId: shopCart.etmealId
          })
          if (result.status === 200) {
            //减少成功,重新获取购物车列表
            this.getShopCart()

          }
        } catch (error) {
          Notify({
            type: 'warning',
            message: '服务器异常'
          });
        }
      },
      //获取购物车列表
      async getShopCart() {
        try {
          const result = await this.$API.reqShopCartApi()
          if (result.status === 200) {
            //请求成功保存数据
            this.shopCartList = result.data.data
          }
        } catch (error) {
          Notify({
            type: 'warning',
            message: '服务器异常'
          });
        }


      },
      //加入购物车
      async addCart(flat, foodsInfo) {
        if (flat == 0) {
          //封装数据
          let disFlavors = []
          this.clickFoodInfo.flavors.forEach((item) => {
            disFlavors.push(JSON.parse(item.value)[item.isCheck])
          })
          //发请求服务器加入购物车
          try {
            const result = await this.$API.reqAddCartAPI({
              amount: this.clickFoodInfo.price / 100,
              dishFlavor: disFlavors.toString(),
              dishId: this.clickFoodInfo.id,
              image: this.clickFoodInfo.image,
              name: this.clickFoodInfo.name
            })
            if (result.status === 200) {
              //添加成功，关闭弹窗
              this.show = false
              this.getShopCart()
            }
          } catch (error) {
            console.log(error.message);
            Notify({
              type: 'warning',
              message: '服务器异常'
            });
          }
        }
        if (flat == 1) {
          //没有规格可 选的
          try {
            const result = await this.$API.reqAddCartAPI({
              amount: foodsInfo.price / 100,
              dishId: foodsInfo.id,
              image: foodsInfo.image,
              name: foodsInfo.name
            })
            if (result.status === 200) {
              //添加成功
              this.getShopCart()
            }
          } catch (error) {
            Notify({
              type: 'warning',
              message: '服务器异常'
            });
          }
        }

      },
      //用户选择口味处理
      updateFlavors(index, flavors) {
        console.log(index, flavors);
        flavors.isCheck = index
      },
      //封装imgReq函数，根据服务器返回的img名称发请求
      imgPath(imgName) {
        return `/api/common/download?name=${imgName}`
      },
      //规格弹出框
      showPopup(foodInfo) {
        this.show = true
        this.clickFoodInfo = foodInfo
      },
      //购物车弹出框
      cartPopup() {
        this.showCart = this.showCart === true ? false : true
      },
      //获取菜品分类
      async getFoodList() {
        try {
          const result = await this.$API.reqFoodListApi()
          if (result.status === 200) {
            this.foodsList = result.data.data
          }
        } catch (error) {
          Notify({
            type: 'warning',
            message: '服务器异常'
          });
        }
      },
      //更具Id获取菜品列表
      async getFoodLisById(categoryId) {
        document.getElementById("main").scrollIntoView({
          behavior: "smooth"
        });
        try {
          const result = await this.$API.reqListById(categoryId, 1)
          if (result.status === 200) {
            this.foodsListById = result.data.data
            //给口味的对象加上手动ischeck，方便做排他
            this.foodsListById.forEach((item) => {
              if (item.flavors.length > 0) {
                item.flavors.forEach((item2) => {
                  this.$set(item2, 'isCheck', 0)
                })
              }
            })
          }
        } catch (error) {
          Notify({
            type: 'warning',
            message: '服务器异常'
          });
        }

      }

    },
    computed: {
      //购物车计算总价格
      totalPrice() {
        let sum = 0
        this.shopCartList.forEach((item) => {
          sum += item.amount * item.number
        })
        return sum
      },
      //计算购物车商品数量
      //购物车的商品数
      shopCartNum() {
        let num = 0
        this.shopCartList.forEach((item) => {
          num += item.number
        })
        return num
      }
    }
  }
</script>

<style lang="less" scoped>
#main {
  height: 100%;
}

/deep/.van-stepper__plus {
  background: #ffc200;
}

.divHead {
  width: 100%;
  height: (152 / 3.75vw);
  background-image: url(./images/mainBg.png);
  background-size: contain;
  z-index: 999;
}

.user {
  margin-top: (10 /3.75vw);
  margin-left: (10 / 3.75vw);
  width: (30 / 3.75vw);
  height: (30 /3.75vw);
}

.divTitle {
  position: absolute;
  width: (365/3.75vw);
  left: (5/3.75vw);
  top: (40/3.75vw);
  width: (361 / 3.75vw);
  opacity: 1;
  border-radius: 2rem;
  z-index: 999;
  background: #ffff;
  box-sizing: border-box;
  padding: (10 / 3.75vw);
  box-shadow: 0rem 2rem 5rem 0rem rgb(69 69 69 / 10%);

  .divStatic {
    display: flex;
    margin-bottom: (10 / 3.75vw);

    .logo {
      width: (43 / 3.75vw);
      height: (43 / 3.75vw);
      border-radius: 6rem;
      margin-right: (15 / 3.75vw);
    }

    img {
      width: (12 / 3.75vw);
      height: (12 / 3.75vw);
    }

    .divName {
      width: (110 / 3.75vw);
      height: (27 / 3.75vw);
      font-size: (20 / 3.75vw);
      color: #333333;
    }

    span {
      font-size: (12 / 3.75vw);
      color: #333333;
    }
  }

  .divDesc2 {
    padding-top: (8 / 3.75vw);
    font-size: (10 / 3.75vw);
    color: #9b9b9b;
    border-top: (2 / 3.75vw) dashed #ebebeb;
  }
}

.van-card {
  width: (286/3.75vw);
  padding: 0;

  .van-stepper__minus {
    height: (22/3.75vw);
    width: (22/3.75vw);
  }

  .van-card__thumb {
    width: (88/3.75vw);
    height: (88/3.75vw);
  }

  .van-card__content {
    padding-left: (6/3.75vw);
  }

  .van-card__title {
    font-size: (15/3.75vw);
    font-weight: 600;
    font-family: PingFangSC, PingFangSC-Semibold;
    color: #333333;
    margin-bottom: (5/3.75vw);
    margin-top: (5/3.75vw);
    overflow: visible;
    max-height: (32/3.75vw);
    line-height: (16/3.75vw);
  }

  .van-card__desc {
    height: (16/3.75vw);
    opacity: 1;
    font-size: (12/3.75vw);
    font-family: PingFangSC, PingFangSC-Regular;
    font-weight: 400;
    text-align: left;
    color: #666666;
    line-height: (16/3.75vw);
    letter-spacing: 0;
    margin-bottom: (4/3.75vw);
    text-overflow: ellipsis;
    white-space: nowrap;
    width: (144/3.75vw);
    max-height: (20/3.75vw);
  }

  .saleNum {
    position: absolute;
    left: (102/3.75vw);
    bottom: (25.5/3.75vw);
    font-size: (12/3.75vw);
    color: #666666;
  }

  .van-card__price {
    font-size: (12/3.75vw);
    font-family: DIN, DIN-Medium;
    font-weight: 600;
    text-align: left;
    color: #e94e3c;

    .van-card__price-integer {
      font-size: (16/3.75vw);
    }
  }

  .van-button--mini {
    position: absolute;
    right: (14/3.75vw);
    bottom: (9/3.75vw);
    width: (64/3.75vw);
    height: (24/3.75vw);
    opacity: 1;
    background: #ffc200;
    border-radius: (12/3.75vw);
    font-size: (12/3.75vw);
    font-family: PingFangSC, PingFangSC-Regular;
    font-weight: 500;
    text-align: center;
    color: #333333;
    line-height: (24/3.75vw);
    letter-spacing: 0;
  }

  .van-stepper {
    position: absolute;
    right: (8/3.75vw);
    bottom: (9/3.75vw);
  }
}

.van-submit-bar {
  bottom: (50 / 3.75vw);
  left: (20 / 3.75vw);
  width: 88%;
  background: #000;
  border-radius: 25rem;
  height: (44 / 3.75vw);
  line-height: (44 / 3.75vw);
  z-index: 3000;
}

.van-submit-bar__price--integer {
  font-size: (20/3.75vw);
}

.cartImag {
  width: (57 /3.75vw);
  height: (49 / 3.75vw);
  left: (40/3.75vw);
  bottom: (45 / 3.75vw);
  z-index: 3333;
  position: fixed;
}

.divGoodsNum {
  width: (18/3.75vw);
  height: (18/3.75vw);
  opacity: 1;
  background: #e94e3c;
  border-radius: 50%;
  text-align: center;
  font-size: (12 / 3.75vw);
  font-family: PingFangSC, PingFangSC-Regular;
  font-weight: 500;
  color: #ffffff;
  line-height: (18 / 3.75vw);
  position: fixed;
  left: (81 / 3.75vw);
  bottom: (85/3.75vw);
  z-index: 5555;
  // position: absolute;
  // left: 50rem;
  // top: -5rem;
}

.van-submit-bar__button {
  position: absolute;
  top: (2/3.75vw);
  right: (2/3.75vw);
  width: (110/3.75vw);
  height: (40/3.75vw);
  font-size: (16/3.75vw);
}

.van-submit-bar__text {
  position: absolute;
  left: (89/3.75vw);
  bottom: (0/3.75vw);

  .van-submit-bar__price {
    font-size: (12/3.75vw);
    color: white;
    font-family: DIN, DIN-Medium;
    font-weight: 500;
  }
}

.van-popup--bottom {
  box-sizing: border-box;
  padding-bottom: (110/3.75vw);
  padding-top: (20/3.75vw);
  padding-left: (20/3.75vw);
  padding-right: (15/3.75vw);
  border-radius: (10/3.75vw);

  .carTitle {
    display: flex;
    justify-content: space-between;
    padding-bottom: (15/3.75vw);
    border-bottom: (2/3.75vw) dashed #efefef;

    .cart {
      font-size: (19/3.75vw);
      font-family: PingFangSC, PingFangSC-Semibold;
      font-weight: 600;
      text-align: left;
      color: #333333;
    }
  }

  .content {
    position: relative;
    margin-top: (15/3.75vw);
    margin-bottom: (15/3.75vw);

    img {
      width: (64/3.75vw);
      height: (64/3.75vw);
      margin-right: (10/3.75vw);
    }

    .title {
      position: absolute;
      top: 0;
    }

    .price {
      position: absolute;
      top: (44/3.75vw);
    }

    .van-stepper {
      position: absolute;
      bottom: (2/3.75vw);
      right: (-3/3.75vw);
    }

    .shopCartFlavors {
      position: absolute;
      left: (75/3.75vw);
      top: (22/3.75vw);
      height: (20/3.75vw);
      line-height: (20/3.75vw);

      .decs {
        display: inline-block;
        height: (18/3.75vw);
        padding: 0 (3/3.75vw) 0 (3/3.75vw);
        text-align: center;
        border: (1/3.75vw) solid #ffc200;
        color: #ffc200;
        font-size: (12/3.75vw);
        margin-right: (10/3.75vw);
        border-radius: (8/3.75vw);
      }
    }
  }
}

.van-popup--center {
  border-radius: (8/3.75vw);
}

.guige {
  padding: (20/3.75vw) (15/3.75vw) (20/3.75vw) (15/3.75vw);
  width: (290/3.75vw);
  height: (290/3.75vw);
  background-color: white;
  font-size: (16/3.75vw);

  .title {
    position: relative;
    text-align: center;
    font-size: (20/3.75vw);
    margin-bottom: (15/3.75vw);
  }

  .select {
    .kouwei {
      display: inline-block;
      height: (30/3.75vw);
      opacity: 1;
      background: #ffffff;
      border: 1px solid #ffc200;
      border-radius: (7/3.75vw);
      line-height: (30/3.75vw);
      padding-left: (13/3.75vw);
      padding-right: (13/3.75vw);
      margin: 0 (5/3.75vw) (10/3.75vw) (5/3.75vw);
      font-size: (14/3.75vw);
      font-family: PingFangSC, PingFangSC-Regular;
      font-weight: 400;
      text-align: center;
      color: #333333;
      margin-top: (10/3.75vw);
      margin-bottom: (5/3.75vw);
    }

    .active {
      background: #ffc200;
    }
  }

  .price {
    opacity: 1;
    font-size: (20/3.75vw);
    font-family: DIN, DIN-Medium;
    font-weight: 600;
    text-align: left;
    color: #e94e3c;
    line-height: (91/3.75vw);
    letter-spacing: 0;
  }

  .van-button--primary {
    height: (33/3.75vw);
    left: (173/3.75vw);
    bottom: (59/3.75vw);
    border-radius: (13/3.75vw);
    background: #ffc200;
    color: #000;
    font-size: (16/3.75vw);
  }
}

.card {
  width: 77%;
  background: white;
  position: absolute;
  left: (82/3.75vw);
  top: (166/3.75vw);
  padding-bottom: (107.6/3.75vw);
}

.van-sidebar {
  width: (80/3.75vw);
  padding-bottom: (150/3.75vw);

  .van-sidebar-item {
    padding: (20/3.75vw) (12/3.75vw);
    font-size: (13/3.75vw);
    line-height: (20/3.75vw);
  }
}

.van-sidebar::-webkit-scrollbar {
  display: none;
}
</style>