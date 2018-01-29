const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const path = require('path')
const native = require('./nativeModules.js')

let renderer = {
  target: 'electron-renderer',
  entry: './src/renderer.js',
  output: {
    path: path.join(__dirname, 'public'),
    filename: 'renderer.js'
  },
  node: {
    __dirname: process.env.NODE_ENV !== 'production',
    __filename: process.env.NODE_ENV !== 'production'
  },
  module: {
    rules: [{
      test: /\.(eot|woff|svg|woff2|ttf|otf)$/,
      exclude: /node_modules/,
      loader: 'file-loader?name=./asset/font/[name].[ext]?[hash]'
    }, {
      test: /\.(png|jpg|gif)$/,
      exclude: /node_modules/,
      loader: 'url-loader?limit=8192&name=./img/[name].[ext]?[hash]'
    }, {
      test: /\.vue$/,
      exclude: /node_modules/,
      loader: 'vue-loader',
      options: {
        loaders: {},
        extractCSS: process.env.NODE_ENV === 'production'
        // other vue-loader options go here
      }
    }]
  },
  resolve: {
    alias: {
      'vue': 'vue/dist/vue.js'
    }
  },
  externals: {},
  plugins: [
    new webpack.DllReferencePlugin({
      manifest: require('./build/manifest.json')
    })
  ]
}

native.addons.forEach((addon, i) => {
  renderer.externals[addon] = process.env.NODE_ENV === 'production'
    ? `require("${native.path + '/' + addon + '.node'}")`
    : `require("${path.join(renderer.output.path, native.path, addon + '.node').replace(/\\/g, '\\\\')}")`
})

if (process.env.NODE_ENV === 'production') {
  const uglifyjs = new UglifyJSPlugin({
    uglifyOptions: {
      ecma: 8,
      output: {
        comments: false,
        beautify: false
      },
      warnings: false
    }
  })
  renderer.resolve.alias['vue'] = 'vue/dist/vue.min.js'
  renderer.plugins = renderer.plugins.concat([
    uglifyjs,
    new ExtractTextPlugin('./renderer.css'),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    })
  ])
  renderer.module.rules.push({
    test: /\.css$/,
    exclude: /node_modules/,
    use: ExtractTextPlugin.extract({ fallback: 'style-loader', use: 'css-loader' })
  })
} else {
  renderer.module.rules.push({
    test: /\.css$/,
    exclude: /node_modules/,
    loader: 'style-loader!css-loader'
  })
  renderer.devServer = {
    contentBase: path.join(__dirname, 'public'),
    compress: true,
    port: 7777
  }
}

module.exports = renderer