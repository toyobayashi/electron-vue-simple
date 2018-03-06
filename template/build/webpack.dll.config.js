const webpack = require('webpack')
const path = require('path')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const { dependencies } = require('../package.json')

const renderer = {
  target: 'electron-renderer',
  entry: {
    vendor: [
      ...Object.keys(dependencies).filter(moduleName => moduleName !== 'vue')
    ]
  },
  node: {
    __filename: false,
    __dirname: false
  },
  output: {
    path: path.join(__dirname, '../public'),
    filename: 'dll.js',
    library: 'dll'
  },
  plugins: [
    new UglifyJSPlugin({
      uglifyOptions: {
        ecma: 8,
        output: {
          comments: false,
          beautify: false
        },
        warnings: false
      }
    }),
    new webpack.DllPlugin({
      path: path.join(__dirname, 'manifest.json'),
      name: 'dll'
    })
  ]
}

renderer.entry.vendor.push(process.env.NODE_ENV === 'production' ? 'vue/dist/vue.runtime.min.js' : 'vue')

module.exports = renderer
