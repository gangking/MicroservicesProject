<template>
  <div class="tablelist">
    <el-table highlight-current-row @current-change="handleCurrentChange" :data="tabelData" border style="width: 100%" height="100%">
      <el-table-column prop="fieldDescribe" label="字段描述">
      </el-table-column>
      <el-table-column prop="fieldName" label="字段名">
      </el-table-column>
      <el-table-column prop="showName" label="显示名称">
      </el-table-column>
      <!-- <el-table-column prop="style" label="显示样式">
        <template slot-scope="scope">
          <p v-html="scope.row.style"></p>
        </template>
      </el-table-column> -->
      <el-table-column prop="dataType" label="数据类型">
      </el-table-column>
    </el-table>

    <el-dialog @close="closeFunc" top="3vh" width="50%" :title="dialogTitle" :visible.sync="innerVisible" append-to-body>
      <div class="formBox" style="height: 350px;overflow: auto;padding: 0 10px;box-sizing: border-box;">
        <el-form label-position="top" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <!-- <el-form-item label="公式" prop="foemula">
            <el-input v-model="ruleForm.foemula"></el-input>
          </el-form-item>
          <el-form-item label="增强方式" prop="enhance">
            <el-input v-model="ruleForm.enhance"></el-input>
          </el-form-item> -->
          <el-form-item label="字段描述" prop="fieldDescribe">
            <el-input v-model="ruleForm.fieldDescribe"></el-input>
          </el-form-item>
          <el-form-item label="数位长度222" prop="precision">
            <el-input v-model="ruleForm.precision"></el-input>
          </el-form-item>
          <el-form-item label="字段名" prop="fieldName">
            <el-input v-model="ruleForm.fieldName"></el-input>
          </el-form-item>
          <el-form-item label="显示名称" prop="showName">
            <el-input v-model="ruleForm.showName"></el-input>
          </el-form-item>
          <!-- <el-form-item label="显示样式" prop="style">
            <ibps-ueditor v-model="ruleForm.style" ref="ueditorIbps"/>
          </el-form-item> -->
          <el-form-item label="数据类型" prop="dataType">
            <el-select v-model="ruleForm.dataType" placeholder="请选择数据类型">
              <el-option label="tinyint" value="tinyint"></el-option>
              <el-option label="int" value="int"></el-option>
              <el-option label="bigint" value="bigint"></el-option>
              <el-option label="float" value="float"></el-option>
              <el-option label="double" value="double"></el-option>
              <el-option label="decimal" value="decimal"></el-option>
              <el-option label="char" value="char"></el-option>
              <el-option label="varchar" value="varchar"></el-option>
              <el-option label="datatime" value="datatime"></el-option>
              <el-option label="data" value="data"></el-option>
              <el-option label="time" value="time"></el-option>
              <el-option label="year" value="year"></el-option>
              <el-option label="timeatamp" value="timeatamp"></el-option>
            </el-select>
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
import IbpsUeditor from "@/components/ibps-ueditor/indexTwo.vue";
export default {
  components:{
    IbpsUeditor
  },
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
      dialogTitle: '新增字段',
      innerVisible: false,
      currentRow: {},
      ruleForm: {
        btId: '',
        btKey: '',
        enhance: '',
        fieldDescribe: '',
        fieldName: '',
        foemula: '',
        precision: 0,
        showName: '',
        style: '',
        dataType: ''
      },
      rules: {
        // enhance: [{ required: true, message: '请输入增强方式', trigger: 'blur' }],
        // foemula: [{ required: true, message: '请输入公式', trigger: 'change' }],
        fieldDescribe: [{ required: true, message: '请输入字段描述', trigger: 'change' }],
        fieldName: [{ required: true, message: '请输入字段名', trigger: 'change' }],
        precision: [{ required: true, message: '请输入数位长度', trigger: 'change' }],
        showName: [{ required: true, message: '请输入显示名称', trigger: 'change' }],
        // style: [{ required: true, message: '请输入显示样式', trigger: 'change' }],
        dataType: [{ required: true, message: '请输入数据类型', trigger: 'change' }]
      }
    };
  },
  methods: {
    ...mapActions(['multipleLeftFontDefinitionSave', 'multipleLeftFontDefinitionDelete']),
    handleCurrentChange(val) {
      // this.$emit('handleCurrentChange',val)
      this.currentRow = val;
    },
    btnClick() {
      console.log('点击按钮', this.btnType);
      switch (this.btnType) {
        case '增加':
          this.dialogTitle = '新增字段';
          this.innerVisible = true;
          this.ruleForm = {
            btId: this.thisCode,
            btKey: this.thisId,
            enhance: '',
            fieldDescribe: '',
            fieldName: '',
            foemula: '',
            precision: 0,
            showName: '',
            style: '',
            dataType: ''
          };
          break;
        case '编辑':
          if (JSON.stringify(this.currentRow) != '{}' && this.currentRow != null) {
            this.ruleForm = this.currentRow;
            this.dialogTitle = '编辑字段';
            this.innerVisible = true;
          } else {
            this.$message.error('请选择要编辑的字段。');
          }
          break;
        case '删除':
          if (JSON.stringify(this.currentRow) != '{}' && this.currentRow != null) {
            this.multipleLeftFontDefinitionDelete({
              ids: this.currentRow.id
            }).then(res => {
              this.$emit('refreshPage');
              this.currentRow = {};
              this.closeFunc();
            });
          } else {
            this.$message.error('请选择要删除的字段。');
          }
          break;
      }
    },
    // 提交
    submitForm(formName) {
      // ueditorIbps
      // let content = this.$refs.ueditorIbps.getUEContent() // 调用子组件方法
      // this.ruleForm.style = content;

      this.$refs[formName].validate(valid => {
        if (valid) {
          this.multipleLeftFontDefinitionSave(this.ruleForm).then(res => {
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
        btId: '',
        btKey: '',
        enhance: '',
        fieldDescribe: '',
        fieldName: '',
        foemula: '',
        precision: 0,
        showName: '',
        style: '',
        dataType: ''
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
  overflow: auto;
  // background: yellow;
}
</style>