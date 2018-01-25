const { exec } = require('child_process')

let serverProcess = exec('node_modules\\.bin\\webpack-dev-server --config webpack.renderer.config.js --hot')
let mainProcess = exec('node_modules\\.bin\\webpack --config webpack.main.config.js -w')

const callback = data => console.log(data.toString())
serverProcess.stdout.on('data', callback)
serverProcess.stderr.on('data', callback)
mainProcess.stdout.on('data', callback)
mainProcess.stderr.on('data', callback)
