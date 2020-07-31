<template>
  <div class="tablelist">
    <el-table highlight-current-row @current-change="handleCurrentChange" :data="tabelData" border style="width: 100%" height="100%">
      <el-table-column prop="bcCode" label="业务类型编码">
      </el-table-column>
      <el-table-column prop="bcDescribe" label="业务类型描述">
      </el-table-column>
      <el-table-column prop="showName" label="显示名称">
      </el-table-column>
      <!-- <el-table-column prop="status" label="状态">
      </el-table-column> -->
    </el-table>

    <el-dialog @close="closeFunc" top="3vh" width="50%" :title="dialogTitle" :visible.sync="innerVisible" append-to-body>
      <div class="formBox" style="height: 350px;overflow: auto;">
        <el-form label-position="top" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <el-form-item v-if="dialogTitle=='新增业务类型分配'" label="业务类型编码" prop="bcCode">
            <el-tree :data="typeTable" show-checkbox default-expand-all node-key="id" ref="tree" highlight-current :props="{label: 'bcDescribe',children: 'children'}" @check="activeSituationType">
            </el-tree>
          </el-form-item>
          <el-form-item v-if="dialogTitle=='编辑业务类型分配'" label="业务类型编码" prop="bcCode">
            <el-input v-model="ruleForm.bcCode" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item v-if="dialogTitle=='编辑业务类型分配'" label="业务类型分配描述" prop="bcDescribe">
            <el-input v-model="ruleForm.bcDescribe"></el-input>
          </el-form-item>
          <el-form-item v-if="dialogTitle=='编辑业务类型分配'" label="显示名称" prop="showName">
            <el-input v-model="ruleForm.showName"></el-input>
          </el-form-item>
          <!-- <el-form-item v-if="dialogTitle=='编辑业务类型分配'" label="业务类型分配状态" prop="status">
            <el-input v-model="ruleForm.status"></el-input>
          </el-form-item>
          <el-form-item v-if="dialogTitle=='编辑业务类型分配'" label="使用次数" prop="recently">
            <el-input v-model="ruleForm.recently"></el-input>
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
import indexApi from '@/api/platform/dispose_visualization/index.js';
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
      dialogTitle: '新增业务类型分配',
      innerVisible: false,
      activeSituationTypeList: [],
      currentRow: {},
      typeTable: [],
      ruleForm: {
        bcCode: '',
        bcDescribe: '',
        btId: '',
        btKey: '',
        recently: 0,
        showName: '',
        status: '',
        superBcid: '',
        tableId: ''
      },
      rules: {
        bcDescribe: [{ required: true, message: '请输入业务类型分配描述', trigger: 'blur' }],
        showName: [{ required: true, message: '请输入显示名称', trigger: 'change' }]
        // recently: [{ required: true, message: '请输入使用次数', trigger: 'change' }],
        // bcCode: [{ required: true, message: '请输入业务类型编码', trigger: 'change' }],
        // status: [{ required: true, message: '请输入业务类型分配状态', trigger: 'change' }]
      }
    };
  },
  created() {
    this.queryBusinessTypeTree({
      bsKey: this.kDispose.sceneId
    }).then(res => {
      this.typeTable = res;
      this.getTypeData(this.typeTable);
      console.log('业务类型列表', this.typeTable);
    });
  },
  methods: {
    ...mapActions([
      'multipleBusTypeSetDefinitionSave',
      'multipleBusTypeSetDefinitionDelete',
      'queryBusinessTypeTree'
    ]),
    getTypeData(list) {
      list.forEach(item => {
        if (item.isGroup != 'N') {
          item['disabled'] = true;
        }
        for (var key in item) {
          if (key == 'children') {
            if (item['children'].length > 0) {
              this.getTypeData(item['children']);
            }
          }
        }
      });
    },
    activeSituationType(info, status) {
      console.log('选择的业务类型', info, status.checkedNodes);
      this.activeSituationTypeList = status.checkedNodes;
      this.activeSituationTypeList.forEach(item => {
        item['btId'] = this.thisCode;
        item['btKey'] = this.thisId;
        item['bcKey'] = item.id;
        item['showName'] = item.bcDescribe;
      });
    },
    handleCurrentChange(val) {
      // this.$emit('handleCurrentChange',val)
      this.currentRow = val;
    },
    btnClick() {
      console.log('点击按钮', this.btnType);
      switch (this.btnType) {
        case '增加':
          this.dialogTitle = '新增业务类型分配';
          this.activeSituationTypeList = [];
          this.innerVisible = true;
          this.$refs.tree.setCheckedKeys([]);
          this.ruleForm = {
            bcCode: '',
            bcDescribe: '',
            btId: this.thisCode,
            btKey: this.thisId,
            recently: 0,
            showName: '',
            status: '',
            superBcid: '',
            tableId: ''
          };
          break;
        case '编辑':
          if (JSON.stringify(this.currentRow) != '{}' && this.currentRow != null) {
            this.ruleForm = this.currentRow;
            this.dialogTitle = '编辑业务类型分配';
            this.innerVisible = true;
          } else {
            this.$message.error('请选择要编辑的业务类型分配。');
          }
          break;
        case '删除':
          if (JSON.stringify(this.currentRow) != '{}' && this.currentRow != null) {
            this.multipleBusTypeSetDefinitionDelete({
              ids: this.currentRow.id
            }).then(res => {
              this.$emit('refreshPage');
              this.currentRow = {};
              this.closeFunc();
            });
          } else {
            this.$message.error('请选择要删除的业务类型分配。');
          }
          break;
      }
    },
    // 提交
    submitForm(formName) {
      // 编辑时单行，新增时批量
      if (this.dialogTitle == '编辑业务类型分配') {
        this.$refs[formName].validate(valid => {
          if (valid) {
            this.multipleBusTypeSetDefinitionSave(this.ruleForm).then(res => {
              this.$emit('refreshPage');
              this.currentRow = {};
              this.closeFunc();
            });
          } else {
            return false;
          }
        });
      } else {
        // var arry = JSON.parse(JSON.stringify(this.activeSituationTypeList));
        var arry = [];
        this.activeSituationTypeList.forEach(item => {
          // 筛选出业务类型
          if(item.isGroup != 'Y') {
            arry.push(item)
          }
        });
        if (arry.length > 0) {
          // 新增
          indexApi.multipleBusTypeSetDefinitionBatSave(arry).then(res => {
            this.$emit('refreshPage');
            this.currentRow = {};
            this.closeFunc();
          });
        } else {
          this.$message.error('请选择要新增的业务类型分配。');
        }
      }
    },
    closeFunc() {
      this.ruleForm = {
        bcCode: '',
        bcDescribe: '',
        btId: '',
        btKey: '',
        recently: 0,
        showName: '',
        status: '',
        superBcid: '',
        tableId: ''
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