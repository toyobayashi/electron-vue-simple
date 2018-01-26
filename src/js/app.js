import binding from 'hello'
export default {
  data () {
    return {
      electronVer: process.versions.electron,
      vueVer: this.$_version,
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
