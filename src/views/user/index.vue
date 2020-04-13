<template>
  <div class='container'>
        {{$store.state.user}}
  </div>
</template>

<script>
import { getInfo } from '@/api/user.js'
export default {

  created () {
    // 在user/index.vue中调用user.js/getInfo
    getInfo()
  }
}
</script>

<style scoped lang='less'></style>
