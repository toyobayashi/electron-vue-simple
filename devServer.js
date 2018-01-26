const { exec } = require('child_process')
const path = require('path')

let serverProcess = exec(path.join('./node_modules/.bin/webpack-dev-server') + ' --config webpack.renderer.config.js --hot')
let mainProcess = exec(path.join('./node_modules/.bin/webpack') + ' --config webpack.main.config.js -w')

const callback = data => console.log(data.toString())
serverProcess.stdout.on('data', callback)
serverProcess.stderr.on('data', callback)
mainProcess.stdout.on('data', callback)
mainProcess.stderr.on('data', callback)
