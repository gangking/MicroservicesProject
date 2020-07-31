<template>
  <div class="main">
    <el-tooltip :disabled="!$slots.content" effect="dark" placement="bottom">
      <div slot="content">
        <slot name="content"></slot>
      </div>
      <el-button @click="onclick" class="ibps-ml-0 ibps-mr btn-text can-hover waves-effect icontop1" type="text" size="small">
        <el-badge :max='99' :hidden="BadgeHidden" class="sub-el-badge" :value="badgeNumber">

          <i class="iconfont  icontop padbom" :class="icon"></i>

        </el-badge>
      </el-button>
    </el-tooltip>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    badgeNumber: {
      type: [Number, String],
      default: 0
    },
    BadgeHidden: {
      type: Boolean,
      default: false
    },
    icon: {
      type: String,
      default: 'icon-pingtai'
    }
  },
  data() {
    return {};
  },
  watch: {},
  computed: {},
  methods: {
    onclick(e) {
      this.$emit('click', e);
    }
  },
  created() {},
  mounted() {}
};
</script>
<style lang="scss" scoped>
.main {
  position: relative;
  width: 52px;
  height: 46px;
  /* overflow: hidden; */
  // .btn-text {
  //   padding-right: 0.16rem !important;
  // }
}
.sub-el-badge {
  // width: 52px;
  // height: 46px;
  /deep/ .el-badge__content {
    transform: translateY(-79%) translateX(91%) !important;
  }
}

.icontop {
  top: 10px;
  display: inline-block;
  font-size: 18px;
  // margin-top: 3px;
}
.icontop1 {
  position: absolute;
  margin: 0 -2px !important;
  // top: -3px;
  // overflow: visible !important;
  // overflow: hidden;
  width: 52px;
  height: 46px;
}
.padbom {
  padding-bottom: 12px;
}
</style>