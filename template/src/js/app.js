import binding from 'hello'
import Vue from 'vue'

export default {
  data () {
    return {
      electronVer: process.versions.electron,
      vueVer: Vue.version,
      dirname: __dirname,
      filename: __filename
    }
  },
  mounted () {
    this.$nextTick(() => {
      alert(binding.native())
    })
  }
}
