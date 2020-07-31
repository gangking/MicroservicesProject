<template>
  <div class="box">
    <pageEffectiveness :busSeId="kDispose.sceneId"/>
  </div>
</template>

<script>
import pageEffectiveness from '@/views/platform/dispatch/Effectiveness';
export default {
  inject: ['kDispose'],
  components: {
    pageEffectiveness
  }
};
</script>

<style lang="scss" scoped>
.box {
    height: 100%;
    width: 100%;
}
</style>