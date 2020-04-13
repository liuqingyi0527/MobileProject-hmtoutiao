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
