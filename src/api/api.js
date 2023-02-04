import axios from '@/api/request';
//获取验证码api
export const reqCodeApi=(phone)=>axios({url:'/user/sendMsg',method:'post',data:{phone}})
//登录接口
export const reqLoginApi=(data)=>axios({url:'/user/login',method:'post',data})
//获取菜品分类列表
export const reqFoodListApi=()=>axios.get('/category/list')
//根据ID获取菜品列表
export const reqListById=(categoryId,status)=>axios.get(`/dish/list?categoryId=${categoryId}&status=${status}`)
//获取购物车列表
export const reqShopCartApi=()=>axios.get('shoppingCart/list')
//照片请求的api
export const reqImageApi=(name)=>axios.get(`/common/download?name=${name}`)
//加入购物车
export const reqAddCartAPI=(data)=>axios({method:'post',url:'/shoppingCart/add',data})
//购物车商品减少
export const reqSubGoodsByCart=(data)=>axios({method:'post',url:'/shoppingCart/sub',data})
//购物车增加物品 
export const reqAddCartGoodsApi=(data)=>axios({url:'/shoppingCart/add',method:'post',data})
//清空购物车
export const reqClearShopCart=()=>axios.delete('/shoppingCart/clean')
//获取地址信息
export const reqAddressListApi=()=>axios.get('/addressBook/list')
//新增地址
export const addAddressApi=(data)=>axios({method:'post',url:'/addressBook',data})
//修改默认地址
export const updateDefaultApi=(data)=>axios({method:'put',data,url:'/addressBook/default'})
//修改地址信息
export const updateAddressInfo=(data)=>axios({method:'put',url:'/addressBook',data})
//删除地址
export const deleteAddressApi=(id)=>axios.delete(`/addressBook?ids=${id}`)
//获取默认地址
export const getDefaultAddressApi=()=>axios.get('/addressBook/default')
//提交订单
export const reqSubmitOrderApi=(data)=>axios({method:'post',url:'/order/submit',data})
//获取订单列表
export const reqOrderListApi=(page,pageSize)=>axios.get(`/order/userPage?page=${page
}&pageSize=${pageSize}`)
//再来一单
export const reqAgainApi=(data)=>axios({method:'post',url:'/order/again',data})
//退出登录
export const reqLoginoutApi=()=>axios.post('/user/loginout')
//邮箱获取验证码
export const getCodeByEmailApi=(email)=>axios({method:'post',url:'/user/sendEmail',data:{email}})