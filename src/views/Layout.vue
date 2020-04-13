<template>
<!-- 固定定位 -->
  <div class='container'>
    <van-nav-bar
  title="黑马头条"
  fixed
  @click-right="hRearch"
/>
<!-- 跳转路由的位置 -->
    <router-view></router-view>
  <van-tabbar route>
    <!-- 标签栏支持路由模式，用于搭配vue-router使用。
    路由模式下会匹配页面路径和标签的to属性，并自动选中对应的标签-->
      <van-tabbar-item icon="home-o" to='/'>主页</van-tabbar-item>
      <van-tabbar-item icon="search" to='/question'>问答</van-tabbar-item>
      <van-tabbar-item icon="video-o" to='/video'>视频</van-tabbar-item>
      <van-tabbar-item icon="user-o" to='/user'>我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
export default {
  name: 'Layout',
  data () {
    return {

    }
  },
  methods: {
    hRearch () {

    }
  }
}
</script>

<style scoped lang='less'></style>
