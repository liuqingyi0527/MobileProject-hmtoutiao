<template>
<div class="index">
    <van-tabs swipeable  v-model="activeIndex">
        <van-tab :key="item.id" v-for="item in channels" :title="item.name">
        <article-list
         @showMoreAction="hMoreAction"
        :channel='item'>
        </article-list>
        </van-tab>
    </van-tabs>
 <!-- 频道列表 开关 通过定位 -->
    <div class="bar-btn" @click="showChannelEdit=true">
        <van-icon name="wap-nav" size="24" />
    </div>

    <!-- 文章更多操作：反馈，举报.....
       第一次进来，showMoreAction是false,所以其下的 more-action 就不会创建出来
    -->
    <van-popup ref="vanPopup" :style="{width:'80%'}" v-model="showMoreAction">
     <!-- 更多组件 -->
      <more-action
       ref="refMoreAction"
      @dislike='hDislike'
      @report="hReport"
      ></more-action>
    </van-popup>
    <!-- ActionSheet 动作面板 ,给父组件传值-->
  <van-action-sheet title="编辑频道" v-model="showChannelEdit">
      <channel-edit
      :activeIndex="activeIndex"
      :channels="channels"
      @updateCurIndex="hUpdateCurIndex"
      @updateCurChannel="hUpdateCurChannel"
      @close="hCloseChannelEdit"
      >
      </channel-edit>
    </van-action-sheet>
</div>
</template>

<script>
import { getChannels } from '@/api/channel.js'
// 引入文件列表组件
import ArticleList from './articleList'
// 叉号点击后的内容
import MoreAction from './moreAction.vue'
import { dislikeArticle, reportArticle } from '@/api/article.js'
import ChannelEdit from './channelEdit.vue'
export default {
  name: 'home',
  // 局部组件 只在父模板可用 一定要在实例上注册了才能在html文件中使用
  components: {
    ArticleList,
    MoreAction,
    ChannelEdit
  },
  data () {
    return {
      activeIndex: 0,
      channels: [],
      showMoreAction: false, // 控制弹出层
      articleId: null, // 当前要操作的文章编号
      showChannelEdit: false// 频道面板控制
    }
  },
  created () {
    this.getChannelsMethod()
  },
  methods: {
    // 8、更新当前的选中频道下标
    hUpdateCurIndex (index) {
      this.activeIndex = index
    },
    // 7、关闭编辑频道弹层
    hCloseChannelEdit () {
      this.showChannelEdit = false
    },
    // 6、把当前的传的channel处于 选中状态
    hUpdateCurChannel (channel) {
      this.activeIndex = this.channels.findIndex(it => it.id === channel.id)
      console.log(this.activeIndex)// 返回的是索引
    },
    // 4、删除文章封装操作
    delArticle () {
      this.$eventBus.$emit('delArticle', {
        articleId: this.articleId,
        channelId: this.channels[this.activeIndex].id// 当前频道编号
      })
    },
    // 5、举报文章接收moreAction里的hReport事件
    async  hReport (typeId) {
      // typeId就是在moreAction组件中抛出来的举报类型
      alert(typeId)
      // （1）调用接口
      const result = await reportArticle(this.articleId, typeId)
      console.log(result)
      // （2） 退出弹层
      this.showMoreAction = false
      // happy
      this.$toast.success('操作成功')
      // （3） 删除对应的文章
      this.delArticle()
    },
    // 3、不感兴趣文章
    async  hDislike () {
      // （1）调用接口
      const result = await dislikeArticle(this.articleId)
      console.log(result)
      // （2）退出弹层
      this.showMoreAction = false
      this.$toast.success('操作成功')
      // （3）删除对应的文章
      this.delArticle()
    },
    // 2、点击叉号文章弹框
    hMoreAction (articleId) {
      // 处理子组件articleList中的点击 X 事件
      // 1. 显示弹窗
      // console.log('文章id' + acticleId)
      this.showMoreAction = true
      // 1. 显示弹窗，确保它的isReport是flase
      if (this.$refs.refMoreAction) {
        // 在父组件中去修改子组件的数据
        // this.$refs.refMoreAction就是子组件
        this.$refs.refMoreAction.isReport = false
      }
      // 保存编号备用
      this.articleId = articleId
    },
    // 1、 获取频道
    async getChannelsMethod () {
      const { data: { data } } = await getChannels()
      // console.log(data)
      this.channels = data.channels
    }
  }

}
</script>

<style scoped lang='less'>
 .bar-btn{
      position: fixed;
      right: 5px;
      top: 52px;
      display: flex;
      align-items: center;
      background-color: #fff;
      opacity: 0.8;
      z-index:1
  }

</style>
