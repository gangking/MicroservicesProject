<template>
  <div class="teambox">
    <search />
    <btnComponent :btnList="btnList" @btnClick="btnClick" />
    <tableComponent :pageResult="pageResult" @handleCurrentChange="handleCurrentChange" :tableData="tableData" @btnEditClick="btnEditClick" @btnStartClick="btnStartClick" @btnStopClick="btnStopClick" @btnDeleteClick="btnDeleteClick" @getMultipleSelection="getMultipleSelection" />
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" width="768px" @close="close">
      <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-position="left">
        <el-form-item label="年度" prop="yearNumber">
          <el-input v-model="form.yearNumber"></el-input>
        </el-form-item>
        <el-form-item label="执行组织" prop="orgGroupId">
          <el-select @change="activeGroup" v-model="form.orgGroupId" placeholder="请选择执行组织">
            <el-option v-for="(item) in orgGroupList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="法定假日" prop="legalHoliday">
          <!-- <el-input v-model="form.legalHoliday"></el-input> -->
          <el-date-picker type="dates" v-model="form.legalHoliday" placeholder="设置法定假日" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
        <el-form-item label=" 假日" prop="sanyHoliday">
          <!-- <el-input v-model="form.sanyHoliday"></el-input> -->
          <el-date-picker type="dates" v-model="form.sanyHoliday" placeholder="设置 假日" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="周末" prop="weekendList">
          <!-- <el-input v-model="form.weekendList"></el-input> -->
          <el-date-picker type="dates" v-model="form.weekendList" placeholder="设置周末" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="form.status" placeholder="请选择状态">
            <el-option label="启用" value="actived"></el-option>
            <el-option label="停用" value="deleted"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import search from './search';
