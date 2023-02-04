import vue from 'vue'
import vueRouter from 'vue-router'
import Home from '@/page/Home/Home'
  //通知框
   import {Notify} from 'vant';
vue.use(vueRouter)

//编程式路由跳转到当前路由（参数不变），多次执行会抛出NavigationDup....警告错误
//所以要重写push和replace方法
//先备份一下原型对象上的push和replace方法
let originPush = vueRouter.prototype.push
let originReplace = vueRouter.prototype.replace

vueRouter.prototype.push = function (location, resolve, reject) {
  if (resolve && reject) {
    //用call方法来改变this的指向
    originPush.call(this, location, resolve, reject)
  } else {
    originPush.call(this, location, () => {}, () => {})
  }
}
vueRouter.prototype.replace = function (location, resolve, reject) {
  if (resolve && reject) {
    originReplace.call(this, location, resolve, reject)
  } else {
    originReplace.call(this, location, () => {}, () => {})
  }
}

//路由规则
const routes=[
  {path:'/paysuccess',component:()=>import('@/page/Order/PaySuccess')},
  //订单详情页
  {path:'/detail',component:()=>import('@/page/Detail/detail')},
  //个人中心
  {path:'/myinfo',component:()=>import('@/page/MyInfo/MyInfo')},
    //重定位
  {path:'/',component:()=>import('@/page/Login/Login')},
  //订单管理
  {path:'/order',component:()=>import('@/page/Order/Order')},
  //地址编辑页面
  {path:'/addressedit',component:()=>import('@/page/Address/AddressEdit')},
  //地址管理
  {
   path:'/address',
   component:()=>import('@/page/Address/Address')
  },
  //登录
  {
    path:'/login',component:()=>import('@/page/Login/Login')
  },
  //首页
  {
    path:'/home',component:()=>import('@/page/Home/Home')
  }
]
const router=new vueRouter({
  routes,
})
//路由守卫
router.beforeEach((to,from,next)=>{
  if(to.path==='/login'){
    next()
  }else if(sessionStorage.getItem('user')!==null){
    //用户已经登录，放行
    next()
  }else{
    //用户未登录
    Notify({
      type: 'warning',
      message: '用户未登录，请先登录'
    })
    next('/login')
  }
})

export default router