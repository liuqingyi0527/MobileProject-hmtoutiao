// 把所有的用户操作功能，全写在这里
import request from '@/utils/request'
/**
 * 用户登录
 * @param {*} user
 */
export function login (user) {
  return request({
    method: 'POST',
    url: '/app/v1_0/authorizations',
    data: user
  })
}
