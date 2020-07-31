<template>
  <el-card>
    <div class="redblock"></div>
    <div class="danjutitle">
      <a href="#" class="djprogress" :style="isActive=='billUnfinished'?'color:#E61A23;':''" @click="change(billUnfinished,'billUnfinished')">单据代办</a>
      <el-divider direction="vertical" />
      <a href="#" class="djprogress" :style="isActive=='billFinished'?'color:#E61A23;':''" @click="change(billFinished,'billFinished')">单据已办</a>
      <a href="#" class="bigger" @click="logvisible "><img src="@/assets/images/desktop/amplification.png"></a>
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
import billFinished from './billFinished.vue'
import billUnfinished from './billUnfinished.vue'
import bigger from "./dialog.vue";

export default {
  data() {
    return {
      billFinished,
      billUnfinished,
      currentView:'billUnfinished',
      isActive:'billUnfinished',
      dialogTableVisible: false,
    };
  },
  methods: {
    change(tabItem,active) {
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
  components:{
    billFinished,
    billUnfinished,
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
  background-color: #E61A23;
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
  .bigger{
    position: absolute;
    // top: 4px;
    right: 0px;
    display: inline-block;
    width: 15px;
    height: 15px;
    img{
      width: 100%;
      height: 100%;
    }
  }
  .djprogress{
    color: #9ea0a2;
    font-size: 18px;
  }
}
</style>