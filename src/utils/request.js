// 1、 对axios进行二次封装
import axios from 'axios'
import store from '@/store/index.js'
import JSONBig from 'json-bigint'
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

export default request
