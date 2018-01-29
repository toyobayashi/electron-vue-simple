<template>
<div>
  <div class="text-center"><img src="../res/img/256x256.png"></div>
  <h1 class="vue text-center">electron-vue-simple</h1>
  <p class="text-center" v-text="`Electron: ${electronVer}`"></p>
  <p class="text-center" v-text="`Vue: ${vueVer}`"></p>
  <p class="text-center" v-text="`Dir: '${dirname}'`"></p>
  <p class="text-center" v-text="`File: '${filename}'`"></p>
</div>
</template>

<script src="../js/app.js">
</script>

<style src="../css/app.css">
</style>
