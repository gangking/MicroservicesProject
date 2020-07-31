<template>
  <div class="verical-tabs">
    <div class="verical-tabs-top">

      <el-tabs class="verical-tab" :value="stepDirectionIsIndex" :tab-position="tabPosition" @tab-click="tabClick" style="height: 100%;">
        <el-tab-pane v-for="(item,index) in payable.steps" :key="index" :name="index+''" :label="item.stepDescribe">{{item.stepDescribe}}</el-tab-pane>
      </el-tabs>
    </div>
    <div class="verical-tabs-bottom">
      <i class="icon-shuzhuangheng" @click="setStepv" style=" cursor: pointer;"></i>
    </div>
  </div>
</template>
<script>
export default {
  methods: {
    tabClick({ name }) {
      this.payable.onStepIndexEvent(name, this.payable.steps[name], false);
      console.log('tabClick', name);
    },
    setStepv() {
      this.payable.stepDirectionIsVertical = false;
    }
  },
  computed: {
    stepDirectionIsIndex() {
      return this.payable.stepDirectionIsIndex + '';
    }
  },
  inject: ['payable'],
  data() {
    return {
      tabPosition: 'left'
    };
  }
};
</script>

<style lang="scss"  >
.verical-tabs {
  display: flex;
  height: 100%;
  width: 100%;

  flex-direction: column;
  .verical-tabs-top {
    .verical-tab.el-tabs.el-tabs--left {
      .el-tabs__header.is-left {
        margin-right: 0;
      }
    }
    flex-grow: 1;
    /deep/ .el-tabs__item {
      // padding-right: 30px;
      height: 30px;
      line-height: 30px;
      background-color: #fff;
      font-size: 13px;
      color: #606266;
      min-width: 116px;
    }
    /deep/.el-tabs__nav-wrap.is-left {
      margin-right: 0;
    }
    /deep/ .el-tabs__item.is-left {
      text-align: center !important;
    }

    /deep/ .el-tabs__nav-scroll {
      margin-left: 0;
    }
    /deep/ .el-tabs__item:hover {
      background: rgba(52, 152, 219, 0.29);
      color: #606266;
    }
    // /deep/ .el-tabs__item:hover::before {
    //   text-align: right;
    //   content: "";
    //   width: 0;
    //   height: 0;
    //   border-width: 16px 16px 16px 0;
    //   border-style: solid;
    //   border-color: transparent #fff transparent transparent;
    //   position: absolute;
    //   top: 0;
    //   right: 0;
    // }
    // /deep/ .el-tabs__item.is-active::before,
    // .el-tabs__item:hover::before {
    //   text-align: right;
    //   content: "";
    //   width: 0;
    //   height: 0;
    //   border-width: 16px 16px 16px 0;
    //   border-style: solid;
    //   border-color: transparent #fff transparent transparent;
    //   position: absolute;
    //   top: 0;
    //   right: 0;
    // }
    /deep/ .el-tabs__item.is-active {
      color: #fff;
      background: rgba(52, 152, 219, 0.74);
      border-left: 5px solid #4fa6e0;
    }
    /deep/ .el-tabs__active-bar {
      background-color: transparent;
      width: 0;
    }
    /deep/ .el-tabs--left,
    .el-tabs--right {
      overflow: inherit;
    }
    /deep/ .display-form-container .form-content {
      text-align: left;
    }
    /deep/ .el-tabs--left .el-tabs__item.is-left {
      text-align: left;
    }
    /deep/ .el-tabs__nav-wrap::after {
      width: 0;
    }
  }
  .verical-tabs-bottom {
    flex-basis: 30px;
    font-size: 20px;
    color: #2395ed;
  }
}
</style>