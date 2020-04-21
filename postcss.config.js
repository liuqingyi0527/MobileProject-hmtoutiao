module.exports = {
  plugins: {
    autoprefixer: {},
    'postcss-pxtorem':
    {
      rootValue: 37.5, // 结果为：设计稿元素尺寸/37.5
      propList: ['*']
    }
  }
}
