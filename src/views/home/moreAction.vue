<template>
  <div class="more-action">
    <van-cell-group v-if="!isReport">
      <van-cell @click="$emit('dislike')">不感兴趣</van-cell>
      <van-cell is-link @click="isReport=true">反馈垃圾内容</van-cell>
      <van-cell>拉黑作者</van-cell>
    </van-cell-group>
    <van-cell-group v-else>
      <van-cell icon="arrow-left" @click="isReport=false">返回</van-cell>
     <!-- 便利constants里面的数组，取出value(数字12345) -->
      <van-cell
      v-for="(item,idx) in reports"
      :key='idx'
      @click="$emit('report',item.value)"
      >
      {{item.label}}
      </van-cell>
    </van-cell-group>
  </div>
</template>

<script>
import { reports } from '@/utils/constants.js'
export default {
  data () {
    return {
      isReport: false,
      // 常量数组，数组里是对象
      reports
    }
  }
}
</script>

<style lang='less' scoped>
.more-action {
  border-radius: 4px;
}
</style>
