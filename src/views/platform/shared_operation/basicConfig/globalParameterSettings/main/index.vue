<template>
  <div class="orgabox">
    <btnComponent :btnList="btnList" @btnClick="btnClick" />
    <tableComponent :pageResult="pageResult" @handleCurrentChange="handleCurrentChange" :tableData="tableData" @btnEditClick="btnEditClick" @btnStartClick="btnStartClick" @btnStopClick="btnStopClick" @btnDeleteClick="btnDeleteClick" />
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" width="768px" @close="close">
      <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-position="left">
        <el-form-item label="执行组织" prop="orgGroupId">
          <el-select @change="activeGroup" v-model="form.orgGroupId" placeholder="请选择执行组织">
            <el-option v-for="(item) in orgGroupList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="全局类型" prop="gobalType">
          <el-select v-model="form.gobalType" placeholder="请选择全局类型">
            <el-option label="超时类型" value="O"></el-option>
            <el-option label="异常类型" value="E"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="时间长度" prop="value">
          <el-input v-model="form.value"></el-input>
        </el-form-item>
        <el-form-item label="时间单位" prop="valueUnit">
          <el-select v-model="form.valueUnit" placeholder="请选择时间单位">
            <el-option label="天" value="D"></el-option>
            <el-option label="小时" value="H"></el-option>
            <el-option label="分钟" value="M"></el-option>
          </el-select>
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
import btnComponent from '@/views/platform/shared_operation/basicConfig/components/btnList.vue';
import tableComponent from './table';
import { createNamespacedHelpers } from 'vuex';
const { mapActions, mapState, mapGetters, mapMutations } = createNamespacedHelpers(
  'shared_operation/basiConfig'
);
export default {
  components: {
    btnComponent,
    tableComponent
  },
  data() {
    return {
      btnList: [
        {
          label: '新增',
          type: 'add'
        }
      ],
      tableData: [],
      dialogTitle: '新增工作日',
      dialogFormVisible: false,
      form: {
        orgGroupName: '',
        orgGroupId: '',
        gobalType: '',
        value: '',
        status: '',
        valueUnit: ''
      },
      orgGroupList: [],
      pageResult: { page: 1, totalCount: 0 },
      rules: {
        gobalType: [{ required: true, message: '请选择全局类型', trigger: 'blur' }],
        valueUnit: [{ required: true, message: '请选择时间单位', trigger: 'blur' }],
        value: [{ required: true, message: '请输入参数值（即时间长度）', trigger: 'blur' }],
        orgGroupId: [{ required: true, message: '请选择执行组织', trigger: 'blur' }],
        status: [{ required: true, message: '请选择执行状态', trigger: 'blur' }]
      }
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
    ...mapActions(['gobalParamList', 'gobalParamAddEdit', 'gobalParamDeleteStop', 'groupTree']),
    onload() {
      this.gobalParamList({
        parameters: [],
        requestPage: {
          pageNo: this.pageResult.page,
          limit: 10,
          totalCount: 45
        },
        sorts: []
      }).then(res => {
        console.log('全局参数列表', res);
        this.tableData = res.dataResult;
        this.pageResult = res.pageResult;
      });
    },
    // 翻页
    handleCurrentChange(page) {
      this.pageResult.page = page;
      this.onload();
    },
    close() {
      this.form = {
        orgGroupName: '',
        orgGroupId: '',
        gobalType: '',
        value: '',
        status: '',
        valueUnit: ''
      };
      this.dialogFormVisible = false;
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
    // 提交组织表单
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.gobalParamAddEdit(this.form).then(res => {
            this.dialogFormVisible = false;
            this.onload();
          });
        } else {
          return false;
        }
      });
    },
    // 编辑参数
    btnEditClick(info) {
      this.dialogTitle = '编辑参数';
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
      this.gobalParamDeleteStop({
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
        this.$message.error('当前参数已启动');
        return;
      }
      var parmas = JSON.parse(JSON.stringify(info));
      parmas['status'] = 'actived';
      this.gobalParamAddEdit(parmas).then(res => {
        // 刷新表格
        this.onload();
      });
    },
    // 删除
    btnDeleteClick(info) {
      this.gobalParamDeleteStop({
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
          this.dialogTitle = '新增参数';
          this.form = {
            orgGroupName: '',
            orgGroupId: '',
            gobalType: '',
            value: '',
            status: '',
            valueUnit: ''
          };
          this.dialogFormVisible = true;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.orgabox {
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