<template>
  <div class="userlist">
    <div class="select">
      <el-tag closable v-for="(item) in activeInvoiceList" :key="item.id" @close="deleteItem(item)">{{item.name}}</el-tag>
    </div>
    <div class="search">
      <!-- <el-input v-model="formInline.user" placeholder="姓名"></el-input>
      <el-button type="primary" @click="onSubmit">查询</el-button> -->
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="姓名">
          <el-input v-model="formInline.user" placeholder="姓名"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table ref="multipleTable" :data="tableData" @select="selectRow" @select-all="allSelectRow" @selection-change="handleSelectionChange" style="width: 100%">
      <el-table-column type="selection" width="55">
      </el-table-column>
      <el-table-column property="name" label="姓名" width="120">
      </el-table-column>
      <el-table-column property="butxt" label="公司名称">
      </el-table-column>
      <el-table-column property="userno" label="工号">
      </el-table-column>
      <el-table-column property="mobile" label="联系方式">
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination @current-change="handleCurrentChangepage" :current-page="currentPage" layout="total, prev, pager, next, jumper" :total="tableTotal">
      </el-pagination>
    </div>
    <div class="btnbox">
      <el-button @click="close">取消</el-button>
      <el-button type="primary" @click="getUser">确认</el-button>
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
    innerVisible: {
      type: Boolean,
      default: false
    },
    bsaList: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  watch: {
    innerVisible: {
      handler(val) {
        if (val) {
          this.currentPage = 1;
          this.setEdit();
        }
      },
      immediate: true
    }
  },
  data() {
    return {
      activeInvoiceList: [], // 已选数据
      tableData: [], // 表格数据
      multipleSelection: [], // 多选数据
      currentPage: 1, // 当前页
      tableTotal: 0, // 总数
      formInline: {
        user: ''
      }
    };
  },
  created() {
    this.setEdit();
  },
  methods: {
    setEdit() {
      if (this.innerVisible) {
        this.activeInvoiceList = [];
        // 是否编辑
        if (this.bsaList.length > 0) {
          // console.log('判断是否有编辑数据', this.flag, this.bsaList);
          this.bsaList.forEach(row => {
            var item = row;
            item['id'] = row.userId;
            item['name'] = row.userName;
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
    ...mapActions(['queryUserList']),
    onload() {
      this.tableData = [];
      this.multipleSelection = [];
      this.queryUserList({
        parameters: [{ key: 'Q^NAME_^SL', value: this.formInline.user }],
        requestPage: { pageNo: this.currentPage, limit: 20, totalCount: 71 },
        sorts: []
      }).then(res => {
        console.log('员工表', res);
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
            if (item.id == row.id || item.name == row.name) {
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
      let arr = this.activeInvoiceList;
      arr.splice(
        arr.findIndex(item => item.id === row.id),
        1
      );
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
      this.onload();
    },
    // 翻页
    handleCurrentChangepage(val) {
      console.log(`当前页: ${val}`);
      this.currentPage = val;
      this.onload();
    },
    // 选中员工
    handleCurrentChange(val) {
      //   console.log('选中员工',val)
      this.multipleSelection = val;
    },
    close() {
      this.$emit('userclose');
    },
    getUser() {
      if (this.activeInvoiceList.length > 0) {
        this.$emit('getUser', this.activeInvoiceList);
      } else {
        this.$message.error('未选择员工');
        return;
      }
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