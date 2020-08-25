
function renderCDNLink (js, css) {
  js.forEach(url => {
    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = url
    document.body.appendChild(script)
  })
  css.forEach(url => {
    const css = document.createElement('link')
    css.href = url
    css.rel = 'stylesheet'
    document.head.appendChild(css)
  })
}

module.exports = class CDNListPlugin {
  constructor (options) {
    this.options = options || {}
  }

  apply (compiler) {
    if (compiler.hooks) { // webpack v4+
      compiler.hooks.compilation.tap('CDNListPlugin', (compilation) => {
        if (compilation.hooks.htmlWebpackPluginBeforeHtmlGeneration) {
          compilation.hooks.htmlWebpackPluginBeforeHtmlGeneration.tapAsync('CDNListPlugin', (data, callback) => {
            data.assets.js = [...this.options.js || [], ...data.assets.js]
            data.assets.css = [...this.options.css || [], ...data.assets.css]
            if (this.options.extract) {
              const file = renderCDNLink(data.assets.js, data.assets.css)
              compilation.assets['cdnlist.js'] = {
                source: () => file,
                size: () => file.length
              }
            }
            callback(null, data)
          })
        }
      })
    } else { // webpack v3
      // TODO
    }
  }
}
