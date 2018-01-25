export default {
  data () {
    return {
      electronVer: process.versions.electron,
      vueVer: this.$_version,
      dirname: __dirname,
      filename: __filename
    }
  }
}
