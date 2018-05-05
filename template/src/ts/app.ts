import { Vue, Component } from 'vue-property-decorator'

@Component
export default class extends Vue {
  message = '{{name}}'

  hello () {
    console.log(this.getPath())
  }

  mounted () {
    this.$nextTick(() => {
      this.hello()
    })
  }
}
