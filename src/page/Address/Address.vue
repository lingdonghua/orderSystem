<template>
  <!-- 地址管理 -->

  <div class="address">
    <NavTop name="地址管理"></NavTop>
    <!-- 空页显示 -->
    <!-- this.shopCartListList.length===0 -->
    <van-empty description="空空如也" v-if="false" />
    <div class="item" v-for="cart in shopCartListList" :key="cart.id">
      <span class="label">{{ cart.label }}</span>
      <span class="title">{{ cart.detail }}</span>
      <div class="user">
        {{ cart.consignee }}
        <span v-if="cart.sex==='1'">先生</span>
        <span v-else>女士</span> 13538583023
      </div>
      <div class="default">
        <input
          type="radio"
          name="isDefault"
          :checked="cart.isDefault===1"
          @click="updateDefault(cart.id)"
        />
        <span>设为默认地址</span>
      </div>
      <span class="iconfont icon-xiugai" @click="update(cart)"></span>
    </div>
    <div class="add" @click="add">+添加收获地址</div>
  </div>
</template>

<script>
import { Toast } from 'vant';
import {
    Notify
  } from 'vant';
export default {
name:'Address',
data() {
    return {
      //购物车数据
      shopCartListList:[]
    };
  },
  methods: {
    //添加新地址
    add(){
      this.$router.push('/addressedit')
      setTimeout(()=>{
        this.$bus.$emit('edit',0)
      },600)


      Toast('新增地址');
    },
    //修改默认地址
    async updateDefault(id){
    const result= await this.$API.updateDefaultApi({id:id})
    },
    update(item) {
      this.$router.push('/addressedit')
      setTimeout(()=>{
        this.$bus.$emit('edit',1,item)
      },600)


    },
    //获取地址信息列表
    async getAddressList(){
      try {
        const result= await this.$API.reqAddressListApi()
        if(result.status===200){
          this.shopCartListList=result.data.data
          //获取成功，封装数据
          // result.data.data.forEach((item)=>{
          //   // let obj={}
          //   // obj.id=item.id
          //   // obj.name=item.consignee
          //   // obj.tel=item.phone
          //   // obj.address=item.detail
          //   // obj.isDefault=item.isDefault===1?true:false
          //   // obj.label=item.label
          //   // obj.sex=item.sex
          //   // arr.push(obj)
          //   console.log(item);
          // })
        }
      } catch (error) {
        Notify({
            type: 'warning',
            message: '服务器异常'
          });
      }
    }
  },
  beforeDestroy(){
  this.$bus.$off('edit')
  },
mounted(){
//获取地址信息列表
this.getAddressList()
}
}
</script>

<style lang="less" scoped>
.address {
  width: 100%;
  background: #f3f2f7;
  padding-bottom: (15/3.75vw);
  .item {
    position: relative;
    width: 96%;
    margin: 0 auto;
    box-sizing: border-box;
    padding: (15/3.75vw) (15/3.75vw) (15/3.75vw) (10/3.75vw);
    margin-top: (10/3.75vw);
    border-radius: (8/3.75vw);
    background: white;
    margin-bottom: (10/3.75vw);
  }
  .label {
    display: inline-block;
    height: 23px;
    padding: 5px;
    background-color: #fef8e7;
    font-size: (12/3.75vw);
    text-align: center;
    box-sizing: border-box;
    margin-right: 15px;
    margin-bottom: (10/3.75vw);
  }
  .title {
    color: #333333;
    font-size: (15/3.75vw);
  }
  .user {
    font-family: PingFangSC, PingFangSC-Regular;
    font-weight: 400;
    text-align: left;
    color: #999999;
    font-size: (13/3.75vw);
    padding-bottom: (12/3.75vw);
    border-bottom: 0.5px solid #efefef;
  }
  .default {
    padding-top: (8/3.75vw);
    font-size: (13/3.75vw);
  }
  .icon-xiugai {
    position: absolute;
    right: (19/3.75vw);
    top: (27/3.5vw);
    font-size: (20/3.75vw);
  }
  .add {
    width: 96%;
    margin: 0 auto;
    text-align: center;
    padding: (10/3.75vw) 0;
    background-color: #ffc200;
    border-radius: (8/3.75vw);
  }
}
</style>