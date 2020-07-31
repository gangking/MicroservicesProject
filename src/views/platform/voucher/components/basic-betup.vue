<template>
  <div class="basicSetup">
    <div class="item">
      <label>业务场景</label>
      <business-scenario @getSelectScenario="getSelectScenario" />
    </div>
    <div class="item">
      <label>业务类型</label>
      <el-select @change='getbusinessType' v-model="businessType.default" placeholder="请选择">
        <el-option v-for="item in businessType.data" :key="item.bcCode" :label="item.bcDescribe" :value="item.bcCode">
        </el-option>
      </el-select>
    </div>
    <div class="item">
      <label>规则策略</label>
      <el-select @change='getruleStrategy' v-model="ruleStrategy.default" placeholder="请选择">
        <el-option v-for="item in ruleStrategy.data" :key="item.stCode" :label="item.stDesc" :value="item.stCode">
        </el-option>
      </el-select>
    </div>
    <div class="item">
      <label>凭证模板</label>
      <el-select @change='getvoucherTemplates' v-model="voucherTemplates.default" placeholder="请选择">
        <el-option v-for="item in voucherTemplates.data" :key="item.tpCode" :label="item.tpDesc" :value="item.tpCode">
        </el-option>
      </el-select>
    </div>
    <el-dialog title="复制凭证规则" :visible.sync="dialogVisible" width="40%" :before-close="closeCopyFunc">
      <div class="copyBox" style="display:flex;">
        <div class="item item2">
          <label>业务类型</label>
          <el-select @change='getbusinessType' v-model="copyType" placeholder="请选择">
            <el-option v-for="item in businessType.data" :key="item.bcCode" :label="item.bcDescribe" :value="item.bcCode">
            </el-option>
          </el-select>
        </div>
        <div class="item item2">
          <label>目标业务类型</label>
          <el-select v-model="targetType" placeholder="请选择">
            <el-option v-for="item in businessType.data" :key="item.bcCode" :label="item.bcDescribe" :value="item.bcCode">
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="copyBox" style="display:flex;">
        <div class="item item2">
          <label>是否覆盖规则</label>
          <el-switch v-model="isCover" active-color="#13ce66" :active-text="isCover=='0'?'否':'是'" inactive-color="#ff4949" active-value="1" inactive-value="0">
          </el-switch>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeCopyFunc">取 消</el-button>
        <el-button type="primary" @click="submitCopyFunc">复 制</el-button>
      </span>
    </el-dialog>
    <el-button type="primary" plain @click="searchVoucher" icon="el-icon-search">搜索</el-button>
    <el-button type="primary" plain @click="openCopyFunc" icon="el-icon-document-copy">复制</el-button>
  </div>
</template>

