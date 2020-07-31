<template>
  <div class="ruleTableBox">
    <div class="btnlist">
      <el-button size="mini" plain type="primary" @click="addColumn"><i class="el-icon-circle-plus-outline"></i>增加列</el-button>
      <el-button size="mini" plain type="danger" @click="deletedColumn"><i class="el-icon-delete"></i>删除列</el-button>
      <el-button size="mini" plain type="primary" @click="copyColumn"><i class="el-icon-document-copy"></i>复制列</el-button>
      <el-button size="mini" plain type="success" @click="save"><i class="el-icon-folder-checked"></i>保存</el-button>
    </div>

    <div class="table">
      <!-- 第一列遮盖层-->
      <div class="rownamelist">
        <div class="rownamelistbox" v-if="tableDataList.length>0" ref="leftbox">
          <table>
            <thead>
              <tr>
                <!-- 列名 -->
                <th>凭证模板</th>
              </tr>
            </thead>
            <tr v-for="(item,index) in rowNameList" :key="index">
              <td>
                <!-- 行标题 -->
                <span :title="item">
                  {{item}}
                </span>
              </td>
            </tr>
          </table>
        </div>
      </div>

      <!-- 表头遮盖层 -->
      <div class="rownamelist rownamelistTop">
        <div class="rownamelistbox" ref="topbox">
          <table :width="tableWidth" v-if="tableDataList.length>0">
            <thead>
              <tr>
                <th>凭证模板</th>
                <th v-for="(item,index) in tableThList" :key="index" title="点击选中当前列" @click="activeColumn(item)">{{item.lebel}}</th>
              </tr>
            </thead>
          </table>
        </div>
      </div>
      
      <div class="thistabbox" ref="tableBox" @scroll="tableBoxScroll">
        <table :width="tableWidth" v-if="tableDataList.length>0">
          <thead>
            <tr>
              <!-- 列名 -->
              <th>凭证模板</th>
              <th v-for="(item,index) in tableThList" :key="index" title="点击选中当前列" @click="activeColumn(item)">{{item.lebel}}</th>
            </tr>
          </thead>

          <tr v-for="(item) in tableDataList" :key="item.rowNames">
            <td v-for="(val,key) in item" :key="key" :style="activeColumns.value==key?'background: #EAF5FF;color:#5cbae6;':''">
              <!-- 行标题 -->
              <span v-if="val == item.rowNames" :title="item.rowNames">
                {{val}}
              </span>
              <!-- 行数据 -->
              <span v-else @click="clickOnCell(item,key,val)" :style="(activeCells.rowNames==item.rowNames)&&(activeCells.key==key)?'background: #A9CCE3;color:white;':''">
                <i class="icon-voucher" v-if="(item[key].length == 1) && (item[key][0].value || item[key][0].prerequisite)"></i>
                <i class="icon-voucher" v-else-if="item[key].length>1"></i>
              </span>
            </td>
          </tr>
        </table>
      </div>
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
    tableDataListS: {
      type: Array,
      default: []
    },
    itfTableDataList: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      tableDataList: [],
      tableThList: [],
      activeColumns: {
        index: null,
        label: null,
        value: null
      },
      activeCells: {
        rowNames: null,
        key: null
      },
      tableWidth: 0, // 表格宽度
      getData: [], // 接口返回的数据
      rowNameList: [], // 列名数组
    };
  },
  watch: {
    tableDataList(val) {
      this.$emit('getTableDataList', val);
    },
    tableDataListS(val) {
      console.log('父组件表格数据变化了', val);
      if (this.tableDataList.length > 1) {
        // 更新表头
        var list = [];
        for (var key in val[0]) {
          if (key != 'rowNames') {
            var index = parseInt(key.slice(7));
            var item = {
              index: index,
              lebel: '行项目' + index,
              value: 'voucher' + index
            };
            list.push(item);
          }
        }
        this.tableThList = list;
        this.tableWidth = (this.tableThList.length + 1) * 80;
      }
      this.tableDataList = val;
    },
    activeCells(val) {
      // 监控单元格选中状态
      this.$emit('getActiveCells', val);
    },
    itfTableDataList(val) {
      // 获取接口数据
      this.getData = val;
      this.setGetData(val);

      // 清除选中单元格状态
      this.activeCells = {
        rowNames: null,
        key: null
      };
    }
  },
  created() {
    // this.tableDataList = [
    //   {
    //     rowNames: '公司代码',
    //     voucher1: [{
    //       value: 'BO_GL_TAX_HEAD_UPDATEBY="刘德华"',
    //       listStr: "[{\"id\":\"629690511367602176\",\"name\":\"更新人\",\"key\":\"UPDATEBY\",\"parentId\":\"62801871699443780\",\"type\":\"varchar\",\"attrType\":\"field\",\"tableName\":\"BO_GL_TAX_HEAD\",\"icon\":\"fa fa-varchar\",\"relation\":\"one2many\",\"isPk\":false},{\"id\":\"17\",\"key\":\"等于\",\"name\":\"=\",\"type\":\"btn\"},\"\\\"刘德华\\\"\"]",
    //       prerequisite: 'BO_GL_TAX_HEAD_ip=1000',
    //       prerequisiteArr: '[{"id":"636531040046809088","name":"IP地址","key":"ip","parentId":"636531040000671744","type":"varchar","attrType":"field","tableName":"BO_GL_TAX_HEAD","icon":"fa fa-varchar","relation":"one2many","isPk":false},{"id":"17","key":"等于","name":"=","type":"btn"},"100","0"]',
    //     }, {
    //       value: 'BO_GL_TAX_HEAD_UPDATEBY="张学友"',
    //       listStr: "[{\"id\":\"629690511367602176\",\"name\":\"更新人\",\"key\":\"UPDATEBY\",\"parentId\":\"62801871699443780\",\"type\":\"varchar\",\"attrType\":\"field\",\"tableName\":\"BO_GL_TAX_HEAD\",\"icon\":\"fa fa-varchar\",\"relation\":\"one2many\",\"isPk\":false},{\"id\":\"17\",\"key\":\"等于\",\"name\":\"=\",\"type\":\"btn\"},\"\\\"张学友\\\"\"]",
    //       prerequisite: 'BO_GL_TAX_HEAD_ip=1000',
    //       prerequisiteArr: '[{"id":"636531040046809088","name":"IP地址","key":"ip","parentId":"636531040000671744","type":"varchar","attrType":"field","tableName":"BO_GL_TAX_HEAD","icon":"fa fa-varchar","relation":"one2many","isPk":false},{"id":"17","key":"等于","name":"=","type":"btn"},"100","0"]',
    //     }],
    //     voucher2: [{
    //       value: '',
    //       listStr: '',
    //       prerequisite: '',
    //       prerequisiteArr: '',
    //     }],
    //     voucher3: [],
    //     voucher4: [{
    //       value: 'BO_GL_TAX_HEAD_UPDATEBY="刘德华"',
    //       listStr: "[{\"id\":\"629690511367602176\",\"name\":\"更新人\",\"key\":\"UPDATEBY\",\"parentId\":\"62801871699443780\",\"type\":\"varchar\",\"attrType\":\"field\",\"tableName\":\"BO_GL_TAX_HEAD\",\"icon\":\"fa fa-varchar\",\"relation\":\"one2many\",\"isPk\":false},{\"id\":\"17\",\"key\":\"等于\",\"name\":\"=\",\"type\":\"btn\"},\"\\\"刘德华\\\"\"]",
    //       prerequisite: 'BO_GL_TAX_HEAD_ip=1000',
    //       prerequisiteArr: '[{"id":"636531040046809088","name":"IP地址","key":"ip","parentId":"636531040000671744","type":"varchar","attrType":"field","tableName":"BO_GL_TAX_HEAD","icon":"fa fa-varchar","relation":"one2many","isPk":false},{"id":"17","key":"等于","name":"=","type":"btn"},"100","0"]',
    //     }],
    //   },
    //   {
    //     rowNames: '单据号码',
    //     voucher1: [{
    //       value: '',
    //       listStr: '',
    //       prerequisite: '',
    //       prerequisiteArr: '',
    //     }],
    //     voucher2: [],
    //     voucher3: [{
    //       value: '',
    //       listStr: '',
    //       prerequisite: '',
    //       prerequisiteArr: '',
    //     }],
    //     voucher4: [{
    //       value: '',
    //       listStr: '',
    //       prerequisite: '',
    //       prerequisiteArr: '',
    //     }],
    //   },
    //   {
    //     rowNames: '凭证类型',
    //     voucher1: [{
    //       value: '',
    //       listStr: '',
    //       prerequisite: '',
    //       prerequisiteArr: '',
    //     }],
    //     voucher2: [],
    //     voucher3: [],
    //     voucher4: [{
    //       value: '',
    //       listStr: '',
    //       prerequisite: '',
    //       prerequisiteArr: '',
    //     }],
    //   },
    //   {
    //     rowNames: '货币码',
    //     voucher1: [],
    //     voucher2: [{
    //       value: '',
    //       listStr: '',
    //       prerequisite: '',
    //       prerequisiteArr: '',
    //     }],
    //     voucher3: [{
    //       value: '',
    //       listStr: '',
    //       prerequisite: '',
    //       prerequisiteArr: '',
    //     }],
    //     voucher4: [],
    //   },
    //   {
    //     rowNames: '凭证中的凭证日期',
    //     voucher1: [],
    //     voucher2: [{
    //       value: '',
    //       listStr: '',
    //       prerequisite: '',
    //       prerequisiteArr: '',
    //     }],
    //     voucher3: [],
    //     voucher4: [{
    //       value: '',
    //       listStr: '',
    //       prerequisite: '',
    //       prerequisiteArr: '',
    //     }],
    //   },
    //   {
    //     rowNames: '凭证中的过账日期',
    //     voucher1: [{
    //       value: '',
    //       listStr: '',
    //       prerequisite: '',
    //       prerequisiteArr: '',
    //     }],
    //     voucher2: [],
    //     voucher3: [{
    //       value: '',
    //       listStr: '',
    //       prerequisite: '',
    //       prerequisiteArr: '',
    //     }],
    //     voucher4: [],
    //   }
    // ]
    // this.tableDataList = [
    //   {
    //     rowNames: '公司代码',
    //   },
    //   {
    //     rowNames: '单据号码',
    //   },
    //   {
    //     rowNames: '凭证类型',
    //   },
    //   {
    //     rowNames: '货币码',
    //   },
    //   {
    //     rowNames: '凭证中的凭证日期',
    //   },
    //   {
    //     rowNames: '凭证中的过账日期',
    //   }
    // ]
    // axios.get('http://172.18.3.81:3000/mock/35/ibps/certificationRulesService/findAllByRuleId', {
    //   ruleId: '8888'
    // }).then((res) => {
    //   console.log('YAPI中表格数据', res.data.data)
    //   this.getData = res.data.data;
    //   this.setGetData(res.data.data);
    // })
  },
  methods: {
    tableBoxScroll() {
      var dom = this.$refs.tableBox;
      // console.log('滚动元素', dom, '水平滚动距离：' + dom.scrollLeft, '垂直滚动距离：' + dom.scrollTop);
      this.$nextTick(() => {
        var leftbox = this.$refs.leftbox;
        var topbox = this.$refs.topbox;
        leftbox.style.top = -dom.scrollTop + 'px';
        // if(dom.scrollLeft)
        topbox.style.left = -dom.scrollLeft + 'px';
      });
    },
    // 改造接口请求数据
    setGetData(list) {
      var tablist = [];
      this.rowNameList = [];
      this.tableDataList = [];
      var accRuleflag = 0;
      if (list.length > 1) {
        this.setdata(list[0].accRulePosnrdPoList);
      }

      console.log('this.tableThList', this.tableThList);
      for (var i = 0; i < list.length; i++) {
        var item = list[i];
        var tablistItem = {};
        tablistItem.rowNames = item.fieldName;
        this.rowNameList.push(item.fieldDesc);

        if (item.accRulePosnrdPoList.length < 1) {
          for (var j = 0; j < this.tableThList.length; j++) {
            var item2 = {};
            var key = 'voucher' + (j + 1);
            tablistItem[key] = [];
            item2.accRuleConfPoList = [];
          }
        } else {
          for (var j = 0; j < this.tableThList.length; j++) {
            if (item.accRulePosnrdPoList[j]) {
              var item2 = item.accRulePosnrdPoList[j];
              var key = 'voucher' + (j + 1);
              if (item2.accRuleConfPoList.length < 1) {
                tablistItem[key] = [];
              } else {
                for (var k = 0; k < item2.accRuleConfPoList.length; k++) {
                  var item3 = item2.accRuleConfPoList[k];
                  item3.value = item3.expression;
                  item3.listStr = item3.expressionArr;
                }
              }
              tablistItem[key] = item2.accRuleConfPoList;
            } else {
              var item2 = {};
              var key = 'voucher' + (j + 1);
              item2.accRuleConfPoList = [];
              tablistItem[key] = [];
            }
          }

          // for (var j = 0; j < item.accRulePosnrdPoList.length; j++) {
          //   var item2 = item.accRulePosnrdPoList[j];
          //   var key = 'voucher' + (j + 1)
          //   if (item2.accRuleConfPoList.length < 1) {
          //     tablistItem[key] = [];
          //   } else {
          //     for (var k = 0; k < item2.accRuleConfPoList.length; k++) {
          //       var item3 = item2.accRuleConfPoList[k];
          //       item3.value = item3.expression;
          //       item3.listStr = item3.expressionArr;

          //     }
          //   }

          //   tablistItem[key] = item2.accRuleConfPoList;
          // }
        }

        tablist.push(tablistItem);
      }

      this.tableDataList = tablist;
      //   取消选中整列状态
      this.activeColumns = {
        index: null,
        label: null,
        value: null
      };
      console.log('改造后的数组', tablist);
      // console.log('改造后的数组', JSON.stringify(tablist));
    },
    // 生成表头数据
    setdata(obj) {
      this.tableThList = [];
      console.log('表头数据生成', obj);
      var index = 0;
      for (var i = 0; i < obj.length; i++) {
        index++;
        var item = {
          index: index,
          lebel: '行项目' + index,
          value: 'voucher' + index
        };
        this.tableThList.push(item);
      }
      this.tableWidth = (this.tableThList.length + 1) * 80;
    },
    // 点击凭证单元格
    clickOnCell(item, key, val) {
      // 例行清缓存
      localStorage.removeItem('codeEdit');
      // 保存选中信息
      this.activeCells = {
        rowNames: item.rowNames,
        key: key
      };
      //   取消选中整列状态
      this.activeColumns = {
        index: null,
        label: null,
        value: null
      };
      // console.log('点击凭证单元格');
      this.$emit('getActiveVoucher', item, key, val);
    },
    // 点击选中整列
    // 拿到列的索引值
    activeColumn(info) {
      console.log('点击列', info);
      // 清除选中单元格状态
      this.activeCells = {
        rowNames: null,
        key: null
      };
      // 保存选中列信息
      this.activeColumns = info;
    },
    // 增加列
    addColumn() {
      console.log('增加列');
      // debugger
      if (this.tableDataList.length < 1) {
        this.$message('当前凭证为空数据，无法新增列');
        return;
      }
      var list = JSON.parse(JSON.stringify(this.tableDataList));
      console.log('增加列前', JSON.parse(JSON.stringify(this.tableDataList)));
      var indexlist = [];
      for (var i = 0; i < list.length; i++) {
        var item = list[i];
        var flag = 0;
        for (var key in item) {
          if (key != 'rowNames') {
            flag++;
            var index = parseInt(key.slice(7));
            if (index != NaN) {
              indexlist.push(index);
            }
            var newKey = key.slice(0, 7);
            item[newKey] = [
              {
                value: '',
                listStr: '',
                prerequisite: '',
                prerequisiteArr: ''
              }
            ];
          }
        }
        if (flag > 0) {
          var max = Math.max(...indexlist) + 1;
          //   console.log('索引数组及最大值', indexlist, max, item)

          // 加上索引标识
          for (var key in item) {
            if (key != 'rowNames') {
              var index = parseInt(key.slice(7));
              if (!index) {
                //   console.log('无索引', key)
                var newKey = key + max;
                item[newKey] = [];
                // 删除属性
                delete item[key];
              }
            }
          }
        } else {
          // 如果一个凭证也没有
          for (var key in item) {
            item['voucher1'] = [];
          }
        }
      }
      // console.log('增加列后',list)
      // this.tableDataList = list;
      this.$emit('getTableDataList', list);
      // console.log('生成的数组', this.tableDataList)
    },
    // 复制列
    copyColumn() {
      this.handleClose('copy');
    },
    // 删除列（慎用）
    deletedColumn() {
      this.handleClose('delete');
    },
    // 删除列方法
    handleClose(flag) {
      if (flag == 'delete' && !this.activeColumns.value) {
        this.$message('请选择要删除的列');
        return;
      } else if (flag == 'copy' && !this.activeColumns.value) {
        this.$message('请选择要复制的列');
        return;
      }
      this.$confirm(flag == 'delete' ? '确认删除此列？' : '确定复制当前列？')
        .then(_ => {
          // 删除列数据
          var list = JSON.parse(JSON.stringify(this.tableDataList));
          var indexlist = [];
          for (var i = 0; i < list.length; i++) {
            var item = list[i];
            for (var key in item) {
              if (key != 'rowNames') {
                var index = parseInt(key.slice(7));
                if (index != NaN) {
                  indexlist.push(index);
                }
                if (key == this.activeColumns.value) {
                  if (flag == 'delete') {
                    // 删除列数据
                    delete item[key];
                  }
                }
              }
            }
          }
          var max = Math.max(...indexlist) + 1;
          for (var j = 0; j < list.length; j++) {
            var item = list[j];
            for (var key in item) {
              if (key != 'rowNames') {
                var index = parseInt(key.slice(7));
                if (key == this.activeColumns.value) {
                  if (flag == 'copy') {
                    // 复制列数据
                    // console.log('当前的索引,及最大索引',index,max,item[key])
                    // console.log('新索引','voucher'+max)
                    item['voucher' + max] = item[key];
                  }
                }
              }
            }
          }
          this.tableDataList = list;
          //   取消选中整列状态
          this.activeColumns = {
            index: null,
            label: null,
            value: null
          };
        })
        .catch(_ => {});
    },
    // 保存
    save() {
      if (this.tableDataList.length < 1) {
        this.$message('当前凭证为空数据，无法保存');
        return;
      }
      //   console.log('点击保存，最终要保存的表格', this.tableDataList);
      //   console.log('接口请求保存的参数', this.getData)
      var paramsList = JSON.parse(JSON.stringify(this.getData));
      // 改造请求参数
      for (var i = 0; i < paramsList.length; i++) {
        // 每一行
        var item = paramsList[i];
        item['accRulePosnrdPoList'] = [];
      }

      var list = JSON.parse(JSON.stringify(this.tableDataList));
      var flag = 0;
      for (var i = 0; i < list.length; i++) {
        // 每一行
        var item = list[i];
        for (var key in item) {
          if (key != 'rowNames') {
            flag++;
            item[key];
            for (var j = 0; j < item[key].length; j++) {
              var item2 = item[key][j];
              item2.expression = item2.value;
              item2.expressionArr = item2.listStr;
            }

            var newItem = {
              accRuleConfPoList: item[key]
            };
            paramsList[i].accRulePosnrdPoList.push(newItem);
          }
        }
      }

      // 如果有表达式才需要进一步改造
      if (flag > 0) {
        // 进一步改造参数
        for (var i = 0; i < paramsList.length; i++) {
          // 每一行
          var item = paramsList[i];
          for (var j = 0; j < item.accRulePosnrdPoList.length; j++) {
            // 每一列
            var item2 = item.accRulePosnrdPoList[j];
            item2.posnr = j + 1;
            for (var b = 0; b < item2.accRuleConfPoList.length; b++) {
              // 每一个表达式
              var item3 = item2.accRuleConfPoList[b];
              item3.step = b + 1;
            }
          }
        }
      }
      showLoading();
      indexApi
        .saveAccRuleField(paramsList)
        .then(res => {
          this.$message({
            message: '保存凭证规则成功。',
            type: 'success'
          });
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
          this.$message.error('保存凭证规则失败。');
        });
      //   console.log('改造后的请求参数', paramsList);
      //   console.log('改造后的请求参数', JSON.stringify(paramsList));
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
    height: calc(100% - 44px);
    margin: 0;
    margin-top: 5px;
    border: 2px dashed rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    position: relative;
    overflow: hidden;
    .rownamelist {
      height: 100%;
      position: absolute;
      width: 100px;
      left: 5px;
      top: 5px;
      z-index: 10;
      overflow: hidden;
      .rownamelistbox {
        height: 100%;
        position: absolute;
        left: 0;
        top: 0;
        table {
          table-layout: fixed;
          thead {
            tr {
              th {
                font-weight: normal;
                border-left: 1px solid #ccc;
                font-size: 12px;
                cursor: pointer;
                width: 100px !important;
                height: 36px;
                text-align: center;
                background: #5cbae6;
                color: white;
                font-weight: bold;
                padding: 5px 0;
                box-sizing: border-box;
                &:first-child {
                  border-left: 0;
                  width: 100px !important;
                }
              }
            }
          }
          tr {
            &:last-child {
              td {
                border-bottom: 0;
              }
            }
            td {
              width: 100px !important;
              height: 36px;
              line-height: 36px;
              font-size: 12px;
              background: white;
              padding: 0;
              border-bottom: 1px solid #ccc;
              box-sizing: border-box;
              span {
                display: block;
                width: 100px;
                height: 100%;
                padding-left: 5px;
                border-left: 1px solid #ccc;
                box-sizing: border-box;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
              }
              &:first-child {
                border-left: 0;
                font-weight: bold;
                color: black;
              }
            }
          }
        }
      }
    }
    .rownamelistTop{
      width: 100%;
      height: 36px;
    }

    .thistabbox {
      position: absolute;
      left: 5px;
      top: 5px;
      height: 98%;
      width: 99%;
      overflow: auto;
      table {
        border: 1px solid #ccc;
        table-layout: fixed;
        thead {
          tr {
            th {
              font-weight: normal;
              border-left: 1px solid #ccc;
              font-size: 12px;
              cursor: pointer;
              width: 100px !important;
              height: 36px;
              text-align: center;
              background: #5cbae6;
              color: white;
              font-weight: bold;
              padding: 5px 0;
              box-sizing: border-box;
              &:first-child {
                border-left: 0;
                width: 100px !important;
              }
            }
          }
        }
        > tr {
          // border-bottom: 1px solid #ccc;
          &:last-child {
            td {
              border-bottom: 0;
            }
          }
          td {
            width: 100px !important;
            height: 36px;
            line-height: 36px;
            border-left: 1px solid #ccc;
            font-size: 12px;
            color: rgb(134, 187, 243);
            background: white;
            padding: 0;
            overflow: hidden;
            cursor: pointer;
            border-bottom: 1px solid #ccc;
            box-sizing: border-box;
            span {
              display: block;
              width: 100%;
              height: 100%;
              i {
                display: inline-block;
                width: 100%;
                text-align: center;
                font-size: 18px;
              }
            }
            &:first-child {
              // position: fixed;
              // top: 0;
              // left: 0;
              border-left: 0;
              // background: #f0f9eb;
              font-weight: bold;
              color: black;
              cursor: auto;
              &:hover {
                background: white;
              }
            }
            &:hover {
              background: #d9ecff;
            }
          }
        }
      }
    }
  }
}
</style>