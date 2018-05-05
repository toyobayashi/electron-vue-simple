import webpack from 'webpack'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import OptimizeCSSAssetsPlugin from 'optimize-css-assets-webpack-plugin'
import UglifyJSPlugin from 'uglifyjs-webpack-plugin'
import { VueLoaderPlugin } from 'vue-loader'
import * as path from 'path'
import pkg from '../package.json'

export const mode = process.env.NODE_ENV === 'production' ? 'production' : 'development'
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

export let main: webpack.Configuration = {
  mode,
  target: 'electron-main',
  entry: path.join(__dirname, '../src/ts/main.ts'),
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

export function renderer (manifest: string): webpack.Configuration {
  return {
    mode,
    target: 'electron-renderer',
    entry: path.join(__dirname, '../src/ts/renderer.ts'),
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

export const manifest = path.join(__dirname, 'manifest.json')

export let dll: webpack.Configuration = {
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
