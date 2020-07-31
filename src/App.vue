<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style lang="scss">
@import '@/assets/styles/public-class.scss';
#app {
  .container-component {
    height: 100%;
  }
}
</style>
