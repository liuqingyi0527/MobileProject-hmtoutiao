import Vue from 'vue'
import Vuex from 'vuex'
import { setItem, getItem, removeItem } from '../utils/storage'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 保存公共数据
    // vuex的初始值从localStorage中去取
    user: getItem('user'),
    photo: ''// 用户头像的地址
  },
  mutations: {
    // 修改头像
    updatePhoto (state, photo) {
      state.photo = photo
      // 把这个信息做持久化
      setItem('photo', photo)
    },
    // 3、退出登录时候调用
    delUser (state) {
      state.user = null
      removeItem('user')
    },
    // 2、补充一个mutation来设置user
    // 更新token
    updateToken (state, newToken) {
      state.user.token = newToken
      // 更新token后，本地持久化的token也改变
      setItem('user', state.user)
    },
    // 1、 vuex中的要求：主要通过木桶才能去修改state
    setUser (state, obj) {
      state.user = obj
      // 把这个信息做持久化
      setItem('user', obj)
    }
  },
  actions: {
  },
  modules: {
  }
})
