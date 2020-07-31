<template>
  <div class="tabelbox">
    <div class="list">
      <!-- 业务组管理列表 -->
      <el-table height="100%" ref="multipleTable" :data="tableData" tooltip-effect="dark" header-align="center" style="width: 100%">
        <el-table-column prop="name" label="周规则名">
        </el-table-column>
        <el-table-column prop="cycle" label="周期">
          <template slot-scope="scope">
            <span v-if="scope.row.cycle=='M'">月</span>
            <span v-else-if="scope.row.cycle=='S'">季</span>
            <span v-else-if="scope.row.cycle=='Y'">年</span>
          </template>
        </el-table-column>
        <el-table-column prop="auditedPerson" label="被稽核人员">
          <template slot-scope="scope">
            <span v-for="(item,index) in scope.row.userList" :key="index">
              <span v-if="index<scope.row.userList.length-1">{{item.userName}},</span>
              <span v-else>{{item.userName}}</span>
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="threshold" label="最低提取阈值">
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="200">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="btnEditClick(scope.row)">编辑</el-button>
            <el-button type="text" size="small" @click="btnDeleteClick(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageResult.page" layout="total, prev, pager, next, jumper" :total="pageResult.totalCount" :page-size="10">
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
    pageResult: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  data() {
    return {
      currentPage: 0, // 当前页
      tableTotal: 0 // 总数
    };
  },
  methods: {
    // 翻页
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    // 编辑组织
    btnEditClick(info) {
      this.$emit('btnEditClick', info);
    },
    // 删除组织
    btnDeleteClick(info) {
      this.$emit('btnDeleteClick', info);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.$emit('handleCurrentChange', val);
    }
  }
};
</script>

<style lang="scss" scoped>
.tabelbox {
  flex: 1;
  // height: calc(100% - 50px);
  overflow: auto;
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