<template>
  <div class="tablelist">
    <el-table highlight-current-row @current-change="handleCurrentChange" :data="tabelData" border style="width: 100%" height="100%">
      <el-table-column prop="btCode" label="业务事务编码" width="180">
      </el-table-column>
      <el-table-column prop="btDescribe" label="业务事务描述">
      </el-table-column>
      <el-table-column prop="secondaryBo" label="次级BO" width="180">
      </el-table-column>
      <el-table-column prop="isProcess" label="是否显示处理进度" width="180">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.showHandle" active-value="Y" inactive-value="N" disabled>
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="isFormStatus" label="是否显示表单状态" width="180">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.showStatus" active-value="Y" inactive-value="N" disabled>
          </el-switch>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="bTstatus" label="状态">
      </el-table-column> -->
    </el-table>

    <el-dialog top="5vh" append-to-body :title="dialogTitle" :visible.sync="dialogVisible" width="50%" :before-close="handleClose">
      <div class="formBox" style="height:350px; overflow:auto;">
        <el-form label-position="top" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="业务事务编码" prop="btCode" placeholder='请输入业务事务编码'>
            <el-input v-model="ruleForm.btCode"></el-input>
          </el-form-item>
          <el-form-item label="业务事务描述" prop="btDescribe" placeholder='请输入业务事务描述'>
            <el-input v-model="ruleForm.btDescribe"></el-input>
          </el-form-item>
          <el-form-item label="次级BO" prop="secondaryBo" placeholder='请输入次级BO'>
            <el-input v-model="ruleForm.secondaryBo"></el-input>
          </el-form-item>
          <el-form-item label="是否显示处理进度" prop="showHandle" placeholder='是否显示处理进度'>
            <!-- <template slot-scope="scope"> -->
            <el-switch v-model="ruleForm.showHandle" active-color="#13ce66" inactive-color="#ff4949" active-value="Y" inactive-value="N">
            </el-switch>
            <!-- </template> -->
          </el-form-item>
          <el-form-item label="是否显示表单状态" prop="showStatus" placeholder='是否显示表单状态'>
            <!-- <template slot-scope="scope"> -->
            <el-switch v-model="ruleForm.showStatus" active-color="#13ce66" inactive-color="#ff4949" active-value="Y" inactive-value="N">
            </el-switch>
            <!-- </template> -->
          </el-form-item>
          <!-- <el-form-item label="显示样式" prop="style" placeholder='请输入显示样式'>
            <el-input v-model="ruleForm.style"></el-input>
          </el-form-item>
          <el-form-item label="业务事务状态" prop="bTstatus" placeholder='请输入业务事务状态'>
            <el-input v-model="ruleForm.bTstatus"></el-input>
          </el-form-item> -->
        </el-form>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
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
      currentRow: {},
      dialogTitle: '',
      dialogVisible: false,
      ruleForm: {
        bTstatus: '',
        btCode: '',
        btDescribe: '',
        secondaryBo: '',
        showHandle: 'Y',
        showStatus: 'Y',
        style: '',
        bsKey: '',
        bsId: ''
      },
      rules: {
        btCode: [{ required: true, message: '请输入业务事务编码', trigger: 'blur' }],
        btDescribe: [{ required: true, message: '请输入业务事务描述', trigger: 'blur' }],
        secondaryBo: [{ required: true, message: '请输入次级BO', trigger: 'blur' }],
        // style: [{ required: true, message: '请输入显示样式', trigger: 'blur' }],
        // bTstatus: [{ required: true, message: '请输入业务事务状态', trigger: 'blur' }]
      }
    };
  },
  methods: {
    ...mapActions(['multipleFormDefinitionSave', 'multipleFormDefinitionDelete']),
    // 单选
    handleCurrentChange(info) {
      this.currentRow = info;
    },
    btnClick() {
      console.log('点击按钮', this.btnType);
      switch (this.btnType) {
        case '增加':
          this.ruleForm = {
            bTstatus: '',
            btCode: '',
            btDescribe: '',
            secondaryBo: '',
            showHandle: 'Y',
            showStatus: 'Y',
            style: '',
            bsKey: this.kDispose.sceneId,
            bsId: this.kDispose.sceneInfo.bsCode
          };
          this.dialogTitle = '新增多行业务事务定义';
          this.dialogVisible = true;
          break;
        case '编辑':
          if (JSON.stringify(this.currentRow) != '{}' && this.currentRow != null) {
            this.ruleForm = this.currentRow;
            this.dialogTitle = '编辑多行业务事务定义';
            this.dialogVisible = true;
          } else {
            this.$message.error('请选择要编辑的多行业务事务定义');
          }
          break;
        case '删除':
          console.log('删除', this.currentRow);
          if (JSON.stringify(this.currentRow) != '{}' && this.currentRow != null) {
            this.multipleFormDefinitionDelete({
              ids: this.currentRow.id
            }).then(res => {
              this.$emit('refresh');
              this.currentRow = {};
              this.handleClose();
            });
          } else {
            this.$message.error('请选择要删除的多行业务事务定义');
          }
          break;
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.multipleFormDefinitionSave(this.ruleForm).then(res => {
            this.$emit('refresh');
            this.currentRow = {};
            this.handleClose();
          });
        } else {
          return false;
        }
      });
    },
    handleClose() {
      this.ruleForm = {
        bsCode: '',
        bsKey: '',
        secondaryBo: '',
        style: '',
        bTstatus: 0,
        btCode: '',
        btDescribe: ''
      };
      this.dialogVisible = false;
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