<template>
  <div class="tablelist">
    <el-table :data="tabelData" highlight-current-row @current-change="handleCurrentChange" border style="width: 100%" height="100%">
      <el-table-column prop="bsiCode" label="业务情形编码">
      </el-table-column>
      <el-table-column prop="bsiDesc" label="业务情形描述">
      </el-table-column>
      <!-- <el-table-column prop="status" label="状态">
      </el-table-column> -->
    </el-table>
    <el-dialog append-to-body :title="btnName" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
      <el-form label-position="top" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="业务情形编码" prop="bsiCode" placeholder='请输入业务情形编码'>
          <el-input v-model="ruleForm.bsiCode"></el-input>
        </el-form-item>
        <el-form-item label="业务情形描述" prop="bsiDesc" placeholder='请输入业务情形描述'>
          <el-input v-model="ruleForm.bsiDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
const { mapActions, mapState, mapGetters, mapMutations } = createNamespacedHelpers(
  'ibps/frontVisualizations'
);
export default {
  props: {
    tabelData: {
      type: Array,
      default: () => {
        return [];
      }
    },
    btnName: {
      type: String,
      default: ''
    },
    btnClickFlag: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    btnClickFlag: {
      handler(val) {
        console.log('点击按钮了', this.btnName, this.currentRow);
        if (this.btnName) {
          switch (this.btnName) {
            case '增加':
              this.dialogVisible = true;
              this.ruleForm = {
                bsiCode: '',
                bsiDesc: ''
              };
              this.currentRow = {};
              break;
            case '编辑':
              if (JSON.stringify(this.currentRow) != '{}' && this.currentRow != null) {
                this.dialogVisible = true;
                this.ruleForm = {
                  bsiCode: this.currentRow.bsiCode,
                  bsiDesc: this.currentRow.bsiDesc
                };
              } else {
                // alert('请先选择要编辑的数据');
                this.$message.error('请先选择要编辑的数据');
              }
              break;
            case '删除':
              if (JSON.stringify(this.currentRow) != '{}' && this.currentRow != null) {
                this.setRemoveBusinessSituation();
              } else {
                // alert('请先选择要删除的数据');
                this.$message.error('请先选择要编辑的数据');
              }
              break;
          }
        }
      },
      immediate: true
    }
  },
  inject: ['kDispose'],
  data() {
    return {
      currentRow: {}, // 选中的行数据
      dialogVisible: false,
      ruleForm: {
        bsiCode: '',
        bsiDesc: ''
      },
      rules: {
        bsiCode: [{ required: true, message: '请输入业务情形编码', trigger: 'blur' }],
        bsiDesc: [{ required: true, message: '请输入业务情形描述', trigger: 'blur' }]
      }
    };
  },
  methods: {
    ...mapActions(['saveBusinessSituation', 'removeBusinessSituation']),
    // 选中行
    handleCurrentChange(val) {
      this.currentRow = val;
      this.$emit('getActiveRow', val);
    },
    handleClose() {
      this.dialogVisible = false;
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.dialogVisible = false;
          this.setSaveBusinessSituation();
        } else {
          return false;
        }
      });
    },
    // 新增或编辑业务情形
    setSaveBusinessSituation() {
      var form = {
        bsCode: this.kDispose.bsCode, //业务场景编码
        bsDesc: this.kDispose.bsDescribe, //业务场景描述
        bsKey: this.kDispose.sceneId, //业务场景主键
        bsiCode: this.ruleForm.bsiCode, //业务情形编码
        bsiDesc: this.ruleForm.bsiDesc, //业务情形描述
        id: this.currentRow.id //主键ID
      };
      this.saveBusinessSituation(form).then(res => {
        this.$emit('refreshTabel', {
          type: '业务情形'
        });
      });
    },
    // 删除业务情形
    setRemoveBusinessSituation() {
      this.removeBusinessSituation({
        ids: this.currentRow.id
      }).then(res => {
        this.ruleForm = {
          bsiCode: '',
          bsiDesc: ''
        };
        this.currentRow = {};
        this.$emit('refreshTabel', {
          type: '业务情形'
        });
      });
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