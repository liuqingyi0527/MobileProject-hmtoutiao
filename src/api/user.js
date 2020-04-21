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
    url: '/app/v1_0/user',
    method: 'get'
    // headers: {
    //   Authorization: `Bearer ${store.state.user.token}`
    // }
  })
}

/**
 * 关注用户
 */
export function followUser (userId) {
  return request({
    method: 'POST',
    url: '/app/v1_0/user/followings',
    data: {
      target: userId // 用户id
    }
  })
}
/**
 * 取消关注用户
 */
export function unFollowUser (userId) {
  return request({
    method: 'DELETE',
    url: '/app/v1_0/user/followings/' + userId
  })
}
/**
 * 获取用户资料
 */
export function getProfile () {
  return request({
    method: 'GET',
    url: '/app/v1_0/user/profile'

  })
}

/**
 * 修改用户信息
 * @param {*} data
 * 请求的字段参数 发送几个保存几个，不发送的不修改
 */
export function updateUserInfo (data) {
  return request({
    method: 'PATCH',
    url: '/app/v1_0/user/profile',
    data
  })
}
/**
 * 修改用户的头像
 * @param {*} formData  参数是formData格式
 */
export function updatePhoto (formData) {
  return request({
    method: 'PATCH',
    url: '/app/v1_0/user/photo',
    data: formData
  })
}
