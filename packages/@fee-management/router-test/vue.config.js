const { name } = require('./package.json')
const isDev = process.env.NODE_ENV === 'development'
const CDNListPlugin = require('./webpack-plugin-cdnList')
module.exports = {
  devServer: {
    port: 3004,
    overlay: {
      warnings: false,
      errors: true
    },
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  },
  chainWebpack: config => {
    config.when(!isDev, config => {
      config.plugin('CDNListPlugin').use(CDNListPlugin, [{
        js: [
          'https://unpkg.com/vue@2.6.11/dist/vue.min.js',
          'https://unpkg.com/vue-router@3.2.0/dist/vue-router.min.js',
          'https://unpkg.com/vuex@3.0.1/dist/vuex.min.js',
          'https://unpkg.com/element-ui/lib/index.js'
        ]
      }])
      config.externals({
        'vue': 'Vue',
        'vue-router': 'VueRouter',
        'vuex': 'Vuex',
        'element-ui': 'ELEMENT'
      })
    })
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
