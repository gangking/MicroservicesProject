<template>
  <div class="tablelist">
    <div class="list1">
      <el-table highlight-current-row @current-change="handleCurrentChange" :data="btnTabel" border style="width: 120%" height="120%">
        <el-table-column prop="buttonName" label="按钮名称" width="140">
        </el-table-column>
        <el-table-column prop="buttonPosition" label="按钮位置" width="120">
          <template slot-scope="scope">
            <span v-if="scope.row.buttonPosition=='1'">分页区</span>
            <span v-else-if="scope.row.buttonPosition=='2'">页签</span>
            <span v-else-if="scope.row.buttonPosition=='3'">业务类型</span>
            <span v-else-if="scope.row.buttonPosition=='4'">左边栏</span>
            <span v-else-if="scope.row.buttonPosition=='5'">处理意见</span>
            <span v-else-if="scope.row.buttonPosition=='6'">集中处理</span>
          </template>
        </el-table-column>
        <el-table-column prop="buttonIcon" label="按钮图标" width="120">
          <template slot-scope="scope">
            <i :class="'icon-'+scope.row.buttonIcon" style="color:#409EFF;"></i>
          </template>
        </el-table-column>
        <el-table-column prop="subtab" label="静态页签" width="120">
        </el-table-column>
        <el-table-column prop="buttonType" label="按钮类型" width="120">
        </el-table-column>
        <el-table-column prop="buttonPlain" label="是否朴素按钮" width="140">
          <template slot-scope="scope">
            <el-switch disabled v-model="scope.row.buttonPlain" active-value="1" inactive-value="0">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="buttonRound" label="是否圆角按钮" width="140">
          <template slot-scope="scope">
            <el-switch disabled v-model="scope.row.buttonRound" active-value="1" inactive-value="0">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="buttonCircle" label="是否圆形按钮" width="140">
          <template slot-scope="scope">
            <el-switch disabled v-model="scope.row.buttonCircle" active-value="1" inactive-value="0">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="buttonCode" label="按钮编码" width="120">
        </el-table-column>
        <el-table-column prop="sn" label="排序" width="120">
        </el-table-column>
        <!-- <el-table-column prop="dataStatus" label="状态" width="120">
        </el-table-column> -->
      </el-table>
    </div>

    <el-dialog top="5vh" append-to-body :title="dialogTitle" :visible.sync="dialogVisible" width="70%" :before-close="handleClose">
      <div v-if="dialogTitle == '新增功能按钮'" class="formBox" style="height:450px; overflow:auto;">
        <el-table ref="multipleTable" :data="allBtnData" tooltip-effect="dark" style="width: 120%" @selection-change="btnSelectionChange">
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
        <el-form label-position="top" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">
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
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
const { mapActions } = createNamespacedHelpers('ibps/frontVisualizations');
import indexApi from '@/api/platform/dispose_visualization/index.js';
export default {
  props: {
    tabelData: {
      type: Array,
      default: () => {
        return [];
      }
    },
    btnTabel: {
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
      btnType: '', // 弹窗数据
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
  methods: {
    ...mapActions([
      'singleFormButtonDefinitionEdit',
      'singleFormButtonDefinitionSave',
      'singleFormButtonDefinitionDelete',
      'singleFormButtonAll'
    ]),
    handleCurrentChange(val) {
      // this.$emit('handleCurrentChange',val)
      this.activeBtn = val;
    },
    btnClick() {
      console.log('点击按钮', this.btnType);
      switch (this.btnType) {
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
            this.singleFormButtonDefinitionDelete({
              ids: this.activeBtn.id
            }).then(res => {
              this.$emit('refreshBtn');
              this.activeBtn = {};
              this.handleClose();
            });
          } else {
            this.$message.error('请先选择要操作的按钮。');
          }
          break;
      }
    },
    // 选中的功能按钮
    btnSelectionChange(list) {
      this.activeAllBtn = list;
    },
    // 提交弹窗数据
    submitForm(formName) {
      if (this.dialogTitle == '新增功能按钮') {
        if (this.activeAllBtn.length > 0) {
          for (var i = 0; i < this.activeAllBtn.length; i++) {
            var item = this.activeAllBtn[i];
            item['slcfKey'] = this.thisId;
            item['slcfId'] = this.thisCode;
          }
          indexApi.singleFormButtonDefinitionSave(this.activeAllBtn).then(res => {
            // this.onload();
            this.$emit('refreshBtn');
            this.activeBtn = {};
            this.handleClose();
          });
        } else {
          this.$message.error('请至少选择一个按钮。');
        }
      } else if (this.dialogTitle == '编辑功能按钮') {
        this.$refs[formName].validate(valid => {
          if (valid) {
            this.singleFormButtonDefinitionEdit(this.ruleForm).then(res => {
              this.$emit('refreshBtn');
              this.activeBtn = {};
              this.handleClose();
            });
          } else {
            return false;
          }
        });
      }
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
  width: 120%;
  height: calc(120% - 45px);
  display: flex;
  justify-content: space-between;
  box-sizing: border-box;
  // overflow: auto;
  // background: yellow;
  .list1 {
    // width: 30%;
    flex: 1;
  }
  // .list2 {
  //   width: 35%;
  // }
}
</style>