<template>
  <!-- 单行多行业务事务功能按钮定义 -->
  <tabBox :tabList="tabList" :activeName="activeName" @handleClick="handleClick">
    <div class="tableSlot" slot="tableSlot">
      <tableLayout :tbaleTitle="tbaleTitle" @btnClick="btnClick" :tableBtnList="tableBtnList" :tabelData="tabelData">
        <!-- 多行业务事务功能按钮定义列表 -->
        <functionBtnList @handleCurrentChange="handleCurrentChange" v-if="activeName == 'functionBtn'" :btnTabel="btnTabel" slot="table" :tabelData="tabelData" />
      </tableLayout>
      <el-dialog top="5vh" append-to-body :title="dialogTitle" :visible.sync="dialogVisible" width="70%" :before-close="handleClose">
        <div v-if="dialogTitle == '新增功能按钮'" class="formBox" style="height:450px; overflow:auto;">
          <el-table ref="multipleTable" :data="allBtnData" tooltip-effect="dark" style="width: 100%" @selection-change="btnSelectionChange">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column label="按钮编码" width="120" prop="buttonCode">
            </el-table-column>
            <el-table-column prop="buttonName" label="按钮名称" width="120">
            </el-table-column>
            <el-table-column prop="buttonIcon" label="按钮图标" width="120">
              <template slot-scope="scope">
                <i :class="'icon-'+scope.row.buttonIcon" style="color:#409EFF;"></i>
              </template>
            </el-table-column>
            <el-table-column prop="buttonType" label="按钮类型" width="120">
            </el-table-column>
            <el-table-column prop="buttonPlain" label="是否朴素按钮" width="120">
              <template slot-scope="scope">
                <span v-if="scope.row.buttonPlain=='1'">是</span>
                <span v-else-if="scope.row.buttonPlain=='0'">否</span>
              </template>
            </el-table-column>
            <el-table-column prop="buttonPlain" label="是否圆角按钮" width="120">
              <template slot-scope="scope">
                <span v-if="scope.row.buttonRound=='1'">是</span>
                <span v-else-if="scope.row.buttonRound=='0'">否</span>
              </template>
            </el-table-column>
            <el-table-column prop="buttonPlain" label="是否圆形按钮" width="120">
              <template slot-scope="scope">
                <span v-if="scope.row.buttonCircle=='1'">是</span>
                <span v-else-if="scope.row.buttonCircle=='0'">否</span>
              </template>
            </el-table-column>
            <el-table-column prop="bindFunction" label="绑定事件" width="120">
            </el-table-column>
          </el-table>
        </div>
        <div v-else class="formBox" style="height:450px; overflow:auto;">
          <el-form label-position="top" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
            <el-form-item label="按钮名称" prop="buttonName" placeholder='请输入按钮名称'>
              <el-input v-model="ruleForm.buttonName"></el-input>
            </el-form-item>
            <el-form-item label="按钮编码" prop="buttonCode" placeholder='请输入按钮编码'>
              <el-input :disabled="true" v-model="ruleForm.buttonCode"></el-input>
            </el-form-item>
            <el-form-item label="按钮位置" prop="buttonPosition" placeholder='请输入按钮位置'>
              <el-select :disabled="true" v-model="ruleForm.buttonPosition" placeholder="请选择按钮位置">
                <el-option label="分页区" value="1"></el-option>
                <el-option label="页签" value="2"></el-option>
                <el-option label="业务类型" value="3"></el-option>
                <el-option label="左边栏" value="4"></el-option>
                <el-option label="处理意见" value="5"></el-option>
                <el-option label="集中处理" value="6"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="按钮类型" prop="buttonType" placeholder='请输入按钮类型'>
              <el-input :disabled="true" v-model="ruleForm.buttonType"></el-input>
            </el-form-item>
            <el-form-item label="是否朴素按钮" prop="buttonPlain">
              <el-switch :disabled="true" v-model="ruleForm.buttonPlain" active-text="是" inactive-text="否" active-value="1" inactive-value="0">
              </el-switch>
            </el-form-item>
            <el-form-item label="是否圆角按钮" prop="buttonRound">
              <el-switch :disabled="true" v-model="ruleForm.buttonRound" active-text="是" inactive-text="否" active-value="1" inactive-value="0">
              </el-switch>
            </el-form-item>
            <el-form-item label="是否圆形按钮" prop="buttonCircle">
              <el-switch :disabled="true" v-model="ruleForm.buttonCircle" active-text="是" inactive-text="否" active-value="1" inactive-value="0">
              </el-switch>
            </el-form-item>
            <el-form-item label="排序" prop="sn" placeholder='请输入排序'>
              <el-input :disabled="true" v-model="ruleForm.sn"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="handleClose">取 消</el-button>
          <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </tabBox>
</template>

