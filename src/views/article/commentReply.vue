<template>
<div class="article-comments">
    <!-- 导航栏 -->
    <van-nav-bar :title="comment.reply_count+'条回复'">
      <van-icon slot="left" name="cross"  @click="$emit('close')"/>
    </van-nav-bar>
    <!-- /导航栏 -->

    <!-- 当前评论 -->
    <van-cell title="当前评论">
      <van-image
        slot="icon"
        round
        width="30"
        height="30"
        style="margin-right: 10px;"
        :src="comment.aut_photo"
      />
       <span style="color: #466b9d;" slot="title">{{comment.aut_name}}</span>
      <div slot="label">
        <p style="color: #363636;">{{comment.content}}</p>
        <p>
            <span style="margin-right: 10px;">{{comment.pubdate | relativeTime}}</span>
          <van-button
            size="mini"
            type="default"
          >回复{{comment.reply_count}}</van-button>
        </p>
      </div>
      <van-icon slot="right-icon" />
    </van-cell>
    <!-- /当前评论 -->
    <van-divider>全部回复</van-divider>

    <!-- 对当前评论 回复列表 -->
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
     >
      <van-cell
        v-for="(item, index) in list"
        :key="index"
       :title="item.aut_name"
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
          </p>
        </div>
      </van-cell>
    </van-list>
    <!-- 回复列表 -->

    <!-- 发布回复 -->
    <van-cell-group class="publish-wrap">
      <van-field
       v-model.trim="commentText"
        clearable
        placeholder="请输入回复内容"
      >
        <van-button
          slot="button"
          size="mini"
          type="info"
           @click="hAddReply"
        >发布</van-button>
      </van-field>
    </van-cell-group>
    <!-- /发布回复 -->
</div>

</template>
<script>
import { getComments, addComment } from '@/api/comment'
export default {
  name: 'CommentReply',
  props: {
    comment: {
      type: Object,
      require: true
    }
  },
  data () {
    return {
      list: [], // 评论列表
      loading: false, // 上拉加载更多的 loading
      finished: false, // 是否加载结束
      offset: null,
      commentText: '' // 回复的内容
    }
  },
  methods: {
    // 2、 添加回复
    async hAddReply () {
      // 1.收集用户输入
      if (!this.commentText) {
        return
      }
      // 2.调用接口
      /* target integer 必须  评论的目标id（评论文章即为文章id，对评论进行回复则为评论id）
        content string 必须  评论内容
        art_id integer 非必须  文章id，对评论内容发表回复时，需要传递此参数，表明所属文章id。
      对文章进行评论，不要传此参数。
      */
      const result = await addComment({
        target: this.comment.com_id.toString(), // 评论id
        content: this.commentText,
        art_id: this.$route.params.id// 当前文章的id
      })
      console.log(result)

      // 3.根据调用结果给出反馈
      // 3.1  从接口的返回值中去取出new_obj(表示前评论回复的内容)，添加到listK
      this.list.unshift(result.data.data.new_obj)
      // 3.2 把评论条数加1
      this.comment.reply_count++

      this.$toast('回复成功')
      // 4.清空回复内容
      this.commentText = ''
    },
    // 1、 加载评论回复列表
    async  onLoad () {
      // 异步更新数据
      // 1. 请求数据
      const result = await getComments({
        type: 'c', // 对评论(comment)的回复
        source: this.comment.com_id.toString(), // 评论id
        offset: this.offset
      })
      // 2. 将数据添加到列表中
      this.list.push(...result.data.data.results)
      // 加载状态结束
      this.loading = false

      if (result.data.data.results.length) {
        // 更新一下offset
        // 这个值是后端要求的，用来作分页效的
        // 在发下一次时，要把上一次请求回的来最后一个id传入
        this.offset = result.data.data.last_id
      } else {
        this.finished = true
      }
    }
  }
}
</script>
<style lang="less" scoped>
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
