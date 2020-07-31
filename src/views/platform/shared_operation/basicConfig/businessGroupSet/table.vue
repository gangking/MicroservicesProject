<template>
  <div class="tabbox">
    <div class="list">
      <!-- 业务组管理列表 -->
      <el-table height="100%" ref="multipleTable" :data="tableData" tooltip-effect="dark" header-align="center" style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column prop="levelVal" label="层级"></el-table-column>
        <el-table-column prop="groupNo" label="业务组编号" width="120">
        </el-table-column>
        <el-table-column prop="name" label="业务组名称" width="120">
        </el-table-column>
        <el-table-column prop="status" label="状态" width="80">
          <template slot-scope="scope">
            <span v-if="scope.row.status == 'deleted'">停用</span>
            <span v-else-if="scope.row.status =='actived'">启用</span>
          </template>
        </el-table-column>
        <el-table-column prop="teamManage" label="组员管理" width="100">
          <template slot-scope="scope">
            <el-button type="primary" @click="getGroupGoPage('组员管理',scope.row)">组员管理</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="taskAllocation" label="业务范围" width="100">
          <template slot-scope="scope">
            <el-button type="primary" @click="getGroupGoPage('任务分配',scope.row)">任务分配</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="strategy" label="派单策略" width="100">
          <template slot-scope="scope">
            <el-button type="primary" @click="getGroupGoPage('派单策略',scope.row)">派单策略</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="maxBillNumber" label="最大在手单量" width="100">
        </el-table-column>
        <el-table-column prop="baseBillNumber" label="每日基准单量" width="100">
        </el-table-column>
        <el-table-column prop="autoTriggerNumber" label="触发自动派单" width="100">
        </el-table-column>
        <el-table-column prop="onceAutoPullNumber" label="单次自动派单" width="100">
        </el-table-column>
        <el-table-column prop="manTriggerNumber" label="触发手动派单" width="100">
        </el-table-column>
        <el-table-column prop="onceManPullNumber" label="单次手动提单" width="100">
        </el-table-column>
        <el-table-column prop="ruleSnNo" label="规则序号" width="100">
        </el-table-column>
        <el-table-column prop="deliverThreshold" label="主副岗派单阀值" width="120">
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="200">
          <template slot-scope="scope">
            <el-button type="text" size="small" v-if="scope.row.status == 'deleted'" @click="btnStartClick(scope.row)">启动</el-button>
            <el-button type="text" size="small" v-else-if="scope.row.status =='actived'" @click="btnStopClick(scope.row)">停用</el-button>
            <el-button type="text" size="small" @click="btnEditClick(scope.row)">编辑</el-button>
            <el-button type="text" size="small" @click="btnDeleteClick(scope.row)">删除</el-button>
            <el-button type="text" size="small" v-if="scope.row.level != 3" @click="getChildren(scope.row)">进入下级</el-button>
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
    pageResult: {
      type: Object,
      default: () => {
        return {};
      }
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
      this.$emit('getMultipleSelection', val);
    },
    // 翻页
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.$emit('handleCurrentChange', val);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    },
    // 跳转页面
    getGroupGoPage(page, info) {
      this.$emit('getGroupGoPage', {
        pageType: page,
        data: info
      });
    },
    // 编辑组织
    btnEditClick(info) {
      this.$emit('btnEditClick', info);
    },
    // 停用组织
    btnStopClick(info) {
      this.$emit('btnStopClick', info);
    },
    getChildren(info) {
      this.$emit('getChildren', info);
    },
    // 删除组织
    btnDeleteClick(info) {
      this.$emit('btnDeleteClick', info);
    },
    // 启用
    btnStartClick(info) {
      this.$emit('btnStartClick', info);
    }
  }
};
</script>

<style lang="scss" scoped>
.tabbox {
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