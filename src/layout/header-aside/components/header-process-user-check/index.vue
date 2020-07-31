<template>
  <fssc-header-icon @click.native.stop="handClick" :badge-hidden="false" :badgeNumber="badgeNumber" icon="icon-chulizhong-">
    <div slot="content">我的处理流程</div>
  </fssc-header-icon>
</template>

<script>
import FsscHeaderIcon from '../header-menu-icon';
export default {
  components: {
    FsscHeaderIcon
  },
  props: {
    badgeNumber: {
      type: [String, Number],
      default: 0
    }
  },
  data() {
    return {};
  },
  watch: {},
  computed: {},
  methods: {
    handClick(e) {
      this.$emit('click', e);
    }
  },
  created() {},
  mounted() {}
};
</script>
<style lang="scss" scoped>
.wrapper {
}
</style>