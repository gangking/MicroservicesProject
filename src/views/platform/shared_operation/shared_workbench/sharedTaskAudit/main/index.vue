<template>
  <div class="box">
    <search @closeBox="closeBox" @searchForm="searchForm" />
    <btnComponent :btnList="btnList" @btnClick="btnClick" @isDuty="isDuty" />
    <tableComponent :pageResult="pageResult" @handleCurrentChange="handleCurrentChange" @pendingCancelFunc="pendingCancelFunc" @handleSelectionChange="handleSelectionChange" :tableData="tableData" @getGroupGoPage="getGroupGoPage" />

    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="30%" @close="closeDialog">
      <!-- <el-form :inline="true" :model="formInline" :rules="rules" ref="ruleForm" class="demo-form-inline">
        <el-form-item label="单次提取数" prop="singleExtraction">
          <el-input v-model="formInline.singleExtraction" placeholder=""></el-input>
        </el-form-item>
      </el-form> -->
      <div style="height:350px;overflow:auto;">
        <el-table ref="singleTable" :data="myGroupList" highlight-current-row @current-change="activeGroup" style="width: 100%">
          <el-table-column type="index" width="50">
          </el-table-column>
          <el-table-column property="name" label="业务组" width="120">
          </el-table-column>
          <el-table-column v-if="this.dialogTitle != '自助提取任务'" property="onceManPullNumber" label="自动提取量">
            <template slot-scope="scope">
              <el-input v-model="scope.row.onceManPullNumber" :disabled="true"></el-input>
            </template>
          </el-table-column>
          <el-table-column v-else property="onceAutoPullNumber" label="自助提取量">
            <template slot-scope="scope">
              <el-input v-model="scope.row.onceManPullNumber"></el-input>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">取消</el-button>
        <el-button type="primary" @click="taskExtractionFunc">确认</el-button>
      </span>
    </el-dialog>
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisibleTwo" width="30%" @close="closeDialog">
      <el-form :inline="true" :model="formInline" :rules="rules" ref="ruleFormTwo" class="demo-form-inline">
        <el-form-item label="退回原因" prop="reason">
          <el-input v-model="formInline.reason" placeholder=""></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">取消</el-button>
        <el-button type="primary" @click="singleExtractionFunc('ruleFormTwo')">确认</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import search from './search';
