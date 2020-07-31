<template>
  <el-dialog title="审批加签" :visible.sync="dialogVisible" :close-on-click-modal="false" :close-on-press-escape="false" class="delegate-dialog" top="1vh" width="80%" @open="loadSelData" @close="closeDialog" append-to-body>
    <div class="title">
      <span class="redblock"></span>
      <p>审批加签</p>
    </div>

    <div class="search">
      <span class="mr15">类型选择:</span>
      <el-radio-group v-model="addInfo" @change="getAddInfo">
        <el-radio label="P" class="mr30">加签前(在当前节点之前添加处理人)</el-radio>
        <el-radio label="S">加签后(在当前节点之后添加处理人)</el-radio>
      </el-radio-group>
    </div>

    <div class="person">
      <span class="mr15">加签人员选择:</span>
      <el-button type="primary" plain class="elbtn" @click="addData">
        <i class="iconfont icon-jiaqianzhuijia iconbtn" />
        <span class="icontext">加签追加</span>
      </el-button>
      <el-button type="danger" plain class="elbtn" @click="delData">
        <i class="iconfont icon-jiaqianshanchu iconbtn" />
        <span class="icontext">加签删除</span>
      </el-button>
      <el-button type="success" plain class="elbtn" @click="comData">
        <i class="iconfont icon-jiaqianqueren iconbtn" />
        <span class="icontext">加签确认</span>
      </el-button>
    </div>

    <div class="table">
      <el-table :data="tableData" height="100%" style="width: 100%" v-loading="loading" element-loading-background="rgba(250, 250, 250, 0.5)" :header-cell-style="{color:'#000'}" :row-class-name="tableRowClassName" @selection-change="getRow">
        <el-table-column type="selection" width="45" align="center"></el-table-column>
        <el-table-column type="index" label="加签顺序" width="80" align="center" />
        <el-table-column label="顺序调整" align="center" width="100">
          <template slot-scope="scope">
            <el-button type="primary" plain size="mini" :disabled="scope.$index===0" @click="moveUp(scope.$index,scope.row)" class="arrbtn">
              <i class="el-icon-arrow-up"></i>
            </el-button>
            <el-button type="primary" plain size="mini" :disabled="scope.$index===(tableData.length-1)" @click="moveDown(scope.$index,scope.row)" class="arrbtn">
              <i class="el-icon-arrow-down"></i>
            </el-button>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="员工姓名" width="120"></el-table-column>
        <el-table-column prop="userno" label="员工工号" width="180"></el-table-column>
        <el-table-column prop="butxt" label="公司描述"></el-table-column>
        <el-table-column prop="orgtxt" label="部门描述"></el-table-column>
        <el-table-column prop="domainAccount" label="域账号"></el-table-column>
        <!-- <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="primary" plain class="elbtn" @click="confirm(scope.$index, scope.row)">
              <i class="iconfont icon-zhuanban iconbtn" />
              <span class="icontext">人员选择</span>
            </el-button>
          </template>
        </el-table-column>-->
      </el-table>
    </div>

    <div class="foot">
      <el-pagination :current-page.sync="selcurrentpage" :page-size="10" layout="total, prev, pager, next, jumper" :total="selPageAll" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>

    <!-- 添加人员 -->
    <el-dialog title="添加人员" :visible.sync="addvisible" class="selectBox" :close-on-click-modal="false" :show-close="false" :modal="true" :append-to-body="true" width="70%" top="3vh">
      <div class="searchPerson">
        <div class="option">
          <p>员工姓名:</p>
          <el-input v-model="form.name"></el-input>
        </div>
        <div class="option">
          <p>员工工号:</p>
          <el-input v-model="form.number"></el-input>
        </div>
        <div class="option">
          <p>公司描述:</p>
          <el-input v-model="form.comdes"></el-input>
        </div>
        <div class="option">
          <p>部门描述:</p>
          <el-input v-model="form.depdes"></el-input>
        </div>
        <el-button type="primary" plain class="elbtn" @click="loadData">
          <i class="iconfont icon-search iconbtn" />
          <span class="icontext">搜索</span>
        </el-button>
      </div>
      <div class="addTable">
        <el-table :data="selTableData" height="100%" style="width: 100%" v-loading="selloading" element-loading-background="rgba(250, 250, 250, 0.5)" :header-cell-style="{color:'#000'}" :row-class-name="tableRowClassName" @selection-change="getAddRow" ref="multipleTable">
          <el-table-column type="selection" width="45" align="center"></el-table-column>
          <el-table-column prop="name" label="员工姓名" width="120"></el-table-column>
          <el-table-column prop="userno" label="员工工号" width="180"></el-table-column>
          <el-table-column prop="butxt" label="公司描述"></el-table-column>
          <el-table-column prop="orgtxt" label="部门描述"></el-table-column>
          <el-table-column prop="domainAccount" label="域账号"></el-table-column>
        </el-table>
      </div>
      <div class="foot">
        <el-pagination :current-page.sync="currentpage" :page-size="10" layout="total, prev, pager, next, jumper" :total="pageAll.totalCount" @size-change="handleSizeChange" @current-change="handleSelCurrentChange" />
      </div>
      <div class="combtn">
        <el-button type="primary" class="btn" @click="saveCom">确定</el-button>
        <el-button type="primary" class="btn" @click="cancelCom">取消</el-button>
      </div>
    </el-dialog>

    <!-- 审批意见 -->
    <el-dialog title="审批意见" :visible.sync="comvisible" class="comBox" :close-on-click-modal="false" :show-close="false" :modal="true" :append-to-body="true" width="40%" top="25vh">
      <el-input type="textarea" :rows="8" placeholder="请输入内容" v-model="addForm.opinion" resize="none"></el-input>
      <div class="combtn">
        <el-button type="primary" class="btn" @click="saveAdd">确定</el-button>
        <el-button type="primary" class="btn" @click="cancelAdd">取消</el-button>
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
    title: String,
    outerSkin: Object
  },
  data() {
    return {
      formName: 'form',
      formLabelWidth: '90px',
      dialogVisible: this.visible,
      dialogLoading: false,
      selectorVisible: false,
      loading: false,
      selloading: false,
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
      comvisible: false,
      addForm: {
        instId: '',
        taskId: '',
        userId: '',
        opinion: ''
      },
      addInfo: '',
      multipleSelection: [],
      addRows: [],
      selData: [],
      selTableData: [],
      selcurrentpage: 1,
      selPageAll: 0
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
    selChange(selection, row) {
      console.log('selection', selection);
      console.log('row', row);
    },
    getRow(val) {
      this.multipleSelection = val;
      console.log('multipleSelection', this.multipleSelection);
    },
    getAddRow(val) {
      this.selData = val;
      console.log('selData', this.selData);
    },
    // 增加
    addData() {
      this.loadData();
      // this.selData = [];
      // this.selData = this.tableData;
      // this.toggleSelection(this.tableData);
      this.addvisible = true;
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    // 删除
    delData() {
      this.delInfo(this.tableData, this.multipleSelection, 'id');
    },
    delInfo(arr1, arr2, key) {
      for (let i = 0; i < arr2.length; i++) {
        for (let j = 0; j < arr1.length; j++) {
          if (arr1[j][key] === arr2[i][key]) {
            arr1.splice(j, 1);
          }
        }
      }
    },
    // 确认
    comData() {
      let selId = [];
      this.tableData.forEach(item => {
        selId.push(item.id);
      });
      this.addForm.userId = selId.toString();
      if (this.addForm.userId == '') {
        this.$message({
          showClose: true,
          message: '请选择加签人!',
          type: 'error'
        });
      } else if (this.addInfo == '') {
        this.$message({
          showClose: true,
          message: '请选择类型!',
          type: 'error'
        });
      } else {
        this.addForm.opinion = '';
        // this.addForm.userId = row.id;
        this.comvisible = true;
      }
    },
    moveUp(index, row) {
      var that = this;
      // console.log("上移", index, row);
      // console.log(that.tableData[index]);
      if (index > 0) {
        let upDate = that.tableData[index - 1];
        that.tableData.splice(index - 1, 1);
        that.tableData.splice(index, 0, upDate);
      } else {
        alert('已经是第一条，不可上移');
      }
    },

    moveDown(index, row) {
      var that = this;
      // console.log("下移", index, row);
      if (index + 1 === that.tableData.length) {
        alert('已经是最后一条，不可下移');
      } else {
        // console.log(index);
        let downDate = that.tableData[index + 1];
        that.tableData.splice(index + 1, 1);
        that.tableData.splice(index, 0, downDate);
      }
    },
    getAddInfo() {
      console.log('addInfo', this.addInfo);
    },
    getFormData() {
      this.dialogLoading = true;
      get({
        id: this.formId,
        taskId: this.taskId,
        instId: this.instId
      })
        .then(response => {
          const data = response.data;
          this.form = data;
          console.log('form', this.form);

          this.dialogLoading = false;
        })
        .catch(() => {
          this.dialogLoading = false;
        });
    },
    // 关闭当前窗口
    closeDialog() {
      this.$emit('close', false);
    },
    loadSelData() {
      // this.loading = true;
      // return request({
      //   baseURL: BASE_GATEWAY_API,
      //   url: SYSTEM_URL + "/user/v3/employee/queryByTaskAssign?taskId=" + this.taskId,
      //   method: "get"
      // })
      //   .then(res => {
      //     this.loading = false;
      //     this.tableData = res.data.dataResult;
      //   })
      //   .catch(() => {
      //     this.loading = false;
      //   });
    },
    loadData() {
      this.selloading = true;
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
      })
        .then(res => {
          console.log('getMsgType', res);
          this.selTableData = res.data.dataResult;
          this.pageAll = res.data.pageResult;
          this.selloading = false;
        })
        .catch(() => {
          this.selloading = false;
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
      // this.addvisible = true;
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.currentpage = val;
    },
    handleSelCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.currentpage = val;
      this.loadData();
    },
    saveCom() {
      let allData = this.tableData.concat(this.selData);
      this.tableData = this.unique(allData, 'id');
      this.selPageAll = this.tableData.length;
      this.addvisible = false;
    },
    cancelCom() {
      this.addvisible = false;
    },
    unique(arr, key) {
      const res = new Map();
      return arr.filter(a => !res.has(a[key]) && res.set(a[key], 1));
    },
    saveAdd() {
      showLoading();
      return request({
        baseURL: BASE_GATEWAY_API,
        url: FORM_URL + '/bpm/v3/bpm/task/addSign',
        method: 'post',
        data: {
          instId: this.instId,
          taskId: this.taskId,
          userIds: this.addForm.userId,
          opinion: this.addForm.opinion,
          type: this.addInfo
        }
      })
        .then(res => {
          this.$message({
            message: '加签成功!',
            type: 'success'
          });
          this.outerSkin.handleClose();
          hideLoading();
        })
        .catch(res => {
          hideLoading();
          this.$message({
            message: res.message,
            type: 'error'
          });
        });
    },
    cancelAdd() {
      this.comvisible = false;
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
    padding: 10px 20px !important;
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
.mr15 {
  margin-right: 15px;
}
.mr30 {
  margin-right: 30px;
}
.search {
  margin-top: 10px;
  height: 26px;
  line-height: 26px;
}
.person {
  margin-top: 10px;
  .elbtn {
    margin-right: 20px;
  }
}
.table {
  margin-top: 10px;
  height: 460px;
  /deep/ .arrbtn {
    padding: 5px 8px !important;
  }
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
.selectBox {
  /deep/ .el-dialog__body {
    padding: 0px 20px 20px !important;
  }
  .searchPerson {
    // margin-top: 10px;
    margin-bottom: 10px;
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
      p {
        margin-bottom: 5px;
      }
    }
    .elbtn {
      padding: 8px 15px;
    }
  }
}

.addTable {
  height: 448px;
}
</style>
