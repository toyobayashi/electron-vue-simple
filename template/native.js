const path = require('path')
const outputPath = path.join(__dirname, 'public')
const nativeDir = './lib'

const native = (nativeModules) => {
  let externals = {}
  for (let i = 0; i < nativeModules.length; i++) {
    externals[nativeModules[i]] = process.env.NODE_ENV === 'production'
      ? `process.arch === "ia32" ? require("${nativeDir}/${nativeModules[i]}-ia32.node") : require("${nativeDir}/${nativeModules[i]}-x64.node")`
      : `process.arch === "ia32" ? require("${path.join(outputPath, nativeDir, nativeModules[i] + '-ia32.node').replace(/\\/g, '/')}") : require("${path.join(outputPath, nativeDir, nativeModules[i] + '-x64.node').replace(/\\/g, '/')}")`
  }
  return externals
}

module.exports = native
