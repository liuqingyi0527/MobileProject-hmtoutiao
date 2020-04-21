<template>
  <div class="article-comments">
    <!-- 评论列表 -->
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <van-cell
        v-for="(item,idx) in list"
        :key="idx"
         :title="item.content"
      >
        <van-image
          slot="icon"
          round
          width="30"
          height="30"
          style="margin-right: 10px;"
          :src="item.aut_photo"
        />
        <span style="color: #466b9d;" slot="title">{{item.aut_name}}</span>
        <div slot="label">
          <p style="color: #363636;">{{item.content}}</p>
          <p>
            <span style="margin-right: 10px;">{{item.pubdate | relativeTime}}</span>
             <van-button size="mini" type="default" @click="hReplay(item)">{{ item.reply_count }}回复</van-button>
          </p>
        </div>
        <van-icon slot="right-icon" name="like-o" />
      </van-cell>
    </van-list>
    <!-- 评论列表 -->

    <!-- 发布评论 -->
    <van-cell-group class="publish-wrap">
      <van-field
        clearable
        placeholder="请输入评论内容"
        v-model.trim="commentText"
      >
        <van-button @click="hAddComment" slot="button" size="mini" type="info">发布</van-button>
      </van-field>
    </van-cell-group>
    <!-- /发布评论 -->
    <!-- 评论回复里面的弹层 -->
    <van-popup
    v-model="isReplyShow"
    round
    position="bottom"
    :style="{height:'85%'}"
    >
    <!-- 父传子 加上v-if 保证拿到最新回复数据 -->
     <comment-reply
     v-if="isReplyShow"
      :comment='currentComment'
       @close="isReplyShow = false"
      ></comment-reply>
    </van-popup>
  </div>
</template>
<script>
import { addComment, getComments } from '@/api/comment'
import CommentReply from './commentReply.vue'
export default {
  name: 'ArticleComment',
  props: {
    articleId: {
      type: String,
      required: true
    }
  },
  components: {
    CommentReply
  },
  data () {
    return {
      isReplyShow: false, // 是否显示评论回复
      currentComment: {}, // 当前评论
      commentText: '', // 当前评论的内容
      list: [], // 评论列表
      loading: false, // 上拉加载更多的 loading
      finished: false, // 是否加载结束
      offset: null// 列表数据的偏移量，实现类似分页的效果，要传给后端
    }
  },
  methods: {
    // 3、打开回复弹出框
    hReplay (item) {
      this.isReplyShow = true
      this.currentComment = item
    },
    // 2、获取列表数据
    async onLoad () {
      // 2.1获取数据
      const { data } = await getComments({
        type: 'a',
        source: this.articleId,
        offset: this.offset
      })
      // 2、将数据添加到数组中
      this.list.push(...data.data.results)
      // 3、结束loading
      this.loading = false
      // 4. 判断是否加载结束
      if (data.data.results.length) {
        // offset获取评论数据的偏移量，值为评论id，表示从此id的数据向后取，不传表示从第一页开始读取数据
        this.offset = data.data.last_id
      } else {
        this.finished = true
      }
    },
    // 1、给文章添加评论
    async hAddComment () {
      // 1. 获取当前评论的内容
      if (!this.commentText) {
        return
      }

      // 2. 调用接口，实现添加评论的功能
      const { data: { data } } = await addComment({
        target: this.articleId, // 文章id ,评论的目标id
        content: this.commentText
      })
      console.log(data)

      // 把从接口中返回的数据，添加到评论列表中
      // 3. 最加入的评论应该在数组头部
      this.list.unshift(data.new_obj)
      // 4. 文本框清空
      this.commentText = ''
    }
  }
}
</script>

<style scoped lang='less'>
// 发表评论的区域是固定在下端的
.publish-wrap {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
}
// 给发表评论区空出地方
.van-list {
  margin-bottom: 45px;
}
</style>
