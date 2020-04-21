import request from '@/utils/request'
/**
 * target:integer 评论的目标id（评论文章即为文章id，对评论进行回复则为评论id）
 *content:string 评论内容
 * art_id：integer 文章id
 */
export const addComment = (data) => {
  return request({
    method: 'POST',
    url: '/app/v1_0/comments',
    data

  })
}
/**
 * 获取评论
 */
export function getComments (params) {
  return request({
    method: 'GET',
    url: '/app/v1_0/comments',
    params
  })
}
