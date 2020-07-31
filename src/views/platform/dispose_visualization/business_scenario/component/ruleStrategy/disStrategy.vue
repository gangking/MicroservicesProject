<template>
  <div class="tablelist">
    <el-table highlight-current-row @current-change="handleCurrentChange" :data="tabelData" border style="width: 100%" height="100%">
      <el-table-column prop="stepNo" label="步骤号" width="60">
      </el-table-column>
      <el-table-column prop="stepDescribe" label="分布描述">
      </el-table-column>
      <el-table-column prop="slcfKey" label="单行业务事务主键" width="160">
      </el-table-column>
      <el-table-column prop="slcfId" label="单行业务事务编码" width="160">
      </el-table-column>
      <el-table-column prop="btDescribe" label="多行业务事务描述">
      </el-table-column>
      <el-table-column prop="btKey" label="多行业务事务主键" width="120">
      </el-table-column>
      <el-table-column prop="btId" label="多行业务事务Id" width="120">
      </el-table-column>
      <el-table-column prop="stepContainer" label="渲染表单方式" width="100">
      </el-table-column>
      <!-- <el-table-column prop="dataStatus" label="状态">
      </el-table-column> -->
    </el-table>

    <el-dialog top="5vh" append-to-body :title="dialogTitle" :visible.sync="dialogVisible" width="50%" :before-close="handleClose">
      <div class="formBox" style="height:350px; overflow:auto;">
        <el-form label-position="top" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="步骤号" prop="stepNo" placeholder='请输入步骤号'>
            <el-input v-model="ruleForm.stepNo"></el-input>
          </el-form-item>
          <el-form-item label="分步策略描述" prop="stepDescribe" placeholder='请输入分步策略描述'>
            <el-input v-model="ruleForm.stepDescribe"></el-input>
          </el-form-item>
          <el-form-item label="渲染表单方式" prop="stepContainer" placeholder='请输入渲染表单方式'>
            <el-input v-model="ruleForm.stepContainer"></el-input>
          </el-form-item>
          <el-form-item label="单行业务事务" prop="slcfKey" placeholder='请选择单行业务事务'>
            <!-- <el-input v-model="ruleForm.slcfKey"></el-input> -->
            <el-select @change="activeSingle" v-model="ruleForm.slcfKey" placeholder="请选择单行业务事务">
              <el-option label="请选择" value=""></el-option>
              <el-option v-for="item in tabelSingleData" :key="item.id" :label="item.bsDescribe" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="单行业务事务编码" prop="slcfId" placeholder='请输入单行业务事务编码'>
            <el-input v-model="ruleForm.slcfId"></el-input>
          </el-form-item>
          <el-form-item label="多行业务事务" prop="btId" placeholder='请选择多行业务事务'>
            <!-- <el-input v-model="ruleForm.btId"></el-input> -->
            <el-select @change="activeMulti" v-model="ruleForm.btId" placeholder="请选择多行业务事务">
              <el-option label="请选择" value=""></el-option>
              <el-option v-for="item in tabelMultiData" :key="item.id" :label="item.btDescribe" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="多行业务事务描述" prop="btDescribe" placeholder='请输入多行业务事务描述'>
            <el-input v-model="ruleForm.btDescribe"></el-input>
          </el-form-item>
          <el-form-item label="多行业务事务主键" prop="btKey" placeholder='请输入多行业务事务主键'>
            <el-input v-model="ruleForm.btKey"></el-input>
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
      tabelSingleData: [],
      tabelMultiData: [],
      dialogVisible: false,
      ruleForm: {
        bsId: '',
        bsKey: '',
        btDescribe: '',
        btId: '',
        btKey: '',
        slcfId: '',
        slcfKey: '',
        stepContainer: '',
        stepDescribe: '',
        stepIcon: '',
        stepNo: ''
      },
      rules: {
        stepNo: [{ required: true, message: '请输入步骤号', trigger: 'blur' }],
        stepDescribe: [{ required: true, message: '请输入分步策略描述', trigger: 'blur' }],
        // slcfKey: [{ required: true, message: '请输入单行业务事务主键', trigger: 'blur' }],
        // slcfId: [{ required: true, message: '请输入单行业务事务编码', trigger: 'blur' }],
        // btKey: [{ required: true, message: '请输入多行业务事务主键', trigger: 'blur' }],
        // btId: [{ required: true, message: '请输入多行业务事务ID', trigger: 'blur' }],
        // btDescribe: [{ required: true, message: '请输入多行业务事务描述', trigger: 'blur' }],
        stepContainer: [{ required: true, message: '请输入渲染表单方式', trigger: 'blur' }]
      }
    };
  },
  created() {
    this.singleFormDefinition({
      bsKey: this.kDispose.sceneId
    }).then(res => {
      this.tabelSingleData = res;
      console.log('单行业务事务业务事务定义查询', res);
    });
    this.multipleFormDefinition({
      bsKey: this.kDispose.sceneId
    }).then(res => {
      this.tabelMultiData = res;
      console.log('多行业务事务表单定义查询', res);
    });
  },
  methods: {
    ...mapActions([
      'distributionStrategySave',
      'distributionStrategyDelete',
      'singleFormDefinition',
      'multipleFormDefinition'
    ]),
    activeSingle(id) {
      var flag = false;
      this.tabelSingleData.forEach(item => {
        if (item.id == id) {
          flag = true;
          this.$set(this.ruleForm, 'slcfId', item.slcfId);
        } else {
          // this.$set(this.ruleForm,'slcfId','')
        }
      });
      if (!flag) {
        this.$set(this.ruleForm,'slcfId','')
      }
    },
    activeMulti(id) {
      var flag = false;
      this.tabelMultiData.forEach(item => {
        if (item.id == id) {
          flag = true;
          this.$set(this.ruleForm, 'btDescribe', item.btDescribe);
          this.$set(this.ruleForm, 'btKey', item.id);
        } else {
          // this.$set(this.ruleForm,'btDescribe','')
          // this.$set(this.ruleForm,'btKey','')
        }
      });
      if (!flag) {
        this.$set(this.ruleForm, 'btDescribe', '');
        this.$set(this.ruleForm, 'btKey', '');
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
            bsId: this.kDispose.sceneInfo.bsCode,
            bsKey: this.kDispose.sceneId,
            btDescribe: '',
            btId: '',
            btKey: '',
            slcfId: '',
            slcfKey: '',
            stepContainer: '',
            stepDescribe: '',
            stepIcon: '',
            stepNo: ''
          };
          this.dialogTitle = '新增分步策略';
          this.dialogVisible = true;
          break;
        case '编辑':
          if (JSON.stringify(this.currentRow) != '{}' && this.currentRow != null) {
            this.ruleForm = this.currentRow;
            this.dialogTitle = '编辑分步策略';
            this.dialogVisible = true;
          } else {
            this.$message.error('请选择要编辑的分步策略');
          }
          break;
        case '删除':
          if (JSON.stringify(this.currentRow) != '{}' && this.currentRow != null) {
            this.distributionStrategyDelete({
              ids: this.currentRow.id
            }).then(res => {
              this.$emit('refresh');
            });
          } else {
            this.$message.error('请选择要删除的分步策略');
          }
          break;
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.distributionStrategySave(this.ruleForm).then(res => {
            this.$emit('refresh');
            this.handleClose();
          });
        } else {
          return false;
        }
      });
    },
    handleClose() {
      this.ruleForm = {
        bsId: '',
        bsKey: '',
        btDescribe: '',
        btId: '',
        btKey: '',
        slcfId: '',
        slcfKey: '',
        stepContainer: '',
        stepDescribe: '',
        stepIcon: '',
        stepNo: ''
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