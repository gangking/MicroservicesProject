<template>
  <el-card>
    <div class="redblock"></div>
    <div class="danjutitle">
      <a
        href="#"
        class="djprogress"
        :style="isActive=='approvalUnfinished'?'color:#E61A23;':''"
        @click="change(approvalUnfinished,'approvalUnfinished')"
      >审批待办</a>
      <a href="#" class="bigger" @click="logvisible ">
        <img src="@/assets/images/desktop/amplification.png" />
      </a>
      <el-divider direction="vertical" />
      <a
        href="#"
        class="djprogress"
        :style="isActive=='approvalFinished'?'color:#E61A23;':''"
        @click="change(approvalFinished,'approvalFinished')"
      >审批已办</a>
    </div>
    <component :is="currentView"></component>
    <bigger
      :visible="dialogTableVisible"
      :dialogVisible="dialogTableVisible"
      @handleClose="handleClose"
    ></bigger>
  </el-card>
</template>

<script>
import approvalFinished from "./approvalFinished.vue";
import approvalUnfinished from "./approvalUnfinished.vue";
import bigger from "./dialog.vue";

export default {
  props: {
    componInfo: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      approvalFinished,
      approvalUnfinished,
      currentView: "approvalUnfinished",
      isActive: "approvalUnfinished",
      dialogTableVisible: false
    };
  },
  watch: {
    componInfo: {
      handler(val) {
        //console.log(val, "传入的值来自自定义的信息11118888");
      },
      immediate: true
    }
  },
  methods: {
    change(tabItem, active) {
      this.currentView = tabItem;
      this.isActive = active;
    },
    logvisible() {
      this.dialogTableVisible = true;
    },
    handleClose() {
      this.dialogTableVisible = false;
    }
  },
  components: {
    approvalFinished,
    approvalUnfinished,
    bigger
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
</style>