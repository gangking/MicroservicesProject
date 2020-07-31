<template>
  <div class="box">
    <pageVoucher :busSeId="kDispose.sceneId"/>
  </div>
</template>

<script>
import pageVoucher from '@/views/platform/voucher';
export default {
  inject: ['kDispose'],
  components: {
    pageVoucher
  }
};
</script>

<style lang="scss" scoped>
.box {
    height: 100%;
    width: 100%;
}
</style>