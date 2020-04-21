<template>
  <div class="article-container">
    <!-- 导航栏 -->
    <van-nav-bar
      fixed
      left-arrow
      @click-left="$router.back()"
      title="文章详情"
    ></van-nav-bar>
    <!-- /导航栏 -->

    <!-- 加载中 loading -->
    <van-loading class="article-loading" v-if='loading' />
    <!-- /加载中 loading -->

    <!-- 文章详情 -->
    <div class="detail" v-else>
      <h3 class="title">{{article.title}}</h3>
      <div class="author">
        <van-image round width="1rem" height="1rem" fit="fill" :src="article.aut_photo"/>
        <div class="text">
          <p class="name">{{article.aut_name}}</p>
          <p class="time">{{article.pubate|relativeTime}}</p>
        </div>
        <van-button
          round
          size="small"
          type="info"
           @click="hFollow"
        >{{ article.is_followed ? '取消关注' : '+ 关注' }}</van-button>
      </div>
      <div class="content" v-html="article.content"></div>
      <van-divider>正文结束</van-divider>
      <div class="zan">
        <van-button
        round
        size="small"
        hairline type="primary"
        plain
        @click="onLike"
        :icon="article.attitude === 1 ? 'good-job' : 'good-job-o'"
        >{{ article.attitude === 1 ? '取消点赞' : '点赞' }}</van-button>
        &nbsp;&nbsp;&nbsp;&nbsp;
        <van-button
        round
         size="small"
         hairline
         type="danger"
         plain
         icon="delete"
         @click="onDislike"
         >{{article.attitude ===0 ?"取消不喜欢":"不喜欢"}}</van-button>
      </div>
      <!-- 评论组件  父传给子文章id-->
      <article-comment
      :articleId="$route.params.id"
      ></article-comment>
    </div>
    <!-- /文章详情 -->

  </div>
</template>

<script>
import { getArticle, addLike, deleteLike, deleteDislike, addDislike } from '@/api/article'
import { followUser, unFollowUser } from '@/api/user'
// 引入评论组件
import ArticleComment from '@/views/article/comment'
export default {
  name: 'ArticleIndex',
  components: {
    ArticleComment
  },
  data () {
    return {
      loading: true, // 控制加载中的 loading 状态
      article: { }
    }
  },
  created () {
    this.loadArticle()
  },
  methods: {
    //   4、喜欢不喜欢切换
    async onDislike () {
      const articleId = this.article.art_id.toString()
      // 如果是不喜欢状态，则取消不喜欢
      if (this.article.attitude === 0) {
        await deleteDislike(articleId)
        this.article.attitude = -1
      } else {
        // 否则，不喜欢
        await addDislike(articleId)
        this.article.attitude = 0
      }
    },
    //   3、点赞取消点赞
    async onLike () {
      // 用bigint处理过的文章id,需要toString
      const articleId = this.article.art_id.toString()
      if (this.article.attitude === 1) {
        await deleteLike(articleId)
        this.article.attitude = -1
      } else {
        // 否则点赞
        await addLike(articleId)
        this.article.attitude = 1
      }
    },
    //   2、关注操作
    async hFollow () {
      if (this.article.is_followed) {
        //   为真，要取关
        await unFollowUser(this.article.aut_id)
      } else {
        // 为假，要加关注
        await followUser(this.article.aut_id)
      }
      this.article.is_followed = !this.article.is_followed
    },
    //  1、 获取文章详情
    async loadArticle () {
      // 开启 loading
      this.loading = true
      const { data: { data } } = await getArticle(this.$route.params.id)
      console.log(data)
      this.article = data
      this.loading = false
    }
  }
}
</script>

<style scoped lang='less'>
.article-container{
  position: absolute;
  left: 0;
  top: 0;
  overflow-y: scroll;
  width: 100%;
  height: 100%;
}
.article-loading {
  padding-top: 100px;
  text-align: center;
}
.error{
  padding-top: 100px;
  text-align: center;
}
.detail {
  padding: 50px 10px;
  .title {
    font-size: 16px;
  }
  .zan{
    text-align: center;
  }
  .author {
    padding: 10px 0;
    display: flex;
    .text {
      flex: 1;
      padding-left: 10px;
      line-height: 1.3;
      .name {
        font-size: 14px;
        margin: 0;
      }
      .time {
        margin: 0;
        font-size: 12px;
        color: #999;
      }
    }
  }
  .content {
    font-size:14px;
    overflow: hidden;
    white-space: pre-wrap;
    word-break: break-all;
    /deep/ img{
      max-width:100%;
      background: #f9f9f9;
    }
  }
}
</style>
