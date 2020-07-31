<template>
  <div class="userlist">
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
    <el-table ref="singleTable" :data="tableData" highlight-current-row @current-change="handleCurrentChange" style="width: 100%">
      <el-table-column type="index" width="50">
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
    }
  },
  watch: {
    innerVisible: {
      handler(val) {
        if(val) {
          
        }
      },
      immediate: true
    }
  },
  data() {
    return {
      tableData: [],
      currentRow: {},
      currentPage: 1, // 当前页
      tableTotal: 0, // 总数
      formInline: {
        user: ''
      }
    };
  },
  created() {
    this.onload();
  },
  methods: {
    ...mapActions(['queryUserList']),
    onload() {
      this.queryUserList({
        parameters: [{ key: 'Q^NAME_^SL', value: this.formInline.user }],
        requestPage: { pageNo: this.currentPage, limit: 20, totalCount: 71 },
        sorts: []
      }).then(res => {
        console.log('员工表', res);
        this.tableData = res.dataResult;
        this.currentPage = res.pageResult.page;
        this.tableTotal = res.pageResult.totalCount;
      });
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
      this.currentRow = val;
    },
    close() {
      this.$emit('userclose');
    },
    getUser() {
      if (JSON.stringify(this.currentRow) == '{}') {
        this.$message.error('未选择员工');
        return;
      }
      this.$emit('getUser', this.currentRow);
    }
  }
};
</script>

<style lang="scss" scoped>
.userlist {
  height: 400px;
  .search {
    height: 40px;
  }
  /deep/ .el-table {
    height: 250px;
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