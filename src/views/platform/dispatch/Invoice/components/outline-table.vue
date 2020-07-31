<template>
  <full-screen-container class="outline-table" :is-hidden-full-screen="true">
    <container-btus v-if="btns.length > 0" slot="screen-header" :data="btns" @click="onButtonClick" />
    <div class="outTabbox" slot="screen-content">
      <!--   <div class="search">
        <el-input placeholder="请输入内容" v-model="searchTxt" class="input-with-select" size="mini">
          <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>
      </div> -->
      <div class="tabBox">
        <el-table height="100%" ref="multipleTable" class="outlineTableClass" :data="tableData" tooltip-effect="dark" highlight-current-row header-cell-class-name="headerRowStyle" style="width: 100%;" @selection-change="handleSelectionChange" :row-class-name="tableRowClassName" @row-click="onRowClick" v-loading="loading">
          <el-table-column type="selection" width="25" />
          <el-table-column v-for="(item, key) in tableTitle" :key="key" :min-width="item.style.width" :align="item.style['align']" :prop="item.fieldName" :label="item.showName">
            <template slot="header" slot-scope="scope">
              <span :style="item.style.style">{{ scope.column.label }}</span>
            </template>

            <template slot-scope="scope">
              <div :style="item.style.style" v-html="item.style.tppl ? renderRow(item.style.tppl, scope, item.fieldName): scope.row[item.fieldName]" />
            </template>

          </el-table-column>
        </el-table>
      </div>

    </div>

    <sany-message v-if="messageData" slot="screen-footer" :data="messageData" />
  </full-screen-container>
</template>

<script>
import FullScreenContainer from './full-screen-container';
import ContainerBtus from './container-btns';
import SanyMessage from './message';
import utils from '@/utils/util';
import { renderTppl } from '../utils/tppl';
import { createNamespacedHelpers } from 'vuex';
import _ from 'lodash';
const { mapActions, mapState, mapGetters } = createNamespacedHelpers('ibps/compositeMultiline');
// 引入el-table无限滚动插件
import elTableInfiniteScroll from 'el-table-infinite-scroll';

export default {
  name: 'outline-table',
  directives: {
    'el-table-infinite-scroll': elTableInfiniteScroll
  },
  components: {
    FullScreenContainer,
    ContainerBtus,
    SanyMessage
  },
  inject: ['multiline', 'payable', 'stepContainer'],

  data() {
    return {
      searchTxt: '',
      multipleSelection: [],
      loading: false,
      activeIndex: 0, // 选中索引（仅用于修改）,
      businessData: [],
      tableInfo: Object.freeze({
        table_title_define: [],
        table_btns: [],
        table_data: [],
        message_data: {}
      })
    };
  },
  computed: {
    //  ...mapState(['isRefresh']),
    tableTitle() {
      return this.tableInfo.table_title_define.map(item => {
        item.style = item.style ? JSON.parse(item.style) : {};
        return item;
      });
    },
    tableData() {
      // var list = require('./test.json').data;
      // return list;
      return this.tableInfo.table_data;
    },
    btns() {
      return this.tableInfo.table_btns;
    },
    messageData() {
      return this.tableInfo.message_data;
    },
    businessEventId() {
      return this.stepVal.btKey;
    },
    stepVal() {
      return this.stepContainer.stepVal;
    }
  },
  watch: {
    /*  isRefresh: {
      handler(val) {
        this.LoadTableDefineAndData(0);
      },
      immediate: true
    } */
  },
  created() {
    this.LoadTableDefineAndData(0);
  },
  methods: {
    ...mapActions(['getOutlineTableDefine', 'getBusinessTypeList']),

    // 加载下一页数据
    loadData() {
      console.log('加载下一页数据');
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
      }, 1000);
    },
    LoadTableDefineAndData(index = 0, isEmitSelectRowEvent = true) {
      const {
        multiline: { stepVal }
      } = this;
      //console.log('startLoadOutlineTable....', stepVal);
      return this.getOutlineTableDefine(stepVal)
        .then(tableInfo => {
          this.tableInfo = Object.freeze(tableInfo);
          return tableInfo;
        })
        .then(tableInfo => {
          return new Promise((resolve, reject) => {
            this.$nextTick(() => {
              if (this.tableData.length > 0 && index >= -1) {
                this.activeIndex = index == -1 ? this.tableData.length - 1 : index;
                this.setCurrent(this.tableData[this.activeIndex], isEmitSelectRowEvent);
              }
              resolve(tableInfo);
            });
          });
        })
        .then(() => {
          if (this.tableData.length <= 0) {
            this.onButtonClick('businessTypeDataCreate', { buttonName: '业务类型' });
          }
        });
    },

    refreshLoadTbaleDataAndActiveIndex(isEmitSelectRowEvent = true) {
      this.LoadTableDefineAndData(this.activeIndex, isEmitSelectRowEvent);
    },

    renderRow(tpl, scope, fieldName) {
      scope.value = scope.row[fieldName];
      return renderTppl(tpl, scope);
    },
    //把每一行的索引放进row
    tableRowClassName({ row, rowIndex }) {
      row.index = rowIndex;
    },
    /**
     * 当选中某行
     */
    setCurrent(row, isEmitEvent = true) {
      console.log('选中某行', row);
      this.$refs.multipleTable.setCurrentRow(row);
      isEmitEvent && this.selectBusinessTypeData(row);
    },
    /**
     * 当点击行的时候
     */
    onRowClick(row, column, event) {
      console.log('点击行', row, column, event);
      console.log('获取点击行的索引', row.index);
      this.activeIndex = row.index;
      this.selectBusinessTypeData(row);
    },
    /**
     * 由于异步的不确定性所以摘要表自己独立查询，这个属于冗余查询，后期的会考虑优化
     */
    getblist() {
      if (this.businessData.length <= 0) {
        const { businessEventId = null } = this;
        return this.getBusinessTypeList({ businessEventId }).then(data => {
          this.businessData = data;
          return this.businessData;
        });
      }
      return Promise.resolve(this.businessData);
    },

    selectBusinessTypeData(row) {
      this.getblist().then(data => {
        let { ywlxId, id } = row;
        const businessData = data;
        let btypeList = _.values(businessData).reduce((total, item) => {
          return total.concat(item);
        }, []);
        let currentBtype = btypeList.find(item => {
          return item.id == ywlxId;
        });
        console.log('currentBtype', currentBtype);
        this.payable.onActionEvent(
          'selectBusinessType',
          { btype: currentBtype, dataId: id, buttonName: currentBtype.showName },
          this
        );
      });
    },

    handleSelectionChange(val) {
      this.multipleSelection = val;
      //this.onButtonClick('handleSelectionChange', this.multipleSelection);
    },

    onButtonClick(action, btn, ...args) {
      this.payable.onActionEvent.apply(this.payable, [action, btn, this, ...args]);
    }
  }
};
</script>

<style lang="scss" scoped>
.outTabbox {
  height: 100%;
  .search {
    height: 40px;
    padding: 5px;
    box-sizing: border-box;
  }
  .tabBox {
    height: calc(100% - 40px);
  }
}
/deep/ .el-table th.gutter {
  display: table-cell !important;
}
/deep/ .el-table {
  .cell {
    padding: 0 5px;
  }
}

/deep/ .headerRowStyle {
  background: #f7f7f7 !important;
  color: black;
  font-family: '黑体';
  font-weight: 700;
  height: 45px;
  border-bottom: 1px solid #d4d4de !important;
}
/deep/ .el-table__body tr.current-row > td {
  background-color: #e5f5ff;
  color: #000;
}
</style>
