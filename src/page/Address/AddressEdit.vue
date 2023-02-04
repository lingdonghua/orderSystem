<template>
  <div>
    <NavTop name="地址编辑"></NavTop>
    <div class="one">
      <span>联系人：</span>
      <input type="text" placeholder="请填写收货人的姓名" v-model="name" />
    </div>
    <div class="one">
      <span>手机号：</span>
      <input type="text" placeholder="请填写收货人的手机号码" v-model="phone" />
    </div>
    <div class="one">
      <span>收货地址：</span>
      <input type="text" placeholder="请填写收货人的收货地址" v-model="address" />
    </div>
    <!-- 性别选择 -->
    <div class="radio">
      <label>
        <input type="radio" name="sex" @click="sex=1" checked />先生
      </label>
      <label>
        <input type="radio" name="sex" @click="sex=0" />女士
      </label>
    </div>
    <!-- 标签 -->
    <div class="biaoqian">
      <span>标签 ：</span>
      <button :class="{active:label==='无'}" @click="update(1,'无')">无</button>
      <button :class="{active:label==='公司'}" @click="update(2,'公司')">公司</button>
      <button :class="{active:label==='家'}" @click="update(3,'家')">家</button>
      <button :class="{active:label==='学校'}" @click="update(4,'学校')">学校</button>
    </div>
    <button class="save" @click="save">保存地址</button>
    <button class="delete" @click="deleteAddress(addressObj.id)" v-show="flat===1">删除地址</button>
  </div>
</template>

<script>
  //通知框
  import {
    Notify
  } from 'vant';
  export default {
    name: 'addressedit',
    data() {
      return {
        name: '',
        phone: '',
        address: '',
        sex: 1,
        label: '无',
        //判断是修改还是新增
        flat: 0, //1代表修改 0代表新增
        //保存address传来的数据，修改使用
        addressObj: {}
      };
    },
    mounted() {
      // this.name = this.$parent.name
      // this.phone = this.$parent.phone
      // this.address = this.$parent.address
      // this.sex = this.$parent.sex
      // this.curren = this.$parent.current
      // this.label = this.$parent.label
      // this.flat = this.$parent.flat
      // this.addressObj = this.$parent.addressObj
      //判断是否是修改，数据回显
      this.$bus.$on('edit', (flat, item) => {
        if (item) {
          // this.$parent.name = item.consignee
          // this.$parent.phone = item.phone
          // this.$parent.address = item.detail
          // this.$parent.sex = parseInt(item.sex)
          // this.$parent.label = item.label
          // this.$parent.addressObj = item
          // this.$parent.flat = flat
          this.name=item.consignee
          this.phone=item.phone
          this.address=item.detail
          this.sex=parseInt(item.sex)
          this.label=item.label
          this.addressObj=item
          this.flat=flat
        }else{
          this.name = ''
          this.phone = ''
          this.address = ''
          this.sex = 1
          this.label = '无'
          this.addressObj = item
          this.flat = flat
        }

      })
    },
    methods: {
      //删除地址
      async deleteAddress(id) {
        try {
          const result = await this.$API.deleteAddressApi(id)
          if (result.status === 200) {
            //删除成功，路由跳转
            this.$router.push('/address')
          }
        } catch (error) {
          Notify({
            type: 'warning',
            message: '请输入联系人或者地址'
          });
        }

      },
      //保存地址，发送请求
      async save() {
        //判断是否是修改，数据回显
        if (this.phone === '' || /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/.test(
            this.phone) === false) {
          Notify({
            type: 'warning',
            message: '请输入正确格式的手机号'
          });
          return;
        } else if (this.name === '' || this.address === '') {
          Notify({
            type: 'warning',
            message: '请输入联系人或者地址'
          });
        } else {
          if (this.flat === 0) {
            // try 
            //表单验证通过，发送请求
            const result = await this.$API.addAddressApi({
              consignee: this.name,
              detail: this.address,
              label: this.label,
              phone: this.phone,
              sex: (this.sexByComputed.toString() || null)
            })
            if (result.status === 200) {
              //添加成功，路由跳转
              this.$router.push('/address')
            }
            // } catch (error) {
            //   Notify({
            //     type: 'warning',
            //     message: '服务器异常'
            //   });
            // }
          }
          if (this.flat === 1) {
            //修改数据
            this.addressObj.consignee = this.name
            this.addressObj.detail = this.address
            this.addressObj.label - this.label
            this.addressObj.phone = this.phone
            this.sex = this.sex.toString()
            try {
              const result = await this.$API.updateAddressInfo(this.addressObj)
              if (result.status === 200) {
                //修改成功，路由跳转
                this.$router.push('/address')
              }
            } catch (error) {
              Notify({
                type: 'warning',
                message: '修改地址接口没写，嘻嘻！'
              });
            }
          }
        }
      },
      //修改标签属性
      update(index, value) {
        this.curren = index
        this.label = value
      }
    },
    computed: {
      //防止sex.toString undefined，计算出来
      sexByComputed() {
        if (this.sex !== undefined) {
          return this.sex
        } else {
          return 1
        }
      }
    },
    beforeDestroy(){
        this.name= '',
        this.phone= '',
        this.address= '',
        this.sex= 1,
        this.label= '无',
        //判断是修改还是新增
        this.flat= 0, //1代表修改 0代表新增
        //保存address传来的数据，修改使用
        this.addressObj= {}
  },

  }
</script>

<style lang="less" scoped>
.one {
  height: (40/3.75vw);
  box-sizing: border-box;
  padding: (15/3.75vw) (7/3.75vw) (34/3.75vw) (8/3.75vw);
  border-bottom: 1px solid #e5e4e4;

  span {
    font-size: (13/3.75vw);
    margin-right: (20/3.75vw);
  }

  input {
    border: 0;
    font-size: (12/3.75vw);
    color: #333333;
  }
}

.radio {
  position: absolute;
  right: (18/3.75vw);
  top: (84/3.75vw);
  font-size: (13/3.75vw);
}

.biaoqian {
  height: (33/3.75vw);
  padding-top: (13/3.75vw);
  border-bottom: 1px solid #e5e4e4;
  padding-left: (20/3.75vw);

  span {
    margin-right: (50/3.75vw);
    font-size: (12/3.75vw);
  }

  button {
    width: (55/3.75vw);
    height: (25/3.75vw);
    font-size: (12/3.75vw);
    margin-right: (10/3.75vw);
    background: white;
    border: 1px solid #e5e4e4;
  }

  .active {
    background-color: #e7fef8;
  }
}

.save {
  box-sizing: border-box;
  width: 96%;
  height: (35/3.75vw);
  margin-top: (34/3.75vw);
  border-radius: (8/3.75vw);
  margin-left: (8/3.75vw);
  border: 0;
  background: #ffc200;
}

.delete {
  box-sizing: border-box;
  width: 96%;
  height: (35/3.75vw);
  margin-top: (10/3.75vw);
  border-radius: (8/3.75vw);
  margin-left: (8/3.75vw);
  border: 0;
  background: white;
  border: 1px solid #e5e4e4;
}
</style>