<template>
  <div class="voucherBox">
    <div class="header">
      <div>
        <title-style titleName="基本参数选择" />
        <basicSetup @getSelectScenario="getSelectScenario"
                    @getVoucherList="getVoucherList" />
      </div>
    </div>
    <div class="content">
      <split-pane :min-percent='20'
                  :default-percent='80'
                  split="vertical">
        <template slot="paneL">
          <split-pane split="vertical"
                      :min-percent='20'
                      :default-percent='60'>
            <template slot="paneL">
              <div class="leftbox">
                <title-style titleName="凭证规则参数" />
                <rule-table @getActiveVoucher="getActiveVoucher"
                            @getTableDataList="getTableDataList"
                            :tableDataListS="tableDataList"
                            @getActiveCells="getActiveCells"
                            :itfTableDataList="itfTableDataList" />
              </div>
            </template>
            <template slot="paneR">
              <div class="middlebox">
                <div class="editop">
                  <title-style titleName="表达式">
                    <i slot="btn">
                      <el-button type="primary"
                                 plain
                                 @click="stepEditable">{{isEditable?'显示':'编辑'}}</el-button>
                    </i>
                  </title-style>

                  <div class="codeForm">
                    <div>
                      <el-tabs v-model="editableTabsValue"
                               type="card"
                               editable
                               @edit="handleTabsEdit"
                               @tab-click="handleTabsClick">
                        <el-tab-pane :key="item.name"
                                     v-for="(item) in editableTabs"
                                     :label="item.title"
                                     :name="item.name">
                        </el-tab-pane>
                      </el-tabs>
                      <div class="codeBoxQ">
                        <div class="codeBox">
                          <tabs-panel :form="formDataOne"
                                      codeType="先决条件"
                                      @thisBlur="thisBlurActive"
                                      @getSetCode="getSetCode"
                                      :isEditable="isEditable"
                                      :isStepListNull="isStepListNull"
                                      :isGetNull="isGetNull"
                                      :updateListNull="updateListNull" />
                        </div>
                        <div class="codeBox">
                          <tabs-panel :form="formDataTwo"
                                      codeType="表达式"
                                      @thisBlur="thisBlurActive"
                                      @getSetEffectiveCode="getSetEffectiveCode"
                                      :isEditable="isEditable"
                                      :isStepListNull="isStepListNull"
                                      :isGetNull="isGetNull"
                                      :updateListNull="updateListNull" />
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
                <div class="editbottom">
                  <title-style titleName="逻辑符号" />
                  <bool-logic @getSlectLogic="getSlectLogic" />
                </div>
              </div>
            </template>
          </split-pane>
        </template>
        <template slot="paneR">
          <div class="rightbox">
            <title-style titleName="业务对象" />
            <business-object @getObj="getObj"
                             :info="scenarioInfo">
            </business-object>
          </div>
        </template>
      </split-pane>
    </div>
  </div>
</template>

