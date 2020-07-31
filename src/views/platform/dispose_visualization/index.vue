<template>
  <div class="disposebox">
    <layout @viewDetails="viewDetails" />
    <div class="dialogBox">
      <el-dialog title="提示" :visible.sync="showPageFlag" width="100%" top="0px">
        <div class="businessScenarioTest">
          <businessScenario :openDetail="showPageFlag" :descTitle="title" @goBack="goBack" :breadcrumb="breadcrumb" />
        </div>
      </el-dialog>
    </div>

  </div>
</template>

<script>
import layout from './component/layout';
import businessScenario from './business_scenario';
export default {
  components: {
    layout,
    businessScenario
  },
  provide() {
    return {
      kDispose: this
    };
  },
  data() {
    return {
      breadcrumb: [], // 面包屑数组
      title: '',
      sceneId: '', // 业务场景Id
      bsCode: '', // 业务场景编码
      sceneInfo:'', // 业务场景信息
      bsDescribe: '', // 业务场景描述
      showPageFlag: false // 详情弹窗
    };
  },
  methods: {
    // 点击进入业务场景详情
    viewDetails(info) {
      this.showPageFlag = true;
      this.breadcrumb = [];
      console.log('进入详情页', info);
      this.title = info.bsDescribe;
      this.bsCode = info.bsCode;
      this.sceneId = info.id;
      this.sceneInfo = info;
      this.bsDescribe = info.bsDescribe;
      this.breadcrumb[0] = info.scDescribe; // 服务目录
      this.breadcrumb[1] = info.bsDescribe; // 业务场景
      this.breadcrumb[2] = '基础配置';
      this.breadcrumb[3] = '业务情形';
    },
    goBack() {
      this.showPageFlag = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.disposebox {
  height: 100%;
  background: white;
  .dialogBox {
    width: 100%;
    /deep/ .el-dialog__wrapper {
      .el-dialog__header {
        display: none;
      }
      .el-dialog__body {
        width: 100%;
        padding: 0;
        margin: 0;
        .businessScenarioTest {
          width: 100%;
          height: calc(100vh);
          background: red;
        }
      }
    }
  }
}
</style>