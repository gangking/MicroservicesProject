<template>
  <div class="tablelist">
    <el-table highlight-current-row @current-change="handleCurrentChange" :data="tabelData" border style="width: 100%" height="100%">
      <el-table-column prop="formCode" label="表单编码">
      </el-table-column>
      <el-table-column prop="formDescribe" label="表单描述">
      </el-table-column>
      <el-table-column prop="sfqzscfj" label="是否强制上传附件">
        <template slot-scope="scope">
          <el-switch disabled v-model="scope.row.sfqzscfj" active-color="#13ce66" inactive-color="#ff4949" active-value="1" inactive-value="0">
          </el-switch>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="status" label="状态">
      </el-table-column> -->
    </el-table>
    <el-dialog @close="closeFunc" top="3vh" width="50%" :title="dialogTitle" :visible.sync="innerVisible" append-to-body>
      <div class="formBox" style="height: 300px;overflow: auto;">
        <el-form label-position="top" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="表单编码" prop="formCode">
            <el-input v-model="ruleForm.formCode"></el-input>
          </el-form-item>
          <el-form-item label="表单描述" prop="formDescribe">
            <el-input v-model="ruleForm.formDescribe"></el-input>
          </el-form-item>
          <el-form-item label="是否强制上传附件" prop="sfqzscfj">
            <!-- <el-input v-model="ruleForm.sfqzscfj"></el-input> -->
            <el-switch v-model="ruleForm.sfqzscfj" active-color="#13ce66" inactive-color="#ff4949" active-value="1" inactive-value="0">
            </el-switch>
          </el-form-item>
          <!-- <el-form-item label="表单版本" prop="formVersion">
            <el-input v-model="ruleForm.formVersion"></el-input>
          </el-form-item>
          <el-form-item label="表单状态" prop="status">
            <el-switch v-model="ruleForm.status" active-color="#13ce66" inactive-color="#ff4949" :active-value="1" :inactive-value="0">
            </el-switch>
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
        formCode: '',
        bcKey: '',
        bcId: '',
        formDescribe: '',
        formVersion: '',
        status: 1,
        lock: 1,
        sfqzscfj: '1'
      },
      rules: {
        formDescribe: [{ required: true, message: '请输入表单描述', trigger: 'blur' }],
        // formVersion: [{ required: true, message: '请输入表单版本', trigger: 'change' }],
        // lock: [{ required: true, message: '请输入排他锁', trigger: 'change' }],
        formCode: [{ required: true, message: '请输入表单编码', trigger: 'change' }],
        // status: [{ required: true, message: '请输入表单状态', trigger: 'change' }]
      }
    };
  },
  methods: {
    ...mapActions([
      'multipleBusTypeFormSetDefinitionSave',
      'multipleBusTypeFormSetDefinitionDelete'
    ]),
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
            formDescribe: '',
            formVersion: '',
            bcKey: this.thisId,
            bcId: this.thisCode,
            lock: '',
            formCode: '',
            status: 1,
            sfqzscfj: '1'
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
            this.multipleBusTypeFormSetDefinitionDelete({
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
          this.multipleBusTypeFormSetDefinitionSave(this.ruleForm).then(res => {
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
        formCode: '',
        bcKey: '',
        bcId: '',
        formDescribe: '',
        formVersion: '',
        status: '',
        lock: '',
        sfqzscfj: '1'
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