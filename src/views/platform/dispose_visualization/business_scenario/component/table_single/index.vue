<template>
  <!-- 业务事务定义 -->
  <tabBox :tabList="tabList" :activeName="activeName" @handleClick="handleClick">
    <div class="tableSlot" slot="tableSlot">
      <tableLayout :tbaleTitle="tbaleTitle" @btnClick="btnClick" :tableBtnList="tableBtnList" :tabelData="tabelData">
        <!-- 业务事务定义列表 -->
        <singleFormList @handleCurrentChange="handleCurrentChange" v-if="activeName == 'formDefinition'" slot="table" :tabelData="tabelData" />
      </tableLayout>
      <el-dialog @close="closeFunc" top="3vh" width="50%" :title="dialogTitle" :visible.sync="innerVisible" append-to-body>
        <div class="formBox" style="height: 400px;overflow: auto;">
          <el-form label-position="top" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
            <el-form-item label="单行业务事务编码" prop="slcfId">
              <el-input v-model="ruleForm.slcfId"></el-input>
            </el-form-item>
            <el-form-item label="单行业务事务描述" prop="describe">
              <el-input v-model="ruleForm.describe"></el-input>
            </el-form-item>
            <el-form-item label="是否强制上传附件" prop="forceUpload">
              <el-switch v-model="ruleForm.forceUpload" active-text="是" inactive-text="否" active-value="Y" inactive-value="N">
              </el-switch>
            </el-form-item>
            <el-form-item label="是否关联前置单据" prop="relateBills">
              <el-switch v-model="ruleForm.relateBills" active-text="是" inactive-text="否" active-value="Y" inactive-value="N">
              </el-switch>
            </el-form-item>
            <el-form-item label="是否显示处理进度" prop="showHandle">
              <el-switch v-model="ruleForm.showHandle" active-text="是" inactive-text="否" active-value="Y" inactive-value="N">
              </el-switch>
            </el-form-item>
            <el-form-item label="是否显示表单状态" prop="showStatus">
              <el-switch v-model="ruleForm.showStatus" active-text="是" inactive-text="否" active-value="Y" inactive-value="N">
              </el-switch>
            </el-form-item>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitForm('ruleForm')">确认</el-button>
          <el-button @click="closeFunc">关闭</el-button>
        </span>
      </el-dialog>
    </div>
  </tabBox>
</template>

<script>
import tabBox from '../tab_box';
import tableLayout from '../table_layout.vue';
import singleFormList from './singleFormList';
import { createNamespacedHelpers } from 'vuex';
const { mapActions } = createNamespacedHelpers('ibps/frontVisualizations');
export default {
  inject: ['kDispose'],
  components: {
    tabBox,
    tableLayout,
    singleFormList
  },
  data() {
    return {
      activeName: 'formDefinition', // 默认选中栏
      tabList: [
        {
          label: '业务事务定义',
          name: 'formDefinition'
        }
      ], // tab栏数据
      tbaleTitle: '单行业务事务定义', // 表格标题
      tableBtnList: [], // 表格按钮组数据
      tabelData: [], // 表格数据
      btnTabel: [], // 按钮表格数据
      dialogTitle: '新增业务事务定义',
      innerVisible: false,
      currentRow: {},
      ruleForm: {
        bsDescribe: '',
        bsId: '',
        bsKey: '',
        describe: '',
        forceUpload: 'Y',
        relateBills: 'Y',
        showHandle: 'Y',
        showStatus: 'Y',
        slcfId: ''
      },
      rules: {
        describe: [{ required: true, message: '请输入单行复合表单描述', trigger: 'blur' }],
        slcfId: [{ required: true, message: '请输入单行复合表单ID', trigger: 'change' }]
      }
    };
  },
  created() {
    // this.tableBtnList = require('./testData/tableBtnList.json').tableBtnList;
    // this.tabelData = require('./testData/tabelData.json').tabelData;
    this.onload();
  },
  methods: {
    ...mapActions([
      'singleFormDefinition',
      'singleFormDefinitionSave',
      'singleFormDefinitionDelete'
    ]),
    onload() {
      this.tableBtnList = require('./testData/tableBtnList.json').tableBtnList;
      this.singleFormDefinition({
        bsKey: this.kDispose.sceneId
      }).then(res => {
        this.tabelData = res;
        console.log('单行业务事务业务事务定义查询', res);
      });
    },
    handleClick(tab) {
      console.log(tab);
      this.activeName = tab.name;
      this.tbaleTitle = tab.label;
      if (tab.label == '业务事务定义') {
        // this.tabelData = require('./testData/tabelData.json').tabelData;
        this.onload();
      }
    },
    closeFunc() {
      this.ruleForm = {
        bsDescribe: '',
        bsId: '',
        bsKey: '',
        describe: '',
        forceUpload: 'Y',
        relateBills: 'Y',
        showHandle: 'Y',
        showStatus: 'Y',
        slcfId: ''
      };
      this.innerVisible = false;
    },
    // 提交
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.singleFormDefinitionSave(this.ruleForm).then(res => {
            this.onload();
            this.currentRow = {};
            this.closeFunc();
          });
        } else {
          return false;
        }
      });
    },
    // 按钮点击
    btnClick(info) {
      console.log('点击的是哪个按钮？', info);
      switch (info.label) {
        case '增加':
          console.log('业务场景信息', this.kDispose.sceneInfo);
          this.dialogTitle = '新增业务事务定义';
          this.innerVisible = true;
          this.ruleForm = {
            bsDescribe: this.kDispose.sceneInfo.bsDescribe,
            bsId: this.kDispose.sceneInfo.bsCode,
            bsKey: this.kDispose.sceneInfo.id,
            describe: '', // 单行复合表单ID
            forceUpload: 'Y',
            relateBills: 'Y',
            showHandle: 'Y',
            showStatus: 'Y',
            slcfId: '' //
          };
          break;
        case '编辑':
          if (JSON.stringify(this.currentRow) != '{}' && this.currentRow != null) {
            this.ruleForm = this.currentRow;
            this.dialogTitle = '编辑业务事务定义';
            this.innerVisible = true;
          } else {
            this.$message.error('请选择要编辑的业务事务。');
          }
          break;
        case '删除':
          if (JSON.stringify(this.currentRow) != '{}' && this.currentRow != null) {
            this.singleFormDefinitionDelete({
              ids: this.currentRow.id
            }).then(res => {
              this.onload();
              this.currentRow = {};
            });
          } else {
            this.$message.error('请选择要删除的业务事务。');
          }
          break;
      }
    },
    // 选中的数据行
    handleCurrentChange(info) {
      this.currentRow = info;
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
.tableSlot {
  height: 100%;
  overflow: auto;
}
</style>