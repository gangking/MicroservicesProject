<template>
  <el-dialog title="转办人员选择" :visible.sync="dialogVisible" :close-on-click-modal="false" :close-on-press-escape="false" class="delegate-dialog" top="1vh" width="80%" @open="loadData" @close="closeDialog" append-to-body>
    <div class="title">
      <span class="redblock"></span>
      <p>人员查询</p>
    </div>

    <div class="search">
      <div class="option">
        <span>员工姓名:</span>
        <el-input v-model="form.name"></el-input>
      </div>
      <div class="option">
        <span>员工工号:</span>
        <el-input v-model="form.number"></el-input>
      </div>
      <div class="option">
        <span>公司描述:</span>
        <el-input v-model="form.comdes"></el-input>
      </div>
      <div class="option">
        <span>部门描述:</span>
        <el-input v-model="form.depdes"></el-input>
      </div>
      <el-button type="primary" plain class="elbtn" @click="loadData">
        <i class="iconfont icon-search iconbtn" />
        <span class="icontext">搜索</span>
      </el-button>
    </div>

    <div class="table">
      <el-table :data="tableData" height="100%" style="width: 100%" v-loading="loading" element-loading-background="rgba(250, 250, 250, 0.5)" :header-cell-style="{color:'#000'}" :row-class-name="tableRowClassName">
        <el-table-column prop="name" label="员工姓名" width="120"></el-table-column>
        <el-table-column prop="userno" label="员工工号" width="180"></el-table-column>
        <el-table-column prop="butxt" label="公司描述"></el-table-column>
        <el-table-column prop="orgtxt" label="部门描述"></el-table-column>
        <el-table-column prop="domainAccount" label="域账号"></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="primary" plain class="elbtn" @click="confirm(scope.$index, scope.row)">
              <i class="iconfont icon-zhuanban iconbtn" />
              <span class="icontext">确认转办</span>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="foot">
      <el-pagination :current-page.sync="currentpage" :page-size="10" layout="total, prev, pager, next, jumper" :total="pageAll.totalCount" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>

    <!-- 确认转办 -->
    <el-dialog title="审批意见" :visible.sync="addvisible" class="selectBox" :close-on-click-modal="false" :show-close="false" :modal="true" :append-to-body="true" width="40%" top="25vh">
      <el-input type="textarea" :rows="8" placeholder="请输入内容" v-model="addForm.opinion" resize="none"></el-input>
      <div class="combtn">
        <el-button type="primary" class="btn" @click="saveCom">确定</el-button>
        <el-button type="primary" class="btn" @click="cancelCom">取消</el-button>
      </div>
    </el-dialog>
  </el-dialog>
</template>

<script>
import { changeTypeOptions, changeTypeStatusOptions } from '../constants';
import { save, edit as get } from '@/api/platform/bpmn/bpmTaskChange';
import IbpsEmployeeSelector from '@/business/platform/org/employee/selector';
import IbpsEmployeeSelectorDialog from '@/business/platform/org/employee/dialog';
import ActionUtils from '@/utils/action';
import request from '@/utils/request';
import { SYSTEM_URL, BASE_GATEWAY_API, FORM_URL } from '@/api/baseUrl';
import { showLoading, hideLoading } from '@/utils/loading';

