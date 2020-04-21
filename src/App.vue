<template>
  <div id="app">
    <!-- 缓存所有路由 -->
     <keep-alive>
          <router-view v-if="$route.meta.isKeepAlive"></router-view>
     </keep-alive>
     <router-view  v-if="!$route.meta.isKeepAlive"></router-view>

  </div>
</template>
<script>
export default {

}
</script>
<style lang="less">
</style>
