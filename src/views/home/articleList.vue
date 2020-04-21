<template>
  <div class="scroll-wrapper" @scroll="remember" ref="myScroll">
    <van-pull-refresh v-model="isLoadingNew" @refresh="onRefresh">
    文章列表{{channel.id}}--{{channel.name}}
    <!--van-list:自带有下拉加载更多的效果-->
    <!-- List 组件通过loading和finished两个变量控制加载状态
     当组件滚动到底部时，会触发 @load事件 并将loading设置成true
     此时可以发起异步操作并更新数据，数据更新完毕后，将loading设置成false即可。
     若数据已全部加载完毕，则直接将finished设置成true即可
    -->
    <van-list v-model="loading"
    :finished="finished"
    finished-text="没有更多了"
    @load="onLoad">
     <!-- 用bigint处理过是一个对象，但是用+可以默认成字符串，就不用tostring -->
      <van-cell
      v-for="(item,index) in list"
      :key="index"
      :title="item.title"
      @click="$router.push('/article/'+item.art_id)"
      >
        <!-- 不用插槽内容在最右侧 -->
        <div slot="label">
          <!-- 图片 -->
          <van-grid :column-num="item.cover.images.length">
            <van-grid-item v-for="(img,idx) in item.cover.images" :key="idx">
             <!-- 设置lazy-load属性来开启图片懒加载，需要搭配 Lazyload 组件使用 -->
              <van-image lazy-load :src="img" />
            </van-grid-item>
          </van-grid>
          <!-- 文字说明 -->
          <div class="meta">
           <span>{{item.aut_name}}</span>
        <span>{{item.comm_count}}评论</span>
        <span>{{item.pubdate | relativeTime}}</span>
       <!--登陆用户可以看见 X
            依据：只有登陆用户才有vuex 中 user
        -->
        <span class=close  v-if="$store.state.user" @click.stop="hMoreAction(item.art_id)">
          <van-icon name="cross"></van-icon>
        </span>
          </div>
        </div>
      </van-cell>
    </van-list>
     </van-pull-refresh>
  </div>
</template>

<script>
import { getArticles } from '@/api/article'

export default {
  name: 'ArticleList',
  props: {
    // 从父组件中获取当前的频道信息
    channel: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      list: [], // 列表数据
      isLoadingNew: false, // 是否正在下拉刷新
      loading: false,
      finished: false,
      timestamp: null // 保存本次请求数据要用到的时间戳
    }
  },
  created () {
    // 监听事件总线的删除文章 方法
    this.$eventBus.$on('delArticle', (obj) => {
      console.log('参数是', obj)// obj是对象不能用+ 号打印了
      // console.log('参数是' + JSON.stringify(obj))
      console.log(`收到了delArticle事件，当前是${this.channel.id}频道`)
      if (obj.channel_id === this.channel_id) {
        const idx = this.list.findIndex(it => it.art_id.toString() === obj.articleId)
        if (idx !== -1) {
          // 找到了
          this.list.splice(idx, 1)
        }
      }
    })
  },
  activated () {
    // 组件激活时的钩子函数
    console.log('activated')
    // 去设置一下滚动条的位置
    if (this.scrollTop && this.$refs.myScroll) {
      // 恢复
      this.$refs.myScroll.scrollTop = this.scrollTop
    }
  },
  deactivated () {
    console.log('deactivated')
  },
  methods: {
    // 当scroll发生了，会自动传 event 事件对象
    remember (event) {
      // todo : 去完成节流操作

      // 取出当前滚动条的位置
      // 保存到一个普通的属性中。
      this.scrollTop = event.target.scrollTop
      // console.log(this.scrollTop)
    },
    // 3、子传值给父组件 在文章列表上 点击某个文章的 X ，bigintObj为文章编号
    hMoreAction (bigintObj) {
      // console.log(typeof bigintObj)// object
      // console.log(typeof bigintObj.toString())// string
      // 通过自定义事件(showMoreAction)，告诉父组件去弹窗
      this.$emit('showMoreAction', bigintObj.toString())
    },
    // 1、下拉加载的具体代码
    async onRefresh () {
      // 1、发送请求，取回最新文章
      // console.log('上拉刷新加载新数据.....')
      const result = await getArticles({
        channel_id: this.channel.id, // 当前的频道ID
        timestamp: Date.now(), // 请求最新的推荐数据传当前的时间戳
        with_top: 1
      })
      // 2. 添加到list中，确定是要放在头部
      const arr = result.data.data.results
      this.list.unshift(...arr)
      const msg = arr.length ? `刷新成功${arr.length}` : '没有最新数据'
      this.$toast(msg)

      // 3.修改下拉刷新的状态
      this.isLoadingNew = false
    },
    // 2、onLoad:执行时机：
    // （1）页面打开，van-list内容不足一屏，则会自动调用
    // （2）手动上拉，也会执行
    async onLoad () {
      console.log('加载新数据.....')
      const {
        data: { data }
      } = await getArticles({
        channel_id: this.channel.id, // 当前的频道ID
        timestamp: this.timestamp || Date.now(),
        // 请求新的推荐数据传当前的时间戳，请求历史推荐传指定的时间戳
        with_top: 1
      })
      // 1.1 把取回来的数组arr中的数据放入 this.list中。
      //  相当于是要把数组arr中的内容 填充到数组this.list.(还是原来的数组)
      const arr = data.results
      // console.log(arr)
      this.list.push(...arr)
      console.log(arr)
      // 1.2 更新一下，下一次请求时发的时间戳
      this.timestamp = data.pre_timestamp
      // 加载状态结束
      this.loading = false
      // 数据全部加载完成
      if (arr.length === 0) {
        this.finished = true
      }
      // 测试 finished-text的出现
      // if (arr.length >= 10) {
      //   this.finished = true
      // }
    }
  }
}
</script>
<style scoped lang='less'>
.meta {
  display: flex;
  span {
    margin-right: 10px;
  }
  .close{
    // 让它在最右面
    margin-left: auto;
  }
}
</style>
