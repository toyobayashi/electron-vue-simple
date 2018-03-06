import { app, BrowserWindow } from 'electron'

let mainWindow

function createWindow () {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600
  })

  let winURL = process.env.NODE_ENV === 'dev'
    ? 'http://localhost:7777/index.html'
    : `file:///${__dirname.replace(/\\/g, '/')}/index.html`

  mainWindow.loadURL(winURL)

  if (process.env.NODE_ENV === 'dev') mainWindow.webContents.openDevTools()

  mainWindow.on('closed', function () {
    mainWindow = null
  })
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
