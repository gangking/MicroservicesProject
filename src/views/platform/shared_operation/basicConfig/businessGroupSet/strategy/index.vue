<template>
  <component :is="manualAuto" @closeBox="closeBox" @getGroupGoPage="getGroupGoPage"></component>
</template>

<script>
import Manual from './manual';
import Automatic from './automatic';
export default {
  components: {
    Manual,
    Automatic
  },
  props: {
    manualAuto: {
      type: String,
      default: 'Automatic'
    }
  },
  methods: {
    getGroupGoPage(info) {
      this.$emit('getGroupGoPage', info);
    },
    closeBox() {
      this.$emit('getGroupGoPage', {
        pageType: '业务组管理'
      });
    }
  }
};
</script>

<style lang="scss" scoped>
</style>