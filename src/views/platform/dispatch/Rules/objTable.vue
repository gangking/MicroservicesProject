<template>
  <div class="module">
    <!-- <div class="tabs">
      <el-tabs v-model="activeName">
        <el-tab-pane label="替代业务对象" name="showObj"></el-tab-pane>
      </el-tabs>
    </div> -->
    <div class="title">
      <el-button type="success">替代业务对象</el-button>
      <el-input :disabled="!isEditable" @focus="ruleBlur" v-model="value" placeholder="请选择替代业务对象"></el-input>
      <span class="tip" v-show="!value">替代业务对象不能为空</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'title-style',
  props: {
    isEditable: {
      type: Boolean,
      default: false
    },
    titleName: {
      type: String,
      default() {
        return '';
      }
    },
    showObj: {
      type: Boolean,
      default: false
    },
    tableObjFlag: {
      type: Boolean,
      default: false
    },
    tableObj: {
      type: String,
      default() {
        return '';
      }
    }
  },
  watch: {
    tableObjFlag(val) {
      console.log('接收到业务对象表值变化', val, this.tableObj);
    },
    tableObj: {
      handler(val) {
        console.log('接收到业务对象表值变化', val);
        this.value = val;
      }
    }
  },
  data() {
    return {
      value: '',
      activeName: 'showObj'
    };
  },
  methods: {
    ruleBlur() {
      console.log('获取焦点');
      this.$nextTick(() => {
        this.$emit('thisBlur', 'tableObj');
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.module {
  height: 30px;
  box-sizing: border-box;
  .tabs {
    height: 30px;
    /deep/ .el-tabs {
      .el-tabs__item {
        height: 30px;
        line-height: 30px;
      }
      .el-tabs__nav {
        margin-left: 20px;
      }
      .el-tabs__active-bar {
        height: 4px;
        padding: 0 10px;
        left: -10px;
      }
      .el-tabs__header {
        margin: 0;
      }
    }
  }
  .title {
    width: 100%;
    // height: calc(100% - 30px);
    height: calc(100%);
    box-sizing: border-box;
    .tip {
      display: inline-block;
      width: 130px;
      color: red;
      font-weight: normal;
      font-size: 12px;
    }
    /deep/ .el-button {
      width: 104px;
    }
    /deep/ .el-input{
      width: calc(100% - 130px - 104px - 30px);
    }
    /deep/ .el-textarea {
      height: 100%;
      overflow: auto;
      textarea {
        height: 100% !important;
      }
    }
    > span {
      display: inline-block;
      padding-left: 10px;
      font-size: 13px;
      font-weight: bold;
    }
  }
}
</style>