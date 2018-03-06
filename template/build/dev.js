const { exec } = require('child_process')
const path = require('path')

let serverProcess = exec(path.join('../node_modules/.bin/webpack-dev-server') + ' --config webpack.renderer.config.js --hot', { cwd: __dirname })
let mainProcess = exec(path.join('../node_modules/.bin/webpack') + ' --config webpack.main.config.js -w', { cwd: __dirname })

const callback = data => console.log(data.toString())
serverProcess.stdout.on('data', callback)
serverProcess.stderr.on('data', callback)
mainProcess.stdout.on('data', callback)
mainProcess.stderr.on('data', callback)
