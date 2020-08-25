// const buble = require('rollup-plugin-buble')
const babel = require('rollup-plugin-babel')
export default {
  input: 'src/index.js',
  output: {
    file: 'dist/qiankun.js',
    format: 'umd',
    name: 'winning-qiankun',
    exports: 'named'
  },
  plugins: [
    // nodeResolve(),
    babel({
      exclude: ['node_modules/**'],
      runtimeHelpers: true
    })
  ]
}
