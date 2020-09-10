const { name } = require('./package')
const isDev = process.env.NODE_ENV === 'development'

module.exports = {
  publicPath: isDev ? '/' : '/refund',
  devServer: {
    hot: true,
    disableHostCheck: true,
    port: 3000,
    overlay: {
      warnings: false,
      errors: true
    },
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  },
  configureWebpack: {
    output: {
      // 把子应用打包成 umd 库格式
      library: `${name}-[name]`,
      libraryTarget: 'umd',
      jsonpFunction: `webpackJsonp_${name}`
    }
  }
}
