<template>
  <div class="main">
    <van-nav-bar
      title="登录"
      left-text="手机登录"
      right-text="邮箱登录"
      @click-left="left"
      @click-right="right"
    />
    <van-form>
      <van-field
        v-model="username"
        name="手机号"
        label="手机号"
        placeholder="请输入手机号"
        :rules="[{ validator, message: '请填写正确格式的手机号' }]"
        v-if="phoneOrEmail==='phone' "
      />
      <van-field
        v-model="username"
        name="QQ邮箱"
        label="QQ邮箱"
        placeholder="请输入QQ邮箱"
        :rules="[{ pattern, message: '请填写正确格式的QQ邮箱' }]"
        v-if="phoneOrEmail==='email' "
      />
      <van-button
        type="info"
        class="code"
        @click="getCode"
        :disabled="num!==0"
        v-show="num===0"
      >获取验证码</van-button>
      <van-button
        type="info"
        class="code"
        @click="getCode"
        :disabled="num!==0"
        v-show="num!==0"
      >{{ num }}</van-button>
      <van-field v-model="code" name="验证码" label="验证码" placeholder="请输入验证码" />
      <div style="margin: 16px;">
        <van-button round block type="info" native-type="submit" @click="login">登录</van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
//通知框
import { Notify } from 'vant';
export default {
  name:'Login',
  data(){
    return {
      username:'',
      code:'',
      phoneOrEmail:'phone',
      //按钮倒计时
      num:0,
      timer:null,

      //表单验证
      pattern:/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
      phoneRule:/^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/
    }
  },
  methods:{
    //用户点击左边
    left(){
     this.phoneOrEmail='phone'
      this.num=0
    },
    //点击右边
    right(){
      this.phoneOrEmail='email'
      this.num=0
    },
    //手机号函数校验
    validator(val){
      return this.phoneRule.test(val)
    },

    //获取验证码
    getCode(){
      if(this.username.trim()===''){
        Notify({ type: 'warning', message: '请填写手机号或邮箱号！' });
        return;
      }
      if(this.phoneOrEmail==='phone'){
        if(!this.phoneRule.test(this.username.trim())) return
      }else {
        if(!this.pattern.test(this.username.trim())) return
      }
      this.num=30
      if(this.phoneOrEmail==='phone'){
        this.$API.reqCodeApi(this.username.trim()).then((res)=>{
        //发送成功，自动填装验证码（模拟，因为手机短信收费）
        this.code=res.data.data
        }).catch(()=>{
        //请求发送失败
        Notify({ type: 'warning', message: '服务器异常' });
        })
      }else{
        this.$API.getCodeByEmailApi(this.username.trim()).catch(()=>{
            //请求发送失败
        Notify({ type: 'warning', message: '服务器异常' });
        })
      }

      //倒计时
      this.timer=setInterval(()=>{
        if(this.num===0){
           clearInterval(this.timer)
        }else{
          this.num--
        }
      },1000)
    },
    //登录
    async login(){
      try {
      if(this.username.trim()&&this.code.trim()){
      const result= await this.$API.reqLoginApi({phone:this.username.trim(),code:this.code.trim()})
      if(result.status===200){
        //登录成功，路由跳转
        //存个数据在session会话存储，便于路由守卫
        sessionStorage.setItem('user','已登录')
        sessionStorage.setItem('userPhone',this.username)
        this.$router.push('/home')
      }
      }
      } catch (error) {
        Notify({ type: 'warning', message: '服务器异常' });
      }


    }

  },

}
</script >

<style lang="less" scoped>
.main {
  background-color: #f3f2f7;
  font-size: 20px !important;
}
.van-cell {
  height: (60 / 3.75vw);
}
.login {
  font-size: (30 / 3.75vw);
}
/deep/.van-nav-bar__text {
  color: #ffc431;
}
.code {
  position: absolute;
  right: 0;
  border-radius: (30 / 3.75vw);
  background-color: #ffc431;
  z-index: 999;
  height: (37 / 3.75vw);
  width: (103 / 3.75vw);
}
.van-form {
  position: relative;
  margin-top: (30 / 3.75vw);
}
.van-nav-bar {
  background-color: #333333;
}
/deep/.van-nav-bar__content {
  height: (99 / 3.75vw);
}
/deep/.van-nav-bar__title {
  color: white;
}

.van-button--block {
  margin-top: (30 / 3.75vw);
  background-color: #ffc431;
}
</style>