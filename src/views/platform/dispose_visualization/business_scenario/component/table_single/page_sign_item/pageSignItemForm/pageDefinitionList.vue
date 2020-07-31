<template>
  <div class="tablelist">
    <el-table highlight-current-row @current-change="handleCurrentChange" :data="tabelData" border style="width: 100%" height="100%">
      <el-table-column prop="slcfTabKey" label="表单分配表主键" width="180">
      </el-table-column>
      <el-table-column prop="slcfTabId" label="表单分配表ID" width="200">
      </el-table-column>
      <el-table-column prop="formCode" label="表单编码">
      </el-table-column>
      <el-table-column prop="describe" label="表单描述">
      </el-table-column>
      <!-- <el-table-column prop="status" label="状态">
      </el-table-column> -->
    </el-table>
    <el-dialog @close="closeFunc"  width="50%" :title="dialogTitle" :visible.sync="innerVisible" append-to-body>
      <div class="formBox" style="height: 200px;overflow: auto;">
        <el-form label-position="top" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="表单编码" prop="formCode">
            <el-input v-model="ruleForm.formCode"></el-input>
          </el-form-item>
          <el-form-item label="表单描述" prop="describe">
            <el-input v-model="ruleForm.describe"></el-input>
          </el-form-item>
          <!-- <el-form-item label="表单版本" prop="version">
            <el-input v-model="ruleForm.version"></el-input>
          </el-form-item>
          <el-form-item label="表单状态" prop="status">
            <el-input v-model="ruleForm.status"></el-input>
          </el-form-item>
          <el-form-item label="排它锁" prop="lock">
            <el-input v-model="ruleForm.lock"></el-input>
          </el-form-item> -->
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('ruleForm')">确认</el-button>
        <el-button @click="closeFunc">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
const { mapActions } = createNamespacedHelpers('ibps/frontVisualizations');
export default {
  props: {
    tabelData: {
      type: Array,
      default: () => {
        return [];
      }
    },
    thisId: {
      type: String,
      default: ''
    },
    thisCode: {
      type: String,
      default: ''
    },
    clickFlag: {
      type: Boolean,
      default: false
    },
    buttonType: {
      type: String,
      default: ''
    }
  },
  watch: {
    clickFlag(val) {
      if (this.buttonType) {
        this.btnType = this.buttonType;
        this.btnClick();
      }
    }
  },
  data() {
    return {
      btnType: '',
      dialogTitle: '新增表单分配',
      innerVisible: false,
      currentRow: {},
      ruleForm: {
        describe: '',
        version: '',
        slcfTabId: '',
        slcfTabKey: '',
        lock: '',
        formCode: '',
        status: ''
      },
      rules: {
        describe: [{ required: true, message: '请输入表单描述', trigger: 'blur' }],
        // version: [{ required: true, message: '请输入表单版本', trigger: 'change' }],
        // lock: [{ required: true, message: '请输入排他锁', trigger: 'change' }],
        formCode: [{ required: true, message: '请输入表单编码', trigger: 'change' }],
        // status: [{ required: true, message: '请输入表单状态', trigger: 'change' }]
      }
    };
  },
  methods: {
    ...mapActions(['singleFormItemDefinitionSave', 'singleFormItemDefinitionDelete']),
    handleCurrentChange(val) {
      // this.$emit('handleCurrentChange',val)
      this.currentRow = val;
    },
    btnClick() {
      console.log('点击按钮', this.btnType);
      switch (this.btnType) {
        case '增加':
          this.dialogTitle = '新增表单分配';
          this.innerVisible = true;
          this.ruleForm = {
            describe: '',
            version: '',
            slcfTabId: this.thisCode,
            slcfTabKey: this.thisId,
            lock: '',
            formCode: '',
            status: ''
          };
          break;
        case '编辑':
          if (JSON.stringify(this.currentRow) != '{}' && this.currentRow != null) {
            this.ruleForm = this.currentRow;
            this.dialogTitle = '编辑表单分配';
            this.innerVisible = true;
          } else {
            this.$message.error('请选择要编辑的表单分配。');
          }
          break;
        case '删除':
          if (JSON.stringify(this.currentRow) != '{}' && this.currentRow != null) {
            this.singleFormItemDefinitionDelete({
              ids: this.currentRow.id
            }).then(res => {
              this.$emit('refreshPage');
              this.currentRow = {};
              this.closeFunc();
            });
          } else {
            this.$message.error('请选择要删除的表单分配。');
          }
          break;
      }
    },
    // 提交
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.singleFormItemDefinitionSave(this.ruleForm).then(res => {
            // this.onload();
            this.$emit('refreshPage');
            this.currentRow = {};
            this.closeFunc();
          });
        } else {
          return false;
        }
      });
    },
    closeFunc() {
      this.ruleForm = {
        describe: '',
        version: '',
        slcfTabId: '',
        slcfTabKey: '',
        lock: '',
        formCode: '',
        status: ''
      };
      this.innerVisible = false;
    }
  }
};
</script>

<style lang="scss" scoped>
/deep/ .el-dialog {
  .el-dialog__body {
    .el-form {
      .el-form-item__label {
        padding: 0;
      }
    }
  }
}
.tablelist {
  height: calc(100% - 45px);
  box-sizing: border-box;
  // overflow: auto;
  // background: yellow;
}
</style>