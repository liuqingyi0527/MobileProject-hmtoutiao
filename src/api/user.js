// 把所有的用户操作功能，全写在这里
import request from '@/utils/request'
// import store from '@/store/index.js'
/**
 *
 * @param {用户登录} user
 */
export function login (user) {
  return request({
    method: 'POST',
    url: '/app/v1_0/authorizations',
    data: user
  })
}
/**
 * 用户信息获取
 */
export function getInfo () {
  // console.dir(store)
  return request({
    url: '/app/v1_0/user/profile',
    method: 'get'
    // headers: {
    //   Authorization: `Bearer ${store.state.user.token}`
    // }
  })
}
