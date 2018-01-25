const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const path = require('path')

let renderer = {
  target: 'electron-renderer',
  entry: './src/renderer.js',
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: 'renderer.js'
  },
  node: {
    __dirname: process.env.NODE_ENV !== 'production'
  },
  module: {
    rules: [{
      test: /\.css$/,
      exclude: /node_modules/,
      use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: 'css-loader'
      })
    }, {
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
        extractCSS: true
        // other vue-loader options go here
      }
    }]
  },
  resolve: {
    alias: {
      'vue': 'vue/dist/vue.js'
    }
  },
  plugins: [
    new ExtractTextPlugin('./renderer.css'),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    }),
    new webpack.DllReferencePlugin({
      manifest: require('./build/manifest.json')
    })
  ],
  devServer: {
    hot: true,
    inline: true,
    contentBase: path.resolve(__dirname, 'public'),
    compress: true,
    port: 7777
  }
}

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
  renderer.plugins.push(uglifyjs)
  delete renderer['devServer']
}

module.exports = renderer
