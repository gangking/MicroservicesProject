<template>
  <div class="box">
    <search @closeBox="closeBox" @searchForm="searchForm" />
    <btnComponent :btnList="btnList" @clickType="clickType" />
    <tableComponent :pageResult="pageResult" @handleCurrentChange="handleCurrentChange" :tableData="tableData" :clickFlag="clickFlag" :clickTypeTxt="clickTypeTxt" @getGroupGoPage="getGroupGoPage" @dispatchUserFunc="dispatchUserFunc" @returnShool="returnShool" @handleSelectionChange="handleSelectionChange" />
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
    <el-dialog title="回收任务池失败，请重新选择要回收的任务池" :visible.sync="innerVisible" width="40%" @close="closePool">
      <div class="tableBox">
        <el-table ref="singleTable" :data="pooltableData" highlight-current-row @current-change="activePool" style="width: 100%">
          <el-table-column type="index" width="50">
          </el-table-column>
          <el-table-column prop="name" label="共享池名称">
          </el-table-column>
          <el-table-column prop="groupAlias" label="共享池别名">
          </el-table-column>
          <el-table-column prop="groupNote" label="共享池描述">
          </el-table-column>
        </el-table>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closePool">取 消</el-button>
        <el-button type="primary" @click="returnShoolTwo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import search from './search';
import btnComponent from './btnList';
import tableComponent from './table';
import { createNamespacedHelpers } from 'vuex';
const { mapActions } = createNamespacedHelpers('shared_operation/sharedTask');
const { mapActions: mapActionsTwo } = createNamespacedHelpers('shared_operation/basiConfig');
export default {
  components: {
    search,
    btnComponent,
    tableComponent
  },
  data() {
    return {
      btnList: [
        {
          label: '批量收回',
          func: ''
        },
        {
          label: '批量指定人员派工',
          func: ''
        }
      ],
      searchFormVal: [],
      pooltableData: [],
      innerVisible: false,
      activePoolItem: {},
      activeTaskItem: {},
      tableData: [],
      clickTypeTxt: '',
      clickFlag: false,
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
      ids: '',
      pageResult: { page: 1, totalCount: 0 }
    };
  },
  inject: {
    ibpsPayable: {
      from: "ibpsPayable",
      default() {
        return this;
      }
    }
  },
  created() {
    // this.tableData = require('./data.json').list;
    this.onload();
  },
  mounted() {
    this.ibpsPayable.$on("exit-multi-form", this.onEvenReload);
  },
  destroyed() {
    this.ibpsPayable.$off("exit-multi-form", this.onEvenReload);
  },
  methods: {
    onEvenReload(type){
      // console.log('触发未派列表更新',type);
      this.onload();
    },
    ...mapActions(['deliverList', 'deliverRecover', 'deliverAssign']),
    ...mapActionsTwo(['groupMemberList', 'sharedPollList']),
    onload() {
      this.deliverList({
        parameters: this.searchFormVal,
        requestPage: {
          pageNo: this.pageResult.page,
          limit: 10,
          totalCount: 45
        },
        sorts: []
      }).then(res => {
        console.log('已派任务列表', res);
        this.tableData = res.dataResult;
        this.pageResult = res.pageResult;
      });
    },
    // 翻页
    handleCurrentChange(page) {
      this.pageResult.page = page;
      this.onload();
    },
    getGroupGoPage(info) {
      this.$emit('getGroupGoPage', info);
    },
    closeBox() {
      this.$emit('getGroupGoPage', {
        pageType: '主页'
      });
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
      this.searchFormVal = [
        { key: 'Q^b.doc_number^SL', value: info.docNumber },
        { key: 'Q^b.app_id_^SL', value: bsCode },
        { key: 'Q^b.bukrs^SL', value: info.companyCode },
        { key: 'Q^b.username^SL', value: info.applicant },
        { key: 'Q^c.name_^SL', value: info.name },
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
        },

        {
          key: 'Q^a.deliver_time^DL',
          value: info.deliver[0]
        },
        {
          key: 'Q^a.deliver_time^DG',
          value: info.deliver[1]
        }
      ];
      this.onload();
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
          this.groupMemberList({
            parameters: [{ key: 'Q^group_id^SL', value: arry[0].groupId }],
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
        } else if (info.label == '批量回收') {
          this.returnShool({
            id: ids
          });
        }
      } else {
        this.$message.error('请至少选择一行数据，再操作。');
      }

      // this.clickTypeTxt = info.label;
      // this.clickFlag = this.clickFlag ? false : true;
    },
    // 回收任务池
    returnShool(info) {
      this.activeTaskItem = info;
      this.deliverRecover({
        ids: info.id
      }).then(res => {
        console.log('回收任务池失败');
        if (res && res.state == '8848') {
          // this.$message.error('回收任务池失败，重新选择要回收任务池！');
          this.innerVisible = true;
          this.sharedPollList({
            parameters: [{ key: 'Q^share_pool^SL', value: 'Y' }],
            requestPage: {
              pageNo: 1,
              limit: 10000,
              totalCount: 6
            },
            sorts: []
          }).then(res => {
            console.log('共享池列表', res);
            this.pooltableData = res.dataResult;
          });
          // this.pooltableData = []
        } else {
          this.onload();
        }
      });
    },
    closePool() {
      this.activePoolItem = {};
      this.innerVisible = false;
    },
    // 重新回收任务池
    returnShoolTwo() {
      if (JSON.stringify(this.activePoolItem) != '{}') {
        console.log('回收重新选的任务池', this.activePoolItem);
        // this.returnShool(this.activePoolItem);
        this.deliverRecover({
          ids: this.activeTaskItem.id,
          sharePoolId: this.activePoolItem.id
        }).then(res => {
          if (res && res.state == '8848') {
            this.$message.error('重新回收任务池失败！');
          } else {
            this.innerVisible = false;
            this.onload();
          }
        });
      } else {
        this.$message.error('请选择要回收的任务池！');
      }
    },
    activePool(val) {
      this.activePoolItem = val;
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
    },
    // 查询员工
    onSubmit() {
      console.log('submit!');
      this.groupMemberList({
        parameters: [
          { key: 'Q^group_id^SL', value: this.multipleSelectionData.groupId },
          { key: 'Q^b.NAME_^SL', value: this.formInline.user },
          { key: 'Q^BELONG_TO^SL', value: 1 }
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
  // overflow: auto;
  .dialogTabel {
    height: 300px;
  }
}
</style>