<template>
  <div class="voucherBox">
    <!-- 顶部搜索区域 -->
    <div class="header">
      <div>
        <title-style titleName="集成策略配置" />
        <basicSetup @getVoucherParameter="getVoucherParameter" />
      </div>
    </div>
    <!-- 内容区 -->
    <div class="content">
      <split-pane :min-percent='20' :default-percent='80' split="vertical">
        <template slot="paneL">
          <split-pane split="vertical" :min-percent='20' :default-percent='30'>
            <!-- 业务对象明细字段 -->
            <template slot="paneL">
              <div class="leftbox">
                <title-style titleName="业务对象明细字段" />
                <rule-table @getActiveVoucher="getActiveVoucher" @updateTreeTable="getVoucherParameter" :tableDataList="businessObjectTreeTable" :firstBusinessObjectTreeTable="firstBusinessObjectTreeTable" :searchClick="searchClick" :searchInfo="voucherParameter" />
              </div>
            </template>
            <template slot="paneR">
              <div class="middlebox">
                <div class="editop">
                  <title-style titleName="表达式">
                    <i slot="btn">
                      <el-button type="primary" plain @click="stepEditable">{{isEditable?'显示':'编辑'}}</el-button>
                    </i>
                  </title-style>

                  <!-- 表达式规则编辑区域start -->
                  <div class="codeForm">
                    <div>
                      <el-tabs v-model="editableTabsValue" type="card" editable @edit="handleTabsEdit" @tab-click="handleTabsClick">
                        <el-tab-pane :key="item.name" v-for="(item) in editableTabs" :label="item.title" :name="item.name">
                        </el-tab-pane>
                      </el-tabs>
                      <div class="codeBoxQ">
                        <div class="codeBox">
                          <tabs-panel :form="formDataOne" codeType="先决条件" @thisBlur="thisBlurActive" @getSetCode="getSetCode" :isEditable="isEditable" :isStepListNull="isStepListNull" :isGetNull="isGetNull" :updateListNull="updateListNull" />
                        </div>
                        <div class="codeBox">
                          <tabs-panel :form="formDataTwo" codeType="表达式" @thisBlur="thisBlurActive" @getSetEffectiveCode="getSetEffectiveCode" :isEditable="isEditable" :isStepListNull="isStepListNull" :isGetNull="isGetNull" :updateListNull="updateListNull" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <!-- 表达式规则编辑区域end -->
                </div>
                <div class="editbottom">
                  <title-style titleName="逻辑符号" />
                  <bool-logic @getSlectLogic="getSlectLogic" />
                </div>
              </div>
            </template>
          </split-pane>
        </template>
        <!-- 集成接口明细字段 -->
        <template slot="paneR">
          <div class="rightbox">
            <title-style titleName="集成接口明细字段" />
            <business-object @getObj="getObj" :interfaceInfo="scenarioInfo">
            </business-object>
          </div>
        </template>
      </split-pane>
    </div>
  </div>
</template>

