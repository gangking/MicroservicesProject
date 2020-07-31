<template>
  <div class="box">
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
        <el-table-column prop="docDescription" label="单据描述" width="120">
          <template slot-scope="scope">
            <span v-html="scope.row.docDescription"></span>
          </template>
        </el-table-column>
        <el-table-column prop="chargebackName" label="退单人" width="120">
        </el-table-column>
        <el-table-column prop="chargebackReason" label="退单原因" width="120">
        </el-table-column>
        <el-table-column prop="bukrs" label="公司代码" width="120">
        </el-table-column>
        <!-- <el-table-column prop="PRCTR" label="利润中心" width="100">
        </el-table-column> -->
        <!-- <el-table-column prop="amount" label="单据金额" width="120">
        </el-table-column> -->
        <el-table-column prop="startTime" label="提单日期" width="140" :formatter="dateFormat">
        </el-table-column>
        <el-table-column prop="createTime" label="入池日期" width="140" :formatter="dateFormat">
        </el-table-column>
        <el-table-column prop="deliverTime" label="派工日期" width="140" :formatter="dateFormat">
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="200">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="returnTaskAuditFunc('agree','同意',scope.row)">同意</el-button>
            <el-button type="text" size="small" @click="returnTaskAuditFunc('oppose','不同意',scope.row)">不同意</el-button>
            <el-button type="text" size="small" @click="dispatchFunc(scope.row)">转派</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageResult.page" layout="total, prev, pager, next, jumper" :total="pageResult.totalCount" :page-size="10">
      </el-pagination>
    </div>
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="30%" @close="closeUserDilog">
      <div v-if="dialogTitle == '转派'">
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
          <el-form-item>
            <el-input v-model="formInline.user" placeholder="请输入员工名"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">查询</el-button>
          </el-form-item>
        </el-form>
        <div class="dialogTabel">
          <el-table :data="userTableData" tooltip-effect="dark" style="width: 100%" @current-change="handleSelectionChangeUser" highlight-current-row>
            <el-table-column label="工号" prop="userNo">
            </el-table-column>
            <el-table-column label="员工名" prop="userName">
            </el-table-column>
            <el-table-column label="所属组" prop="groupName">
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div v-else>
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
          <el-form-item label="审核意见：">
            <el-input v-model="formInline.auditDesc" placeholder="请输入审核意见"></el-input>
          </el-form-item>
        </el-form>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="closeUserDilog">关闭</el-button>
        <el-button v-if="dialogTitle == '转派'" type="primary" @click="distribution">分配</el-button>
        <el-button v-else type="primary" @click="returnFormAuditFunc">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
const { mapActions } = createNamespacedHelpers('shared_operation/sharedTask');
const { mapActions: mapActionsTwo } = createNamespacedHelpers('shared_operation/basiConfig');
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
      dialogTitle: '转派',
      dialogVisible: false,
      formInline: {
        user: '',
        userInfo: {},
        auditDesc: '',
        action: ''
      },
      userTableData: [],
      // 要操作的数据行
      multipleSelectionData: {}
    };
  },
  methods: {
    ...mapActions(['charaeeBackList', 'returnTaskAudit']),
    ...mapActionsTwo(['groupMemberList']),
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
    // 翻页
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.$emit('handleCurrentChange', val);
    },
    // 同意/不同意
    returnTaskAuditFunc(flag, type, info) {
      // this.returnTaskAudit
      this.dialogTitle = type;
      this.formInline.action = flag;
      this.dialogVisible = true;
      this.multipleSelectionData = info;
    },
    returnFormAuditFunc() {
      this.returnTaskAudit({
        id: this.multipleSelectionData.id,
        desc: this.formInline.desc,
        action: this.formInline.action
      }).then(res => {
        console.log('审核结果', res);
        this.$emit('refresh');
        this.closeUserDilog();
        if (res && res.state == '8848') {
          this.$message.error(res.info.message ? res.info.message : '审核失败');
        }
      });
    },
    // 跳转页面
    getGroupGoPage(page, info) {
      this.$emit('getGroupGoPage', {
        pageType: page,
        data: info
      });
    },
    // 打开转派
    dispatchFunc(info) {
      console.log('要转派的数据行', info);
      this.dialogTitle = '转派';
      this.dialogVisible = true;
      this.multipleSelectionData = info;
      // 查询员工
      this.groupMemberList({
        parameters: [{ key: 'Q^group_id^SL', value: this.multipleSelectionData.groupId }],
        requestPage: {
          pageNo: 1,
          limit: 20,
          totalCount: 45
        },
        sorts: []
      }).then(res => {
        console.log('员工列表', res);
        this.userTableData = res.dataResult;
      });
    },
    // 转派  分配
    distribution() {
      this.charaeeBackList({
        queueId: this.multipleSelectionData.queueId,
        backId: this.multipleSelectionData.id,
        userId: this.formInline.userInfo.id
      }).then(res => {
        this.$emit('refresh');
      });
    },
    // 关闭
    closeUserDilog() {
      this.formInline = {
        user: '',
        userInfo: {},
        auditDesc: '',
        action: ''
      };
      this.dialogVisible = false;
    },
    // 选择员工
    handleSelectionChangeUser(val) {
      this.formInline.userInfo = val;
      this.$set(this.formInline, 'user', val.name);
    },
    // 查询员工
    onSubmit() {
      console.log('submit!');
      this.groupMemberList({
        parameters: [
          { key: 'Q^group_id^SL', value: this.multipleSelectionData.groupId },
          { key: 'Q^b.NAME_^SL', value: this.formInline.user }
        ],
        requestPage: {
          pageNo: 1,
          limit: 20,
          totalCount: 45
        },
        sorts: []
      }).then(res => {
        console.log('员工列表', res);
        this.userTableData = res.dataResult;
        // this.tableData = res.dataResult;
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
  .dialogTabel {
    height: 300px;
    overflow: auto;
  }
}
</style>