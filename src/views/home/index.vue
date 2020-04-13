<template>
<div class="index">
    <van-tabs swipeable>
        <van-tab :key="item.id" v-for="item in channels" :title="item.name">
        <article-list
         @showMoreAction="hMoreAction"
        :channel='item'>
        </article-list>
        </van-tab>
    </van-tabs>

    <!-- 文章更多操作：反馈，举报..... -->
    <van-popup :style="{width:'80%'}" v-model="showMoreAction">
     <!-- 更多组件 -->
      <more-action @dislike='hDislike'></more-action>
    </van-popup>
</div>
</template>

<script>
import { getChannels } from '@/api/channel.js'
// 引入文件列表组件
import ArticleList from './articleList'
// 叉号点击后的内容
import MoreAction from './moreAction.vue'
import { dislikeArticle } from '@/api/article.js'
export default {
  name: 'home',
  // 局部组件 只在父模板可用 一定要在实例上注册了才能在html文件中使用
  components: {
    ArticleList,
    MoreAction
  },
  data () {
    return {
      channels: [],
      showMoreAction: false, // 控制弹出层
      articleId: null // 当前要操作的文章编号
    }
  },
  created () {
    this.getChannelsMethod()
  },
  methods: {
    // 不感兴趣文章
    async  hDislike () {
      const result = await dislikeArticle(this.acticleId)
      console.log(result)
      this.$toast.success('操作成功')

      // todo:删除对应文章
      this.showMoreAction = false
    },
    // 点击叉号文章弹框
    hMoreAction (acticleId) {
      // 处理子组件articleList中的点击 X 事件
      // 1. 显示弹窗
      console.log('文章id' + acticleId)
      this.showMoreAction = true
      // 保存编号备用
      this.acticleId = acticleId
    },
    // 获取频道
    async getChannelsMethod () {
      const { data: { data } } = await getChannels()
      // console.log(data)
      this.channels = data.channels
    }
  }

}
</script>

<style scoped lang='less'>

</style>
