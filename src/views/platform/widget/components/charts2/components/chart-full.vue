<template>
  <div class="chart">
    <el-dialog
      ref="dialog"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="true"
      :fullscreen="fullscreen"
      class="chart-preview-dialog1"
      @close="closeDialog"
      @open="loadComponent"
      append-to-body
    >
      <component :is="compon" />
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dialogVisible: false,
      fullscreen: true,
      compon: ""
    };
  },
  computed: {},
  created() {},
  mounted() {
    // this.loadComponent();
  },
  watch: {
    visible: {
      handler: function(val, oldVal) {
        this.dialogVisible = this.visible;
      },
      immediate: true
    }
  },
  methods: {
    closeDialog() {
      this.$emit("update:visible", false);
      setTimeout(() => {
        document.querySelectorAll(".chart-main .chartFull")[0].style.display = "block";
      }, 100);
    },
    btnClose() {
      this.$emit("update:visible", false);
      setTimeout(() => {
        document.querySelectorAll(".chart-main .chartFull")[0].style.display = "block";
      }, 100);
    },
    loadComponent() {
      this.compon = () =>
        import("@/views/platform/widget/components/charts2/index");
      setTimeout(() => {
        document.querySelectorAll(".chart-main .chartFull")[1].style.display = "none";
        document.querySelectorAll(
          ".chart-preview-dialog1 .el-dialog__header"
        )[0].style.cssText = "padding:0px";
      }, 100);
    }
  },
  components: {}
};
</script>

<style scoped lang="scss">
// /deep/ .el-dialog {
//   width: 100% !important;
//   margin: 0 auto !important;
//   height: 100% !important;
//   padding: 0 !important;
//   overflow: hidden;
// }
// /deep/ .el-dialog__body {
//   height: calc(100vh) !important;
//   padding: 0;
//   overflow: hidden;

//   .note-alias {
//     height: 100%;
//   }
//   .el-card__body {
//     height: 100%;
//   }
// }

/deep/ .el-dialog {
  height: 100%;
  padding: 0 !important;
  .el-dialog__body {
    height: calc(100vh) !important;
    padding: 0;
    overflow: hidden;
  }
}
</style>
