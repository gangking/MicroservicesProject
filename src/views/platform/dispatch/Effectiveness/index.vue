<template>
  <div class="effectiveness-box">
    <div class="container">
      <div class="content">
        <el-row type="flex"
                class="row-bg"
                justify="space-between">
          <el-col :span="6">
            <div class="grid-content bg-purple">
              <!-- 检查步骤 -->
              <test-step @getCodeDetail="getCodeDetail"
                         @saveRuleData="saveRuleData"
                         @batchSave="batchSave"
                         @deleteRuleData="deleteRuleData"
                         @getSelectScenario="getSelectScenario"
                         @stepEditable="stepEditable"
                         :activeRowF="activeRow"
                         :step-list="stepList"
                         :loadings="loadings"
                         comType="有效性检查"
                         @getIsStepListNull="getIsStepListNull">
                <title-style slot="title"
                             titleName='有效性规则步骤' />
              </test-step>
            </div>
          </el-col>
          <el-col :span="11">
            <div class="grid-content bg-purple">
              <!-- 执行脚本配置 -->
              <div class="scriptBox">
                <div>
                  <tabs-panel :form="formDataOne"
                              codeType="先决条件"
                              @thisBlur="thisBlurActive"
                              @getSetCode="getSetCode"
                              :isEditable="isEditable"
                              :isStepListNull="isStepListNull" />
                </div>
                <div>
                  <tabs-panel :form="formDataTwo"
                              codeType="有效性检查"
                              @thisBlur="thisBlurActive"
                              @getSetEffectiveCode="getSetEffectiveCode"
                              :isEditable="isEditable"
                              :isStepListNull="isStepListNull" />
                </div>
                <div>
                  <message-type :form="formDataThree"
                                @thisBlur="thisBlurActive"
                                :isEditable="isEditable"
                                :blurFormFlag="blurFormFlag"
                                :msgVarList="msgVarList"
                                @getNewMsgData="getNewMsgData" />
                </div>
              </div>
            </div>
          </el-col>
          <el-col :span="7">
            <div class="grid-content bg-purple">
              <!-- 业务对象及布尔逻辑符号 -->
              <div class="objLogic">
                <div class="objBox">
                  <business-object @getObj="getObj"
                                   :objTreeData="objTreeData">
                    <title-style slot="title"
                                 titleName='业务对象' />
                  </business-object>
                </div>
                <div>
                  <businessLogic @getSlectLogic="getSlectLogic">
                    <title-style slot="title"
                                 titleName='布尔逻辑符号' />
                    <title-style slot="title2"
                                 titleName='常量' />
                  </businessLogic>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import titleStyle from './components/title-style'
