<template>
  <div class="channel-edit">
    <!-- 当前登陆用户已经订阅的频道 -->
    <div class="channel">
      <van-cell title="我的频道" :border="false">
          <van-button  size="mini" type="info">编辑</van-button>
      </van-cell>
      <van-grid>
        <van-grid-item
        v-for="(item,idx) in channels"
        :key="item.id"
        :class="{'cur':idx===activeIndex}"
        @click="hClickMyChannel(item)"
         >
          <span>{{item.name}}</span>
          <van-icon name="cross" class="btn"></van-icon>
        </van-grid-item>
      </van-grid>
    </div>
     <!-- 当前登陆用户没有订阅的频道 -->
    <div class="channel">
      <van-cell title="可选频道" :border="false"></van-cell>
      <van-grid>
        <van-grid-item v-for="item in recommendChannels" :key="item.id">
          <span>{{item.name}}</span>
        </van-grid-item>
      </van-grid>
    </div>
  </div>
</template>

<script>
import { getAllChannels } from '@/api/channel.js'
export default {
  name: 'ChannelEdit',
  props: {
    channels: {
      type: Array, // 一定要传入数组
      required: true // 不传就报错。
    },
    activeIndex: { // 当前父组件中选中的那个频道的下标,在显示时，它应该要高亮
      type: Number,
      required: true
    }
  },
  data () {
    return {
      allChannels: []
    }
  },
  computed: {
    recommendChannels () {
      return this.allChannels.filter((allChannels) => {
        const idx = this.channels.findIndex(item => item.id === allChannels.id)
        return idx === -1
      })
    }
  },
  created () {
    this.getAllChannels()
  },
  methods: {
    // 2、  处理点击频道子传值给父（传参频道）
    hClickMyChannel (channel) {
      this.$emit('updateCurChannel', channel)
      //    关闭弹层
      this.$emit('close')
    },
    //   1、获取所有频道
    async getAllChannels () {
      const { data: { data } } = await getAllChannels()
      console.log('所有频道是', data)
      this.allChannels = data.channels
    }
  }
}
</script>

<style lang="less" scoped>
  .channel{
    padding:15px;
    font-size:14px;
  }
  .btn {
    position: absolute;
    top: 0;
    right: 0;
    font-size: 24px;
}
  // 高亮显示
  .cur{
    color:red;
    font-weight:bold;
  }
</style>
