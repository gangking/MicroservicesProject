<template>
  <div class="tablelist">
    <el-table :data="trreTable" height="100%" highlight-current-row @current-change="handleCurrentChangeOne" style="width: 100%;margin-bottom: 20px;" row-key="id" border :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
      <el-table-column prop="bcCode" label="业务类型编码">
      </el-table-column>
      <!-- <el-table-column prop="name" label="业务类型名称">
        </el-table-column> -->
      <el-table-column prop="bcDescribe" label="业务类型描述">
      </el-table-column>
      <el-table-column prop="isGroup" label="是否为业务类型">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.isGroup" active-value="N" inactive-value="Y" disabled>
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="100">
        <template slot-scope="scope">
          <el-button type="text" @click="editType(scope.row)" size="small">编辑</el-button>
          <el-button type="text" size="small" @click="deleteFunc(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog width="35%" :title="dialogTile" :visible.sync="innerVisible" append-to-body>
      <el-form :model="ruleForm" label-position="top" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">
        <el-form-item label="业务类型编码" prop="bcCode">
          <el-input v-model="ruleForm.bcCode" placeholder="请输入业务类型编码"></el-input>
        </el-form-item>
        <!-- <el-form-item label="业务类型名称" prop="name">
          <el-input v-model="ruleForm.name" placeholder="请输入业务类型名称"></el-input>
        </el-form-item> -->
        <el-form-item label="业务类型描述" prop="bcDescribe">
          <el-input v-model="ruleForm.bcDescribe" placeholder="请输入业务类型描述"></el-input>
        </el-form-item>
        <el-form-item label="是否为业务类型" prop="isGroup">
          <!--
             顶层增加本级的时只能增加同级分组；
             顶层增加时只能增加分组；
             顶层但是无子集时，在新增下级时可用；
             disabled
              -->
          <el-select :disabled="ruleForm.isGroup=='N'" v-model="ruleForm.isGroup" placeholder="请选择是否分组">
            <el-option label="是" value="N"></el-option>
            <el-option label="否" value="Y"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">确认</el-button>
          <el-button @click="closeDialog">取消</el-button>
        </el-form-item>
      </el-form>
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
    trreTable: {
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
  data() {
    return {
      currentRow: {},
      isDisabled: false, // 是否禁用分组选项
      dialogTile: '新增业务类型',
      innerVisible: false,
      ruleForm: {
        bcCode: '',
        bcDescribe: '',
        bsCode: '',
        bsKey: '',
        isGroup: 'Y',
        name: '',
        parentId: '',
        pathName: ''
      },
      rules: {
        // name: [{ required: true, message: '请输入业务类型名称', trigger: 'blur' }],
        bcCode: [{ required: true, message: '请输入业务类型编码', trigger: 'blur' }],
        bcDescribe: [{ required: true, message: '请输入业务类型描述', trigger: 'blur' }],
        isGroup: [{ required: true, message: '请选择是否分组', trigger: 'change' }]
      }
    };
  },
  watch: {
    btnClickFlag: {
      handler(val) {
        console.log('点击按钮了', this.btnName, this.currentRow);
        if (this.btnName) {
          if (JSON.stringify(this.currentRow) != '{}' || this.btnName == '本级增加') {
            switch (this.btnName) {
              case '本级增加':
                this.dialogTile = '新增本级';
                this.innerVisible = true;
                this.ruleForm.bsKey = this.kDispose.sceneId;
                this.ruleForm.bsCode = this.kDispose.bsCode;
                if (JSON.stringify(this.currentRow) == '{}') {
                  this.ruleForm.parentId = '-1'; // 顶层节点为-1
                  this.ruleForm.pathName = '';
                  this.$set(this.ruleForm, 'isGroup', 'Y');
                  this;
                } else {
                  console.log('选中再本级增加', this.currentRow);
                  this.ruleForm.parentId = this.currentRow.parentId; // 不是顶层则传所选行的parentId
                  if (this.currentRow.parentId == '-1') {
                    this.ruleForm.pathName = '';
                  } else {
                    this.ruleForm.pathName = this.currentRow.bcDescribe;
                  }
                }
                break;
              case '下级增加':
                // 业务类型不能添加下级
                if (this.currentRow.isGroup != 'N') {
                  this.dialogTile = '新增下级';
                  this.innerVisible = true;
                  // this.$set(this.ruleForm, 'isGroup', 'N');
                  this.ruleForm.bsKey = this.kDispose.sceneId;
                  this.ruleForm.bsCode = this.kDispose.bsCode;
                  this.ruleForm.pathName = this.currentRow.bcDescribe;
                  this.ruleForm.parentId = this.currentRow.id; // 下级传操作行id
                } else {
                  this.$message.error('业务类型不允许添加下级');
                }
                break;
              case '删除':
                if (JSON.stringify(this.currentRow) != '{}' && this.currentRow != null) {
                  this.deleteFunc(this.currentRow);
                } else {
                  // alert('请先选择要删除的数据');
                  this.$message.error('请先选择要编辑的数据');
                }
                break;
            }
          } else {
            this.$message.error('请先选择要操作的数据');
          }
        }
      },
      immediate: true
    }
  },
  methods: {
    ...mapActions(['saveBusinessType', 'removeBusinessType']),
    handleCurrentChange(val) {
      this.currentRow = val;
      this.$emit('getActiveRow', val);
    },
    // 选择业务类型
    handleCurrentChangeOne(val) {
      console.log('选择业务类型', val);
      this.currentRow = val;
    },
    // 删除
    deleteFunc(info) {
      // console.log('删除',info)
      if (info.children.length == 0) {
        this.removeBusinessType({
          ids: info.id
        }).then(res => {
          this.closeDialog();
          this.$emit('refreshTabel', {
            type: '业务类型'
          });
        });
      } else {
        this.$message.error('当前分组已包含子集，请先删除子集');
      }
    },
    // 编辑
    editType(info) {
      console.log('编辑', info);
      this.dialogTile = '编辑业务类型';
      this.innerVisible = true;
      this.ruleForm = info;
    },
    // 提交
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.saveBusinessType(this.ruleForm).then(res => {
            this.closeDialog();
            this.$emit('refreshTabel', {
              type: '业务类型'
            });
          });
        } else {
          return false;
        }
      });
    },
    closeDialog() {
      this.ruleForm = {
        bcCode: '',
        bcDescribe: '',
        bsCode: '',
        bsKey: '',
        isGroup: 'Y',
        name: '',
        parentId: '',
        pathName: ''
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
  // width: 100%;
  height: calc(100% - 45px);
  display: flex;
  justify-content: space-between;
  box-sizing: border-box;
  // overflow: auto;
  // background: yellow;
  .list1 {
    flex: 1;
    // width: 30%;
  }
  .list2 {
    // width: 35%;
  }
}
</style>