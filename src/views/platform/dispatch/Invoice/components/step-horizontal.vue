<template>
  <div class="stepBoxStyle">
    <div class="stepbox-left">
      <i class="icon-hengzhuanshu" @click="setStepv" style=" cursor: pointer;"></i>
    </div>
    <div class="stepbox-right">
      <el-steps :active="parseInt(payable.stepDirectionIsIndex)" :align-center="true">
        <el-step v-for="(item, key) in stepVal" :key="key" :title="item.stepDescribe" @click.native="stepNext(key, item)" />
      </el-steps>
    </div>

  </div>
</template>

<script>
export default {
  name: 'step-horizontal',
  inject: ['payable'],
  props: {
    stepVal: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      stepActive: 0
    };
  },

  methods: {
    stepNext(index, item, isInit = false) {
      this.stepActive = index;
      this.$emit('step-index', index, item, isInit);
    },
    setStepActive(index) {
      this.stepActive = index;
    },
    setStepv() {
      this.payable.stepDirectionIsVertical = true;
    }
  }
};
</script>

<style lang="scss" scoped>
.stepBoxStyle {
  height: 100%;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  .stepbox-left {
    flex-basis: 80px;
    font-size: 20px;
    color: #2395ed;
  }
  .stepbox-right {
    flex-grow: 1;
  }
}
// 进度条样式修改
.stepBoxStyle > .stepbox-right {
  /deep/ .el-step__icon {
    width: 18px;
    height: 18px;
    font-size: 12px;
  }
  /deep/ .el-step__title {
    font-size: 12px;
    line-height: 30px;
  }
  /deep/ .is-process {
    color: white;
    border-color: #2395ed;
  }
  /deep/ .is-process .is-text {
    background: #2395ed;
  }
  /deep/ .el-step__main .is-process {
    color: #303133;
  }
  /deep/ .is-finish {
    color: #2395ed;
  }
  /deep/ .el-step__main .is-finish {
    color: #303133;
    font-weight: bold;
  }
  /deep/ .is-wait {
    color: #2395ed;
    border-color: #2395ed;
  }
  /deep/ .el-step__main .is-wait {
    color: #303133;
    font-weight: bold;
  }
  /deep/ .el-step__line {
    top: 8px !important;
  }
}
</style>
