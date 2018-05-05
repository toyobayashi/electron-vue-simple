export default {
  data () {
    return {
      message: '{{name}}'
    }
  },
  methods: {
    hello () {
      console.log(this.getPath())
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.hello()
    })
  }
}