import testStep from './components/test-step.vue'
import businessObject from './components/business-object'
import businessLogic from './components/bool-logic'
import tabsPanel from './components/tabs-panel'
import messageType from './components/message-type'
import effectApi from '@/api/platform/effectiveness/index.js';
import { buildTree } from "@/api/platform/form/formDef";
export default {
  components: {
    titleStyle,
    testStep,
    businessObject,
    businessLogic,
    tabsPanel,
    messageType
  },
  props:{
    busSeId:{
      type:String,
      default:''
    }
  },
  provide() {
    return {
      ruleStrategyProvide: this
    };
  },
  data () {
    return {
      id:this.busSeId,
      // 先决条件
      formDataOne: {
        tabs: [
          {
            label: '前提条件',
            name: 'Prerequisite'
          },
          //  {
          //   label: '增强脚本',
          //   name: 'EnhanceScript'
          // }
          ],
        formula: {
          variable: {},
          func: {},
          value: ''
        },
        formtype: 'Prerequisite'
      },
      // 有效性检查
      formDataTwo: {
        tabs: [
          {
            label: '有效性检查',
            name: 'EffectiveInspection'
          }, 
          // {
          //   label: '增强脚本',
          //   name: 'EnhanceScript'
          // }
          ],
        formula: {
          variable: {},
          func: {},
          value: ''
        },
        formtype: 'Effective-Inspection'
      },
      // 提示消息
      formDataThree: {
        tabs: [
          {
            label: '消息检查',
            name: 'inspection'
          }, 
          // {
          //   label: '增强脚本',
          //   name: 'EnhanceScript'
          // }
          ],
        formInfo: {}
      },
      blurFormFlag: null,
      ruleItem: {},
      stepId: '',
      stepList: [],
      // 业务对象
      objTreeData: [],
      // 业务场景
      newBsKey: '',
      activeRow: false, // 是否选中步骤
      isEditable: false,
      msgVarList: [],
      isStepListNull: false, // 步骤表是否为空标识
      loadings: true, // 用于关闭步骤表加载样式
    }
  },
  mounted(){
      localStorage.removeItem('codeEdit')
  },
  methods: {
    // 获取步骤表查询结果是否为空
    getIsStepListNull(val){
        this.isStepListNull = val;
    },
    // 获取点击选中有效性规则内容
    getCodeDetail (info) {
      // console.log('获取选中有效性规则内容', info);
      // 实时更新消息区和规则区
      this.updateMsgRule(info);
      // 保存当前选中步骤id
      this.stepId = info.id;
      this.activeRow = true;

      // 保存当前选中步骤基本信息
      this.ruleItem.bsKey = info.bsKey ? info.bsKey : this.newBsKey;
      this.ruleItem.bzNumber = info.bzNumber ? info.bzNumber : '';
      this.ruleItem.bzDescribe = info.bzDescribe ? info.bzDescribe : '';
      this.ruleItem.usePath = info.usePath ? info.usePath : '';
      this.ruleItem.isFrontEnd = info.isFrontEnd ? info.isFrontEnd : '';
      this.ruleItem.id = info.id ? info.id : '';
    },
    // 获取设置的最新消息区域的值
    getNewMsgData (val) {
      // console.log('获取最新消息值', val);
      this.ruleItem.msgType = val.msgType.default;
      this.ruleItem.msgSort = val.msgCategory.default;
      this.ruleItem.msgNumber = val.msgCode.default;
      this.ruleItem.msg1 = val.msgVar1.list.length > 0 ? val.msgVar1.list[0].tableName + '_' + val.msgVar1.list[0].key : "";
      this.ruleItem.msgobj1 = val.msgVar1.list.length > 0 ? JSON.stringify(val.msgVar1.list) : "";
      this.ruleItem.msg2 = val.msgVar2.list.length > 0 ? val.msgVar2.list[0].tableName + '_' + val.msgVar2.list[0].key : "";
      this.ruleItem.msgobj2 = val.msgVar1.list.length > 0 ? JSON.stringify(val.msgVar2.list) : "";
      this.ruleItem.msg3 = val.msgVar3.list.length > 0 ? val.msgVar3.list[0].tableName + '_' + val.msgVar3.list[0].key : "";
      this.ruleItem.msgobj3 = val.msgVar1.list.length > 0 ? JSON.stringify(val.msgVar3.list) : "";
      this.ruleItem.msg4 = val.msgVar4.list.length > 0 ? val.msgVar4.list[0].tableName + '_' + val.msgVar4.list[0].key : "";
      this.ruleItem.msgobj4 = val.msgVar1.list.length > 0 ? JSON.stringify(val.msgVar4.list) : "";
    },
    // 获取设置的先决条件最新规则信息
    getSetCode (info) {
      // console.log('获取最新先决条件规则', info)
    //   if(info.length<1){
    //       return
    //   }
      this.ruleItem.prerequisite = this.splicingRule(info);
      this.ruleItem.prerequisiteArr = JSON.stringify(info);
    },
    // 获取设置的有效性检查最新规则信息
    getSetEffectiveCode (info) {
      // console.log('获取最新有效性检查规则', info)
    //   if(info.length<1){
    //       return
    //   }
      this.ruleItem.booleanStatement = this.splicingRule(info);
      this.ruleItem.booleanStatementArr = JSON.stringify(info);
    },
    // 拼接规则
    splicingRule (info) {
      var ruleTxt = "";
      for (var i = 0; i < info.length; i++) {
        var item = info[i];
        if (item.tableName != undefined) {
          ruleTxt += item.tableName + '_' + item.key;
        } else if (item.type == 'btn') {
          ruleTxt += item.name;
        } else {
          ruleTxt += item;
        }
      }
      return ruleTxt;
    },
    // 修改编辑
    stepEditable (flag) {
      this.isEditable = flag;
    },
    // 单个保存
    saveRuleData (info) {
      // console.log('点击保存', this.ruleItem);
      effectApi.effectivenessSave([this.ruleItem]).then((res) => {
        this.$message({
          message: '保存成功！',
          type: 'success'
        });
        this.activeRow = false;
        this.getFinndAll(info);
      }).catch((req) => {
        this.loadings = false;
        this.$message.error('数据保存失败');
      })
    },
    // 批量排序保存
    batchSave (info) {
      this.loadings = true;
      effectApi.effectivenessSave(info.list).then((res) => {
        this.$message({
          message: '保存成功！',
          type: 'success'
        });
        this.activeRow = false;
        this.getFinndAll(info);
      }).catch((req) => {
        this.loadings = false;
        this.$message.error('数据保存失败');
      })
    },
    // 删除
    deleteRuleData (info) {
      if (this.stepId) {
        this.loadings = true;
        effectApi.bsCheckStepDelete({
          ids: this.stepId
        }).then((res) => {
          this.$message({
            message: '删除成功！',
            type: 'success'
          });
          this.activeRow = false;
          this.getFinndAll(info);
        })
      } else {
        this.loadings = false;
        this.$message.error('删除步骤失败！');
      }
    },
    // 获取所选业务场景
    getSelectScenario (info) {
      this.newBsKey = info.bizKey;
      buildTree({
        boCode: info.bizKey,
        boDefId: info.boDefId,
        mode: 'bo'
      }).then(response => {
        // console.log('获取所选的业务对象', response)
        this.objTreeData = response.data;
      }).catch(e => {
        this.$message.error('业务场景获取失败');
      });
    },
    // 刷新步骤表(删除，修改，保存后调用)
    getFinndAll (info) {
      // console.log('保存', info)
      effectApi.bsCheckStepFindAll({
        bsKey: info.bsKey, // 业务场景
        usePath: info.usePath
      }).then((res) => {
        this.loadings = false;
        this.stepList = res.data;
      }).catch((req) => {
        this.loadings = false;
        this.$message.error('步骤表查询失败');
      })
    },
    // 更新规则区和消息区信息
    updateMsgRule (info) {
      // 获取并设置规则内容
      this.$set(this.formDataOne, 'value', info.prerequisiteArr ? JSON.parse(info.prerequisiteArr) : '');
      this.$set(this.formDataTwo, 'value', info.booleanStatementArr ? JSON.parse(info.booleanStatementArr) : '');

      // 获取并设置消息区内容
      this.$set(this.formDataThree, 'formInfo', info ? info : {});
    },
    // 获取当前选中焦点
    thisBlurActive (type) {
      // console.log(type)
      switch (type) {
        case 'Prerequisite':
          this.blurFormFlag = 'formDataOne'
          break;
        case 'Effective-Inspection':
          this.blurFormFlag = 'formDataTwo'
          break;
        case '消息变量':
          this.blurFormFlag = 'msgVar'
          break;
        case 'PrerequisiteScript':
          this.blurFormFlag = null;
          break;
        case 'Effective-InspectionScript':
          this.blurFormFlag = null;
          break;
      }
    },
    // 获取点击的业务对象
    getObj (info) {
      // 参数2表示点击的是业务对象
      this.setRuleValue(info, 'variable')
    },
    // 获取选中逻辑符号
    getSlectLogic (info) {
      // console.log('获取选中逻辑符号', info)
      this.setRuleValue(info)
    },
    // 根据当前焦点赋值
    setRuleValue (info, flag) {
      switch (this.blurFormFlag) {
        case 'formDataOne':
          var form = JSON.parse(JSON.stringify(this.formDataOne))
          if (flag == 'variable') {
            this.$set(this.formDataOne, 'variable', {})
            setTimeout(() => {
              this.$set(this.formDataOne, 'variable', info)
            }, 10)
          } else {
            this.$set(this.formDataOne, 'func', {})
            setTimeout(() => {
              this.$set(this.formDataOne, 'func', info)
            }, 10)
          }
          break;
        case 'formDataTwo':
          var form = JSON.parse(JSON.stringify(this.formDataTwo))
          if (flag == 'variable') {
            this.$set(this.formDataTwo, 'variable', {})
            setTimeout(() => {
              this.$set(this.formDataTwo, 'variable', info)
            }, 10)
          } else {
            this.$set(this.formDataTwo, 'func', {})
            setTimeout(() => {
              this.$set(this.formDataTwo, 'func', info)
            }, 10)
          }
          break;
        case 'msgVar':
          var arr = [];
          arr.push(info);
          this.msgVarList = arr;
          break;
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.effectiveness-box {
  width: 100%;
  height: 100%;
  position: relative;
  background: white;
  .container {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    padding: 10px;
    box-sizing: border-box;
  }
  .content {
    width: 100%;
    height: 100%;
    .el-col {
      height: 100%;
      margin-right: 10px;
      &:last-child {
        margin-right: 0;
      }
    }
    /deep/ .el-col-11,
    /deep/ .el-col-7 {
      .bg-purple {
        border: 0;
      }
    }
    .grid-content {
      min-height: 36px;
      height: 100%;
      .scriptBox {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        height: 100%;
        > div {
          flex: 1;
          border: 1px solid #ccc;
          margin-bottom: 10px;
          overflow: auto;
          &:first-child {
            flex: 0.8;
          }
          &:last-child {
            height: 224px;
            margin-bottom: 0;
          }
        }
      }
      .objLogic {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        height: 100%;
        .objBox {
          height: 212px;
          overflow: hidden;
        }
        > div {
          flex: 1;
          border: 1px solid #ccc;
          margin-bottom: 10px;
          &:last-child {
            margin-bottom: 0;
          }
        }
      }
    }
    .row-bg {
      // padding: 8px 0;
      background-color: white;
      height: 100%;
      margin: 0 !important;
    }
  }
}
</style>