//
import requset from '@/utils/request'
/**
 * 获取当前频道
 */
export const getChannels = () => {
  return requset({
    method: 'GET',
    url: '/app/v1_0/user/channels'
  })
}
// 获取所有频道
export const getAllChannels = () => {
  return requset({
    method: 'GET',
    url: '/app/v1_0/channels'
  })
}
/**
 * 获取系统所有频道，原有的覆盖顺序序号但不会删除未涉及到的用户频道
 * 不允许掺入推荐
 */
export const addChannel = (channels) => {
  return requset({
    //  默认get
    method: 'PUT',
    url: '/app/v1_0/user/channels',
    data: {
      channels
    }
  })
}
/**
 *删除频道
 * @param {*} channels
 */
export function deleteChannels (channels) {
  return requset({
    method: 'DELETE',
    url: '/app/v1_0/user/channels',
    data: { channels }
  })
}
