<template>
  <div class="userlist">
    <div class="select">
      <el-tag closable v-for="(item) in activeInvoiceList" :key="item.id" @close="deleteItem(item)">{{item.describe}}</el-tag>
    </div>
    <div class="search">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="场景编码">
          <el-input v-model="formInline.bocode" placeholder="请输入业务场景编码"></el-input>
        </el-form-item>
        <el-form-item label="场景描述">
          <el-input v-model="formInline.boDesc" placeholder="请输入场景描述"></el-input>
        </el-form-item>
        <el-form-item label="场景应用描述">
          <el-input v-model="formInline.bpmDesc" placeholder="请输入场景应用描述"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table ref="multipleTable" :data="tableData" @select="selectRow" @select-all="allSelectRow" @selection-change="handleSelectionChange" style="width: 100%">
      <el-table-column type="selection" width="55">
      </el-table-column>
      <el-table-column type="index" width="50">
      </el-table-column>
      <el-table-column property="bsCode" label="业务场景编码" />
      <el-table-column property="bsDescribe" label="业务场景描述" />
      <el-table-column property="bpmKey" label="业务场景应用ID" />
      <el-table-column property="describe" label="业务场景应用描述" />
    </el-table>
    <div class="pagination">
      <el-pagination @current-change="handleCurrentChangepage" :current-page="currentPage" layout="total, prev, pager, next, jumper" :total="tableTotal" :page-size="20">
      </el-pagination>
    </div>
    <div class="btnbox">
      <el-button @click="close">取消</el-button>
      <el-button type="primary" @click="getBusScenario">确认</el-button>
    </div>

  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
const { mapActions, mapState, mapGetters, mapMutations } = createNamespacedHelpers(
  'shared_operation/basiConfig'
);
export default {
  props: {
    bsaList: {
      type: Array,
      default: () => {
        return [];
      }
    },
    flag: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      tableData: [], // 表格数据
      multipleSelection: [], // 多选数据
      activeInvoiceList: [], // 已选数据
      currentPage: 1, // 当前页
      tableTotal: 0, // 总数
      formInline: {
        boDesc: '',
        bocode: '',
        bpmDesc: ''
      }
    };
  },
  watch: {
    flag(val) {
      // console.log('打开选择业务场景弹窗watch');
      this.currentPage = 1;
      this.setEdit();
    }
  },
  created() {
    // console.log('打开选择业务场景弹窗created');
    this.setEdit();
  },
  methods: {
    setEdit() {
      if (this.flag) {
        this.activeInvoiceList = [];
        // 是否编辑
        if (this.bsaList.length > 0) {
          // console.log('判断是否有编辑数据', this.flag, this.bsaList);
          this.bsaList.forEach(row => {
            var item = row;
            item['key'] = row.bsaKey;
            item['describe'] = row.bsaName;
            this.activeInvoiceList.push(item);
            // 新增的同时去重
            this.deDuplication();
          });
        } else {
          this.activeInvoiceList = [];
        }
        setTimeout(() => {
          this.onload();
        }, 10);
      }
    },
    ...mapActions(['queryAllBo']),
    onload() {
      this.tableData = [];
      this.multipleSelection = [];
      // this.activeInvoiceList = [];
      this.queryAllBo({
        parameters: [
          { key: 'Q^bs_describe_^SL', value: this.formInline.boDesc },
          { key: 'Q^BS_CODE_^SL', value: this.formInline.bocode },
          { key: 'Q^describe_^SL', value: this.formInline.bpmDesc }
        ],
        requestPage: { pageNo: this.currentPage, limit: 20, totalCount: 53 },
        sorts: []
      }).then(res => {
        // console.log('业务场景列表', res);
        this.tableData = res.dataResult;
        this.currentPage = res.pageResult.page;
        this.tableTotal = res.pageResult.totalCount;
        this.autoCheckList();
      });
    },
    // 自动选中
    autoCheckList() {
      this.$refs.multipleTable.clearSelection();
      this.$nextTick(() => {
        // console.log('设置选中', this.activeInvoiceList);
        this.activeInvoiceList.forEach(row => {
          this.tableData.forEach(item => {
            if (item.id == row.id || item.key == row.key) {
              this.$refs.multipleTable.toggleRowSelection(item);
            }
          });
        });
      });
    },
    // 去重
    deDuplication() {
      var arry = this.activeInvoiceList.reduce(function(prev, element) {
        if (!prev.find(el => el.id == element.id)) {
          prev.push(element);
        }
        return prev;
      }, []);
      this.activeInvoiceList = arry;
    },
    // 删除
    deleteItem(row) {
      // var b = JSON.parse(JSON.stringify(this.activeInvoiceList));
      // console.log('删除某一项', row, b);
      let arr = JSON.parse(JSON.stringify(this.activeInvoiceList));
      // console.log(arr.findIndex(item => item.id === row.id));
      if (arr.findIndex(item => item.id === row.id) != -1) {
        arr.splice(
          arr.findIndex(item => item.id === row.id),
          1
        );
      } else {
        arr.splice(
          arr.findIndex(item => item.key === row.key),
          1
        );
      }

      this.activeInvoiceList = arr;
      this.autoCheckList();
    },
    // 当前勾选
    handleSelectionChange(val) {
      console.log('当前勾选', val);
      this.multipleSelection = val;
    },
    // 勾选某一项
    selectRow(selection, row) {
      console.log('勾选某一项', selection, this.multipleSelection);
      if (selection.length > this.multipleSelection.length) {
        this.activeInvoiceList.push(row);
        // 新增的同时去重
        this.deDuplication();
      } else {
        // 删除
        this.deleteItem(row);
      }
    },
    // 点击全选
    allSelectRow(selection) {
      if (selection.length > 0) {
        selection.forEach((val, index, arr) => {
          this.activeInvoiceList.push(val);
        });
        // 同时去重
        this.deDuplication();
      } else {
        this.tableData.forEach((val, index, arr) => {
          // 删除
          this.deleteItem(val);
        });
      }
    },
    // 搜索onSubmit
    onSubmit() {
      this.currentPage = 1;
      this.onload();
    },
    // 翻页
    handleCurrentChangepage(val) {
      console.log(`当前页: ${val}`);
      this.currentPage = val;
      this.onload();
    },
    close() {
      this.$emit('userclose');
    },
    getBusScenario() {
      if (this.activeInvoiceList.length < 1) {
        this.$message.error('未选择业务场景');
        return;
      }
      this.$emit('getBusScenario', this.activeInvoiceList);
    }
  }
};
</script>

<style lang="scss" scoped>
.userlist {
  // height: 440px;
  .select {
    height: 80px;
    padding: 5px;
    border: 1px solid #ccc;
    overflow: auto;
    box-sizing: border-box;
    margin-bottom: 10px;
  }
  .search {
    height: 40px;
    /deep/ .el-input--small {
      width: 160px !important;
    }
  }
  /deep/ .el-table {
    height: 300px;
    overflow: auto;
  }
  .pagination {
    height: 50px;
    text-align: center;
    padding-top: 10px;
    box-sizing: border-box;
  }
  .btnbox {
    height: 50px;
    line-height: 50px;
    text-align: center;
  }
}
</style>