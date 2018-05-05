import Vue from 'vue'
import * as electron from 'electron'
import getPath from '../get-path'

declare module 'vue/types/vue' {
  interface Vue {
    electron: typeof electron
    getPath: typeof getPath
  }
}
