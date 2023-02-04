import Vue from 'vue'
import App from './App.vue'
import NavTop from '@/components/NavTop'
import { Button } from 'vant';
import { Form } from 'vant';
import { Field } from 'vant';
import { NavBar } from 'vant';
import { Notify } from 'vant';
import router from '@/router/index'
//全局导入所有api接口
import * as API from '@/api/api'
import { Tabbar, TabbarItem } from 'vant';
// 侧边导航
import { Sidebar, SidebarItem } from 'vant';
//卡片
import { Card } from 'vant';

//提交订单栏
import { SubmitBar } from 'vant';
//地址组件
import { AddressList } from 'vant';
// 空页显示
import { Empty } from 'vant';
//编辑地址组件
import { AddressEdit } from 'vant';
//弹出层
import { Popup } from 'vant';
//步进器
import { Stepper } from 'vant';
//celi单元格
import { Cell, CellGroup } from 'vant';
//字体图标
import { Icon } from 'vant';
//单选框
import { RadioGroup, Radio } from 'vant';
//list列表组件，下拉滚动时触发事件
import { List } from 'vant';
//懒加载用的图片
import meinv from '@/assets/1.gif'
//照片懒加载
import { Lazyload } from 'vant';
Vue.use(Lazyload, {
  loading:meinv
});

Vue.use(List);

Vue.use(Radio);
Vue.use(RadioGroup);

Vue.use(Icon);

Vue.use(Cell);
Vue.use(CellGroup);

Vue.use(Stepper);

Vue.use(Popup);

Vue.use(AddressEdit)

Vue.use(Empty);

Vue.use(AddressList);
Vue.use(SubmitBar);
// 注册时可以配置额外的选项
Vue.use(Lazyload, {
  lazyComponent: true,
});

Vue.use(Card);
Vue.use(Sidebar);
Vue.use(SidebarItem);
Vue.use(Tabbar);
Vue.use(TabbarItem);
console.log(API);
Vue.use(NavBar);
Vue.use(Form);
Vue.use(Field);
Vue.config.productionTip = false
Vue.use(Button)

//注册全局组件
Vue.component('NavTop',NavTop)
new Vue({
  render: h => h(App),
  router,
  beforeCreate(){
    //全局事件总线
    Vue.prototype.$bus=this
    Vue.prototype.$API=API
  }
  
}).$mount('#app')
