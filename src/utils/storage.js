// 封装一个模块，来使用loaclStorage
/**
 *获取storage
 * @param {storage} name
 */
export const getItem = (name) => {
  return JSON.parse(localStorage.getItem(name))
}
/**
 * 设置storage
 * @param {Storage变量名} name
 * @param {Storage数据} data
 */
export const setItem = (name, data) => {
  return localStorage.setItem(name, JSON.stringify(data))
}
/**
 *
 * @param {*} name
 */
export const removeItem = (name) => {
  localStorage.removeItem(name)
}