export default {
  // computed: {
  //   ...mapStateGlobal(["taskId", "instId", "table_head_id"])
  // },
  components: {
    IbpsEmployeeSelector,
    IbpsEmployeeSelectorDialog
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    readonly: {
      type: Boolean,
      default: false
    },
    id: String,
    taskId: String,
    instId: String,
    outerSkin: Object,
    title: String
  },
  data() {
    return {
      formName: 'form',
      formLabelWidth: '90px',
      dialogVisible: this.visible,
      dialogLoading: false,
      selectorVisible: false,
      loading: false,
      form: {
        name: '',
        number: '',
        comdes: '',
        depdes: ''
      },
      tableData: [],
      currentpage: 1,
      pageAll: {},
      addvisible: false,
      addForm: {
        instId: '',
        taskId: '',
        userId: '',
        opinion: ''
      }
    };
  },
  computed: {},
  watch: {
    visible: {
      handler: function(val, oldVal) {
        this.dialogVisible = this.visible;
      },
      immediate: true
    }
  },
  mounted() {
    // this.loadData();
  },
  methods: {
    // getFormData() {
    //   this.dialogLoading = true;
    //   get({
    //     id: this.formId,
    //     taskId: this.taskId,
    //     instId: this.instId,
    //     outerSkin: this.outerSkin,
    //   })
    //     .then(response => {
    //       const data = response.data;
    //       this.form = data;
    //       // this.formValidate()
    //       this.dialogLoading = false;
    //     })
    //     .catch(() => {
    //       this.dialogLoading = false;
    //     });
    // },
    // 关闭当前窗口
    closeDialog() {
      this.$emit('close', false);
    },

    loadData() {
      this.loading = true;
      return request({
        baseURL: BASE_GATEWAY_API,
        url: SYSTEM_URL + '/user/v3/employee/queryWithShift',
        method: 'post',
        data: {
          parameters: [
            {
              key: 'Q^NAME_^SL',
              value: this.form.name
            },
            {
              key: 'Q^USERNO_^SL',
              value: this.form.number
            },
            {
              key: 'Q^BUTXT^SL',
              value: this.form.comdes
            },
            {
              key: 'Q^ORGTXT^SL',
              value: this.form.depdes
            }
          ],
          requestPage: {
            pageNo: this.currentpage,
            limit: 10,
            totalCount: 100
          },
          sorts: []
        }
      }).then(res => {
        console.log('getMsgType', res);
        this.tableData = res.data.dataResult;
        this.pageAll = res.data.pageResult;
        this.loading = false;
      });
    },
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex % 2 == 0) {
        return 'warning-row';
      } else {
        return 'success-row';
      }
    },
    confirm(index, row) {
      console.log(index, row);
      this.addForm.opinion = '';
      this.addForm.userId = row.id;
      this.addvisible = true;
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.currentpage = val;
      this.loadData();
    },
    saveCom() {
      this.addvisible = false;
      showLoading();
      return request({
        baseURL: BASE_GATEWAY_API,
        url: FORM_URL + '/bpm/v3/bpm/task/shift',
        method: 'post',
        data: {
          instId: this.instId,
          taskId: this.taskId,
          userId: this.addForm.userId,
          opinion: this.addForm.opinion
        }
      }).then(res => {
        hideLoading();
        this.$message({
          message: '转办成功!',
          type: 'success'
        });
        // this.$emit('close')
        // 退出表单
        this.outerSkin.handleClose();
      });
    },
    cancelCom() {
      this.addvisible = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.delegate-dialog {
  .form {
    margin-top: 15px;
  }
  .el-dialog__header {
    padding-top: 15px !important;
    /deep/ .el-dialog__title {
      color: #0066a9 !important;
      font-size: 16px;
    }
  }
  .el-dialog__body {
    padding: 10px 20px;
    height: 90%;
    height: calc(100vh - 130px) !important;
  }
}
/deep/ .el-table .warning-row {
  background: oldlace;
}

/deep/ .el-table .success-row {
  background: #f0f9eb;
}
.title {
  position: relative;
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 4px;
  width: 200px;
  height: 24px;
  border-bottom: 2px solid #ccc;
  .redblock {
    position: absolute;
    top: 1px;
    display: inline-block;
    width: 5px;
    height: 17px;
    background-color: #e61a23;
  }
  p {
    position: absolute;
    left: 15px;
    top: 0;
    margin: 0;
    width: 200px;
  }
}
.search {
  margin-top: 10px;
  .el-input {
    width: 150px;
    .el-input__inner {
      height: 28px;
      line-height: 28px;
      width: 150px;
    }
  }
  .option {
    display: inline-block;
    width: 22%;
  }
  .elbtn {
    padding: 8px 15px;
  }
}
.table {
  margin-top: 10px;
  height: 540px;
}
.foot {
  width: 560px;
  margin: 13px auto;
}
.combtn {
  margin-top: 15px;
  padding-left: 29%;
  .btn {
    margin: 0 30px;
  }
}
</style>
