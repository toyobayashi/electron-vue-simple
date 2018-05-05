import webpack from 'webpack'
import path from 'path'
import fs from 'fs'
import { main, renderer, dll, mode, manifest } from './webpack.config'
import { createServer, Socket } from 'net'

if (mode === 'production') prod()
else dev()

function dev () {
  let client: Socket | null = null

  webpackWatch()
  serverStart()

  function webpackWatch () {
    checkAndBundleDll(() => {
      const mainCompiler = webpack(main)
      const rendererCompiler = webpack(renderer(manifest))
      const watchOptions = {
        aggregateTimeout: 300,
        poll: undefined
      }

      mainCompiler.watch(watchOptions, watchHandler('main'))
      rendererCompiler.watch(watchOptions, watchHandler('renderer'))

      function watchHandler (msg: string) {
        return (err: Error, stats: webpack.Stats) => {
          if (err) {
            console.log(err)
            return
          }
          console.log(stats.toString({
            colors: true,
            children: false,
            entrypoints: false,
            modules: false
          }) + '\n')

          if (client) client.write(msg)
        }
      }
    })
  }

  function serverStart () {
    const server = createServer(function (socket) {
      if (client !== null) {
        socket.end()
        throw new Error('Connect failed.')
      }
      console.log('connect: ' + socket.remoteAddress + ':' + socket.remotePort)

      socket.on('data', data => {
        if (data.toString() === 'electron') client = socket
      })

      socket.on('error', function (exception) {
        console.log('socket error:' + exception)
        socket.end()
      })

      socket.on('close', function () {
        client = null
        console.log('close: ' + socket.remoteAddress + ':' + socket.remotePort)
      })
    }).listen(8081, 'localhost')

    server.on('listening', function () {
      console.log('Server running at localhost:' + server.address().port)
    })

    server.on('error', function (exception) {
      console.log('server error:' + exception)
    })
  }
}

function prod () {
  checkAndBundleDll(() => webpack([main, renderer(manifest)], (err, stats: any) => {
    if (err) {
      console.log(err)
      return
    }
    console.log(stats.toString({
      modules: false,
      colors: true
    }) + '\n')
  }))
}

function checkAndBundleDll (callback?: Function) {
  const dllContent = getDllBundle()
  if (dllContent) {
    if (mode === 'production') {
      if (dllContent[dllContent.indexOf('=') - 1] === ' ') bundleDll(callback)
      else if (callback) callback()
    } else {
      if (dllContent[dllContent.indexOf('=') - 1] !== ' ') bundleDll(callback)
      else if (callback) callback()
    }
  } else bundleDll(callback)

  function bundleDll (callback?: Function) {
    webpack(dll, (err, stats) => {
      if (err) {
        console.log(err)
        return
      }
      console.log(stats.toString({
        colors: true,
        children: false,
        entrypoints: false,
        modules: false
      }) + '\n')
      if (callback) callback()
    })
  }

  function getDllBundle (): string | null {
    if (!dll.output) throw new Error('Empty output.')
    if (!dll.output.path || !dll.output.filename) throw new Error('Empty output.path or output.filename.')
    const dllFile = path.join(dll.output.path, dll.output.filename)
    if (!fs.existsSync(dllFile)) return null
    return fs.readFileSync(dllFile, 'utf8')
  }
}
