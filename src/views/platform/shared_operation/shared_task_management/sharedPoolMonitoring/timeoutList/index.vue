<template>
  <div class="box">
    <search @closeBox="closeBox" @searchForm="searchForm" />
    <btnComponent :btnList="btnList" @clickType="clickType" />
    <tableComponent @handleCurrentChange="handleCurrentChange" :pageResult="pageResult" :tableData="tableData" :clickFlag="clickFlag" :clickTypeTxt="clickTypeTxt" @getGroupGoPage="getGroupGoPage" @handleSelectionChange="handleSelectionChange" @dispatchUserFunc="dispatchUserFunc" />
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="30%" @close="closeUserDilog">
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
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeUserDilog">关闭</el-button>
        <el-button type="primary" @click="distribution">分配</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import search from '@/views/platform/shared_operation/shared_task_management/sharedPoolMonitoring/undeliveredList/search.vue';
import btnComponent from './btnList';
import tableComponent from './table';
import { createNamespacedHelpers } from 'vuex';
const { mapActions } = createNamespacedHelpers('shared_operation/sharedTask');
const { mapActions: mapActionsTwo } = createNamespacedHelpers('shared_operation/basiConfig');
export default {
  props: {
    isUpdate: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    isUpdate(val) {
      this.onload();
    }
  },
  components: {
    search,
    btnComponent,
    tableComponent
  },
  data() {
    return {
      btnList: [
        {
          label: '批量指定人员派工',
          func: ''
        }
      ],
      tableData: [],
      searchInfo:[],
      clickTypeTxt: '',
      clickFlag: false,
      pageResult: {},
      dialogTitle: '指定人员派工',
      dialogVisible: false,
      formInline: {
        user: '',
        userInfo: {},
        auditDesc: '',
        action: ''
      },
      userTableData: [],
      multipleTabelData: [],
      multipleSelectionData: {},
      ids: ''
    };
  },
  created() {
    // this.tableData = require('./data.json').list;
    this.onload();
  },
  methods: {
    ...mapActions(['qutstandingTimeout', 'deliverAssign']),
    ...mapActionsTwo(['groupMemberList']),
    onload() {
      this.qutstandingTimeout({
        parameters: this.searchInfo,
        requestPage: {
          pageNo: this.pageResult.page,
          limit: 20,
          totalCount: 45
        },
        sorts: []
      }).then(res => {
        console.log('共享池监控未派超时任务列表', res);
        if (res && res.state == '8848') {
          this.$message.error('查询失败！');
        } else {
          this.tableData = res.dataResult;
          this.pageResult = res.pageResult;
        }
      });
    },
    handleCurrentChange(val) {
      this.pageResult.page = val;
      this.onload();
    },
    getGroupGoPage(info) {
      this.$emit('getGroupGoPage', info);
    },
    // 搜索
    searchForm(info) {
      console.log('搜索', info);
      var bsCode = '';
      for (var i = 0; i < info.bsaList.length; i++) {
        var item = info.bsaList[i];
        if (i != info.bsaList.length - 1) {
          bsCode += item.bsaKey + ',';
        } else {
          bsCode += item.bsaKey;
        }
      }
      info['bsCode'] = bsCode;
      this.searchInfo = [
        { key: 'Q^b.doc_number^SL', value: info.docNumber },
        { key: 'Q^B.app_id_^SL', value: info.bsCode },
        { key: 'Q^b.bukrs^SL', value: info.companyCode },
        { key: 'Q^b.username^SL', value: info.username },
        { key: 'Q^a.status^SL', value: info.status },
        { key: 'Q^type^SL', value: info.taskType },
        { key: 'Q^f.id_^SL', value: info.sharePoolId },
        { key: 'Q^a.business_group_level1_id^SL', value: info.oneLevelGroup },
        { key: 'Q^a.business_group_level2_id^SL', value: info.twoLevelGroup },
        { key: 'Q^a.business_group_level3_id^SL', value: info.threeLevelGroup },
        {
          key: 'Q^b.start_time_^DL',
          value: info.dateSubmit[0]
        },
        {
          key: 'Q^b.start_time_^DG',
          value: info.dateSubmit[1]
        },

        {
          key: 'Q^a.create_time^DL',
          value: info.dataPool[0]
        },
        {
          key: 'Q^a.create_time^DG',
          value: info.dataPool[1]
        }
      ];
      this.onload();
      // this.qutstandingTimeout({
      //   parameters: [
      //     { key: 'Q^b.doc_number^SL', value: info.docNumber },
      //     { key: 'Q^B.app_id_^SL', value: bsCode },
      //     { key: 'Q^b.bukrs^SL', value: info.companyCode },
      //     { key: 'Q^b.username^SL', value: info.username },
      //     { key: 'Q^a.status^SL', value: info.status },
      //     { key: 'Q^type^SL', value: info.taskType },
      //     { key: 'Q^sharePoolId^SL', value: info.sharePoolId },
      //     { key: 'Q^sharePoolName^SL', value: info.sharePoolName },
      //     {
      //       key: 'Q^b.start_time_^DL',
      //       value: info.dateSubmit[0]
      //     },
      //     {
      //       key: 'Q^b.start_time_^DG',
      //       value: info.dateSubmit[1]
      //     },

      //     {
      //       key: 'Q^a.create_time^DL',
      //       value: info.dataPool[0]
      //     },
      //     {
      //       key: 'Q^a.create_time^DG',
      //       value: info.dataPool[1]
      //     }
      //   ],
      //   requestPage: {
      //     pageNo: this.pageResult.page,
      //     limit: 10,
      //     totalCount: 45
      //   },
      //   sorts: []
      // }).then(res => {
      //   console.log('共享池监控未派超时任务列表', res);
      //   if (res && res.state == '8848') {
      //     this.$message.error(
      //       '查询失败！'
      //     );
      //   } else {
      //     this.tableData = res.dataResult;
      //     this.pageResult = res.pageResult;
      //   }
      // });
    },
    closeBox() {
      this.$emit('getGroupGoPage', {
        pageType: '主页'
      });
    },
    // 按钮点击类型
    clickType(info) {
      console.log('点击按钮', info, this.multipleTabelData);
      if (this.multipleTabelData.length > 0) {
        var ids = '';
        var arry = [this.multipleTabelData[0]];
        var flag = false;
        for (var i = 0; i < this.multipleTabelData.length; i++) {
          var item = this.multipleTabelData[i];
          if (arry[0].groupId != item.groupId) {
            flag = true;
          }
          if (i != this.multipleTabelData.length - 1) {
            ids += item.id + ',';
          } else {
            ids += item.id;
          }
        }
        this.ids = ids;
        if (flag) {
          this.$message.error('不同组无法批量派工。');
          return;
        }
        console.log('批量操作参数', ids);
        if (info.label == '批量指定人员派工') {
          this.dialogTitle = '批量指定人员派工';
          this.dialogVisible = true;
          // 查询员工
          this.onSubmit();
        }
      } else {
        this.$message.error('请至少选择一行数据，再操作。');
      }

      // this.clickTypeTxt = info.label;
      // this.clickFlag = this.clickFlag ? false : true;
    },
    // 提交 指定人员派工  分配 结果
    distribution() {
      this.deliverAssign({
        ids: this.ids,
        userId: this.formInline.userInfo.userId
      }).then(res => {
        this.onload();
        this.closeUserDilog();
      });
    },
    // 指定人员派工
    dispatchUserFunc(info) {
      this.dialogTitle = '指定人员派工';
      this.dialogVisible = true;
      this.multipleSelectionData = info;
      this.ids = info.id;
      // 查询员工
      this.onSubmit();
    },
    // 关闭弹窗
    closeUserDilog() {
      this.formInline = {
        user: '',
        userInfo: {},
        auditDesc: '',
        action: ''
      };
      this.dialogVisible = false;
    },
    // 批量选中数据行
    handleSelectionChange(list) {
      this.multipleTabelData = list;
    },
    // 选择员工
    handleSelectionChangeUser(val) {
      console.log('选择员工', val);
      this.formInline.userInfo = val;
      this.$set(this.formInline, 'user', val.userName);
      console.log(this.formInline);
    },
    // 查询员工
    onSubmit() {
      console.log('submit!');
      this.groupMemberList({
        parameters: [
          { key: 'Q^group_id^SL', value: this.multipleSelectionData.groupId },
          { key: 'Q^b.NAME_^SL', value: this.formInline.user },
          {
            key: 'Q^BELONG_TO^SL',
            value: 1
          }
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
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
</style>