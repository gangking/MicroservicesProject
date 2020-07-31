<template>
  <div class="box">
    <div class="list">
      <!-- 业务组管理列表 -->
      <el-table height="100%" ref="multipleTable" :data="tableData" tooltip-effect="dark" header-align="center" style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column prop="docNumber" label="单据号" width="140">
          <template slot-scope="scope">
            <el-button type="text" @click="detailvisible(scope.row)">{{scope.row.docNumber}}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="docDescription" label="单据描述" width="120">
          <template slot-scope="scope">
            <span v-html="scope.row.docDescription"></span>
          </template>
        </el-table-column>
        <el-table-column prop="bukrs" label="公司代码" width="120">
        </el-table-column>
        <!-- <el-table-column prop="PRCTR" label="利润中心" width="100">
        </el-table-column> -->
        <el-table-column prop="username" label="申请人" width="120">
        </el-table-column>
        <el-table-column prop="bsDesc" label="业务场景" width="120">
        </el-table-column>
        <!-- <el-table-column prop="amount" label="金额" width="120">
        </el-table-column> -->
        <el-table-column prop="startTime" label="提单日期" width="140" :formatter="dateFormat">
        </el-table-column>
        <el-table-column prop="createTime" label="入池日期" width="140" :formatter="dateFormat">
        </el-table-column>
        <el-table-column prop="dataDispatch" label="派工日期" width="140" :formatter="dateFormat">
        </el-table-column>
        <el-table-column prop="docStatus" label="单据状态" width="120">
        </el-table-column>
        <el-table-column prop="taskHolder" label="任务持有人" width="120">
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="100">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="dispatchFunc(scope.row)">指定规则派工</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageResult.page" layout="total, prev, pager, next, jumper" :total="pageResult.totalCount" :page-size="10">
      </el-pagination>
    </div>
    <el-dialog title="指定规则派工" :visible.sync="dialogVisible" width="30%" @close="closeDialogVisible">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item>
          <el-input v-model="formInline.user" placeholder="请输入自动规则名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>
      <div class="table" style="height:200px;overflow:auto;">
        <el-table ref="multipleTable" :data="userTableData" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChangeUser">
          <el-table-column type="selection" width="55">
          </el-table-column>
          <el-table-column label="派单规则编号" prop="ruleNo">
          </el-table-column>
          <el-table-column label="派单规则名称" prop="name">
          </el-table-column>
        </el-table>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialogVisible">关闭</el-button>
        <el-button type="primary" @click="distribution">分配</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
const { mapActions, mapState, mapGetters, mapMutations } = createNamespacedHelpers(
  'shared_operation/basiConfig'
);
export default {
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
    clickTypeTxt: {
      type: String,
      default: ''
    },
    clickFlag: {
      type: Boolean,
      default: false
    },
    pageResult: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  watch: {
    clickFlag(val) {
      console.log('点击按钮', val);
      if (this.clickTypeTxt == '批量指定规则派工') {
        if (this.multipleSelection.length > 0) {
          this.onSubmit();
          this.dialogVisible = true;
        } else {
          this.$message.error('请至少选择一行再进行操作');
        }
      }
    }
  },
  data() {
    return {
      multipleSelection: [], // 存储批量选中数据
      currentPage: 0, // 当前页
      tableTotal: 0, // 总数
      dialogVisible: false,
      formInline: {
        user: ''
      },
      userTableData: [], // 员工
      multipleSelectionUser: []
    };
  },
  methods: {
    ...mapActions(['deliverRuleList', 'ruleWorker']),
    // 跳转表单
    detailvisible(row) {
      console.log('跳转表单', row);
      // 未审核accountingQuery  已审核accountingQuery
      // const { instId, taskId } = row;
      const { appId, instId, taskId } = row;
      this.ibpsPayable.setPayableParams({
        appId,
        instId,
        taskId,
        status: 'submitterQuery'
      });
      // this.dialogTableVisible = true;
      // console.log('params', this.params);
    },
    // 日期格式化
    dateFormat(row, column, value) {
      // console.log('日期格式化',value)
      if (!value) {
        return;
      }
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
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 选择自动规则
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
    // 指定自动规则弹窗打开
    dispatchFunc(info) {
      this.multipleSelection = [];
      this.multipleSelection.push(info);
      this.onSubmit();
      this.dialogVisible = true;
    },
    // 分配
    distribution() {
      console.log('开始分配', this.multipleSelectionUser, this.multipleSelection);
      if (this.multipleSelectionUser.length == 1) {
        var ids = '';
        for (var i = 0; i < this.multipleSelection.length; i++) {
          var item = this.multipleSelection[i];
          if (i != this.multipleSelection.length - 1) {
            ids += item.id + ',';
          } else {
            ids = item.id;
          }
        }
        var ruleId = this.multipleSelectionUser[0].id;
        this.ruleWorker({
          ids: ids,
          ruleId: ruleId
        }).then(res => {
          if (res && res.state == '8848') {
            console.log('分配失败错误信息', res);
            this.$message.error('分配失败！');
          } else {
            this.$emit('refresh');
            this.closeDialogVisible();
          }
        });
      } else {
        this.$message.error('至少且只能选择一个自动规则。');
      }
    },
    closeDialogVisible() {
      this.multipleSelectionUser = [];
      this.dialogVisible = false;
    },
    // 查询自动规则
    onSubmit() {
      console.log('submit!');
      this.deliverRuleList({
        parameters: [
          { key: 'Q^rule_type^SL', value: 'AUTO' },
          { key: 'Q^name^SL', value: this.formInline.user }
        ],
        requestPage: {
          pageNo: 1,
          limit: 1000,
          totalCount: 45
        },
        sorts: []
      }).then(res => {
        console.log('自动规则列表', res);
        this.userTableData = res.dataResult;
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.box {
  flex: 1;
  .list {
    height: calc(100% - 40px);
  }
  .pagination {
    height: 40px;
    text-align: center;
  }
}
</style>