const path = require('path')
const WinCookiePlugin = require('winning-cookie-webpack-plugin')
const fileListPugin = require('@winning-plugin/webpack-filelist-export')
const isDev = process.env.NODE_ENV === 'development'

const resolve = dir => path.join(__dirname, dir)

module.exports = {
  productionSourceMap: false,
  publicPath: isDev ? './' : '/',
  chainWebpack (config) {
    config.when(isDev, config => {
      // Docs and Usage please see https://github.com/winning-finance/winning-cookie-webpack-plugin#readme
      config.plugin('WinCookiePlugin').use(WinCookiePlugin, [{
        userInfoParams: {
          loginURL: 'http://172.16.6.213/base/api/v1/base/user/login',
          userInfoURL: 'http://172.16.6.213/base/api/v1/base/user/get_information',
          username: 'L10044',
          password: '456'
        },
        extraCookies: {
          'W-FLOW': 'canary',
          'W-SEQ': 21
        }
      }])
    })
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
    // set svg-sprite-loader
    config.module
      .rule('svg')
      .exclude.add([
        resolve('../../../node_modules/winning-components/lib/finance-theme/icon-svg'),
        resolve('src/assets/icon-svg')
      ])
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add([
        resolve('src/assets/icon-svg'),
        resolve('../../../node_modules/winning-components/lib/finance-theme/icon-svg')
      ])
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: '[name]'
      })
      .end()
  },
  configureWebpack: {
    resolve: {
      alias: {
        '@': resolve('src'),
        '@style': resolve('src/assets/styles')
      }
    }
  },
  devServer: {
    port: 8080,
    proxy: {
      '/outpat-person': {
        target: 'http://172.16.6.213'
      },
      '/schedule-outpatient': {
        target: 'http://172.16.6.213'
      },
      '/finance-common': {
        target: 'http://172.16.6.213'
        // changeOrigin: true
        // pathRewrite: {
        //   '^/finance-common': ''
        // }
      },
      '/oss': {
        target: 'http://172.16.6.213'
      }
    }
  }
}