<script>
import titleStyle from './components/title-style';
import basicSetup from './components/basic-betup';
import businessObject from './components/business-object';
import boolLogic from './components/bool-logic';
import tabsPanel from './components/tabs-panel';
import ruleTable from './components/rule-table';
import SplitPane from 'vue-splitpane';
import indexApi from '@/api/platform/voucher/index.js';
import TreeUtils from '@/utils/tree';
import { showLoading, hideLoading } from '@/utils/loading';
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
  data() {
    return {
      scenarioInfo: {}, // 用来查询集成接口明细字段
      // 先决条件
      formDataOne: {
        tabs: [
          {
            label: '先决条件',
            name: 'Prerequisite'
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
      editableTabs: [
        {
          title: 'case1',
          name: '1',
          content: []
        }
      ],
      activeCells: null, // 用于判断单元格是否被选中
      voucherParameter: {}, // 查询参数
      firstBusinessObjectTreeTable: [], // 业务对象树数据
      businessObjectTreeTable: [], // 业务对象树数据
      searchClick: false,

      tabIndex: 1, // 表示标签页数目
      isGetNull: false, // 用于清空编辑器
      updateListNull: false // 当重新获取表格数据后清空编辑器
    };
  },
  methods: {
    // 获取选中的单元格信息规则
    getActiveVoucher(info) {
      console.log('获取选中的单元格信息规则', info);
      // this.matchingArry();
      // 保存选中信息
      this.activeCells = info;
      // 回显规则
      // 先清空tab
      this.editableTabs = [
        {
          title: 'case1',
          name: '1',
          content: [{}]
        }
      ];
      this.tabIndex = 1;
      this.editableTabsValue = '1';
      // 规避为空情况
      if (info.fieldConfPoList.length < 1) {
        this.isGetNull = this.isGetNull ? false : true;
        // console.log('设置为空', this.isGetNull)
        this.$set(this.formDataOne, 'value', '');
        this.$set(this.formDataTwo, 'value', '');
        return;
      } else {
        if (info.fieldConfPoList.length > 1) {
          var list = [];
          // 动态更新tab页签数目
          for (var i = 0; i < info.fieldConfPoList.length; i++) {
            var item = info.fieldConfPoList[i];
            var tabItem = {
              title: 'case' + (i + 1),
              name: i + 1 + '',
              content: [
                {
                  value: item.expression,
                  expressionArr: item.expressionArr,
                  prerequisite: item.prerequisite,
                  prerequisiteArr: item.prerequisiteArr
                }
              ]
            };
            list.push(tabItem);
          }
          this.editableTabs = list;
          this.tabIndex = info.fieldConfPoList.length;
          this.editableTabsValue = '1';
        } else {
          this.editableTabs[0].content.push(info.fieldConfPoList[0]);
        }
      }
      // 根据tab页签索引赋值
      var index = parseInt(this.editableTabsValue) - 1;
      // 获取并设置规则内容
      // 设置先决条件
      this.$set(
        this.formDataOne,
        'value',
        info.fieldConfPoList[index].prerequisiteArr
          ? JSON.parse(info.fieldConfPoList[index].prerequisiteArr)
          : ''
      );
      // 设置表达式
      this.$set(
        this.formDataTwo,
        'value',
        info.fieldConfPoList[index].expressionArr
          ? JSON.parse(info.fieldConfPoList[index].expressionArr)
          : ''
      );
    },
    // 获取先决条件
    getSetCode(info) {
      console.log('获取先决条件', info);
      //   console.log('当前标签页列表及标签页', this.editableTabs, this.editableTabsValue);
      // 找到需要更新值的表达式数组索引项
      // 同时更新标签数组内容
      if (JSON.stringify(this.activeCells) == '{}') {
        return
      }
      var list = [];
      var index = 0;
      for (var j = 0; j < this.editableTabs.length; j++) {
        var item = this.editableTabs[j];
        if (item.name == this.editableTabsValue) {
          index = j;
          item.content[0].prerequisite = this.splicingRule(info);
          item.content[0].prerequisiteArr = JSON.stringify(info);
          item.content[0]['step'] = j;
          list.push(item.content[0]);
        } else {
          item.content[0]['step'] = j;
          list.push(item.content[0]);
        }
      }

      console.log('获取当前所选最新先决条件索引', index,this.activeCells);

      // 更新给所选的单元格数据中
      this.activeCells.fieldConfPoList = list;
      this.activeCells.fieldPo['fieldConfPoList'] = list;
      // this.activeCells.fieldPo['fieldConfPoList'][index]['prerequisite'] = this.splicingRule(info);
      // this.activeCells.fieldPo['fieldConfPoList'][index]['prerequisiteArr'] = JSON.stringify(info);

      this.matchingArry(this.businessObjectTreeTable);
      console.log(
        '获取当前所选最新先解决条件',
        index,
        this.activeCells,
        this.businessObjectTreeTable
      );
    },
    // 获取表达式
    getSetEffectiveCode(info) {
      console.log('获取表达式', info);
      if (JSON.stringify(this.activeCells) == '{}') {
        return
      }
      // 找到需要更新值的表达式数组索引项
      // 同时更新标签数组内容
      var list = [];
      var index = 0;
      for (var j = 0; j < this.editableTabs.length; j++) {
        var item = this.editableTabs[j];
        if (item.name == this.editableTabsValue) {
          index = j;
          item.content[0].value = this.splicingRule(info);
          item.content[0].expression = this.splicingRule(info);
          item.content[0].expressionArr = JSON.stringify(info);
          item.content[0]['step'] = j;
          list.push(item.content[0]);
        } else {
          item.content[0]['step'] = j;
          list.push(item.content[0]);
        }
      }

      // 更新给所选的单元格数据中
      this.activeCells.fieldConfPoList = list;
      this.activeCells.fieldPo['fieldConfPoList'] = list;
      // this.activeCells.fieldPo['fieldConfPoList'][index]['expression'] = this.splicingRule(info);
      // this.activeCells.fieldPo['fieldConfPoList'][index]['expressionArr'] = JSON.stringify(info);

      console.log('获取当前所选最新表达式索引', index);
      this.matchingArry(this.businessObjectTreeTable);
      console.log('获取当前所选最新表达式', index, this.activeCells, this.businessObjectTreeTable);
    },
    // 递归匹配树形数组
    matchingArry(list) {
      for (var i = 0; i < list.length; i++) {
        var item = list[i];
        if (item.id == this.activeCells.id) {
          item = this.activeCells;
        }
        for (var j in item) {
          if (item['children'].length > 0) {
            this.setName(item['children']);
          }
        }
      }
    },
    // 拼接规则
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
    // 显示编辑
    stepEditable() {
      if (this.activeCells == null) {
        this.$message('请先选择要编辑的凭证规则。');
        // 禁止编辑
        this.isEditable = false;
        return;
      } else {
        this.isEditable = this.isEditable ? false : true;
      }
    },
    // 获取点击的业务对象
    getObj(info) {
      //   console.log('获取点击的业务对象', info, this.blurFormFlag)
      this.setRuleValue(info, 'variable');
    },
    // 获取选中逻辑符号
    getSlectLogic(info) {
      //   console.log('获取选中逻辑符号', info)
      this.setRuleValue(info);
    },
    // 设置当前选中焦点值
    thisBlurActive(info) {
      //   console.log('当前获取焦点的是', info)
      switch (info) {
        case 'Prerequisite':
          this.blurFormFlag = 'formDataOne';
          break;
        case 'Effective-Inspection':
          this.blurFormFlag = 'formDataTwo';
          break;
      }
    },
    // 根据当前焦点赋值
    setRuleValue(info, flag) {
      //   var activeCellsFlag = localStorage.getItem('activeCells');
      if (this.activeCells == null) {
        this.$message('请先选择要编辑的凭证规则。');
        return;
      }
      switch (this.blurFormFlag) {
        case 'formDataOne':
          var form = JSON.parse(JSON.stringify(this.formDataOne));
          if (flag == 'variable') {
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
    },
    // 开始搜获（获取选中的集成接口及集成策略）
    getVoucherParameter(info) {
      console.log('获取选中的集成接口及集成策略', info);
      this.activeCells = {};
      this.isGetNull = this.isGetNull ? false : true;
      this.isEditable = false;
      this.tabIndex = 1;
      this.editableTabsValue = '1';
      this.editableTabs = [
        {
          title: 'case1',
          name: '1',
          content: [{}]
        }
      ];
      // 设置先决条件
      this.$set(this.formDataOne, 'value', '');
      // 设置表达式
      this.$set(this.formDataTwo, 'value', '');

      this.voucherParameter = info;
      this.searchClick = this.searchClick ? false : true;
      // 接口请求获取业务对象树数据
      this.scenarioInfo = info.integrationInterface;
      this.updateTreeTable(info);
    },
    // 刷新树表
    updateTreeTable(info) {
      // 获取业务对象明细字段服务模拟数据
      // this.businessObjectTreeTable = require('./components/testTable').list;
      this.businessObjectTreeTable = [];
      this.firstBusinessObjectTreeTable = [];
      showLoading();
      indexApi
        .leftObjectFontServer({
          boCode: info.integrationStrategy.boCode,
          sttId: info.integrationStrategy.sttId
        })
        .then(res => {
          hideLoading();
          // console.log('获取业务对象明细字段服务', res);
          this.businessObjectTreeTable = TreeUtils.transformToArrayFormat(res.data, {
            idKey: 'id',
            pIdKey: 'key'
          });
          // if (this.firstBusinessObjectTreeTable.length == 0) {
          // this.firstBusinessObjectTreeTable = TreeUtils.transformToArrayFormat(res.data, {
          //   idKey: 'id',
          //   pIdKey: 'key'
          // });
          // this.setName(this.firstBusinessObjectTreeTable);
          // }

          // firstBusinessObjectTreeTable
          this.setName(this.businessObjectTreeTable);
          console.log('获取业务对象明细字段服务', res, this.businessObjectTreeTable);
        })
        .catch(req => {
          console.log('业务对象明细字段服务获取失败', req);
          hideLoading();
          this.$message.error('业务对象明细字段服务获取失败');
        });
    },
    // 递归改造树形数组
    setName(list) {
      for (var i = 0; i < list.length; i++) {
        var item = list[i];
        for (var j in item) {
          if (j == 'children') {
            if (item['children'].length > 0) {
              this.setName(item['children']);
            } else {
              if (!item['fieldConfPoList']) {
                if (item.fieldPo) {
                  if (item.fieldPo.fieldConfPoList.length == 0) {
                    item.fieldPo.fieldConfPoList = [
                      {
                        prerequisite: '',
                        prerequisiteArr: '[]',
                        expression: '',
                        expressionArr: '[]'
                      }
                    ];
                  }
                  item['fieldConfPoList'] = item.fieldPo.fieldConfPoList;
                } else {
                  item['fieldConfPoList'] = [];
                }
              }

              // 判断当前是否有表达式
              // 防止默认保存一个表达式空的情况下显示星星
              if (item.fieldPo) {
                if (item.fieldPo.fieldConfPoList.length == 1) {
                  var item2 = item.fieldPo.fieldConfPoList[0];
                  if (item2.prerequisite || item2.expression) {
                    item.confFlag = true;
                  } else {
                    item.confFlag = false;
                  }
                }
              } else {
                // 当fieldPo为空时处理
                item['fieldPo'] = {
                  fieldConfPoList: [
                    {
                      prerequisite: '',
                      prerequisiteArr: '[]',
                      expression: '',
                      expressionArr: '[]'
                    }
                  ]
                };
              }
            }
          }
        }
      }
    },
    // 动态增减标签页新增按钮或删除按钮点击事件
    handleTabsEdit(targetName, action) {
      var targetNameIndex = null;
      console.log('动态增减标签页新增按钮或删除按钮点击事件', targetName, action);
      if (action === 'add') {
        if (this.activeCells == null) {
          this.$message('请先选择要编辑的凭证规则。');
          return;
        }
        // this.tabIndex = this.editableTabs.length;
        let newTabName = ++this.tabIndex + '';
        this.editableTabs.push({
          title: 'case' + this.tabIndex,
          name: newTabName,
          content: [
            {
              value: '',
              expressionArr: '',
              prerequisite: '',
              prerequisiteArr: ''
            }
          ]
        });
        this.editableTabsValue = newTabName;
        // 数据重新排序
        for (var i = 0; i < this.editableTabs.length; i++) {
          var item = this.editableTabs[i];
          item['title'] = 'case' + (i + 1);
          item['name'] = '' + (i + 1);
        }
        // console.log('新增按钮或删除按钮点击事件', this.editableTabsValue, this.editableTabs);
      }
      if (action === 'remove') {
        // console.log()
        if (this.editableTabs.length == 1) {
          this.$message('至少保留一个表达式。');
          return;
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
        // 数据重新排序
        for (var i = 0; i < this.editableTabs.length; i++) {
          var item = this.editableTabs[i];
          item['title'] = 'case' + (i + 1);
          item['name'] = '' + (i + 1);
        }
        // console.log('删除后的表达式列表', this.editableTabs, this.editableTabsValue)
      }
      // 更新数据表字段数据
      //   console.log('增减表达式的参数,操作的tab index值', targetNameIndex)
      // 根据标签数据设置值
      var index = this.editableTabs.length - 1;
      // var index = parseInt(this.editableTabsValue) - 1;
      if (this.editableTabs[index].content.length < 1) {
        this.$set(this.formDataOne, 'value', '');
        this.$set(this.formDataTwo, 'value', '');
        return;
      }
      // 获取并设置规则内容isGetNull
      if (
        !this.editableTabs[index].content[0].prerequisiteArr &&
        !this.editableTabs[index].content[0].expressionArr
      ) {
        this.isGetNull = this.isGetNull ? false : true;
      }
      this.$set(
        this.formDataOne,
        'value',
        this.editableTabs[index].content[0].prerequisiteArr
          ? JSON.parse(this.editableTabs[index].content[0].prerequisiteArr)
          : ''
      );
      this.$set(
        this.formDataTwo,
        'value',
        this.editableTabs[index].content[0].expressionArr
          ? JSON.parse(this.editableTabs[index].content[0].expressionArr)
          : ''
      );
    },
    // 动态增减标签页点击事件
    handleTabsClick(activeTab) {
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
        return;
      }
      //   console.log('点击页签', this.editableTabs[index].content)
      // 获取并设置规则内容
      this.$set(
        this.formDataOne,
        'value',
        this.editableTabs[index].content[0].prerequisiteArr
          ? JSON.parse(this.editableTabs[index].content[0].prerequisiteArr)
          : ''
      );
      this.$set(
        this.formDataTwo,
        'value',
        this.editableTabs[index].content[0].expressionArr
          ? JSON.parse(this.editableTabs[index].content[0].expressionArr)
          : ''
      );
    }
  }
};
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