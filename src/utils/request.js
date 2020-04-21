// 1、 对axios进行二次封装
import axios from 'axios'
import store from '@/store/index.js'
import JSONBig from 'json-bigint'
import router from '@/router/index.js'
const request = axios.create({
  // 设置基准值
  baseURL: 'http://ttapi.research.itcast.cn',
  // 收到后端数据用jsonBig处理大数问题
  transformResponse: [function (data) {
    try {
      return JSONBig.parse(data)
    } catch (e) {
      return data
    }
  }]
})
// 2、 添加请求拦截器
request.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  // console.log(config)// 请求配置项
  const user = store.state.user
  // console.log(user)
  if (user) {
    config.headers.Authorization = `Bearer ${store.state.user.token}`
  }
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})
// 2、 响应拦截器处理token问题
request.interceptors.response.use(function (response) {
  return response
}, async function (error) {
  // 如果返回401错误
  if (error.response.status === 401) {
    console.log('token失效')
    // 返回401并且存在refresh_token, 用refresh_token去求一个特殊的接口以获取新的token
    if (store.state.user && store.state.user.refresh_token) {
      try {
        const result = await axios({
          url: 'http://ttapi.research.itcast.cn/app/v1_0/authorizations',
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${store.state.user.refresh_token}`
          }
        })
        // 从接口返加值中去取出新token，更新到当前的vuex中
        // mutations去改token
        console.log('refresh_token请求到新的token', result.data.data.token)
        store.commit('updateToken', result.data.data.token)
        // 更新了token请求重发一次
        console.log('更新token')
        return request(error.config)
      } catch (error) {
        console.log('更新token，refresh_token 失败')
        // 消除vuex的token
        store.commit('setUser', null)
        // 必须要重新登陆
        router.push({
          path: '/login',
          query: {
            // router中有一个属性currentRoute
            from: router.currentRoute.fullPath
          }
        })
      }
    } else {
      console.log('没有refresh token,准备去重新登陆吧')
      router.push({
        path: '/login',
        query: {
          // router中有一个属性currentRoute
          from: router.currentRoute.fullPath
        }
      })
    }
    // console.log('响应拦截器')
    // console.dir(error)
  } else {
    return Promise.reject(error)
  }
})
export default request