import btnComponent from '@/views/platform/shared_operation/basicConfig/components/btnList.vue';
import tableComponent from './table';
import { createNamespacedHelpers } from 'vuex';
const { mapActions, mapState, mapGetters, mapMutations } = createNamespacedHelpers(
  'shared_operation/sharedWork'
);
export default {
  components: {
    search,
    btnComponent,
    tableComponent
  },
  inject: {
    ibpsPayable: {
      from: "ibpsPayable",
      default() {
        return this;
      }
    }
  },
  data() {
    return {
      dialogTitle: '',
      dialogVisible: false,
      dialogVisibleTwo: false,
      formInline: {
        singleExtraction: '',
        reason: ''
      },
      returnIds: '',
      rules: {
        singleExtraction: [{ required: true, message: '请输入单次提取数', trigger: 'blur' }],
        reason: [{ required: true, message: '请输入退单原因', trigger: 'blur' }]
      },
      btnList: [
        {
          label: '自动提取任务',
          func: ''
        },
        {
          label: '自助提取任务',
          func: ''
        },
        {
          label: '批量挂起',
          func: ''
        },
        {
          label: '取消挂起',
          func: ''
        },
        {
          label: '退回申请',
          func: ''
        },
        {
          label: '在岗离岗',
          func: 'isduty',
          value: 1
        }
      ],
      tableData: [],
      clickTypeTxt: '',
      clickFlag: false,
      multipleSelection: [],
      pageResult: { page: 1, totalCount: 0 },
      myGroupList: [],
      activeGroupList: {}
    };
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
    ...mapActions([
      'unAuditedList',
      'pendingCancel',
      'queryMyGroupList',
      'taskExtraction',
      'chargeback',
      'queryIsDuty',
      'setDuty'
    ]),
    // 挂起取消
    pendingCancelFunc(info, type) {
      this.pendingCancel({
        ids: info.id,
        type: type
      }).then(res => {
        this.onload();
      });
    },
    // 勾选的数据
    handleSelectionChange(list) {
      this.multipleSelection = list;
    },
    onload() {
      this.unAuditedList({
        parameters: [],
        requestPage: {
          pageNo: this.pageResult.page,
          limit: 20,
          totalCount: 45
        },
        sorts: []
      }).then(res => {
        console.log('共享任务未审核列表', res);
        if (res && res.state == '8848') {
          this.$message.error(res.info.message ? res.info.message : '分派失败');
        } else {
          this.tableData = res.dataResult;
          this.pageResult = res.pageResult;
        }
        // 查询是否在岗
        this.queryIsDuty().then(res => {
          console.log('查询是否在岗', res);
          this.$set(this.btnList, 5, {
            label: '在岗离岗',
            func: 'isduty',
            value: res.onTheJob
          });
        });
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
      this.unAuditedList({
        parameters: [
          { key: 'Q^b.doc_number^SL', value: info.docNumber },
          { key: 'Q^B.app_id_^SL', value: bsCode },
          { key: 'Q^b.bukrs^SL', value: info.companyCode },
          { key: 'Q^b.username^SL', value: info.applicant },
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
        ],
        requestPage: {
          pageNo: this.pageResult.page,
          limit: 20,
          totalCount: 45
        },
        sorts: []
      }).then(res => {
        console.log('共享任务未审核列表', res);
        if (res && res.state == '8848') {
          this.$message.error(res.info.message ? res.info.message : '分派失败');
        } else {
          this.tableData = res.dataResult;
          this.pageResult = res.pageResult;
        }
      });
    },
    // 在岗离岗
    isDuty(val) {
      console.log('在岗离岗', val);
      this.setDuty({
        onTheJob: val
      }).then(res => {
        this.onload();
      });
    },
    // 按钮点击类型
    btnClick(type) {
      // this.clickTypeTxt = info.label;
      // this.clickFlag = this.clickFlag ? false : true;
      switch (type) {
        case '批量挂起':
          if (this.multipleSelection.length > 0) {
            var ids = '';
            for (var i = 0; i < this.multipleSelection.length; i++) {
              if (i != this.multipleSelection.length - 1) {
                ids += this.multipleSelection[i].id + ',';
              } else {
                ids += this.multipleSelection[i].id;
              }
            }
            this.pendingCancel({
              ids: ids,
              type: 'suspend'
            }).then(res => {
              this.onload();
            });
          } else {
            this.$message.error('请至少选择一行再进行操作');
          }
          break;
        case '取消挂起':
          if (this.multipleSelection.length > 0) {
            var ids = '';
            for (var i = 0; i < this.multipleSelection.length; i++) {
              if (i != this.multipleSelection.length - 1) {
                ids += this.multipleSelection[i].id + ',';
              } else {
                ids += this.multipleSelection[i].id;
              }
            }
            this.pendingCancel({
              ids: ids,
              type: 'cancelSuspend'
            }).then(res => {
              this.onload();
            });
          } else {
            this.$message.error('请至少选择一行再进行操作');
          }
          break;
        case '退回申请':
          if (this.multipleSelection.length > 0) {
            var ids = '';
            for (var i = 0; i < this.multipleSelection.length; i++) {
              if (i != this.multipleSelection.length - 1) {
                ids += this.multipleSelection[i].id + ',';
              } else {
                ids += this.multipleSelection[i].id;
              }
            }
            this.dialogTitle = '批量退回申请';
            this.dialogVisibleTwo = true;
            this.returnIds = ids;
            this.$set(this.formInline, 'reason', '');
          } else {
            this.$message.error('请至少选择一行再进行操作');
          }
          break;
        case '自动提取任务':
          this.dialogTitle = '自动提取任务';
          this.$set(this.formInline, 'singleExtraction', '');
          this.queryMyGroupList({
            parameters: [],
            requestPage: {
              pageNo: 1,
              limit: 1000,
              totalCount: 45
            },
            sorts: []
          }).then(res => {
            this.myGroupList = res.dataResult;
          });
          this.dialogVisible = true;
          break;
        case '自助提取任务':
          this.dialogTitle = '自助提取任务';
          this.$set(this.formInline, 'singleExtraction', '');
          this.queryMyGroupList({
            parameters: [],
            requestPage: {
              pageNo: 1,
              limit: 1000,
              totalCount: 45
            },
            sorts: []
          }).then(res => {
            this.myGroupList = res.dataResult;
          });
          this.dialogVisible = true;
          break;
      }
    },
    closeDialog() {
      this.dialogVisible = false;
      this.dialogVisibleTwo = false;
    },
    // handleCurrentChange
    activeGroup(info) {
      this.activeGroupList = info;
    },
    // 提取任务
    taskExtractionFunc() {
      if (JSON.stringify(this.activeGroupList) != '{}' && this.activeGroupList != null) {
        var item = {};
        item['groupId'] = this.activeGroupList.id;
        if (this.dialogTitle == '自助提取任务') {
          item['number'] = this.activeGroupList.onceManPullNumber;
        }
        // else {
        //   item['number'] = '';
        // }
        this.taskExtraction(item).then(res => {
          this.onload();
          this.activeGroupList = {};
          this.closeDialog();
        });
      } else {
        this.$message.error('请选择要提取的业务组');
      }
    },
    singleExtractionFunc(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (formName == 'ruleFormTwo') {
            this.chargeback({
              ids: this.returnIds,
              type: 'back',
              reason: this.formInline.reason
            }).then(res => {
              this.onload();
            });
          }
          this.closeDialog();
        } else {
          return false;
        }
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