import { app, BrowserWindow, ipcMain, Event } from 'electron'
import { format } from 'url'
import getPath from './get-path'

let mainWindow: BrowserWindow | null

function createWindow () {
  if (process.env.NODE_ENV !== 'production') {
    const { Socket } = require('net')
    const port = 8081
    const host = 'localhost'
    let socket = new Socket()

    socket.connect(port, host)

    socket.on('connect', () => {
      console.log('======  [Development Mode] Connect: websocet://localhost:8081  ======\n\n')
      socket.write('electron')
      mainWindow = new BrowserWindow({
        width: 800,
        height: 600
      })

      mainWindow.loadURL(format({
        pathname: getPath('public', 'index.html'),
        protocol: 'file:',
        slashes: true
      }))

      mainWindow.webContents.openDevTools()

      mainWindow.on('closed', function () {
        mainWindow = null
      })
    })

    socket.on('error', (error: Error) => {
      console.log('error:' + error)
      socket.destroy()
    })
    socket.on('close', () => {
      console.log('Connection closed')
    })

    ipcMain.once('hot-reload', (event: Event) => {
      socket.on('data', (data: Buffer) => {
        const msg = data.toString()
        if (msg === 'renderer') {
          event.sender.send('hot-reload')
        } else if (msg === 'main') {
          app.relaunch({ args: process.argv.slice(1).concat(['--relaunch']) })
          app.exit(0)
        }
      })
    })
  } else {
    mainWindow = new BrowserWindow({
      width: 800,
      height: 600
    })

    mainWindow.loadURL(format({
      pathname: getPath('public', 'index.html'),
      protocol: 'file:',
      slashes: true
    }))

    mainWindow.on('closed', function () {
      mainWindow = null
    })
  }
}

app.on('ready', createWindow)

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow()
  }
})
