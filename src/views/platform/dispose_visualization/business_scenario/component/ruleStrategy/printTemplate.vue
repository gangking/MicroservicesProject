<template>
  <div class="tablelist">
    <el-table highlight-current-row @current-change="handleCurrentChange" :data="tabelData" border style="width: 100%" height="100%">
      <el-table-column prop="tpKey" label="打印模版主键" width="180">
      </el-table-column>
      <el-table-column prop="tpName" label="打印模版名称" width="180">
      </el-table-column>
      <el-table-column prop="bsKey" label="业务场景主键" width="200">
      </el-table-column>
      <el-table-column prop="bsCode" label="业务场景编码" width="200">
      </el-table-column>
      <el-table-column prop="bsiCode" label="业务情形编码" width="200">
      </el-table-column>
      <el-table-column prop="bsiDesc" label="业务情形描述">
      </el-table-column>
      <!-- <el-table-column prop="dataStatus" label="状态">
      </el-table-column> -->
    </el-table>

    <el-dialog top="5vh" append-to-body :title="dialogTitle" :visible.sync="dialogVisible" width="50%" :before-close="handleClose">
      <div class="formBox" style="height:350px; overflow:auto;">
        <el-form label-position="top" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="打印模板主键" prop="tpKey" placeholder='请输入打印模板主键'>
            <el-input v-model="ruleForm.tpKey"></el-input>
          </el-form-item>
          <el-form-item label="打印模板名称" prop="tpName" placeholder='请输入打印模板名称'>
            <el-input v-model="ruleForm.tpName"></el-input>
          </el-form-item>
          <el-form-item label="业务情形编码" prop="bsiCode" placeholder='请选择业务情形编码'>
            <!-- <el-input v-model="ruleForm.bsiCode"></el-input> -->
            <el-select @change="activeSituationData" v-model="ruleForm.bsiCode" placeholder="请选择业务情形编码">
              <!-- <el-option label="请选择" value=""></el-option> -->
              <el-option v-for="item in tabelSituationData" :key="item.bsiCode" :label="item.bsiCode" :value="item.bsiCode">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="业务情形描述" prop="bsiDesc" placeholder='请输入业务情形描述'>
            <el-input v-model="ruleForm.bsiDesc"></el-input>
          </el-form-item>
          <el-form-item label="排序" prop="sn" placeholder='请输入排序'>
            <el-input v-model="ruleForm.sn"></el-input>
          </el-form-item>
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
      tabelSituationData: [],
      ruleForm: {
        bsCode: '',
        bsKey: '',
        bsiCode: '',
        bsiDesc: '',
        sn: 0,
        tpKey: '',
        tpName: ''
      },
      rules: {
        tpKey: [{ required: true, message: '请输入打印模板主键', trigger: 'blur' }],
        tpName: [{ required: true, message: '请输入打印模板名称', trigger: 'blur' }],
        bsiCode: [{ required: true, message: '请输入业务情形编码', trigger: 'blur' }],
        bsiDesc: [{ required: true, message: '请输入业务情形描述', trigger: 'blur' }],
        sn: [{ required: true, message: '请输入排序', trigger: 'blur' }]
      }
    };
  },
  created() {
    this.queryBusinessSituation({
      bsKey: this.kDispose.sceneId
    }).then(list => {
      console.log('获取业务情形列表,', list);
      this.tabelSituationData = list;
    });
  },
  methods: {
    ...mapActions(['printTemplateSave', 'printTemplateDelete', 'queryBusinessSituation']),
    activeSituationData(bsiCode) {
      console.log('选了业务情形', bsiCode, this.tabelSituationData);
      var flag = false;
      this.tabelSituationData.forEach(item => {
        console.log('选了业务情形', bsiCode, item.bsiCode);
        if (item.bsiCode == bsiCode) {
          flag = true;
          this.$set(this.ruleForm, 'bsiDesc', item.bsiDesc);
        } else {
          // debugger;
          // this.$set(this.ruleForm, 'bsiDesc', '');
        }
      });
      if (!flag) {
        this.$set(this.ruleForm, 'bsiDesc', '');
      }
    },
    // 单选
    handleCurrentChange(info) {
      this.currentRow = info;
    },
    btnClick() {
      console.log('点击按钮', this.btnType);
      switch (this.btnType) {
        case '增加':
          this.ruleForm = {
            bsKey: this.kDispose.sceneId,
            bsCode: this.kDispose.sceneInfo.bsCode,
            bsiCode: '',
            bsiDesc: '',
            sn: 0,
            tpKey: '',
            tpName: ''
          };
          this.dialogTitle = '新增打印模板';
          this.dialogVisible = true;
          break;
        case '编辑':
          if (JSON.stringify(this.currentRow) != '{}' && this.currentRow != null) {
            this.ruleForm = this.currentRow;
            this.dialogTitle = '编辑打印模板';
            this.dialogVisible = true;
          } else {
            this.$message.error('请选择要编辑的打印模板');
          }
          break;
        case '删除':
          if (JSON.stringify(this.currentRow) != '{}' && this.currentRow != null) {
            this.printTemplateDelete({
              ids: this.currentRow.id
            }).then(res => {
              this.$emit('refresh');
              this.currentRow = {};
            });
          } else {
            this.$message.error('请选择要删除的打印模板');
          }
          break;
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.printTemplateSave(this.ruleForm).then(res => {
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
        bsiCode: '',
        bsiDesc: '',
        sn: 0,
        tpKey: '',
        tpName: ''
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