<template>
  <div class="container">
    <van-nav-bar title="标题" />
    <van-cell-group>
        <van-field
        label="手机号"
        v-model.trim="user.mobile"
        :error-message="errInfo.mobile"
        required
        clearable
        placeholder="请输入手机号" />

      <van-field
        type="password"
        v-model.trim="user.code"
        :error-message="errInfo.code"
        required
        clearable
        label="密码"
        placeholder="请输入密码"
      />
    </van-cell-group>
     <div class="btn-wrap">
        <van-button type="primary" @click="hLogin" class="btn">登陆</van-button>
      </div>
  </div>
</template>

<script>
// import request from '@/utils/request.js'
import { login } from '@/api/user'
import { mapMutations } from 'vuex'
export default {
  name: 'LoginIndex',
  data () {
    return {
      user: {
        mobile: '13911111111',
        code: '246810'
      },
      // 保存错误信息
      errInfo: {
        mobile: '',
        code: ''
      }

    }
  },
  methods: {
    ...mapMutations(['setUser']),
    /**
    用于对用户信息进行验证
    如果通过验证，则返回true
     */
    checkInfo (user) {
      if (user.mobile === '') {
        this.errInfo.mobile = '手机号不能为空'
        return false
      } else {
        // 这里不写else会有bug
        this.errInfo.mobile = ''
      }
      if (user.code === '') {
        this.errInfo.code = '密码不能为空'
        return false
      } else {
        this.errInfo.code = ''
      }
      return true
    },
    async hLogin () {
    // 1| 对用户信息验证
      if (!this.checkInfo(this.user)) {
        return
      }
      // 2. loading
      this.$toast.loading({
        message: '登陆中....',
        duration: 0, // 会一直存在,如果有下一个this.$toast被调用，它就会被覆盖，也就消失了
        mask: true // 整体加一个遮罩
      })
      // 3、调用接口
      try {
        // 如果 login这个操作没有错误，则不会进入catch
        const { data: { data } } = await login(this.user)
        this.$toast.success('登陆成功')
        // 1. 保存信息到vuex中user (并且在vuex里存到本地localStorage)
        // 方式一：this.$store.commit
        // this.$store.commit('setUser', result.data.data)
        // 方式二：mapMutations
        this.setUser(data)
        // todo : 用户跳转
        this.$router.push('/')
      } catch (err) {
        // 有错误，就会到这里来
        // err这个错误是 axios给出来了。它表示通过axios发请求时，请求出错了
        // console.dir(err)
        const errMsg = err.response.data.message
        if (errMsg) {
          if (errMsg.mobile) {
            // 说明手机号错误
            this.$toast.fail('手机号错误')
          }
          if (errMsg.code) {
            this.$toast.fail('密码错误')
          }
        } else {
          this.$toast.fail('登录错误')
        }
      }
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
