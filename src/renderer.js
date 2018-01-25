import './css/public.css'
import Vue from 'vue'
import App from './tpl/App.vue'

Vue.use({
  install (Vue) {
    Vue.prototype.$_version = Vue.version
  }
})

new Vue({
  el: '#app',
  render: h => h(App)
})
