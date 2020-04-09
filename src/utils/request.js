// 对axios进行二次封装
import axios from 'axios'
const request = axios.create({
  // 设置基准值
  baseURL: 'http://ttapi.research.itcast.cn'
})
export default request
