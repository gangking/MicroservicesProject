<template>
  <div class="box">
    <div class="list">
      <!-- 业务组管理列表 -->
      <el-table height="100%" ref="multipleTable" :data="tableData" tooltip-effect="dark" header-align="center" style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column prop="ruleNo" label="派单规则编号">
        </el-table-column>
        <el-table-column prop="name" label="派单规则名称">
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template slot-scope="scope">
            <span v-if="scope.row.status == 'deleted'">停用</span>
            <span v-else-if="scope.row.status =='actived'">启用</span>
          </template>
        </el-table-column>
        <el-table-column prop="ruleType" label="派单规则类型">
          <template slot-scope="scope">
            <span v-if="scope.row.ruleType == 'AUTO'">自动</span>
            <span v-else-if="scope.row.ruleType =='MAN'">手动</span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="200">
          <template slot-scope="scope">
            <el-button type="text" size="small" v-if="scope.row.status == 'deleted'" @click="btnStartClick(scope.row)">启动</el-button>
            <el-button type="text" size="small" v-else-if="scope.row.status =='actived'" @click="btnStopClick(scope.row)">停用</el-button>
            <el-button type="text" size="small" @click="btnEditClick(scope.row)">编辑</el-button>
            <el-button type="text" size="small" @click="btnDeleteClick(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageResult.page" layout="total, prev, pager, next, jumper" :total="pageResult.totalCount" :page-size="20">
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    tableData: {
      type: Array,
      default: () => {
        return [];
      }
    },
    activeRow: {
      type: Object,
      default: () => {
        return {};
      }
    },
    pageResult:{
      type:Object,
      default: () => {
        return {};
      }
    }
  },
  watch:{
    activeRow:{
      handler(val) {
        if (JSON.stringify(val) != '{}') {
          // this.$refs.multipleTable.setCurrentRow(val);
          this.$refs.multipleTable.toggleRowSelection(val);
        }
      },
      immediate:true
    }
  },
  data() {
    return {
      multipleSelection: [], // 存储批量选中数据
      currentPage: 0, // 当前页
      tableTotal: 0 // 总数
    };
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val;
      this.$emit('getMultipleSelection',val)
    },
    // 翻页
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.$emit('handleCurrentChange',val)
    },
    // 编辑组织
    btnEditClick(info) {
      this.$emit('btnEditClick', info);
    },
    // 停用组织
    btnStopClick(info) {
      this.$emit('btnStopClick', info);
    },
    // 删除组织
    btnDeleteClick(info) {
      this.$emit('btnDeleteClick', info);
    },
    // 启用
    btnStartClick(info) {
      this.$emit('btnStartClick', info);
    },
    // 跳转页面
    getGroupGoPage(page, info) {
      this.$emit('getGroupGoPage', {
        pageType: page,
        data: info
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.box {
  height: calc(100% - 100px);
  .list {
    height: calc(100% - 40px);
    overflow: auto;
  }
  .pagination {
    height: 40px;
    text-align: center;
  }
}
</style>