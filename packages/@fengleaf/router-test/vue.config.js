const { name } = require('./package.json')
const isDev = process.env.NODE_ENV === 'development'
const fileListPugin = require('@winning-plugin/webpack-filelist-export')

module.exports = {
  publicPath: isDev ? '/' : '/router-test',
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
      config.plugin('filePlugin').after('html').use(fileListPugin, [
        {
          jsExternals: [
            '/web-public/js/vue.min.js',
            '/web-public/js/vue-router.min.js',
            '/web-public/js/vuex.min.js',
            '/web-public/js/element-ui.js'
          ]
        }
      ])
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
