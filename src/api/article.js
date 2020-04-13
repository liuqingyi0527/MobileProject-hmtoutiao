// 所有与文章相关的操作
import request from '@/utils/request'

/**
 * 获取文章列表信息
 * @param {*} data
 *
 * {
 *   channel_id: 频道ID,
 *   timestamp: 时间戳，请求新的推荐数据传当前的时间戳，请求历史推荐传指定的时间戳
 *   with_top:1
 * }
 */
export const getArticles = (data) => {
  return request({
    url: '/app/v1_1/articles',
    method: 'GET',
    params: data
  })
}
// 不感兴趣文章操作
export const dislikeArticle = (articleId) => {
  return request({
    url: '/app/v1_0/article/dislikes',
    method: 'POST',
    data: {
      target: articleId
    }
  })
}
