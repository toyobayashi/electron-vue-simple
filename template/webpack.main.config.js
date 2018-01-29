const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const path = require('path')

let main = {
  target: 'electron-main',
  entry: './src/main.dev.js',
  output: {
    path: path.join(__dirname, 'public'),
    filename: 'main.js'
  },
  node: {
    __dirname: false,
    __filename: false
  },
  plugins: []
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
  main.entry = './src/main.js'
  main.plugins.push(uglifyjs)
}

module.exports = main
