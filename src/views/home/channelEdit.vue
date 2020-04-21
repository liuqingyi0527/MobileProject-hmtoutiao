<template>
  <div class="channel-edit">
    <!-- 当前登陆用户已经订阅的频道 -->
    <div class="channel">
      <van-cell title="我的频道" :border="false">
          <van-button  size="mini" type="info" @click='editing=!editing'>
            {{editing ? "取消": "编辑"}}
          </van-button>
      </van-cell>
      <van-grid>
        <van-grid-item
        v-for="(item,idx) in channels"
        :key="item.id"
        :class="{'cur':idx===activeIndex}"
        @click="hClickMyChannel(item)"
         >
          <span>{{item.name}}</span>
          <!-- 第一个推荐不可删除 -->
          <van-icon name="cross" class="btn" v-show="editing && idx!=0"></van-icon>
        </van-grid-item>
      </van-grid>
    </div>
     <!-- 当前登陆用户没有订阅的频道 -->
    <div class="channel">
      <van-cell title="可选频道" :border="false"></van-cell>
      <van-grid>
        <van-grid-item
        v-for="item in recommendChannels"
        :key="item.id"
        @click="hAddChannel(item)"
        >
          <span>{{item.name}}</span>
        </van-grid-item>
      </van-grid>
    </div>
  </div>
</template>

<script>
import { getAllChannels, addChannel, deleteChannels } from '@/api/channel.js'

export default {
  name: 'ChannelEdit',
  props: {
    channels: {
      type: Array, // 一定要传入数组
      required: true // 不传就报错。
    },
    activeIndex: {
      // 当前父组件中选中的那个频道的下标,在显示时，它应该要高亮
      type: Number,
      required: true
    }
  },
  data () {
    return {
      allChannels: [],
      editing: false
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
    // 3、将item z这个频道添加到我的频道中
    async hAddChannel (item) {
      const allChannelNow = [...this.channels, item]
      // 新数组改成接口中需要格式 (map返回一个新数组)
      const newchannels = allChannelNow.map((it, idx) => {
        return {
          id: it.id,
          seq: idx
        }
      })
      // 后台规定在调用这个接口时，不要把推荐频道也传进去了。
      newchannels.splice(0, 1) // 删除第一个元素
      // 在调用这个接口时，不要把推荐频道也传进去了。
      console.log(allChannelNow, newchannels)
      // newchannels 0: {id: 5, seq: 1}
      const result = await addChannel(newchannels)
      console.log(result)
      // 直接修改父级组件中的频道列表
      this.channels.push(item)
    },
    // 2、  处理点击频道子传值给父（传参频道）
    async hClickMyChannel (channel) {
      // 在编辑的时候点击
      if (this.editing) {
        console.log('删除频道', channel)
        // 参数是：当前频道的id
        const result = await deleteChannels([channel.id])
        console.log(result)
        // 如果上面的操作没有错误，则说明已经成功地在服务器上删除了
        // 1.找出当前的下标
        const idx = this.channels.findIndex(it => it.id === channel.id)
        // 2、删除频道
        if (idx !== -1) {
          this.channels.splice(idx, 1)
        }
        // 如果当前删除的频道在 活动频道之前 ，则要把活动频道的下标-1。
        if (idx < this.activeIndex) {
          // 要把父组件中的activeIndex - 1
          this.$emit('updateCurIndex', this.activeIndex - 1)
        }
      } else {
        this.$emit('updateCurChannel', channel)
        //    关闭弹层
        this.$emit('close')
      }
    },
    //   1、获取所有频道
    async getAllChannels () {
      const { data: { data } } = await getAllChannels()
      // console.log('所有频道是', data)
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
