<template>
  <!-- 初始状态：
       1. 需要选择集成策略，自动带出下方左侧业务对象树
       2. 选择集成接口，刷新带出右侧集成接口明细字
  -->
  <div class="basicSetup">
    <div class="item">
      <span class="label">集成策略</span>
      <div class="bsaList">
        <div class="newSelect" @click="innerVisible=true">
          <el-tag @close="closeScenario(item)" v-for="item in integrationStrategyList" :key="item.id" :type="item.id">
            {{item.sttDesc}}
          </el-tag>
        </div>
      </div>
    </div>
    <el-button type="primary" plain @click="searchVoucher" icon="el-icon-search">搜索</el-button>

    <el-dialog width="65%" title="选择集成策略" top="5vh" :visible.sync="innerVisible" append-to-body @close="userclose">
      <scenarioList :openFlag="innerVisible" :bsaList="integrationStrategyList" @getBusScenario="getBusScenario" @userclose="userclose" />
    </el-dialog>
  </div>
</template>

<script>
import indexApi from '@/api/platform/voucher/index.js';
import scenarioList from './scenario';
export default {
  components: {
    scenarioList
  },
  data() {
    return {
      innerVisible: false,
      integrationStrategy: {}, // 集成策略
      integrationStrategyList: [],
      integrationInterface: {} // 集成接口
    };
  },
  created() {
  },
  methods: {
    // 单个删除弹窗选中集成策略
    closeScenario(info) {
      var arry = JSON.parse(JSON.stringify(this.integrationStrategyList));
      // console.log('单个删除弹窗选中集成策略',info)
      for (var i = 0; i < arry.length; i++) {
        if (info.bsaKey == arry[i].bsaKey) {
          // a.slice(2,5)
          arry.splice(i, 1);
          // console.log('删除后的集成策略',arry);
        }
      }
      this.integrationStrategyList = arry;
    },
    userclose() {
      this.innerVisible = false;
    },
    // 获取弹窗选中的集成策略
    getBusScenario(list) {
      if (list.length == 1) {
        this.integrationStrategyList = list;
        this.integrationStrategy = {boCode: list[0].boCode, sttId: list[0].id,sttCode: list[0].sttCode}; // 接口业务对象编码查询返回的boCode,集成策略主键
        this.integrationInterface = { boCode: list[0].apiBoCode, desc: list[0].apiDesc }; // 接口主业务对象编码
        // console.log('选择的集成策略', list);
        this.userclose();
        this.searchVoucher();
      } else {
        this.$message.error('仅支持单选');
      }
    },
    // 点击搜索
    searchVoucher() {
      if (!this.integrationStrategy) {
        this.$message.error('请先选择集成策略');
      } else {
        this.$emit('getVoucherParameter', {
          integrationInterface: this.integrationInterface,
          integrationStrategy: this.integrationStrategy
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.basicSetup {
  display: flex;
  position: absolute;
  top: 0px;
  left: 50%;
  transform: translateX(-50%);
  // right: 20px;
  .item {
    margin: 0 20px;
    height: 40px;
    line-height: 38px;
    display: flex;
    padding-top: 3px;
    box-sizing: border-box;
    .label {
      display: inline-block;
      width: 60px;
      position: relative;
      top: -2px;
      font-size: 13px;
      font-weight: bold;
      margin-right: 10px;
      &:before {
        content: '*';
        color: red;
        font-size: 16px;
        position: relative;
        top: 3px;
        left: -2px;
      }
    }

    .bsaList {
      .newSelect {
        width: 250px;
        height: 32px;
        line-height: 32px;
        overflow: auto;
        border: 1px dashed #ccc;
        border-radius: 4px;
      }
      .el-input__suffix {
        display: none;
      }
    }
  }

  // .item {
  //   margin: 0 20px;
  //   height: 40px;
  //   line-height: 38px;
  //   display: flex;
  //   padding-top: 3px;
  //   box-sizing: border-box;
  //   .label {
  //     display: inline-block;
  //     width: 60px;
  //     position: relative;
  //     top: -2px;
  //     font-size: 13px;
  //     font-weight: bold;
  //     margin-right: 10px;
  //     &:before {
  //       content: '*';
  //       color: red;
  //       font-size: 16px;
  //       position: relative;
  //       top: 3px;
  //       left: -2px;
  //     }
  //   }
  //   /deep/ .el-input {
  //     top: -2px;
  //   }
  //   /deep/ .el-select {
  //     .el-input {
  //       .el-input__inner {
  //         width: 220px;
  //         height: 30px;
  //         overflow: hidden;
  //         white-space: nowrap;
  //         text-overflow: ellipsis;
  //       }
  //     }
  //     .el-input__icon {
  //       line-height: 30px;
  //     }
  //   }
  //   /deep/ .el-button {
  //     height: 30px;
  //     position: relative;
  //     top: 4px;
  //   }
  // }
  /deep/ .el-button {
    height: 30px;
    position: relative;
    top: 4.5px;
  }
}
</style>