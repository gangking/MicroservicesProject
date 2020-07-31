<template>
  <div class="tabbox">
    <div class="list">
      <!-- 业务组管理列表 -->
      <el-table height="100%" ref="multipleTable" :data="tableData" tooltip-effect="dark" header-align="center" style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column prop="docNumber" label="单据编号" width="140">
          <template slot-scope="scope">
            <el-button type="text" @click="detailvisible(scope.row)">{{scope.row.docNumber}}</el-button>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="docDescription" label="单据描述" width="120">
          <template slot-scope="scope">
            <span v-html="scope.row.docDescription"></span>
          </template>
        </el-table-column> -->
        <el-table-column prop="bukrs" label="公司代码" width="120">
        </el-table-column>
        <!-- <el-table-column prop="PRCTR" label="利润中心" width="100">
        </el-table-column> -->
        <el-table-column prop="username" label="申请人" width="120">
        </el-table-column>
        <el-table-column prop="bsDesc" label="业务场景">
        </el-table-column>
        <!-- <el-table-column prop="amount" label="金额" width="120">
        </el-table-column> -->
        <el-table-column prop="startTime" label="提交日期" width="140" :formatter="dateFormat">
        </el-table-column>
        <el-table-column prop="createTime" label="入池日期" width="140" :formatter="dateFormat">
        </el-table-column>
        <el-table-column prop="status" label="单据状态" width="120">
          <template slot-scope="scope">
            <span v-if="scope.row.status == 'suspend'">挂起</span>
            <span v-else-if="scope.row.status =='running'">未审核</span>
            <span v-else-if="scope.row.status =='finish'">已审核</span>
          </template>
        </el-table-column>
        <el-table-column prop="duration" label="审核倒计时" width="120">
          <template slot-scope="scope">
            <span :style="Number(scope.row.duration)>0?'':'color:red;'">{{ scope.row.duration | countDown}}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="merchantsCode" label="客商代码" width="120">
        </el-table-column>
        <el-table-column prop="merchantsName" label="客商名称" width="120">
        </el-table-column> -->
        <el-table-column fixed="right" label="操作" width="160">
          <template slot-scope="scope">
            <el-button v-if="scope.row.status == 'running'" type="text" size="small" @click="pendingCancelFunc(scope.row,'suspend')">挂起</el-button>
            <el-button v-else-if="scope.row.status =='suspend'" type="text" size="small" @click="pendingCancelFunc(scope.row,'cancelSuspend')">取消挂起</el-button>
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
  inject: {
    ibpsPayable: {
      from: 'ibpsPayable',
      default() {
        return this;
      }
    }
  },
  inject: {
    ibpsPayable: {
      from: 'ibpsPayable',
      default() {
        return this;
      }
    }
  },
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
      tableTotal: 0, // 总数
      // 员工
      multipleSelectionUser: []
    };
  },
  filters: {
    // 倒计时保留两位小数
    countDown(val) {
      var x = Number(val);
      var f = parseFloat(x);
      if (isNaN(f)) {
        return false;
      }
      var f = Math.round(x * 100) / 100;
      var s = f.toString();
      var rs = s.indexOf('.');
      if (rs < 0) {
        rs = s.length;
        s += '.';
      }
      while (s.length <= rs + 2) {
        s += '0';
      }
      return s;
    }
  },
  methods: {
    // 日期格式化
    dateFormat(row, column, value) {
      // console.log('日期格式化',value)
      var t = new Date(value); //row 表示一行数据, updateTime 表示要格式化的字段名称
      var year = t.getFullYear(),
        month = t.getMonth() + 1,
        day = t.getDate(),
        hour = t.getHours(),
        min = t.getMinutes(),
        sec = t.getSeconds();
      var newTime =
        year +
        '-' +
        (month < 10 ? '0' + month : month) +
        '-' +
        (day < 10 ? '0' + day : day) +
        ' ' +
        (hour < 10 ? '0' + hour : hour) +
        ':' +
        (min < 10 ? '0' + min : min) +
        ':' +
        (sec < 10 ? '0' + sec : sec);
      return newTime;
    },
    // 跳转表单
    detailvisible(row) {
      console.log('跳转表单', row);
      // 未审核accountingQuery  已审核accountingQuery
      // const { instId, taskId } = row;
      const { appId, instId, taskId } = row;
      if (row.status == 'suspend') {
        this.ibpsPayable.setPayableParams({
          appId,
          instId,
          taskId,
          status: 'submitterQuery'
        });
      } else {
        this.ibpsPayable.setPayableParams({
          appId,
          instId,
          taskId,
          status: 'approverProcess'
        });
      }

      // this.dialogTableVisible = true;
      // console.log('params', this.params);
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      this.$emit('handleSelectionChange', val);
    },
    // 选择员工
    handleSelectionChangeUser(val) {
      this.multipleSelectionUser = val;
    },
    // 翻页
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.$emit('handleCurrentChange', val);
    },
    // 跳转页面
    getGroupGoPage(page, info) {
      this.$emit('getGroupGoPage', {
        pageType: page,
        data: info
      });
    },
    // 取消、挂起、退回
    pendingCancelFunc(info, type) {
      this.$emit('pendingCancelFunc', info, type);
    },
    // 查询员工
    onSubmit() {
      console.log('submit!');
    }
  }
};
</script>

<style lang="scss" scoped>
.tabbox {
  flex: 1;
  overflow: auto;
  .list {
    overflow: auto;
    height: calc(100% - 40px);
  }
  .pagination {
    height: 40px;
    text-align: center;
  }
}
</style>