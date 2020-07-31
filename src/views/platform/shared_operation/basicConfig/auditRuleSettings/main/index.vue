<template>
  <div class="orgabox">
    <btnComponent :btnList="btnList" @btnClick="btnClick" />
    <tableComponent :pageResult="pageResult" @handleCurrentChange="handleCurrentChange" :tableData="tableData" @btnEditClick="btnEditClick" @btnDeleteClick="btnDeleteClick" />
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" width="768px" @close="close">
      <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-position="left">
        <el-form-item label="周规则名" prop="name">
          <el-input v-model="form.name" placeholder="请输入周规则名"></el-input>
        </el-form-item>
        <el-form-item label="周期" prop="cycle">
          <el-select v-model="form.cycle" placeholder="请选择周期">
            <el-option label="月" value="M"></el-option>
            <el-option label="季" value="S"></el-option>
            <el-option label="年" value="Y"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="被稽核人员" prop="userList">
          <div class="bsaList">
            <div class="newSelect" @click="innerVisible=true">
              <el-tag v-for="item in form.userList" :key="item.userId" :type="item.userId">
                {{item.userName}}
              </el-tag>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="提取最低阈值" prop="threshold">
          <el-input v-model="form.threshold" placeholder="请输入提取最低阈值"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
      </div>

      <el-dialog top="5vh" width="768px" title="选择员工" :visible.sync="innerVisible" append-to-body @close="userclose">
        <userList :innerVisible="innerVisible" :bsaList="form.userList" @getUser="getUser" @userclose="userclose" />
      </el-dialog>
    </el-dialog>
  </div>
</template>

<script>
import btnComponent from '@/views/platform/shared_operation/basicConfig/components/btnList.vue';
import tableComponent from './table';
import { createNamespacedHelpers } from 'vuex';
import userList from './userList.vue';
const { mapActions, mapState, mapGetters, mapMutations } = createNamespacedHelpers(
  'shared_operation/basiConfig'
);
export default {
  components: {
    btnComponent,
    tableComponent,
    userList
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
      innerVisible: false,
      form: {
        orgGroupName: '',
        name: '',
        cycle: '',
        value: '',
        threshold: '',
        userList: []
      },
      userListOption: [],
      orgGroupList: [],
      pageResult: { page: 1, totalCount: 0 },
      rules: {
        cycle: [{ required: true, message: '请选择周期', trigger: 'blur' }],
        userList: [{ required: true, message: '请选择被稽核人员', trigger: 'blur' }],
        value: [{ required: true, message: '请输入参数值（即时间长度）', trigger: 'blur' }],
        name: [{ required: true, message: '请输入周规则名', trigger: 'blur' }],
        threshold: [{ required: true, message: '请输入提取最低阈值', trigger: 'blur' }]
      }
    };
  },
  created() {
    this.onload();
  },
  methods: {
    ...mapActions(['auditRuleList', 'auditRuleListAddEdit', 'auditRuleListDelete']),
    onload() {
      this.auditRuleList({
        parameters: [],
        requestPage: {
          pageNo: this.pageResult.page,
          limit: 10,
          totalCount: 45
        },
        sorts: []
      }).then(res => {
        console.log('稽核规则列表', res);
        this.tableData = res.dataResult;
        this.pageResult = res.pageResult;
      });
    },
    // 翻页
    handleCurrentChange(page) {
      this.pageResult.page = page;
      this.onload();
    },
    // 选择员工
    getUser(info) {
      var arry = [];
      info.forEach(item => {
        var a = {
          userId: item.id,
          userName: item.name
        };
        arry.push(a);
      });
      console.log('选中员工', arry);
      this.userListOption = arry;
      this.form.userList = arry;
      this.userclose();
    },
    userclose() {
      this.innerVisible = false;
    },
    close() {
      this.form = {
        orgGroupName: '',
        name: '',
        cycle: '',
        value: '',
        threshold: '',
        userList: []
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
          this.auditRuleListAddEdit(this.form).then(res => {
            this.dialogFormVisible = false;
            this.onload();
          });
        } else {
          return false;
        }
      });
    },
    // 编辑稽核规则
    btnEditClick(info) {
      this.dialogTitle = '编辑稽核规则';
      this.dialogFormVisible = true;
      this.form = info;
      // console.log('编辑组织', info);
    },
    // 删除
    btnDeleteClick(info) {
      this.auditRuleListDelete({
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
          this.dialogTitle = '新增稽核规则';
          this.form = {
            orgGroupName: '',
            name: '',
            cycle: '',
            value: '',
            threshold: '',
            userList: []
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
      .bsaList {
        .newSelect {
          width: 188px;
          height: 32px;
          overflow: auto;
          border: 1px dashed #ccc;
          border-radius: 4px;
        }
        .el-input__suffix {
          display: none;
        }
      }
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