<script>
import tabBox from '@/views/platform/dispose_visualization/business_scenario/component/tab_box.vue';
import tableLayout from '@/views/platform/dispose_visualization/business_scenario/component//table_layout.vue';
import functionBtnList from './functionBtnList';
import { createNamespacedHelpers } from 'vuex';
import indexApi from '@/api/platform/dispose_visualization/index.js';
const { mapActions } = createNamespacedHelpers('ibps/frontVisualizations');
export default {
  inject: ['kDispose'],
  components: {
    tabBox,
    tableLayout,
    functionBtnList
  },
  props: {
    activeInfo: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  watch: {
    activeInfo: {
      handler(val) {
        if (JSON.stringify(val) != '{}') {
          console.log('进入具体单行2', val);
          this.id = val.id;
          this.code = val.code
          this.onload();
        }
      },
      immediate: true
    }
  },
  data() {
    return {
      id: '',
      code:'',
      activeName: 'functionBtn', // 默认选中栏
      tabList: [
        {
          label: '功能按钮定义',
          name: 'functionBtn'
        }
      ], // tab栏数据
      tbaleTitle: '多行业务事务功能按钮定义', // 表格标题
      tableBtnList: [], // 表格按钮组数据
      tabelData: [], // 表格数据
      btnTabel: [], // 按钮表格数据
      // 弹窗数据
      dialogTitle: '',
      dialogVisible: false,
      ruleForm: {
        bsCode: '',
        bsKey: '',
        buttonPosition: '',
        buttonType: '',
        sn: 0,
        buttonName: '',
        buttonCode: ''
      },
      rules: {
        buttonName: [{ required: true, message: '请输入按钮名称', trigger: 'blur' }],
        // buttonCode: [{ required: true, message: '请输入按钮编码', trigger: 'blur' }],
        // buttonPosition: [{ required: true, message: '请输入按钮位置', trigger: 'blur' }],
        // buttonType: [{ required: true, message: '请输入按钮类型', trigger: 'blur' }],
        // sn: [{ required: true, message: '请输入排序', trigger: 'blur' }]
      },
      allBtnData: [], // 全局功能按钮
      activeAllBtn: [], // 选中功能按钮
      activeBtn: {}
    };
  },
  created() {
    // this.tableBtnList = require('./testData/tableBtnList.json').tableBtnList;
    // this.tabelData = require('./testData/tabelData2.json').tabelData;
    // this.btnTabel = require('./testData/btnTabel.json').btntabel;
  },
  methods: {
    ...mapActions([
      'multipleButtonDefinition',
      'singleFormButtonAll',
      'multipleButtonDefinitionAdd',
      'multipleButtonDefinitionEdit',
      'multipleButtonDefinitionDelete'
    ]),
    onload() {
      this.tableBtnList = require('./testData/tableBtnList.json').tableBtnList;
      this.multipleButtonDefinition({
        btKey: this.id
      }).then(res => {
        console.log('多行业务事务按钮定义查询', res);
        this.btnTabel = res;
      });
    },
    handleClick(tab) {
      console.log(tab);
      this.tbaleTitle = tab.label;
      this.activeName = tab.name;
      if (tab.label == '功能按钮定义') {
        this.onload();
      }
    },
    // 提交弹窗数据
    submitForm(formName) {
      if (this.dialogTitle == '新增功能按钮') {
        if (this.activeAllBtn.length > 0) {
          for (var i = 0; i < this.activeAllBtn.length; i++) {
            var item = this.activeAllBtn[i];
            item['btKey'] = this.id;
            item['btId'] = this.code;
          }
          indexApi.multipleButtonDefinitionAdd(this.activeAllBtn).then(res => {
            this.onload();
            this.handleClose();
          });
        } else {
          this.$message.error('请至少选择一个按钮。');
        }
      } else if (this.dialogTitle == '编辑功能按钮') {
        this.$refs[formName].validate(valid => {
          if (valid) {
            this.multipleButtonDefinitionEdit(this.ruleForm).then(res => {
              this.onload();
              this.activeBtn = {};
              this.handleClose();
            });
          } else {
            return false;
          }
        });
      }
    },
    // 选中的功能按钮
    btnSelectionChange(list) {
      this.activeAllBtn = list;
    },
    // 选中的功能按钮(编辑删除)
    handleCurrentChange(info) {
      this.activeBtn = info;
    },
    // 关闭弹窗
    handleClose() {
      this.ruleForm = {
        bsCode: '',
        bsKey: '',
        buttonPosition: '',
        buttonType: '',
        sn: 0,
        buttonName: '',
        buttonCode: ''
      };
      this.dialogVisible = false;
    },
    // 按钮点击
    btnClick(info) {
      console.log('点击的是哪个按钮？', info);
      switch (info.label) {
        case '增加':
          this.dialogTitle = '新增功能按钮';
          this.dialogVisible = true;
          this.singleFormButtonAll({
            parameters: [
              {
                key: 'Q^BUTTON_AREA_^S',
                value: '1'
              }
            ]
          }).then(all => {
            this.allBtnData = all;
            // console.log('全局功能按钮', all);
          });
          break;
        case '编辑':
          if (JSON.stringify(this.activeBtn) != '{}' && this.activeBtn != null) {
            this.ruleForm = this.activeBtn;
            this.dialogTitle = '编辑功能按钮';
            this.dialogVisible = true;
          } else {
            this.$message.error('请先选择要操作的按钮。');
          }
          break;
        case '删除':
          if (JSON.stringify(this.activeBtn) != '{}' && this.activeBtn != null) {
            this.multipleButtonDefinitionDelete({
              ids: this.activeBtn.id
            }).then(res => {
              this.onload();
              this.activeBtn = {};
              this.handleClose();
            });
          } else {
            this.$message.error('请先选择要操作的按钮。');
          }
          break;
      }
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