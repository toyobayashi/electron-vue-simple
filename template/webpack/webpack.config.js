const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const { VueLoaderPlugin } = require('vue-loader')
const path = require('path')
const pkg = require('../package.json')

const mode = process.env.NODE_ENV === 'production' ? 'production' : 'development'
const uglify = new UglifyJSPlugin({
  parallel: true,
  cache: true,
  uglifyOptions: {
    ecma: 8,
    output: {
      comments: false,
      beautify: false
    },
    warnings: false
  }
})

let main = {
  mode,
  target: 'electron-main',
  entry: path.join(__dirname, '../src/js/main.js'),
  output: {
    path: path.join(__dirname, '../public'),
    filename: 'main.js'
  },
  node: {
    __dirname: false,
    __filename: false
  },
  resolve: {
    extensions: ['.ts']
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        loader: 'ts-loader'
      }
    ]
  },
  optimization: {
    minimizer: [uglify]
  }
}

function renderer (manifest) {
  return {
    mode,
    target: 'electron-renderer',
    entry: path.join(__dirname, '../src/js/renderer.js'),
    output: {
      path: path.join(__dirname, '../public'),
      filename: 'renderer.js'
    },
    node: {
      __dirname: false,
      __filename: false
    },
    resolve: {
      extensions: ['.ts']
    },
    module: {
      rules: [
        {
          test: /\.vue$/,
          exclude: /node_modules/,
          loader: 'vue-loader'
        },
        {
          test: /\.css$/,
          exclude: /node_modules/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                url: false
              }
            }
          ]
        },
        {
          test: /\.ts$/,
          exclude: /node_modules/,
          loader: 'ts-loader',
          options: {
            appendTsSuffixTo: [/\.vue$/]
          }
        }
      ]
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: 'renderer.css'
      }),
      new webpack.DllReferencePlugin({
        manifest: require(manifest),
        context: __dirname
      }),
      new VueLoaderPlugin()
    ],
    optimization: {
      minimizer: [
        uglify,
        new OptimizeCSSAssetsPlugin({})
      ]
    }
  }
}

const manifest = path.join(__dirname, 'manifest.json')

let dll = {
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  target: 'electron-renderer',
  entry: {
    vendor: Object.keys(pkg.dependencies)
  },
  node: {
    __filename: false,
    __dirname: false
  },
  output: {
    path: path.join(__dirname, '../public'),
    filename: 'dll.js',
    library: '__dll_[hash]__'
  },
  plugins: [
    new webpack.DllPlugin({
      path: manifest,
      name: '__dll_[hash]__',
      context: __dirname
    })
  ],
  optimization: {
    minimizer: [uglify]
  }
}

module.exports = {
  mode,
  main,
  renderer,
  dll,
  manifest
}
