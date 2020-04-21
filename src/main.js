import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'vant/lib/index.css'
import {
  Tabbar,
  TabbarItem,
  Form,
  Field,
  Button,
  NavBar,
  Toast,
  Tabs,
  Tab,
  List,
  Lazyload,
  CellGroup,
  Cell,
  Icon,
  Grid,
  GridItem,
  Popup,
  Row,
  Col,
  Tag,
  Image,
  PullRefresh,
  ActionSheet,
  Dialog,
  DatetimePicker

} from 'vant'
// 它会根据手机尺寸来设置
import 'amfe-flexible'
import '@/styles/index.less'
// 导入过滤器处理函数
import { relativeTime } from '@/utils/date-time'
Vue.use(DatetimePicker)
Vue.use(Dialog)
Vue.use(Tabbar)
Vue.use(TabbarItem)
Vue.use(Form)
Vue.use(Field)
Vue.use(Button)
Vue.use(NavBar)
Vue.use(Toast)
Vue.use(Tabs)
Vue.use(Tab)
Vue.use(List)
Vue.use(Lazyload)
Vue.use(CellGroup)
Vue.use(Cell)
Vue.use(Icon)
Vue.use(Grid)
Vue.use(GridItem)
Vue.use(Popup)
Vue.use(Row)
Vue.use(Col)
Vue.use(Tag)
Vue.use(Image)
Vue.use(PullRefresh)
Vue.use(ActionSheet)

// 挂载事件总线
// 所有组件都可以访问$eventBus
Vue.prototype.$eventBus = new Vue()
// 使用懒加载
Vue.use(Lazyload)
Vue.config.productionTip = false

// 定义一个全局过滤器
// relativeTime是在/utils/date-time.js中定义的
Vue.filter('relativeTime', relativeTime)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
