<template>
  <div class="ruleTableBox">
    <div class="btnlist">
      <el-button size="mini" plain type="success" @click="save"><i class="el-icon-folder-checked"></i>保存</el-button>
    </div>
    <!-- 树形表格数据 -->
    <div class="table">
      <el-table height="100%" @cell-click="clickOnCell" :data="tableData" style="width: 100%;margin-bottom: 20px;" row-key="id" border default-expand-all :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
        <el-table-column prop="fieldDesc" label="业务场景业务对象树">
          <template slot-scope="scope">
            <span class="itemRule">
              {{scope.row.fieldDesc}}
              <i v-if="scope.row.confFlag" class="icon el-icon-star-on"></i>
            </span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import indexApi from '@/api/platform/voucher/index.js';
import { showLoading, hideLoading } from '@/utils/loading';
export default {
  name: 'rule-table',
  props: {
    tableDataList: {
      type: Array,
      default: []
    },
    firstBusinessObjectTreeTable: {
      type: Array,
      default: []
    },
    searchClick: {
      type: Boolean,
      default: false
    },
    searchInfo: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  watch: {
    searchClick: {
      handler(val) {
        // console.log('点击搜索', val);
        this.activeInfo = null;
      },
      immediate: true
    },
    tableDataList: {
      handler(val, oldval) {
        // console.log('接受表格数据变化', val);
        this.tableData = val;
        // this.oldvalTableDataFirst = this.firstBusinessObjectTreeTable;
      },
      deep: true
    }
  },
  data() {
    return {
      tableData: [],
      oldvalTableDataFirst: [],
      newTabelData: [],
      paramsList: [],
      oldvalParamsList: [],
      newParamsList: []
    };
  },
  created() {
    // this.tableData = require('./testTable.json').list;
    // console.log('表格模拟数据', require('./testTable.json').list);
  },
  methods: {
    // 点击策略单元格
    clickOnCell(row, column, cell, event) {
      // console.log('点击策略单元格', row, column, cell, event);
      if (row['fieldConfPoList']) {
        this.$emit('getActiveVoucher', row);
      }
    },
    // 将新数据和旧数据对比，从而找出已经修改过的节点
    // 用于过滤出修改过的节点，没修改的不要
    filterData() {
      // this.tableData, this.oldvalTableDataFirst
      var arry = [];
      console.log(
        '接受表格数据',
        // '新数据：',
        // this.paramsList,
        '老数据：',
        this.oldvalParamsList
      );
      this.oldvalParamsList.forEach(item => {
        var index = 0;
        if (item.fieldConfPoList.length > 0) {
          item.fieldConfPoList.forEach(item2 => {
            if (item2.prerequisite || item2.expression) {
              index++;
            }
          });
          if (index > 0) {
            arry.push(item);
          }
        }
      });
      if (arry.length == 0) {
        arry.push(this.oldvalParamsList[0]);
      }

      return arry;
      // this.paramsList.forEach(item => {
      //   this.oldvalParamsList.forEach(item2 => {
      //     if (item.id == item2.id) {
      //       // 首先新数据里面规则长度是否一致
      //       if (item.fieldConfPoList.length == item2.fieldConfPoList.length) {
      //         // 一致的话则判断对应的规则是否有变化
      //         // 以及只要有规则就保存
      //         item.fieldConfPoList.forEach(item3 => {
      //           item2.fieldConfPoList.forEach(item4 => {
      //             if (
      //               item3.prerequisite != item4.prerequisite ||
      //               item3.expression != item4.expression
      //             ) {
      //               // 不一致说明有变化，以当前最新数组为准
      //               this.newParamsList.push(item2);
      //             }
      //           });
      //         });
      //       } else {
      //         // 不一致说明有变化，以当前最新数组为准
      //         this.newParamsList.push(item2);
      //       }
      //     }
      //   });
      // });
      // console.log('最终保存数组',this.newParamsList)
    },
    // 保存
    save() {
      console.log('保存功能', this.tableData, this.searchInfo);
      this.paramsList = [];
      this.oldvalParamsList = [];
      // var list = JSON.parse(JSON.stringify(this.oldvalTableDataFirst));
      var list2 = JSON.parse(JSON.stringify(this.tableData));
      // this.setName(list, 'new');
      this.setName(list2, 'old');

      this.newParamsList = this.filterData();

      console.log('最终保存数组测试发版请求参数', this.newParamsList);
      setTimeout(() => {
        showLoading();
        indexApi
          .sttFieldSave(this.newParamsList)
          .then(res => {
            hideLoading();
            this.$emit('updateTreeTable', this.searchInfo);
            if (res.state == 200) {
              this.$message({
                message: '保存成功',
                type: 'success'
              });
            } else {
              this.$message.error('保存失败'+res.cause?res.cause:'');
            }
          })
          .catch(req => {
            hideLoading();
            this.$message.error('保存失败');
          });
      }, 10);
    },
    // 递归改造树形数组
    setName(list, flag) {
      // console.log('递归数组', list);
      for (var i = 0; i < list.length; i++) {
        var item = list[i];
        item['sttCode'] = this.searchInfo.integrationStrategy.sttCode;
        item['sttId'] = this.searchInfo.integrationStrategy.sttId;
        // item['expression'] = item.value;
        for (var j in item) {
          if (j == 'children') {
            if (item['children'].length > 0) {
              this.setName(item['children'], flag);
            } else {
              // console.log('递归数组每一项', item, item.fieldConfPoList);
              if (item['fieldConfPoList'].length > 0) {
                for (var c = 0; c < item['fieldConfPoList'].length; c++) {
                  item['fieldConfPoList'][c]['expression'] = item.fieldConfPoList[c].expression
                    ? item.fieldConfPoList[c].expression
                    : item.fieldConfPoList[c].value;
                }
              }
              delete item.fieldPo;
              if (flag == 'new') {
                this.paramsList.push(item);
              } else {
                this.oldvalParamsList.push(item);
              }
            }
          }
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.ruleTableBox {
  padding: 0 10px;
  box-sizing: border-box;
  height: calc(100% - 41px);
  position: relative;
  .btnlist {
    padding-top: 10px;
    /deep/ .el-button {
      padding: 5px 0;
      width: 70px;
      i {
        margin-right: 5px;
      }
    }
  }
  .table {
    height: calc(100% - 50px);
    margin: 0;
    margin-top: 5px;
    border: 2px dashed rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    position: relative;
    overflow: hidden;
    box-sizing: border-box;
    /deep/ .el-table {
      .itemRule {
        display: inline-block;
        width: 80%;
        height: 100%;
        position: relative;
        .icon {
          position: absolute;
          top: 0;
          right: 0;
          color: #409eff;
          font-size: 18px;
          font-weight: bold;
        }
      }
    }
  }
}
</style>