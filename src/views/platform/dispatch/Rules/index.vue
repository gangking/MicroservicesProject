<template>
  <!-- <ibps-container> -->
  <div class="effectiveness-box">
    <div class="container">
      <!-- <div class="Crumbs">
          <span class="styOne">总账管理 </span> / <span class="styOne">薪资管理 </span> / <span class="styTwo">GL_01_01-薪资计提</span> / <span class="three">替代检查</span>
        </div> -->
      <div class="content">
        <el-row type="flex" class="row-bg" justify="space-between">
          <el-col :span="6">
            <div class="grid-content bg-purple">
              <!-- 检查步骤 -->

              <test-step @getCodeDetail="getCodeDetail" @saveRuleData="saveRuleData" @batchSave="batchSave" @deleteRuleData="deleteRuleData" @getSelectScenario="getSelectScenario" @stepEditable="stepEditable" :activeRowF="activeRow" :ruleItem="ruleItem" :step-list="stepList" :loadings="loadings" :isEffecNull="isEffecNull" comType="替代规则" @getIsStepListNull="getIsStepListNull" :tableObj="ruleItem.tableName">
                <title-style slot="title" title-name="替代规则步骤" />
              </test-step>
            </div>
          </el-col>
          <el-col :span="11">
            <div class="grid-content bg-purple">
              <!-- 执行脚本配置 -->
              <div class="scriptBox">
                <div>
                  <tabs-panel @getNewScriptVal="getNewScriptVal" :form="formDataOne" code-type="先决条件" :is-editable="isEditable" @thisBlur="thisBlurActive" @getSetCode="getSetCode" :isStepListNull="isStepListNull" />
                </div>
                <div>
                  <tabs-panel @getNewScriptVal="getNewScriptVal" :form="formDataTwo" code-type="替代检查" :is-editable="isEditable" @thisBlur="thisBlurActive" @getSetEffectiveCode="getSetEffectiveCode" :isStepListNull="isStepListNull">
                    <objTable :is-editable="isEditable" :tableObjFlag="tableObjFlag" slot="objTable" title-name="替代业务对象" :showObj="true" @objValUpdata="objValUpdata" :tableObj="ruleItem.tableName" @thisBlur="thisBlurActive" />
                  </tabs-panel>
                </div>
                <!-- <div>
                  <objTable :is-editable="isEditable" :tableObjFlag="tableObjFlag" slot="title" title-name="业务对象" :showObj="true" :tableObj="ruleItem.tableName" @thisBlur="thisBlurActive" />
                </div> -->
              </div>
            </div>
          </el-col>
          <el-col :span="7">
            <div class="grid-content bg-purple">
              <!-- 业务对象及布尔逻辑符号 -->
              <div class="objLogic">
                <div class="objBox">
                  <business-object :obj-tree-data="objTreeData" @getObj="getObj">
                    <title-style :is-editable="isEditable" slot="title" title-name="业务对象" />
                  </business-object>
                </div>
                <div>
                  <businessLogic @getSlectLogic="getSlectLogic">
                    <title-style slot="title" title-name="布尔逻辑符号" />
                    <title-style slot="title2" title-name="常量" />
                  </businessLogic>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
  <!-- </ibps-container> -->
</template>

