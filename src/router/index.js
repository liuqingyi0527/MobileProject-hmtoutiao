import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store/index'
const Login = () => import('@/views/login/index.vue')
const Layout = () => import('@/views/Layout')
const Home = () => import('@/views/home')
const Question = () => import('@/views/question')
const Video = () => import('@/views/video')
const User = () => import('@/views/user')
const Article = () => import('@/views/article')
// 全局注册路由
Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/',
    component: Layout,
    children: [
      { path: '/', name: 'home', component: Home },
      { path: '/question', name: 'question', component: Question },
      { path: '/video', name: 'video', component: Video },
      { path: '/user', name: 'user', component: User }
    ]
  },
  {
    path: '/search',
    name: 'search',
    component: () => import('../views/search/index.vue')
  },
  {
    path: '/search/result',
    name: 'searchResult',
    component: () => import('../views/search/result.vue')
  },
  { // 定义路由时，写的是:id
    // 则在路由接收参数时，也要写params.id
    path: '/article/:id',
    name: 'articleDetail',
    component: Article
  }, {
    path: '/user/profile',
    name: 'userProfile',
    component: () => import('@/views/user/profile.vue')
  },
  {
    // 小智同学聊天机器人
    path: '/user/chat',
    name: 'userChat',
    component: () => import('../views/user/chat.vue')
  }
]
const router = new VueRouter({
  routes
})
// 导航守卫 （开始写法）
// router.beforeEach(function (to, from, next) {
//   // 如果你访问的路径是除去登录外的路径，并且你此时没有登录，拦截到登录页面。
//   // 其他情况一概放行。
//   const user = store.state.user
//   if (to.path !== '/login' && !user) return next('/login')
//   next()
// })
// beforEach是由VueRouter提供的
// 每当路由变化时,在跳转目标路由前会执行这个函数(中间件)
router.beforeEach(function (to, from, next) {
  // to   : 目地 B
  // from : 从哪里 A
  // next ：是一个函数，可以用来做路由的跳转
  // console.log('打印to', to, '打印from', from, '打印next', next)
  if (isOk(to)) {
    next()// 不加参数，就是允许进入到to路由
  } else {
    // 回到登录页 ，它在/login中成功登陆之后，应该要跳回到原来访问也
    next({
      path: '/login',
      query: {
        from: to.fullPath // 让它可以找到来时的路 /user
      }
    })
  }
})
// 具体代码
function isOk (to) {
  // 检查是否允许
  // // 如果你访问的路由是以"/user"开头，则一定要是登陆状态，否则不允许
  if (to.path.startsWith('/user') && !store.state.user) {
    // console.log(to)
    return false
  } else {
    return true
  }
}

export default router
