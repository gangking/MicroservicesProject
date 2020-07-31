<template>
  <div class="orgabox">
    <btnComponent :btnList="btnList" @btnClick="btnClick" />
    <tableComponent :pageResult="pageResult" @handleCurrentChange="handleCurrentChange" :tableData="tableData" @btnEditClick="btnEditClick" @btnDeleteClick="btnDeleteClick" />
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" width="768px" @close="close">
      <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-position="left">
        <el-form-item label="任务名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入任务名称"></el-input>
        </el-form-item>
        <!-- <el-form-item label="选择组织" prop="orgGroupName">
          <el-select @change="getSharePool" v-model="form.orgGroupName" placeholder="请选择组织">
            <el-option v-for="(item) in orgGroupList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="稽核池" prop="auditPoolId">
          <el-select @change="activeOneSharePool" v-model="form.auditPoolId" placeholder="请选择稽核池">
            <el-option v-for="(item) in auditPoolNameList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="稽核规则" prop="auditRuleName">
          <el-select @change="activeOneRule" v-model="form.auditRuleId" placeholder="请选择稽核规则">
            <el-option v-for="(item) in auditRuleNameList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>

        </el-form-item>
        <el-form-item label="稽核顺序" prop="auditPlanId">
          <el-select @change="activeOnePlan" v-model="form.auditPlanId" placeholder="请选择稽核顺序">
            <el-option v-for="(item) in auditPlanNameList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否只抽取末级业务范围" prop="level">
          <el-switch v-model="form.level" active-color="#13ce66" :active-text="form.level=='1'?'是':'否'" inactive-color="#ff4949" :active-value="1" :inactive-value="0">
          </el-switch>
          <!-- <el-select v-model="form.level" placeholder="是否只抽取末级业务范围">
            <el-option label="是" value="1"></el-option>
            <el-option label="否" value="0"></el-option>
          </el-select> -->
          <!-- <span>{{form.level=='1'?'是':'否'}}</span>
          <el-switch v-model="form.level" active-color="#13ce66" inactive-color="#ff4949">
          </el-switch> -->
        </el-form-item>
        <el-form-item label="定时任务" prop="taskJobName">
          <el-input :disabled="dialogTitle == '编辑稽核任务'" v-model="form.taskJobName" placeholder="请输入任务名称"></el-input>
        </el-form-item>
        <el-form-item label="周期/天" prop="scale">
          <el-input v-model="form.period" placeholder="请输入周期/天"></el-input>
        </el-form-item>
        <el-form-item label="抽取比例" prop="period">
          <el-input v-model="form.scale" placeholder="请输入抽取比例"></el-input>
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
      dialogTitle: '',
      dialogFormVisible: false,
      form: {
        orgGroupName: '',
        name: '',
        auditPoolName: '',
        auditPoolId: '',
        taskJobName: '',
        taskJobId: '',
        auditRuleName: '',
        auditRuleId: '',
        auditPlanId: '',
        auditPlanName: '',
        period: '',
        scale: '',
        level: 0
      },
      orgGroupList: [],
      auditPoolNameList: [],
      auditPlanNameList: [],
      auditRuleNameList: [],
      pageResult: { page: 1, totalCount: 0 },
      rules: {
        // auditPoolId: [{ required: true, message: '请选择稽核池', trigger: 'blur' }],
        taskJobName: [
          { required: true, message: '请输入定时任务', trigger: 'blur' },
          {
            pattern: /^[^\u4E00-\u9FA5]+$/, // 只能输入英文
            message: '定时任务不能输入汉字'
          }
        ],
        auditRuleId: [{ required: true, message: '请选择稽核规则', trigger: 'blur' }],
        auditPlanId: [{ required: true, message: '请选择稽核顺序', trigger: 'blur' }],
        name: [{ required: true, message: '请输入任务名称', trigger: 'blur' }],
        scale: [{ required: true, message: '请输入周期/天', trigger: 'blur' }],
        period: [{ required: true, message: '请输入抽取比例', trigger: 'blur' }]
      }
    };
  },
  created() {
    // this.tableData = require('./data.json').list;
    this.groupTree().then(res => {
      console.log('获取组织列表', res);
      this.orgGroupList = res;
      this.onload();
      this.auditPlanList({
        parameters: [],
        requestPage: {
          pageNo: 1,
          limit: 10000,
          totalCount: 45
        },
        sorts: []
      }).then(res => {
        console.log('稽核顺序列表', res);
        this.auditPlanNameList = res.dataResult;
      });
      this.auditRuleList({
        parameters: [],
        requestPage: {
          pageNo: 1,
          limit: 10000,
          totalCount: 45
        },
        sorts: []
      }).then(res => {
        console.log('稽核规则列表', res);
        this.auditRuleNameList = res.dataResult;
      });
    });
  },
  methods: {
    ...mapActions([
      'auditTaskList',
      'auditTaskListAddEdit',
      'auditTaskListDelete',
      'groupTree',
      'sharedPollList',
      'auditPlanList',
      'auditRuleList'
    ]),
    onload() {
      this.auditTaskList({
        parameters: [],
        requestPage: {
          pageNo: this.pageResult.page,
          limit: 10,
          totalCount: 45
        },
        sorts: []
      }).then(res => {
        console.log('稽核任务列表', res);
        if (res && res.state == '8848') {
          this.$message.error(res.info.message ? res.info.message : '分派失败');
        } else {
          this.tableData = res.dataResult;
          this.pageResult = res.pageResult;
        }
      });
    },
    // 根据组织查稽核池
    getSharePool(val) {
      this.sharedPollList({
        parameters: [
          { key: 'Q^share_pool^SL', value: 'Y' },
          { key: 'Q^org_group_id^SL', value: val }
        ],
        requestPage: {
          pageNo: 1,
          limit: 100000,
          totalCount: 6
        },
        sorts: []
      }).then(res => {
        console.log('共享池列表', res);
        this.auditPoolNameList = res.dataResult;
        if (res.dataResult.length > 0) {
          this.form.auditPoolId = res.dataResult[0].id;
          this.form.auditPoolName = res.dataResult[0].name;
        }
      });
    },
    activeOneSharePool(info) {
      console.log('选择稽核池1', info);
      this.auditPoolNameList.forEach(item => {
        if (item.id == info) {
          this.form.auditPoolName = item.name;
        }
      });
    },
    activeOneRule(info) {
      this.auditRuleNameList.forEach(item => {
        if (item.id == info) {
          this.form.auditRuleName = item.name;
        }
      });
    },
    activeOnePlan(info) {
      this.auditPlanNameList.forEach(item => {
        if (item.id == info) {
          this.form.auditPlanName = item.name;
        }
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
        name: '',
        auditPoolName: '',
        auditPoolId: '',
        taskJobName: '',
        taskJobId: '',
        auditRuleName: '',
        auditRuleId: '',
        auditPlanId: '',
        auditPlanName: '',
        period: '',
        scale: '',
        level: 0
      };
      this.dialogFormVisible = false;
    },
    // 选中执行组织
    activeGroup() {
      for (var i = 0; i < this.orgGroupList.length; i++) {
        var item = this.orgGroupList[i];
        if (item.id == this.form.name) {
          this.form['orgGroupName'] = item.name;
        }
      }
    },
    // 提交组织表单
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.auditTaskListAddEdit(this.form).then(res => {
            this.dialogFormVisible = false;
            this.onload();
            if (res && res.state == '8848') {
              this.$message.error('保存失败！注意：名称不可重复！');
            }
          });
        } else {
          return false;
        }
      });
    },
    // 编辑稽核规则
    btnEditClick(info) {
      this.dialogTitle = '编辑稽核任务';
      this.form = info;
      // this.$set(this.form, 'level', info.level ? '1' : '0');
      // this.form.assign({},info)
      this.dialogFormVisible = true;
      // console.log('编辑稽核任务设置赋值', info);
    },
    // 删除
    btnDeleteClick(info) {
      this.auditTaskListDelete({
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
          this.dialogTitle = '新增稽核任务';
          this.form = {
            orgGroupName: '',
            name: '',
            auditPoolName: '',
            auditPoolId: '',
            taskJobName: '',
            taskJobId: '',
            auditRuleName: '',
            auditRuleId: '',
            auditPlanId: '',
            auditPlanName: '',
            period: '',
            scale: '',
            level: 0
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