<template>
  <div class="tabelbox">
    <div class="list">
      <!-- 业务组管理列表 -->
      <el-table height="100%" ref="multipleTable" :data="tableData" tooltip-effect="dark" header-align="center" style="width: 100%">
        <el-table-column prop="orgGroupName" label="组织名称">
        </el-table-column>
        <el-table-column prop="gobalType" label="参数">
          <template slot-scope="scope">
            <span v-if="scope.row.gobalType == 'O'">超时类型</span>
            <span v-else-if="scope.row.gobalType =='E'">异常类型</span>
          </template>
        </el-table-column>
        <el-table-column prop="value" label="数值">
          <template slot-scope="scope">
            <span v-if="scope.row.valueUnit == 'D'">{{scope.row.value}}天</span>
            <span v-else-if="scope.row.valueUnit =='H'">{{scope.row.value}}小时</span>
            <span v-else-if="scope.row.valueUnit =='M'">{{scope.row.value}}分钟</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态">
          <template slot-scope="scope">
            <span v-if="scope.row.status == 'deleted'">停用</span>
            <span v-else-if="scope.row.status =='actived'">启用</span>
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
      default: ()=>{
        return {}
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
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.$emit('handleCurrentChange',val)
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