<script>
import businessScenario from './business-scenario';
import indexApi from '@/api/platform/voucher/index.js';
import { showLoading, hideLoading } from '@/utils/loading';
export default {
  components: {
    businessScenario
  },
  data() {
    return {
      isCover: '0',
      thisRuleId:'',
      copyType: '',
      targetType: '',
      dialogVisible: false,
      // 业务类型
      businessType: {
        default: '',
        data: []
      },
      // 规则策略
      ruleStrategy: {
        default: '',
        data: []
      },
      // 凭证模板
      voucherTemplates: {
        default: '',
        data: []
      },
      // 业务场景
      scenario: {},
      loadingInstance: null, // 加载样式
      activeVoucherTem: {}
    };
  },
  created() {
    // 查询凭证规则策略
    indexApi
      .queryRuleStrateList({})
      .then(res => {
        //   console.log('查询凭证规则策略', res)
        this.ruleStrategy.data = res.data;
        this.ruleStrategy.default = res.data[0].stCode;
        this.getruleStrategy(res.data[0].stCode);
      })
      .catch(req => {
        this.$message.error('查询凭证规则策略失败');
      });
    // 查询凭证模板
    indexApi
      .queryAccmodeList({})
      .then(res => {
        //   console.log('查询凭证模板', res)
        this.voucherTemplates.data = res.data;
        this.voucherTemplates.default = res.data[0].tpCode;
        this.getvoucherTemplates(res.data[0].tpCode);
      })
      .catch(req => {
        this.$message.error('查询凭证模板失败');
      });
  },
  methods: {
    // 获取所选的业务场景
    getSelectScenario(info) {
      //   console.log('获取所选的业务场景', info)
      this.scenario = info;
      this.$emit('getSelectScenario', info);
      var bsKey = info.bizKey;
      // 根据业务场景查询业务类型
      // 目前就商旅费控业务场景有业务类型
      indexApi
        .queryBsTypeList({
          bsKey: bsKey
        })
        .then(res => {
          this.businessType.data = res.data;
          if (res.data.length > 0) {
            this.businessType.default = res.data[0].bcCode;
            this.getbusinessType(res.data[0].bcCode);
          } else {
            this.businessType.default = '';
          }

          this.searchVoucher();
          // console.log('获取查询的业务类型', res)
        })
        .catch(req => {
          this.$message.error('查询的业务类型失败');
        });
    },
    // 获取业务类型
    getbusinessType(val) {
      //   console.log('业务类型选中值', val)
      this.businessType.default = val;
      for (var i = 0; i < this.businessType.data.length; i++) {
        var item = this.businessType.data[i];
        if (item.bcCode == val) {
          this.businessType.bcKey = item.id;
        }
      }
      this.searchVoucher();
    },
    // 规则策略
    getruleStrategy(val) {
      //   console.log('规则策略选中值', val)
      this.ruleStrategy.default = val;
      this.searchVoucher();
    },
    // 凭证模板
    getvoucherTemplates(val) {
      //   console.log('凭证模板选中值', val)
      this.voucherTemplates.default = val;
      for (var i = 0; i < this.voucherTemplates.data.length; i++) {
        var item = this.voucherTemplates.data[i];
        if (item.tpCode == val) {
          this.activeVoucherTem = item;
        }
      }
      
      this.searchVoucher();
      //   this.activeVoucherTem
    },
    submitCopyFunc() {
      if (this.copyType == '') {
        this.$message({
          message: '请先选择要复制的业务类型。',
          type: 'warning'
        });
      } else if (this.targetType == '') {
        this.$message({
          message: '请先选择要复制的目标业务类型。',
          type: 'warning'
        });
      } else if (this.targetType == this.copyType) {
        this.$message({
          message: '要复制的业务类型和目标业务类型不能一样。',
          type: 'error'
        });
      } else {
        var copyTypeInfo = this.getTypeItem(this.copyType);
        var targetTypeInfo = this.getTypeItem(this.targetType);
        var params = {
          bcCode:targetTypeInfo.bcCode,
          bcKey:targetTypeInfo.id,
          flag:this.isCover,
          ruleId:this.thisRuleId,
        }
        console.log('要复制的业务类型及目标类型及复制参数', copyTypeInfo, targetTypeInfo,params);
        showLoading();
        indexApi
          .copyRule(params)
          .then(res => {
            hideLoading();
            this.closeCopyFunc();
            this.$message({
              message: '复制成功',
              type: 'success'
            });
          })
          .catch(req => {
            hideLoading();
            this.closeCopyFunc();
            this.$message({
              message: '复制失败',
              type: 'error'
            });
          });
      }
    },
    // 获取所选业务类型具体信息
    getTypeItem(code) {
      var arry = JSON.parse(JSON.stringify(this.businessType.data));
      for (var i = 0; i < arry.length; i++) {
        var item = arry[i];
        if (item.bcCode == code) {
          return item;
        }
      }
    },
    // 关闭复制弹窗
    closeCopyFunc() {
      this.copyType = '';
      this.targetType = '';
      this.isCover = '0';
      this.dialogVisible = false;
    },
    // 打开复制凭证规则
    openCopyFunc() {
      console.log('复制凭证规则');
      this.dialogVisible = true;
    },
    // 点击搜索凭证规则
    searchVoucher() {
      // 先获取所有搜索参数
      // 检验搜索参数是否为空
      if (JSON.stringify(this.scenario) == '{}') {
        this.$message.error('请选择凭证规则业务场景');
        return;
      }

      if (!this.businessType.default) {
        this.$message.error('请选择凭证规则业务类型');
        return;
      }

      if (!this.voucherTemplates.default) {
        this.$message.error('请选择凭证规则模板');
        return;
      }

      if (!this.ruleStrategy.default) {
        this.$message.error('请选择凭证规则策略');
        return;
      }
      var params = {
        // 业务类型相关数据
        bcCode: this.businessType.default,
        bcKey: this.businessType.bcKey,
        // 业务场景相关数据
        boCode: this.activeVoucherTem.boCode,
        bsCode: this.scenario.bsCode,
        bsKey: this.scenario.bizKey,
        // 凭证策略及凭证规则相关数据
        stCode: this.ruleStrategy.default,
        tpCode: this.voucherTemplates.default
      };
      showLoading();
      indexApi
        .saveAccRuleDef(params)
        .then(res => {
          // console.log('保存凭证规则定义', res)
          var ruleId = res.variables.id;
          this.thisRuleId = ruleId;
          this.searchVoucherList(ruleId, this.activeVoucherTem.boCode);
        })
        .catch(req => {
          this.$nextTick(() => {
            // 以服务的方式调用的 Loading 需要异步关闭
            hideLoading();
          });
          this.$message.error('保存凭证规则定义失败');
        });
    },
    // 查询规则列表
    searchVoucherList(id, boCode) {
      indexApi
        .findAllByRuleId({
          ruleId: id,
          boCode: boCode
        })
        .then(res => {
          // var list = require('./test.json').data;
          // console.log('获取接口数据模拟',list)
          this.$emit('getVoucherList', res.data);
          this.$nextTick(() => {
            // 以服务的方式调用的 Loading 需要异步关闭
            hideLoading();
          });
        })
        .catch(req => {
          this.$nextTick(() => {
            // 以服务的方式调用的 Loading 需要异步关闭
            hideLoading();
          });
          this.$message.error('保存凭证规则定义失败');
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.basicSetup {
  position: absolute;
  left: 200px;
  top: 0px;
  // display: flex;
  .item2 {
    /deep/ .el-select {
      .el-input {
        .el-input__inner {
          width: 160px !important;
        }
      }
    }
    /deep/ .el-switch {
      position: relative;
      top: 7px;
    }
  }
  .item {
    margin-right: 10px;
    height: 40px;
    line-height: 38px;
    display: flex;
    padding-top: 3px;
    box-sizing: border-box;
    float: left;
    label {
      font-size: 13px;
      font-weight: bold;
      margin-right: 10px;
      &:after {
        content: '*';
        color: red;
        font-size: 16px;
        position: relative;
        top: 3px;
        left: 2px;
      }
    }
    /deep/ .el-select {
      .el-input {
        .el-input__inner {
          width: 120px;
          height: 30px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }
      .el-input__icon {
        line-height: 30px;
      }
    }
    /deep/ .el-button {
      height: 30px;
      position: relative;
      top: 6px;
    }
  }
  /deep/ .el-button {
    height: 30px;
    position: relative;
    top: 6px;
  }
}
</style>