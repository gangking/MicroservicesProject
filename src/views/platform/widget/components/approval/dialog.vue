<template>
  <div class="dialog">
    <el-dialog
      :visible.sync="dialogVisible"
      :before-close="handleClose"
      style="height: 100%;"
      append-to-body
      top="63px"
      :modal="false"
      width="94%"
    >
      <div class="redblock"></div>
      <div class="danjutitle">
        <a
          href="#"
          class="djprogress"
          :style="isActive=='approvalUnfinished'?'color:#E61A23;':''"
          @click="change(approvalUnfinished,'approvalUnfinished')"
        >审批待办</a>
        <el-divider direction="vertical" />
        <a
          href="#"
          class="djprogress"
          :style="isActive=='approvalFinished'?'color:#E61A23;':''"
          @click="change(approvalFinished,'approvalFinished')"
        >审批已办</a>
      </div>
      <component :is="currentView"></component>
    </el-dialog>
  </div>
</template>

<script>
import approvalFinished from "./approvalFinished.vue";
import approvalUnfinished from "./approvalUnfinished.vue";
export default {
  mounted() {
    // console.log(this.tableData);
  },
  data() {
    return {
      approvalFinished,
      approvalUnfinished,
      currentView: "approvalUnfinished",
      isActive: "approvalUnfinished",
      tableData: this.msg,
      dialogTableVisible: false,
      formLabelWidth: "120px"
    };
  },
  methods: {
    handleClose() {
      // console.log("关闭");
      this.$emit("handleClose", false);
    },
    change(tabItem, active) {
      this.currentView = tabItem;
      this.isActive = active;
    }
  },
  props: {
    msg: Array,
    dialogVisible: Boolean
  },
  components: {
    approvalFinished,
    approvalUnfinished
  }
};
</script>

<style lang="scss" scoped>
.redblock {
  display: inline-block;
  position: absolute;
  left: 0;
  width: 5px;
  height: 17px;
  background-color: #e61a23;
}
.redblock_title {
  position: relative;
  top: -4px;
  left: -20px;
  margin-bottom: 17px;
  > a {
    position: absolute;
    top: 4px;
    right: -20px;
    display: inline-block;
    width: 15px;
    height: 15px;
    img {
      width: 100%;
      height: 100%;
    }
  }
}
#noticetitle {
  width: 200px;
  height: 25px;
  margin-top: 2px !important;
  margin-left: 20px !important;
  font-size: 18px;
  font-family: PingFang SC;
  margin-bottom: 12px;
}
/deep/ .el-dialog__header {
  padding: 0 !important;
}
/deep/ .el-dialog {
  height: 100% !important;
  margin-left: 80px;
}
.redblock {
  display: inline-block;
  position: absolute;
  left: 0;
  width: 5px;
  height: 17px;
  background-color: #e61a23;
}
.danjutitle {
  position: relative;
  margin-bottom: 20px;
  font-size: 20px;
  font-family: PingFang SC;
  top: -4px;
  // left: -10px;
  font-weight: 700;
  .el-divider--vertical {
    width: 2px;
    background: #9ea0a2;
  }
  .bigger {
    position: absolute;
    // top: 4px;
    right: 0px;
    display: inline-block;
    width: 15px;
    height: 15px;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .djprogress {
    color: #9ea0a2;
    font-size: 18px;
  }
}
.danjutitle /deep/ a{
  text-decoration: none !important;
}
</style>