import '../css/public.css'
import Vue from 'vue'
import App from '../vue/App.vue'
import electron from 'electron'

Vue.use({
  install (Vue) {
    Vue.prototype.electron = electron
  }
})

window.app = new Vue({
  el: '#app',
  render: h => h(App)
})
