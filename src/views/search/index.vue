<template>
<div>
    <!-- 搜索组件一级路由   $router.back()返回上一个页面-->
    <van-nav-bar left-arrow title="搜索中心" @click-left="$router.back()"></van-nav-bar>
    <!-- 当用户在输入框中写入内容时去调用接口 -->
    <van-search
      show-action
      placeholder="请输入搜索关键词"
      shape="round"
      @input="hSearch"
      v-model.trim="keyword"
      >
      <!-- 文档里有slots 的说明 -->
    <div slot="action"
    @click="hClickSearchInput"
    >搜索</div>
    </van-search>

    <!-- 联想建议 遍历的是计算属性里面的值，所以在把里面的:title代替了 -->
     <!-- 联想建议
     如果用户在搜索框中输入了内容，则显示联想建议，
      否则，显示搜索历史
     -->
    <van-cell-group v-if="keyword">
      <van-cell
      v-for="(item,idx) in cSearchSuggestions"
      :key="idx"
      @click="hClickSuggestion(idx)"
      icon="search">
        <div slot="title" v-html="item"></div>
      </van-cell>

    </van-cell-group>
    <!-- /联想建议 -->

    <!-- 搜索历史记录 -->
    <van-cell-group v-else>
      <van-cell title="历史记录">
      </van-cell>
      <van-cell
        v-for="(item,idx) in searchHistories"
        :title="item"
        :key="idx"
        @click="hClickHistory(item)"
        >
        <!-- stop阻止冒泡事件 -->
        <van-icon name="close" @click.stop="hRemoveHistory(idx)" />
      </van-cell>
    </van-cell-group>
    <!-- /搜索历史记录 -->
  </div>
</template>

<script>
// 实现搜索记录持久化
// 在添加，或者删除searchHistories时，要同时保存到localstroage
import { getItem, setItem } from '@/utils/storage'
import { getSearchSuggestions } from '@/api/search'
export default {
  name: 'Search',
  data () {
    return {
      timer: null, // 计时器
      keyword: '', // 搜索关键字
      searchHistories: getItem('searchHistories') || [] // 搜索历史记录
    }
  },
  computed: {
    // 补充计算属行
    cSearchSuggestions () {
      // 用正则构造器的方式，而不用/ /，因为可以写变量
      const reg = new RegExp(this.keyword, 'gi')
      return this.searchHistories.map(str => {
        const str1 = str.replace(reg, function (obj) {
          // 用返回值代替了obj
          return `<span style="color:red">${obj}</span>`
        })
        return str1
      })
    }
  },
  watch: {
    // 当searchHistories变化时，它会执行
    searchHistories (newVal, oldVal) {
      // console.log(newVal, oldVal)
      // 保存到localstorage
      setItem('searchHistories', newVal)
    }
  },
  methods: {
    // 6、在历史记录上点击
    hClickHistory (str) {
      this.addSearchHistory(str)
      // 6.1第一处  跳转搜索结果页，并且传入参数
      setTimeout(() => {
        this.$router.push({
          name: 'searchResult',
          query: {
            keyword: str
          }
        })
      }, 100)
    },
    // 5、 在搜索建议上点击
    hClickSuggestion (idx) {
      // 取出原数据
      const str = this.searchSuggestions[idx]
      this.addSearchHistory(str)
      // 5.1第二处  跳转搜索结果页，并且传入参数
      setTimeout(() => {
        this.$router.push({
          name: 'searchResult',
          query: {
            keyword: str
          }
        })
      }, 100)
    },
    // 3、点击 搜索按钮（添加到历史记录）
    hClickSearchInput () {
      if (this.keyword) {
        this.addSearchHistory(this.keyword)
        // 3.1 第三处 跳入搜索结果页，并且传入参数
        setTimeout(() => {
          this.$router.push({
            name: 'searchResult',
            query: {
              keyword: this.keyword
            }
          })
        }, 100)
      }
    },
    // 4、 删除指定位置的记录记录
    hRemoveHistory (idx) {
      this.searchHistories.splice(idx, 1)
    },
    // 2、 添加历史记录
    addSearchHistory (str) {
      // 1.添加历史记录
      // 1.1不要有重复项
      // 1.2最近搜索的记录应该在最上面
      const index = this.searchHistories.indexOf(str)
      if (index !== -1) {
        // 说明当前的搜索关键字，已经在前面的搜索记录存在了
        // 要调整顺序：把它放在最前面
        // 删除它
        this.searchHistories.splice(index, 1)
      }
      // unshift是在头部添加
      this.searchHistories.unshift(str)
    },
    // 1、输入内容调接口取数据
    // hSearch () {
    //   console.log(this.keyword)
    //   console.log(`当前的定时器是${this.timer}`)
    //   // 1、 没用用防抖的代码
    //   // const result = await getSearchSuggestions(this.keyword)
    //   // console.log(result)
    //   // this.searchSuggestions = result.data.data.options
    //   // 2、 再次调用这个函数的时候判断要清除上一次的定时器
    //   if (this.timer) {
    //     console.log(`消除当前的定时器${this.timer}`)
    //     clearTimeout(this.timer)
    //   }
    //   this.timer = setTimeout(async () => {
    //     // 用户没有输入内容
    //     if (!this.keyword) {
    //       return
    //     }
    //     // 调接口，取回搜索建议
    //     const result = await getSearchSuggestions(this.keyword)
    //     console.log(result)
    //     this.searchSuggestions = result.data.data.options
    //     console.log(`开启10s执行的定时器是${this.timer}`)
    //   }, 10 * 1000)
    // },
    // 1.1节流操作
    hSearch () {
    // 如果定时器为false执行,就打开定时器，在其内部情况timer
      if (!this.timer) {
        // 0.3秒后执行定时器操作请求接口，中间再次发请求又重新拿新数据请求
        this.timer = setTimeout(async () => {
          this.timer = null
          const result = await getSearchSuggestions(this.keyword)
          console.log(result)
          this.searchSuggestions = result.data.data.options
        }, 0.3 * 1000)
      }
    }
  }
}
</script>

<style lang="" scoped>

</style>