<script>
import objTable from './objTable.vue';
import titleStyle from '@/views/platform/dispatch/Effectiveness/components/title-style.vue';
import testStep from '@/views/platform/dispatch/Effectiveness/components/test-step.vue';
import businessObject from '@/views/platform/dispatch/Effectiveness/components/business-object.vue';
import businessLogic from '@/views/platform/dispatch/Effectiveness/components/bool-logic.vue';
import tabsPanel from '@/views/platform/dispatch/Effectiveness/components/tabs-panel.vue';
import rulesApi from '@/api/platform/rules/index.js';
import { buildTree } from '@/api/platform/form/formDef';
export default {
  components: {
    titleStyle,
    objTable,
    testStep,
    businessObject,
    businessLogic,
    tabsPanel
  },
  props: {
    busSeId: {
      type: String,
      default: ''
    }
  },
  provide() {
    return {
      ruleStrategyProvide: this
    };
  },
  data() {
    return {
      id: this.busSeId,
      tableObjFlag: false,
      // 先决条件
      formDataOne: {
        tabs: [
          {
            label: '先决条件',
            name: 'Prerequisite'
          },
          {
            label: '增强脚本',
            name: 'EnhanceScript'
          }
        ],
        formula: {
          variable: {},
          variableScript: {},
          func: {},
          value: '',
          script: ''
        },
        formtype: 'Prerequisite'
      },
      // 替代检查
      formDataTwo: {
        tabs: [
          {
            label: '替代检查',
            name: 'EffectiveInspection'
          },
          {
            label: '增强脚本',
            name: 'EnhanceScript'
          }
        ],
        formula: {
          variable: {},
          variableScript: {},
          func: {},
          value: '',
          script: ''
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
          {
            label: '增强脚本',
            name: 'EnhanceScript'
          }
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
      isEffecNull: '',
      isStepListNull: false, // 步骤表是否为空标识
      loadings: true // 用于关闭步骤表加载样式
    };
  },
  mounted() {
    localStorage.removeItem('codeEdit');
  },
  methods: {
    // 获取步骤表查询结果是否为空
    getIsStepListNull(val) {
      this.isStepListNull = val;
    },
    // 获取点击选中替代规则内容
    getCodeDetail(info) {
      // console.log('获取选中替代规则内容----', info)
      // 实时更新消息区和规则区
      this.updateMsgRule(info);
      // 保存当前选中步骤id
      this.stepId = info.id;
      this.activeRow = true;

      // 保存当前选中步骤基本信息
      this.ruleItem.bsKey = info.bsKey ? info.bsKey : this.newBsKey;

      this.ruleItem.bzNumber = info.bzNumber ? info.bzNumber : '';
      this.$set(this.ruleItem,'tableName',info.tableName ? info.tableName : '')
      // this.ruleItem.tableName = info.tableName ? info.tableName : '';
      this.ruleItem.prerequisiteScript = info.prerequisiteScript ? info.prerequisiteScript : '';
      this.ruleItem.substitutionScript = info.substitutionScript ? info.substitutionScript : '';
      this.ruleItem.bzDescribe = info.bzDescribe ? info.bzDescribe : '';
      this.ruleItem.usePath = info.usePath ? info.usePath : '';
      (this.ruleItem.isFrontEnd = info.isFrontEnd ? info.isFrontEnd : ''),
        (this.ruleItem.id = info.id ? info.id : '');
      this.ruleItem.cleanUp = info.cleanUp;
    },
    // 获取设置的最新增强脚本值
    getNewScriptVal(val, flag) {
      if (flag == 'Prerequisite') {
        this.ruleItem.prerequisiteScript = val;
      } else {
        this.ruleItem.substitutionScript = val;
      }
    },
    // 获取设置的先决条件最新规则信息
    getSetCode(info) {
      // console.log('获取最新先决条件规则', info)
      this.ruleItem.prerequisite = this.splicingRule(info);
      this.ruleItem.prerequisiteArr = JSON.stringify(info);
    },
    // 获取设置的替代检查最新规则信息
    getSetEffectiveCode(info) {
      // console.log('=====获取最新替代检查规则', info)
      if (info.length < 1) {
        this.isEffecNull = false;
      } else {
        this.isEffecNull = true;
      }
      
      this.ruleItem.booleanStatement = this.splicingRule(info).split('=')[1]?this.splicingRule(info).split('=')[1]:'';
      // console.log('=====获取最新替代检查规则2', this.ruleItem.booleanStatement)
      this.ruleItem.booleanStatementArr = JSON.stringify(info);
      if (info[0]) {
        // this.ruleItem.tableName = info[0].tableName; // 赋值tableName
        // this.ruleItem.boProperty = info[0].key;
        this.tableObjFlag = this.tableObjFlag ? false : true;
        this.$set(this.ruleItem, 'tableName', info[0].tableName);
        this.ruleItem.boProperty = info[0].key;
      }
    }, // 拼接规则
    splicingRule(info) {
      var ruleTxt = '';
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
    stepEditable(flag) {
      this.isEditable = flag;
    },
    // 单个保存
    saveRuleData(info) {
      // console.log('点击保存', this.ruleItem);
      console.log('点击保存111', this.ruleItem, info.newItem);
      var addItem = info.newItem;
      // 对象合并
      Object.assign(addItem, this.ruleItem);
      // console.log('合并后新对象', addItem);

      // 如果规则有值，则不能编辑增强脚本，且脚本必须为空
      // 如果脚本有值，则不能编辑规则，且规则必须为空
      if (addItem.prerequisite && addItem.prerequisiteScript) {
        this.$message.error('如果已填入先决条件，就不能再填写增强脚本，反之一样。');
        this.activeRow = false;
        this.getFinndAll(info);
        return;
      }

      if (addItem.booleanStatement && addItem.substitutionScript) {
        this.$message.error('如果已填入替代规则，就不能再填写增强脚本，反之一样。');
        this.activeRow = false;
        this.getFinndAll(info);
        return;
      }

      // if (!addItem.tableName) {
      //   // 请选择业务对象表
      //   this.$message.error('请选择业务对象表。');
      //   this.activeRow = false;
      //   this.getFinndAll(info);
      //   return;
      // }

      rulesApi
        .effectivenessSave([addItem])
        .then(res => {
          this.$message({
            message: '保存成功！',
            type: 'success'
          });
          this.activeRow = false;
          this.getFinndAll(info);
        })
        .catch(req => {
          this.loadings = false;
          this.$message.error('数据保存失败');
        });
    },
    // 批量排序保存
    batchSave(info) {
      console.log('替代规则批量保存', info.list, typeof info.list);
      rulesApi
        .effectivenessSave(info.list)
        .then(res => {
          this.$message({
            message: '保存成功！',
            type: 'success'
          });
          this.activeRow = false;
          this.getFinndAll(info);
        })
        .catch(req => {
          this.loadings = false;
          this.$message.error('数据保存失败');
        });
    },
    // 删除
    deleteRuleData(info) {
      if (this.stepId) {
        rulesApi
          .bsCheckStepDelete({
            ids: this.stepId
          })
          .then(res => {
            this.$message({
              message: '删除成功！',
              type: 'success'
            });
            this.activeRow = false;
            this.getFinndAll(info);
          });
      } else {
        this.loadings = false;
        this.$message.error('删除步骤失败！');
      }
    },
    // 获取所选业务场景
    getSelectScenario(info) {
      this.newBsKey = info.bizKey;
      buildTree({
        boCode: info.bizKey,
        boDefId: info.boDefId,
        mode: 'bo'
      })
        .then(response => {
          // this.boData = response.data;
          // console.log('获取所选的业务对象', response)
          this.objTreeData = response.data;
        })
        .catch(e => {
          this.$message.error('业务场景查询失败');
        });
    },
    // 刷新步骤表(删除，修改，保存后调用)
    getFinndAll(info) {
      rulesApi
        .bsCheckStepFindAll({
          bsKey: info.bsKey, // 业务场景
          // bsKey: '600000000000000000', // 业务场景
          usePath: info.usePath
        })
        .then(res => {
          this.stepList = res.data;
        })
        .catch(req => {
          this.$message.error('数据查询失败');
        });
    },
    // 更新规则区和消息区信息
    updateMsgRule(info) {
      // 获取并设置规则内容
      this.$set(
        this.formDataOne,
        'value',
        info.prerequisiteArr ? JSON.parse(info.prerequisiteArr) : ''
      );
      this.$set(
        this.formDataTwo,
        'value',
        info.booleanStatementArr ? JSON.parse(info.booleanStatementArr) : ''
      );

      // 获取并回显增强脚本内容
      this.$set(this.formDataOne, 'script', info.prerequisiteScript ? info.prerequisiteScript : '');
      this.$set(this.formDataTwo, 'script', info.substitutionScript ? info.substitutionScript : '');

      // 获取并设置消息区内容
      this.$set(this.formDataThree, 'formInfo', info || {});
    },
    objValUpdata(val){
      this.$set(this.ruleItem, 'tableName', val);
    },
    // 获取当前选中焦点
    thisBlurActive(type) {
      // console.log(type)
      switch (type) {
        case 'tableObj':
          this.blurFormFlag = 'tableObj';
          break;
        case 'Prerequisite':
          this.blurFormFlag = 'formDataOne';
          break;
        case 'Effective-Inspection':
          this.blurFormFlag = 'formDataTwo';
          break;
        case 'PrerequisiteScript':
          this.blurFormFlag = 'PrerequisiteScript';
          break;
        case 'Effective-InspectionScript':
          this.blurFormFlag = 'Effective-InspectionScript';
          break;
      }
    },
    // 获取点击的业务对象
    getObj(info) {
      console.log('获取点击的业务对象', info, this.blurFormFlag);
      this.setRuleValue(info, 'variable');
    },
    // 获取选中逻辑符号
    getSlectLogic(info) {
      // console.log('获取选中逻辑符号', info)
      this.setRuleValue(info);
    },
    // 根据当前焦点赋值
    setRuleValue(info, flag) {
      switch (this.blurFormFlag) {
        case 'tableObj':
          if (info.attrType != 'field') {
            // this.ruleItem.tableName = info.tableName;
            this.tableObjFlag = this.tableObjFlag ? false : true;
            this.$set(this.ruleItem, 'tableName', info.tableName);
            // this.$set(this.ruleItem,'tableName','')
            // setTimeout(() => {
            //   this.$set(this.ruleItem, 'tableName', info.tableName);
            // }, 10);
            this.ruleItem.boProperty = info.key;
          } else {
            this.$message.error('所选为业务对象属性，不是业务对象表。');
          }

          break;
        case 'PrerequisiteScript':
          if (flag == 'variable') {
            this.$set(this.formDataOne, 'variableScript', {});
            setTimeout(() => {
              this.$set(this.formDataOne, 'variableScript', info);
            }, 10);
          }
          break;
        case 'Effective-InspectionScript':
          if (flag == 'variable') {
            this.$set(this.formDataTwo, 'variableScript', {});
            setTimeout(() => {
              this.$set(this.formDataTwo, 'variableScript', info);
            }, 10);
          }
          break;
        case 'formDataOne':
          var form = JSON.parse(JSON.stringify(this.formDataOne));
          if (flag == 'variable') {
            // console.log('点击的是业务对象')
            this.$set(this.formDataOne, 'variable', {});
            setTimeout(() => {
              this.$set(this.formDataOne, 'variable', info);
            }, 10);
          } else {
            this.$set(this.formDataOne, 'func', {});
            setTimeout(() => {
              this.$set(this.formDataOne, 'func', info);
            }, 10);
          }
          break;
        case 'formDataTwo':
          var form = JSON.parse(JSON.stringify(this.formDataTwo));
          if (flag == 'variable') {
            this.$set(this.formDataTwo, 'variable', {});
            setTimeout(() => {
              this.$set(this.formDataTwo, 'variable', info);
            }, 10);
          } else {
            this.$set(this.formDataTwo, 'func', {});
            setTimeout(() => {
              this.$set(this.formDataTwo, 'func', info);
            }, 10);
          }
          break;
      }
    }
  }
};
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
          // height: calc((100%-90px)/2);
          border: 1px solid #ccc;
          margin-bottom: 10px;
          overflow: auto;
          // &:first-child {
          //   flex: 0.8;
          // }
          &:last-child {
            // flex: 0.3;
            // height: 90px;
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
