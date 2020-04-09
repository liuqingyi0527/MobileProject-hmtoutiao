<template>
  <div class="container">
    <van-nav-bar title="标题" />
    <van-cell-group>
      <van-field v-model="user.mobile" required clearable label="手机号" placeholder="请输入手机号" />
      <van-field v-model="user.code" required clearable type="password" label="密码" />
      <div class="btn-wrap">
        <van-button type="primary" @click="hLogin" class="btn">登陆</van-button>
      </div>
    </van-cell-group>
  </div>
</template>

<script>
// import request from '@/utils/request.js'
import { login } from '@/api/user'
export default {
  name: 'LoginIndex',
  data () {
    return {
      user: {
        mobile: '13911111111',
        code: '246810'
      }
    }
  },
  methods: {
    async hLogin () {
      console.log(this.user)
      const result = await login(this.user)
      console.log(result)
    }
  }
}
</script>

<style scoped lang='less'>
.btn-wrap {
  padding: 20px;
  .btn {
    width: 100%;
    background-color: #6db4fb;
    color: #fff;
  }
}
</style>
