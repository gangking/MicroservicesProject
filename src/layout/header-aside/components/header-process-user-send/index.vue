<template>
  <!-- <el-tooltip class="item" effect="dark" content="我的发起流程" placement="bottom">
            <span class="process" @click="processApp">
              <i v-if="$store.state.ibps.theme.activeName=='light-white'" class="iconfont icon-toubu-jiqirenfasong black" />
              <i v-else class="iconfont icon-toubu-jiqirenfasong white" />
              <span class="num">
                <el-badge :value="proAppNum" :max="99" class="item" />
              </span>
            </span>
          </el-tooltip> -->
  <fssc-header-icon @click.native.stop="handClick" :badge-hidden="false" :badgeNumber="badgeNumber" icon="icon-toubu-jiqirenfasong">
    <div slot="content">我的发起流程</div>
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
