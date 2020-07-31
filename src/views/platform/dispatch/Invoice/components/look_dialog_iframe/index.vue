<template>
  <div class="box">
    <iframe frameborder="0" height="100%" width="100%" v-if="src" class="iframe-wrapper" :src="src"></iframe>
  </div>

</template>

<script>
export default {
  props: {
    tagVal: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  data() {
    return {
      src: ''
    };
  },
  created() {
    this.src = this.tagVal.webUrl;
    const loading = this.$loading({
      lock: true,
      text: 'Loading',
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.7)'
    });
    setTimeout(() => {
      loading.close();
    }, 2000);
  }
};
</script>

<style lang="scss" scoped>
.box {
  width: 100%;
  height: 100%;
}
</style>