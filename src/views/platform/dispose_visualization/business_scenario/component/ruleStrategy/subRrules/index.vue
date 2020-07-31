<template>
  <div class="box">
    <pageRules :busSeId="kDispose.sceneId"/>
  </div>
</template>

<script>
import pageRules from '@/views/platform/dispatch/Rules';
export default {
  inject: ['kDispose'],
  components: {
    pageRules
  }
};
</script>

<style lang="scss" scoped>
.box {
    height: 100%;
    width: 100%;
}
</style>