<script>
import titleStyle from './components/title-style'
import basicSetup from './components/basic-betup'
import businessObject from './components/business-object'
import boolLogic from './components/bool-logic'
import tabsPanel from './components/tabs-panel'
import ruleTable from './components/rule-table'
import SplitPane from 'vue-splitpane'
export default {
  components: {
    titleStyle,
    basicSetup,
    businessObject,
    boolLogic,
    tabsPanel,
    ruleTable,
    SplitPane
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
      scenarioInfo: {},
      newBsKey: '', // 业务场景
      // 先决条件
      formDataOne: {
        tabs: [
          {
            label: '前提条件',
            name: 'Prerequisite'
          }, {
            label: '增强脚本',
            name: 'EnhanceScript'
          }],
        formula: {
          variable: {},
          func: {},
          value: ''
        },
        formtype: 'Prerequisite'
      },
      // 表达式
      formDataTwo: {
        tabs: [
          {
            label: '表达式',
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
      isEditable: false, // 是否编辑
      isStepListNull: false, // 步骤表是否为空标识
      blurFormFlag: null, // 用于标识那个编辑器获取到了焦点
      //   动态增减数据
      editableTabsValue: '1',
      editableTabs: [{
        title: 'case1',
        name: '1',
        content: []
      }],
      tabIndex: 1, // 表示标签页数目
      tableDataList: [], // 凭证表格数据
      activeRow: {}, // 所点行信息
      activeColumnsName: '', // 所点单元格属性名
      isGetNull: false, // 用于清空编辑器
      activeCells: {}, // 用于判断单元格是否被选中
      itfTableDataList: [], // 获取接口请求的凭证表格数据
      updateListNull: false, // 当重新获取表格数据后清空编辑器
      activeColumnsInfo: [], // 被选中单元格的值
    }
  },
  methods: {
    // 获取选中的凭证规则
    getActiveVoucher (...info) {
      //   console.log('单元格的值', info)
      //   console.log('点击单元格所在行的信息及列单元格属性名', info[0], info[1])
      //   console.log('单元格的值', info[2])
      this.activeRow = info[0];
      this.activeColumnsName = info[1];
      this.activeColumnsInfo = info[2];
      // 先清空tab
      this.editableTabs = [{
        title: 'case1',
        name: '1',
        content: [{}]
      }];
      this.tabIndex = 1;
      this.editableTabsValue = '1';
      // 规避为空情况
      if (info[2].length < 1) {
        this.isGetNull = this.isGetNull ? false : true;
        // console.log('设置为空', this.isGetNull)
        this.$set(this.formDataOne, 'value', '');
        this.$set(this.formDataTwo, 'value', '');
        return;
      } else {
        if (info[2].length > 1) {
          var list = [];
          // 动态更新tab页签数目
          for (var i = 0; i < info[2].length; i++) {
            var item = info[2][i];
            var tabItem = {
              title: 'case' + (i + 1),
              name: (i + 1) + '',
              content: [{
                value: item.value,
                listStr: item.listStr,
                prerequisite: item.prerequisite,
                prerequisiteArr: item.prerequisiteArr,
              }]
            }
            list.push(tabItem);
          }
          this.editableTabs = list;
          this.tabIndex = info[2].length;
          this.editableTabsValue = '1';
        } else {
          this.editableTabs[0].content.push(info[2][0]);
        }
      }
      //   console.log('tab数据', this.editableTabs, this.tabIndex, this.editableTabsValue)
      // 根据tab页签索引赋值
      var index = parseInt(this.editableTabsValue) - 1;
      // 获取并设置规则内容
      this.$set(this.formDataOne, 'value', info[2][index].prerequisiteArr ? JSON.parse(info[2][index].prerequisiteArr) : '');
      this.$set(this.formDataTwo, 'value', info[2][index].listStr ? JSON.parse(info[2][index].listStr) : '');
    },
    // 获取所选的业务场景
    getSelectScenario (info) {
      //   console.log('index获取业务场景', info)
      this.scenarioInfo = info;
      this.newBsKey = info.bizKey;
    },
    // 获取先决条件
    getSetCode (info) {
      //   console.log('获取先决条件', info);
      //   console.log('当前标签页列表及标签页', this.editableTabs, this.editableTabsValue);
      //   console.log('当前凭证表格数组', this.tableDataList);
      // 找到需要更新值的表达式数组索引项
      // 同时更新标签数组内容
      var list = JSON.parse(JSON.stringify(this.tableDataList))
      var index = null;
      for (var j = 0; j < this.editableTabs.length; j++) {
        var item = this.editableTabs[j];
        if (item.name == this.editableTabsValue) {
          index = j;
          item.content[0].prerequisite = this.splicingRule(info);
          item.content[0].prerequisiteArr = JSON.stringify(info);
        }
      }
      //   console.log('当前行及所在单元格及表达式数组索引', this.activeRow, this.activeColumnsName, index)
      //   if (info.length < 1) {
      //     return;
      //   }
      for (var i = 0; i < list.length; i++) {
        var item = list[i];
        for (var key in item) {
          // 找到所在行
          if (item[key] == this.activeRow.rowNames) {
            if (info.length < 1 && item[this.activeColumnsName].length < 1) {
              //   return;
            } else {
              // 找到所在单元格
              // 根据索引找到并设置单元格对应的表达式项
              item[this.activeColumnsName] = item[this.activeColumnsName].length < 1 ? [{}] : item[this.activeColumnsName];
              item[this.activeColumnsName][index].prerequisite = this.splicingRule(info);
              item[this.activeColumnsName][index].prerequisiteArr = JSON.stringify(info);
              if (!item[this.activeColumnsName][index].listStr) {
                item[this.activeColumnsName][index].value = '';
                item[this.activeColumnsName][index].listStr = '';
              }
            }


          }
        }
      }
      this.tableDataList = list;
      //   console.log('获取先决条件后最终数组', this.tableDataList)
      //   console.log('获取先决条件后最终tab数组', this.editableTabs)
    },
    // 获取表达式
    getSetEffectiveCode (info) {
        console.log('获取表达式', info)
      // 找到需要更新值的表达式数组索引项
      // 同时更新标签数组内容
      var list = JSON.parse(JSON.stringify(this.tableDataList))
      var index = null;
      for (var j = 0; j < this.editableTabs.length; j++) {
        var item = this.editableTabs[j];
        if (item.name == this.editableTabsValue) {
          index = j;
          item.content[0].value = this.splicingRule(info);
          item.content[0].listStr = JSON.stringify(info);
        }
      }
      //   console.log('当前行及所在单元格及表达式数组索引', this.activeRow, this.activeColumnsName, index)
      //   if (info.length < 1) {
      //     return;
      //   }
      for (var i = 0; i < list.length; i++) {
        var item = list[i];
        for (var key in item) {
          // 找到所在行
          if (item[key] == this.activeRow.rowNames) {
            if (info.length < 1 && item[this.activeColumnsName].length < 1) {
              //   return;
            } else {
              // 找到所在单元格
              // 根据索引找到并设置单元格对应的表达式项
              item[this.activeColumnsName] = item[this.activeColumnsName].length < 1 ? [{}] : item[this.activeColumnsName];
              item[this.activeColumnsName][index].value = this.splicingRule(info);
              item[this.activeColumnsName][index].listStr = JSON.stringify(info);
              if (!item[this.activeColumnsName][index].prerequisiteArr) {
                item[this.activeColumnsName][index].prerequisite = '';
                item[this.activeColumnsName][index].prerequisiteArr = '';
              }
            }

          }
        }
      }
      this.tableDataList = list;
      //   console.log('获取表达式后最终数组', this.tableDataList)
      //   console.log('获取表达式后最终tab数组', this.editableTabs)
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
    // 显示编辑
    stepEditable () {
      if (!this.activeCells.rowNames) {
        this.$message('请先选择要编辑的凭证规则。');
        // 禁止编辑
        this.isEditable = false;
        return;
      } else {
        this.isEditable = this.isEditable ? false : true;
      }
    },
    // 监听单元格是不是选中了
    getActiveCells (val) {
      // 如果过单元格未选中则不允许编辑
      // 同时给出提示
      this.activeCells = val;
      if (!this.activeCells.rowNames) {
        // this.$message('请先选择要编辑的凭证规则。');
        // 禁止编辑
        this.isEditable = false;
        // 先清空tab
        this.editableTabs = [{
          title: 'case1',
          name: '1',
          content: [{}]
        }];
        this.tabIndex = 1;
        this.editableTabsValue = '1';
      }
    },
    // 设置当前选中焦点值
    thisBlurActive (info) {
      //   console.log('当前获取焦点的是', info)
      switch (info) {
        case 'Prerequisite':
          this.blurFormFlag = 'formDataOne'
          break;
        case 'Effective-Inspection':
          this.blurFormFlag = 'formDataTwo'
          break;
      }
    },
    // 获取点击的业务对象
    getObj (info) {
      //   console.log('获取点击的业务对象', info, this.blurFormFlag)
      this.setRuleValue(info, 'variable')
    },
    // 获取选中逻辑符号
    getSlectLogic (info) {
      //   console.log('获取选中逻辑符号', info)
      this.setRuleValue(info)
    },
    // 根据当前焦点赋值
    setRuleValue (info, flag) {
      //   var activeCellsFlag = localStorage.getItem('activeCells');
      if (!this.activeCells.rowNames) {
        this.$message('请先选择要编辑的凭证规则。');
        return
      }
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
      }
    },
    // 获取接口请求到的列表数据
    getVoucherList (list) {
      //   console.log('获取接口请求到的列表数据', list)
      this.itfTableDataList = list;
      // 这个时候要清空编辑器
      // 因为还未选中
      this.updateListNull = this.updateListNull ? false : true;
      // 清空选中单元格状态
      this.activeRow = {};
      this.activeColumnsName = '';
      this.activeColumnsInfo = [];
    },
    // 获取表格数据
    getTableDataList (list) {
      this.tableDataList = list;
    },
    // 更新表格数据(用于新增表达式或者删除表达式)
    // targetName// 操作的tab索引
    updateTableDataList (flag, targetNameindex, tabList) {
      //  this.tableDataList // 当前表格数据
      //  this.activeRow = info[0];  // 选中行
      //  this.activeColumnsName = info[1]; // 选中单元格名
      //   console.log('新增表达式，更新表格', flag)
      if (flag == 'add') {
        this.setTableDataList(this.tableDataList, this.activeRow.rowNames, this.activeColumnsName, flag, targetNameindex, tabList)
      } else if ('remove') {
        this.setTableDataList(this.tableDataList, this.activeRow.rowNames, this.activeColumnsName, flag, targetNameindex, tabList)
      }
    },
    setTableDataList (list, rowName, columnsName, flag, targetNameindex, tabList) {
      //   console.log('当前最新tablist', tabList)
      var list = JSON.parse(JSON.stringify(list));
      for (var i = 0; i < list.length; i++) {
        var item = list[i];
        for (var key in item) {
          // 找到所在行
          if (item[key] == rowName) {
            // 然后根据标识新增或者删除
            if (flag == 'add') {
              if (tabList.length - 1 != item[columnsName].length) {
                for (var j = 0; j < tabList.length; j++) {
                  var code = {
                    value: '',
                    listStr: '',
                    prerequisite: '',
                    prerequisiteArr: '',
                  }
                  item[columnsName].push(code);
                }
              } else {
                var code = {
                  value: '',
                  listStr: '',
                  prerequisite: '',
                  prerequisiteArr: '',
                }
                item[columnsName].push(code);
              }

            } else {
              var index = targetNameindex;
              item[columnsName].splice(index, 1);
            }
          }
        }
      }
      this.tableDataList = list;
      //   console.log('最终表格数据', list)
      //   console.log('最终表格数据', this.tableDataList)
    },
    // 动态增减标签页新增按钮或删除按钮点击事件
    handleTabsEdit (targetName, action) {
      var targetNameIndex = null;
      if (action === 'add') {
        if (!this.activeCells.rowNames) {
          this.$message('请先选择要编辑的凭证规则。');
          return
        }
        // this.tabIndex = this.editableTabs.length;
        let newTabName = ++this.tabIndex + '';

        // console.log('单元格的值', this.activeColumnsInfo, newTabName, this.editableTabs)
        this.editableTabs.push({
          title: 'case' + this.tabIndex,
          name: newTabName,
          content: [{
            value: '',
            listStr: '',
            prerequisite: '',
            prerequisiteArr: '',
          }]
        });
        this.editableTabsValue = newTabName;
      }
      if (action === 'remove') {
        // console.log()
        if (this.editableTabs.length == 1) {
          this.$message('至少保留一个表达式。');
          return
        }
        for (var i = 0; i < this.editableTabs.length; i++) {
          var item = this.editableTabs[i];
          if (item.name == targetName) {
            targetNameIndex = i;
          }
        }
        let tabs = this.editableTabs;
        let activeName = this.editableTabsValue;
        if (activeName === targetName) {
          tabs.forEach((tab, index) => {
            if (tab.name === targetName) {
              let nextTab = tabs[index + 1] || tabs[index - 1];
              if (nextTab) {
                activeName = nextTab.name;
              }
            }
          });
        }

        // 选中标签
        this.editableTabsValue = activeName;
        this.editableTabs = tabs.filter(tab => tab.name !== targetName);
        // console.log('删除后的表达式列表', this.editableTabs, this.editableTabsValue)
      }
      // 更新数据表字段数据
      //   console.log('增减表达式的参数,操作的tab index值', targetNameIndex)
      this.updateTableDataList(action, targetNameIndex, this.editableTabs)
      // 根据标签数据设置值
      var index = parseInt(this.editableTabsValue) - 1;
      if (this.editableTabs[index].content.length < 1) {
        this.$set(this.formDataOne, 'value', '');
        this.$set(this.formDataTwo, 'value', '');
        return
      }
      // 获取并设置规则内容isGetNull
      if (!this.editableTabs[index].content[0].prerequisiteArr && !this.editableTabs[index].content[0].listStr) {
        this.isGetNull = this.isGetNull ? false : true;
      }
      this.$set(this.formDataOne, 'value', this.editableTabs[index].content[0].prerequisiteArr ? JSON.parse(this.editableTabs[index].content[0].prerequisiteArr) : '');
      this.$set(this.formDataTwo, 'value', this.editableTabs[index].content[0].listStr ? JSON.parse(this.editableTabs[index].content[0].listStr) : '');
    },
    // 动态增减标签页点击事件
    handleTabsClick (activeTab) {
      //   console.log('动态增减标签页点击事件', activeTab)
      //   console.log('标签数据对应的name', activeTab.name)
      //   console.log('标签数据对应的title', activeTab.label)
      //   console.log('标签数据对应的index', activeTab.index)
      //   this.tabIndex = activeTab.index;
      // 根据tab页签索引赋值
      var index = parseInt(activeTab.name) - 1;
      //   console.log('tab数据', index, this.editableTabs[index].content)
      if (this.editableTabs[index].content.length < 1) {
        this.$set(this.formDataOne, 'value', '');
        this.$set(this.formDataTwo, 'value', '');
        return
      }
      //   console.log('点击页签', this.editableTabs[index].content)
      // 获取并设置规则内容
      this.$set(this.formDataOne, 'value', this.editableTabs[index].content[0].prerequisiteArr ? JSON.parse(this.editableTabs[index].content[0].prerequisiteArr) : '');
      this.$set(this.formDataTwo, 'value', this.editableTabs[index].content[0].listStr ? JSON.parse(this.editableTabs[index].content[0].listStr) : '');
    }
  }
}
</script>

<style lang="scss" scoped>
.voucherBox {
  width: 100%;
  //   height: calc(100vh);
  height: 100%;
  //   border: 1px solid #ccc;
  background: white;
  .header {
    position: relative;
  }
  .content {
    display: flex;
    width: 100%;
    height: calc(100% - 42px); // 多2个指线
    border-radius: 4px;
    > .vue-splitter-container {
      width: 100%;
      .leftbox,
      .middlebox,
      .rightbox {
        height: 100%;
      }
      .leftbox {
      }
      .middlebox {
        .editop {
          height: 70%;
          .codeForm {
            display: flex;
            flex-direction: column;
            height: calc(100% - 41px);
            > div {
              flex: 1;
              // background: red;
              .codeBoxQ {
                height: calc(100% - 41px);
                // background: red;
                .codeBox {
                  height: 50%;
                }
              }
              /deep/ .el-tabs--card {
                //   height: 100%;
                .el-tabs__header {
                  margin: 0;
                }
                //   .el-tabs__content {
                //     height: calc(100% - 41px);
                //     .el-tab-pane {
                //       height: 100%;
                //       .codeBox {
                //         height: 50%;
                //       }
                //     }
                //   }
              }
            }
          }
        }
        .editbottom {
          height: 30%;
        }
      }
      .rightbox {
      }
    }
    // > div {
    //   width: 30%;
    //   height: 100%;
    //   border-left: 1px solid #ccc;

    //   &:first-child {
    //     width: 50%;
    //     border-left: 0;
    //   }
    //   &:last-child {
    //     width: 20%;
    //   }
    //   .editop {
    //     height: 70%;
    //     .codeForm {
    //       display: flex;
    //       flex-direction: column;
    //       height: calc(100% - 41px);
    //       > div {
    //         flex: 1;
    //         // background: red;
    //         .codeBoxQ {
    //           height: calc(100% - 41px);
    //           // background: red;
    //           .codeBox {
    //             height: 50%;
    //           }
    //         }
    //         /deep/ .el-tabs--card {
    //           //   height: 100%;
    //           .el-tabs__header {
    //             margin: 0;
    //           }
    //           //   .el-tabs__content {
    //           //     height: calc(100% - 41px);
    //           //     .el-tab-pane {
    //           //       height: 100%;
    //           //       .codeBox {
    //           //         height: 50%;
    //           //       }
    //           //     }
    //           //   }
    //         }
    //       }
    //     }
    //   }
    //   .editbottom {
    //     height: 30%;
    //   }
    // }
  }
}
</style>