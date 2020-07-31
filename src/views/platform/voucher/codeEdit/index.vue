<template>
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
</template>

<script>
import tabsPanel from '../components/tabs-panel';
export default {
  components: {
    tabsPanel
  },
  props: {
    isEditable: {
      type: Boolean,
      default: false
    },
    updateListNull: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isStepListNull: false, // 步骤表是否为空标识
      //   动态增减数据
      editableTabsValue: '1',
      editableTabs: [
        {
          title: 'case1',
          name: '1',
          content: []
        }
      ],
      // 先决条件
      formDataOne: {
        tabs: [
          {
            label: '前提条件',
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
      }
    };
  },
  methods: {
    // 动态增减标签页新增按钮或删除按钮点击事件
    handleTabsEdit(targetName, action) {
      var targetNameIndex = null;
      if (action === 'add') {
        if (!this.activeCells.rowNames) {
          this.$message('请先选择要编辑的凭证规则。');
          return;
        }
        if (this.activeColumnsInfo.length < 1) {
        }
        let newTabName = ++this.tabIndex + '';

        // console.log('单元格的值', this.activeColumnsInfo, newTabName, this.editableTabs)
        this.editableTabs.push({
          title: 'case' + this.tabIndex,
          name: newTabName,
          content: [
            {
              value: '',
              listStr: '',
              prerequisite: '',
              prerequisiteArr: ''
            }
          ]
        });
        this.editableTabsValue = newTabName;
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
        // console.log('删除后的表达式列表', this.editableTabs, this.editableTabsValue)
      }
      // 更新数据表字段数据
      //   console.log('增减表达式的参数,操作的tab index值', targetNameIndex)
      this.updateTableDataList(action, targetNameIndex, this.editableTabs);
      // 根据标签数据设置值
      var index = parseInt(this.editableTabsValue) - 1;
      if (this.editableTabs[index].content.length < 1) {
        this.$set(this.formDataOne, 'value', '');
        this.$set(this.formDataTwo, 'value', '');
        return;
      }
      // 获取并设置规则内容isGetNull
      if (
        !this.editableTabs[index].content[0].prerequisiteArr &&
        !this.editableTabs[index].content[0].listStr
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
        this.editableTabs[index].content[0].listStr
          ? JSON.parse(this.editableTabs[index].content[0].listStr)
          : ''
      );
    },
    // 更新表格数据(用于新增表达式或者删除表达式)
    // targetName// 操作的tab索引
    updateTableDataList(flag, targetNameindex, tabList) {
      //  this.tableDataList // 当前表格数据
      //  this.activeRow = info[0];  // 选中行
      //  this.activeColumnsName = info[1]; // 选中单元格名
      //   console.log('新增表达式，更新表格', flag)
      if (flag == 'add') {
        this.setTableDataList(
          this.tableDataList,
          this.activeRow.rowNames,
          this.activeColumnsName,
          flag,
          targetNameindex,
          tabList
        );
      } else if ('remove') {
        this.setTableDataList(
          this.tableDataList,
          this.activeRow.rowNames,
          this.activeColumnsName,
          flag,
          targetNameindex,
          tabList
        );
      }
    },
    setTableDataList(list, rowName, columnsName, flag, targetNameindex, tabList) {
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
                    prerequisiteArr: ''
                  };
                  item[columnsName].push(code);
                }
              } else {
                var code = {
                  value: '',
                  listStr: '',
                  prerequisite: '',
                  prerequisiteArr: ''
                };
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
    }
  }
};
</script>

<style lang="scss" scoped>
</style>