import btnComponent from '@/views/platform/shared_operation/basicConfig/components/btnList.vue';
import tableComponent from './table';
import { createNamespacedHelpers } from 'vuex';
const { mapActions, mapState, mapGetters, mapMutations } = createNamespacedHelpers(
  'shared_operation/basiConfig'
);
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
          label: '新增',
          func: ''
        },
        {
          label: '导入',
          func: ''
        },
        {
          label: '导出',
          func: ''
        },
        {
          label: '批量删除',
          func: ''
        },
        {
          label: '批量停用',
          func: ''
        }
      ],
      tableData: [],
      dialogTitle: '新增工作日',
      dialogFormVisible: false,
      form: {
        yearNumber: '',
        legalHoliday: '',
        sanyHoliday: '',
        weekendList: '',
        orgGroupName: '',
        status: '',
        orgGroupId: ''
      },
      orgGroupList: [],
      pageResult: { page: 1, totalCount: 0 },
      rules: {
        yearNumber: [{ required: true, message: '请输入年度', trigger: 'blur' }],
        legalHoliday: [{ required: true, message: '请输入法定假日', trigger: 'blur' }],
        sanyHoliday: [{ required: true, message: '请输入 假日', trigger: 'blur' }],
        weekendList: [{ required: true, message: '请输入周末', trigger: 'blur' }],
        orgGroupId: [{ required: true, message: '请选择执行组织', trigger: 'blur' }],
        status: [{ required: true, message: '请选择执行状态', trigger: 'blur' }]
      },
      multipleList: [] // 当前选中的工作日
    };
  },
  created() {
    // this.tableData = require('./data.json').list;
    this.groupTree().then(res => {
      console.log('获取组织列表', res);
      this.orgGroupList = res;
      this.onload();
    });
  },
  methods: {
    ...mapActions(['workingDateList', 'workingDateAddEdit', 'workingDateDeleteStop', 'groupTree']),
    onload() {
      this.workingDateList({
        parameters: [],
        requestPage: {
          pageNo: this.pageResult.page,
          limit: 10,
          totalCount: 45
        },
        sorts: []
      }).then(res => {
        console.log('工作日列表', res);
        this.tableData = res.dataResult;
        this.pageResult = res.pageResult;
      });
    },
    // 翻页
    handleCurrentChange(page) {
      this.pageResult.page = page;
      this.onload();
    },
    // 选中执行组织
    activeGroup() {
      for (var i = 0; i < this.orgGroupList.length; i++) {
        var item = this.orgGroupList[i];
        if (item.id == this.form.orgGroupId) {
          this.form['orgGroupName'] = item.name;
        }
      }
    },
    close() {
      this.form = {
        yearNumber: '',
        legalHoliday: '',
        sanyHoliday: '',
        weekendList: '',
        orgGroupName: '',
        status: '',
        orgGroupId: ''
      };
      this.dialogFormVisible = false;
    },
    // 提交组织表单
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // this.addOredit();
          var parmas = JSON.parse(JSON.stringify(this.form));
          // if (this.dialogTitle != '编辑工作日') {
          parmas.legalHoliday = !(parmas.legalHoliday instanceof Array)
            ? parmas.legalHoliday
            : parmas.legalHoliday.join();
          parmas.sanyHoliday = !(parmas.sanyHoliday instanceof Array)
            ? parmas.sanyHoliday
            : parmas.sanyHoliday.join();
          parmas.weekendList = !(parmas.weekendList instanceof Array)
            ? parmas.weekendList
            : parmas.weekendList.join();
          // }
          this.workingDateAddEdit(parmas).then(res => {
            this.dialogFormVisible = false;
            this.onload();
          });
        } else {
          return false;
        }
      });
    },
    // 编辑组织
    btnEditClick(info) {
      this.dialogTitle = '编辑工作日';
      this.dialogFormVisible = true;
      this.form = info;
      // console.log('编辑组织', info);
    },
    // 停用
    btnStopClick(info) {
      if (info.status == 'deleted') {
        this.$message.error('当前组织已停用');
        return;
      }
      this.workingDateDeleteStop({
        ids: info.id,
        type: 'stop'
      }).then(res => {
        // 刷新表格
        this.onload();
      });
    },
    // 启用
    btnStartClick(info) {
      if (info.status == 'actived') {
        this.$message.error('当前工作日已启动');
        return;
      }
      var parmas = JSON.parse(JSON.stringify(info));
      parmas['status'] = 'actived';
      this.workingDateAddEdit(parmas).then(res => {
        // 刷新表格
        this.onload();
      });
    },
    // 删除
    btnDeleteClick(info) {
      this.workingDateDeleteStop({
        ids: info.id,
        type: 'deleted'
      }).then(res => {
        // 刷新表格
        this.onload();
      });
    },
    // 按钮组点击事件
    btnClick(type) {
      switch (type) {
        case '新增':
          this.dialogTitle = '新增工作日';
          this.form = {
            yearNumber: '',
            legalHoliday: '',
            sanyHoliday: '',
            weekendList: '',
            orgGroupName: '',
            status: '',
            orgGroupId: ''
          };
          this.dialogFormVisible = true;
          break;
        case '导入':
          break;
        case '导出':
          break;
        case '批量删除':
          if (this.multipleList.length > 0) {
            var ids = '';
            for (var i = 0; i < this.multipleList.length; i++) {
              if (i != this.multipleList.length - 1) {
                ids += this.multipleList[i].id + ',';
              } else {
                ids += this.multipleList[i].id;
              }
            }
            this.workingDateDeleteStop({
              ids: ids,
              type: 'deleted'
            }).then(res => {
              // 刷新表格
              this.onload();
            });
          } else {
            this.$message.error('请至少选择一行再进行操作');
          }
          break;
        case '批量停用':
          if (this.multipleList.length > 0) {
            var ids = '';
            for (var i = 0; i < this.multipleList.length; i++) {
              if (i != this.multipleList.length - 1) {
                ids += this.multipleList[i].id + ',';
              } else {
                ids += this.multipleList[i].id;
              }
            }
            this.workingDateDeleteStop({
              ids: ids,
              type: 'stop'
            }).then(res => {
              // 刷新表格
              this.onload();
            });
          } else {
            this.$message.error('请至少选择一行再进行操作');
          }
          break;
      }
    },
    // 选中工作日
    getMultipleSelection(list) {
      this.multipleList = list;
    }
  }
};
</script>

<style lang="scss" scoped>
.teambox {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: white;
  /deep/ .el-form {
    .el-form-item {
      .el-form-item__label {
        width: 108px !important;
        text-align: right;
      }
      .el-select--small {
        width: 188px !important;
      }
      .el-date-editor {
        width: 188px !important;
      }
    }
  }
}
</style>