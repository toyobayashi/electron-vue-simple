import '../css/style.css'
import Vue from 'vue'
import * as electron from 'electron'
import App from '../vue/App.vue'
import getPath from './get-path'

if (process.env.NODE_ENV !== 'production') {
  electron.ipcRenderer.on('hot-reload', () => {
    location.reload()
  })
  electron.ipcRenderer.send('hot-reload')
  console.log('======  [Development Mode]  ======\n\n')
}

Vue.use({
  install (Vue) {
    Vue.prototype.electron = electron
    Vue.prototype.getPath = getPath
  }
})

// tslint:disable-next-line:no-unused-expression
new Vue({
  el: '#app',
  render: h => h(App)
})
