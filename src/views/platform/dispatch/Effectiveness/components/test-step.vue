<template>
  <div class="test-step">
    <slot name="title"></slot>
    <div class="content">
      <div class="operation">
        <!-- 业务场景选择 -->
        <div class="businessScenario">
          <business-scenario @getSelectScenario="getSelectScenario" :comType="comType" />
        </div>
        <div class="select">
          <label>调用点：</label>
          <br />
          <el-select v-model="defaultValue" placeholder="请选择调用点" size="mini" @change="selectCalling">
            <el-option v-for="item in dropdownList" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="btn">
          <div>
            <el-button type="primary" plain @click="openAddStepDelog">增加步骤</el-button>
          </div>

          <div>
            <el-button type="danger" plain @click="deleteClick">删除</el-button>
            <el-button type="danger" plain @click="stepEditable">{{isEditable?'显示':'编辑'}}</el-button>
            <el-button type="success" plain @click="save">保存</el-button>
          </div>

        </div>
      </div>
      <tableComponent :loading="loading" :tableList="tableData" :comType="comType" @getIsStepListNull="getIsStepListNull" @batchSave="batchSave" v-loading="loading" @tbMove="tbMove" @textareaEdit="textareaEdit" @activeStepListItem="activeStepListItem" @checkboxClick="checkboxClick"/>
    </div>

    <!-- 新增步骤弹窗区 -->
    <el-dialog title="新增步骤" :visible.sync="centerDialogVisible" width="30%" center>
      <el-form label-position="right" label-width="100px" :model="formLabelAlign" :rules="rules" ref="ruleForm">
        <el-form-item label="步骤号：" prop='SerialNum'>
          <el-input v-model="formLabelAlign.SerialNum" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="步骤描述：">
          <el-input v-model="formLabelAlign.bzDescribe"></el-input>
        </el-form-item>
        <el-form-item label="调用点：" prop="usePath">
          <el-input v-model="formLabelAlign.usePath" :disabled="true"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addStep('ruleForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import rulesApi from '@/api/platform/rules/index.js';
import effectApi from '@/api/platform/effectiveness/index.js';
import businessScenario from './business-scenario';
import tableComponent from './table';
import { upload } from '@/assets/js/common.js';
export default {
  name: 'test-step',
  components: {
    businessScenario,
    tableComponent
  },
  props: {
    stepList: {
      type: Array,
      default: []
    },
    activeRowF: {
      type: Boolean,
      default: false
    },
    tableObj: {
      type: String,
      default() {
        return '';
      }
    },
    isEffecNull: {
      type: Boolean,
      default: false
    },
    comType: {
      type: String,
      default: ''
    },
    loadings: {
      type: Boolean,
      default: false
    }
  },
  created() {
    localStorage.removeItem('activeRow'); // 第一次进来清除之前缓存
  },
  watch: {
    stepList(val) {
      this.tableData = upload(val);
      console.log('刷新后的摘要表',this.tableData)
      this.loading = false;
    },
    // 调用点改变
    defaultValue(val) {
      console.log('defaultValue变化', val);
    },
    // 模拟用
    tableData(val) {
      for (var i = 0; i < val.length; i++) {
        var item = val[i];
        if (!item.cleanUp) {
          item.cleanUp = 'T';
        }
      }
    },
    // 新增步骤调用点选择
    'formLabelAlign.callingPoint': {
      deep: true,
      handler: function(newVal, oldVal) {
        // code
        console.log('formLabelAlign的callingPoint变化', newVal);
      }
    },
    activeRowF(val) {
      this.activeRow = val;
    },
    loadings(val) {
      // 仅用于当接口失败时关闭加载样式及清除缓存
      if (!val) {
        this.loading = false;
        localStorage.removeItem('codeEdit');
      }
    }
  },
  data() {
    return {
      dropdownList: [
        {
          label: '主业务对象检查',
          value: '1'
        },
        {
          label: '子业务对象检查',
          value: '2'
        },
        {
          label: '完全检查循环',
          value: '3'
        }
      ],
      loading: true,
      defaultValue: '1',
      tableData: [],
      multipleSelection: [], // 存储勾选的步骤
      centerDialogVisible: false,
      activeRow: false,
      activeRowInfo: {},
      // 当前所选业务场景
      bsKey: '',
      // 弹窗新增步骤?
      formLabelAlign: {
        SerialNum: '',
        bzDescribe: '',
        usePath: ''
      },
      rules: {
        usePath: [{ required: true, message: '请选择调用点', trigger: 'change' }],
        SerialNum: [{ required: true, message: '缺少步骤号', trigger: 'change' }]
      },
      isEditable: false
    };
  },
  methods: {
    checkboxClick(list,index) {
      //  scope.row.cleanUp=scope.row.cleanUp=='T'?'F':'T'
      // console.log('点击复选框', item, flag);
      // var list = JSON.parse(JSON.stringify(this.tableData));
      // for (var i = 0; i < list.length; i++) {
      //   var a = list[i];
      //   if (a.id == item.id) {
      //     a.cleanUp = a.cleanUp == 'T' ? 'F' : 'T';
      //   }
      // }
      console.log('改变后的表格数据', list);
      this.tableData = list;
      if (index) {
        this.activeStepListItem(this.tableData[index]);
      }
    },
    // 点击某个步骤行时?
    activeStepListItem(row) {
      console.log('点击当前行', row);
      // 每次点击都清下缓存
      localStorage.removeItem('codeEdit');
      // localStorage.setItem('activeRow', row.index); // 记录点击行所在的数组索引
      this.$emit('getCodeDetail', row);
    },
    openAddStepDelog() {
      this.centerDialogVisible = true;
      this.formLabelAlign.usePath = this.defaultValue;
      if (this.tableData.length == 0) {
        this.formLabelAlign.SerialNum = 10;
      } else if (this.tableData.length >= 1) {
        var max = null;
        var numlist = [];
        for (var i = 0; i < this.tableData.length; i++) {
          var item = this.tableData[i];
          var num = item.bzNumber;
          numlist.push(num);
        }

        max = Math.max(...numlist);
        // 步骤号加10
        this.formLabelAlign.SerialNum = max + 10;
      }
    },
    // 新增步骤
    addStep(formName) {
      this.$refs[formName].validate(valid => {
        var tablist = JSON.parse(JSON.stringify(this.tableData));
        if (valid) {
          var item = JSON.parse(JSON.stringify(this.formLabelAlign));
          item.bzNumber = item.SerialNum;
          tablist.push(item);
          tablist = upload(tablist, true);
          this.tableData = tablist;
          this.centerDialogVisible = false;
          this.$emit('getCodeDetail', item);
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    // 修改
    stepEditable() {
      this.isEditable = this.isEditable ? false : true;
      this.$emit('stepEditable', this.isEditable);
    },
    // 修改描述
    textareaEdit(info) {
      // console.log('改变后的描述',info)
      this.$emit('getCodeDetail', info);
    },
    // 保存(单个)
    save() {
      console.log('当前是', this.comType);
      if (this.comType == '替代规则') {
        if (this.activeRow) {
          if (this.tableObj) {
            this.loading = true;
            this.$emit('saveRuleData', {
              bsKey: this.bsKey, // 业务场景
              usePath: this.defaultValue,
              newItem: this.activeRowInfo
            });
          } else {
            //   有效性规则必填
            this.$message.error('保存失败，请选择业务对象表。');
          }
        }
      } else {
        if (this.activeRow) {
          this.loading = true;
          this.$emit('saveRuleData', {
            bsKey: this.bsKey, // 业务场景
            usePath: this.defaultValue
          });
        } else {
          //   有效性规则必填
          this.$message.error('请先选择要保存的步骤');
        }
      }
    },
    // 删除
    deleteClick() {
      // 清除缓存
      localStorage.removeItem('activeRow');
      if (this.activeRow) {
        this.loading = true;
        this.$emit('deleteRuleData', {
          bsKey: this.bsKey, // 业务场景
          usePath: this.defaultValue
        });
      } else {
        this.$message.error('请先选择要删除的步骤');
      }
    },
    selectCalling(item) {
      console.log('选中调用点:', item);
      localStorage.removeItem('activeRow'); // 清除之前缓存
      this.getFinndAll();
    },
    // 获取所选的业务场景
    getSelectScenario(info) {
      this.bsKey = info.bizKey;
      localStorage.removeItem('activeRow'); // 清除之前缓存
      this.$emit('getSelectScenario', info);
      this.getFinndAll();
    },
    // 查全部有效性规则信息
    getFinndAll() {
      this.loading = true;
      if (this.comType == '替代规则') {
        rulesApi
          .bsCheckStepFindAll({
            bsKey: this.bsKey, // 业务场景
            // bsKey: '600000000000000000', // 业务场景
            usePath: this.defaultValue
          })
          .then(res => {
            this.tableData = upload(res.data);
            console.log('步骤表数据', this.tableData);
            this.loading = false;
          })
          .catch(req => {
            console.log('保存数据失败');
            this.loading = false;
          });
      } else {
        effectApi
          .bsCheckStepFindAll({
            bsKey: this.bsKey, // 业务场景
            // bsKey: '600000000000000000', // 业务场景
            usePath: this.defaultValue
          })
          .then(res => {
            this.tableData = upload(res.data);
            console.log('步骤表数据', this.tableData);
            this.loading = false;
          })
          .catch(req => {
            console.log('保存数据失败');
            this.loading = false;
          });
      }
    },
    getIsStepListNull(val) {
      this.$emit('getIsStepListNull', val);
    },
    // 上移下移
    tbMove(item, flag) {
      var index1 = item.index;
      var index2 = flag == 'top' ? index1 - 1 : index1 + 1;
      localStorage.setItem('activeRow', index2); // 记录点击行所在的数组索引
      var stepNum1 = this.tableData[index1].bzNumber;
      var stepNum2 = this.tableData[index2].bzNumber;
      this.tableData[index1].bzNumber = stepNum2;
      this.tableData[index2].bzNumber = stepNum1;
      this.tableData = this.swapArr(this.tableData, index1, index2);
      //   批量排序保存
      this.loading = true;
      this.batchSave(this.tableData);
    },
    batchSave(list){
      // console.log('拖拽后的表格数据',list)
      // this.tableData = list;
      this.$emit('batchSave', {
        bsKey: this.bsKey, // 业务场景
        list: list,
        usePath: this.defaultValue
      });
    },
    swapArr(arr, index1, index2) {
      console.log('元素索引', index1, index2);
      var list = JSON.parse(JSON.stringify(arr));
      list[index1] = list.splice(index2, 1, list[index1])[0];
      list = upload(list);
      return list;
    }
  }
};
</script>

<style lang="scss" scoped>
.test-step {
  border: 1px solid #d3dce6;
  height: calc(100% - 2px);
  .content {
    height: calc(100% - 42px);
    .operation {
      margin: 0;
      height: 210px;
      border-bottom: 1px solid #999;
      position: relative;
      &:before {
        content: '';
        display: table;
      }
      .btn {
        position: absolute;
        bottom: 5px;
        width: 100%;
        height: 60px;
        line-height: 60px;
        display: flex;
        justify-content: space-between;
        padding: 0 10px;
        box-sizing: border-box;
        /deep/ .el-button--small {
          padding: 5px 8px;
        }
      }
      .select {
        margin: 10px 10px 0px 10px;
        font-size: 12px;
        color: #606266;
        box-sizing: border-box;
        /deep/ .el-select {
          width: 100%;
          height: 32px;
          .el-input__inner {
            height: 32px;
            line-height: 32px;
            color: #606266;
          }
        }
      }
    }
  }
}
</style>