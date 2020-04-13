import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Vant, { Lazyload } from 'vant'
import 'vant/lib/index.css'
// 它会根据手机尺寸来设置
import 'amfe-flexible'
import '@/styles/index.less'
// 导入过滤器处理函数
import { relativeTime } from '@/utils/date-time'
Vue.use(Vant)
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
