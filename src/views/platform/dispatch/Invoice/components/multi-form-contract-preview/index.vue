<template>
  <fsscContainerFrame :tagVal="itemVal" />
</template>

<script>
import fsscContainerFrame from '../frame';
export default {
  components: {
    fsscContainerFrame
  },
  props: {
    tagVal: {
      type: Object,
      default() {
        return {};
      }
    },
    itemVal: {
      type: Object,
      default() {
        return {};
      }
    },
    stepVal: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {};
  },
  watch: {},
  computed: {},
  methods: {},
  created() {},
  mounted() {}
};
</script>
<style lang="scss" scoped>
.wrapper {
}
</style>