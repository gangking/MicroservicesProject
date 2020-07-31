<template>

  <fssc-header-icon @click.native.stop="handClick" :badge-hidden="true" icon="icon-homepage">
    <div slot="content">主页</div>
  </fssc-header-icon>
</template>

<script>
import FsscHeaderIcon from '../header-menu-icon';
export default {
  components: {
    FsscHeaderIcon
  },
  props: {},
  data() {
    return {};
  },
  mounted() {},
  methods: {
    handClick() {
      this.$router.push({ name: 'home' });
    }
  }
};
</script>

<style scoped lang="scss" scoped>
// .imgtop{
//   margin-top: 0.02rem;
//   width: 0.18rem;
//   height: 0.18rem;
// }

.icontop {
  display: inline-block;
  // height: 0.27rem;
  // width: 0.27rem;
  font-size: 19px;
  margin-top: -1px;
}
.icontop1 {
  margin: 0 10px !important;
  width: 48px;
  height: 46px;
}
.padbom {
  padding-bottom: 12px;
}
</style>
