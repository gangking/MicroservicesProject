<template>
  <div class="sharedOperation">
    <!-- 主页面 -->
    <MainPage />
  </div>
</template>

<script>
import MainPage from './mian';
import { createNamespacedHelpers } from 'vuex';
const { mapActions, mapState, mapGetters, mapMutations } = createNamespacedHelpers(
  'shared_operation/basiConfig'
);
export default {
  components: {
    MainPage
  },
  data() {
    return {};
  },
  created() {
    // this.getGroupList().then(res => {
    //   console.log('获取组织列表',res)
    // });
  },
  methods: {
    ...mapActions(['getGroupList'])
  }
};
</script>

<style lang="scss" scoped>
.sharedOperation {
  width: 100%;
  height: 100%;
}
</style>