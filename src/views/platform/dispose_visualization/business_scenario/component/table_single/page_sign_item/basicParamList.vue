<template>
  <div class="tablelist">
    <el-table highlight-current-row @current-change="handleCurrentChange" :data="tabelData" border style="width: 100%" height="100%">
      <el-table-column prop="subtabId" label="页签编码" width="130">
      </el-table-column>
      <el-table-column prop="describe" label="页签描述">
      </el-table-column>
      <el-table-column prop="sn" label="排序" width="50">
      </el-table-column>
      <el-table-column prop="renderMode" label="渲染方式">
      </el-table-column>
      <!-- <el-table-column prop="btg" label="业务事务组">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.btg" active-value="Y" inactive-value="N" disabled>
          </el-switch>
        </template>
      </el-table-column> -->
      <el-table-column prop="tabEnhance" label="页面增强">
      </el-table-column>
      <!-- <el-table-column prop="dataStatus" label="状态" width="120">
      </el-table-column> -->
    </el-table>

    <el-dialog @close="closeFunc" top="3vh" width="50%" :title="dialogTitle" :visible.sync="innerVisible" append-to-body>
      <div class="formBox" style="height: 400px;overflow: auto;">
        <el-form label-position="top" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="页签编码" prop="subtabId">
            <el-input v-model="ruleForm.subtabId"></el-input>
          </el-form-item>
          <el-form-item label="页签定义描述" prop="describe">
            <el-input v-model="ruleForm.describe"></el-input>
          </el-form-item>
          <el-form-item label="渲染方式" prop="renderMode">
            <el-input v-model="ruleForm.renderMode"></el-input>
          </el-form-item>
          <!-- <el-form-item label="业务事务组" prop="btg">
            <el-switch v-model="ruleForm.btg" active-text="是" inactive-text="否" active-value="Y" inactive-value="N">
            </el-switch>
          </el-form-item> -->
          <el-form-item label="排序" prop="sn">
            <el-input v-model="ruleForm.sn"></el-input>
          </el-form-item>
          <el-form-item label="页面增强" prop="tabEnhance">
            <el-input v-model="ruleForm.tabEnhance"></el-input>
          </el-form-item>
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
  inject: ['kDispose'],
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
      dialogTitle: '新增页签定义',
      innerVisible: false,
      currentRow: {},
      ruleForm: {
        describe: '',
        renderMode: '下划线',
        slcfId: '',
        slcfKey: '',
        sn: '1',
        subtabId: '',
        tabEnhance: 'payableDynamicForm',
        btg: 'N'
      },
      rules: {
        describe: [{ required: true, message: '请输入页签描述', trigger: 'blur' }],
        renderMode: [{ required: true, message: '请输入渲染方式', trigger: 'change' }],
        sn: [{ required: true, message: '请设置序号', trigger: 'change' }],
        subtabId: [{ required: true, message: '请输入页签编码', trigger: 'change' }],
        tabEnhance: [{ required: true, message: '请输入增强方式', trigger: 'change' }]
      }
    };
  },
  methods: {
    ...mapActions(['singleFormPageDefinitionSave', 'singleFormPageDefinitionDelete']),
    handleCurrentChange(val) {
      // this.$emit('handleCurrentChange',val)
      this.currentRow = val;
    },
    btnClick() {
      console.log('点击按钮', this.btnType);
      switch (this.btnType) {
        case '增加':
          this.dialogTitle = '新增页签定义';
          this.innerVisible = true;
          this.ruleForm = {
            describe: '',
            renderMode: '下划线',
            slcfId: this.thisCode,
            slcfKey: this.thisId,
            sn: '1',
            subtabId: '',
            tabEnhance: 'payableDynamicForm',
            btg: 'N'
          };
          break;
        case '编辑':
          if (JSON.stringify(this.currentRow) != '{}' && this.currentRow != null) {
            this.ruleForm = this.currentRow;
            this.dialogTitle = '编辑页签定义';
            this.innerVisible = true;
          } else {
            this.$message.error('请选择要编辑的页签定义。');
          }
          break;
        case '删除':
          if (JSON.stringify(this.currentRow) != '{}' && this.currentRow != null) {
            this.singleFormPageDefinitionDelete({
              ids: this.currentRow.id
            }).then(res => {
              this.$emit('refreshPage');
              this.currentRow = {};
              this.closeFunc();
            });
          } else {
            this.$message.error('请选择要删除的页签定义。');
          }
          break;
      }
    },
    // 提交
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.singleFormPageDefinitionSave(this.ruleForm).then(res => {
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
        renderMode: '下划线',
        slcfId: '',
        slcfKey: '',
        sn: '1',
        subtabId: '',
        tabEnhance: 'payableDynamicForm',
        btg: 'N'
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