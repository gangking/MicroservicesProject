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
      <!-- <div class="tab">
        <el-table :data="tableData" ref="singleTable" v-loading="loading" height="100%" style="width: 100%" header-cell-class-name="headerRowStyle" @row-click="activeStepListItem" highlight-current-row :resizable="false">
          <el-table-column prop="bzNumber" label="Step" width="50px">
          </el-table-column>
          <el-table-column prop="cleanUp" label="isClear" width="65px" v-if="comType=='替代规则'">
            <template slot-scope="scope">
              <el-checkbox v-model="scope.row.cleanUp" true-label="T" false-label="F" @click="checkboxClick(scope.row,scope.row.cleanUp)"></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column prop="bzDescribe" label="步骤描述" width="200px">
            <template slot-scope="scope">
              <div class="bzDescribe">
                <span title="双击修改描述">
                  {{scope.row.bzDescribe}}
                  <span class="txt">
                    <el-input type="textarea" autosize placeholder="请输入内容" v-model="scope.row.bzDescribe" @blur="textareaEdit(scope.row)">
                    </el-input>
                  </span>
                </span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="usePath" label="调用点" width="60px">
          </el-table-column>
          <el-table-column prop="address" label="操作" width="60px">
            <template slot-scope="scope">
              <div class="btntable">
                <el-button type="text" v-if="scope.row.index!=0" v-on:click.stop="tbMove(scope.row,'top')"><i class="el-icon-top"></i></el-button>
                <el-button type="text" v-else-if="scope.row.index==0">&#12288;</el-button>
                <el-button type="text" v-if="scope.row.index!=tableData.length-1" v-on:click.stop="tbMove(scope.row,'bootom')"><i class="el-icon-bottom"></i></el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div> -->
      <tableComponent :tableList="tableData"/>
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
    loading(val) {
      console.log('加载标识变化', val);
      if (!val) {
        // 每次加载完默认选中第一个（需求变更）
        //   新增并选中新增行
        if (this.tableData.length < 1) {
          this.$emit('getIsStepListNull', true);
          //   return
        } else {
          // 每次点击都先清下缓存
          localStorage.removeItem('codeEdit');
          this.$emit('getIsStepListNull', false);

          var index = parseInt(localStorage.getItem('activeRow'))
            ? parseInt(localStorage.getItem('activeRow'))
            : 0;
          console.log(
            '每次加载完查询上次是否有点击行',
            localStorage.getItem('activeRow'),
            typeof index
          );

          this.$refs.singleTable.setCurrentRow(this.tableData[index]);
          this.activeRowInfo = this.tableData[index];
          this.$emit('getCodeDetail', this.tableData[index]);
          //   localStorage.removeItem('activeRow')
        }
      }
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
    checkboxClick(item, flag) {
      //  scope.row.cleanUp=scope.row.cleanUp=='T'?'F':'T'
      console.log('点击复选框', item, flag);
      var list = JSON.parse(JSON.stringify(this.tableData));
      for (var i = 0; i < list.length; i++) {
        var a = list[i];
        if (a.id == item.id) {
          a.cleanUp = a.cleanUp == 'T' ? 'F' : 'T';
        }
      }
      console.log('改变后的表格数据', list);
      this.tableData = list;
    },
    // 点击某个步骤行时?
    activeStepListItem(row, event, column) {
      console.log('点击当前行', row, event, column);
      // 每次点击都清下缓存
      localStorage.removeItem('codeEdit');
      localStorage.setItem('activeRow', row.index); // 记录点击行所在的数组索引
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
        if (valid) {
          var item = JSON.parse(JSON.stringify(this.formLabelAlign));
          item.bzNumber = item.SerialNum;
          this.tableData.push(item);
          this.tableData = upload(this.tableData, true);
          this.centerDialogVisible = false;
          //   新增并选中新增行
          this.$refs.singleTable.setCurrentRow(item);
          this.activeRowInfo = item;
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
          if (this.isEffecNull) {
            this.loading = true;
            this.$emit('saveRuleData', {
              bsKey: this.bsKey, // 业务场景
              usePath: this.defaultValue,
              newItem: this.activeRowInfo
            });
          } else {
            //   有效性规则必填
            this.$message.error('保存失败，未填写替代规则');
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
      this.$emit('batchSave', {
        bsKey: this.bsKey, // 业务场景
        list: this.tableData,
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
  // background: yellow;
  border: 1px solid #d3dce6;
  height: calc(100% - 2px);
  .content {
    height: calc(100% - 42px);
    // background: red;
    .operation {
      margin: 0;
      height: 210px;
      border-bottom: 1px solid #999;
      // text-align: center;
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
    .tab {
      height: calc(100% - 210px);
      .btntable {
        display: flex;
      }
      .bzDescribe {
        width: 100%;
        height: 50%;
        // background-color: red;
        display: flex;
        justify-content: space-between;
        > span {
          width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          line-height: 32px;
          position: relative;
          cursor: pointer;
          .txt {
            display: none;
            height: 100%;
            /deep/ .el-textarea__inner {
              height: 32px !important;
            }
          }
          &:active {
            /deep/ .el-textarea {
              display: block;
            }
          }
          /deep/ .el-textarea {
            position: absolute;
            left: 0;
            bottom: 0;
            display: none;
            &:hover {
              display: block;
            }
          }
        }
      }
      /deep/ .el-table--enable-row-transition .el-table__body td {
        border-right: 1px solid #ccc;
        &:last-child {
          border-right: 0;
        }
      }
      /deep/ .headerRowStyle {
        background: #f0f9eb !important;
        color: black;
        border-right: 1px solid #ccc;
        &.last-child {
          border-right: 0;
        }
      }

      /deep/ .el-table__body tr.current-row > td {
        background-color: #d9ecff;
        //   background-color: red;
        font-weight: bold;
        .bzDescribe {
          .txt {
            display: block !important;
          }
        }
      }
    }
  }
}
</style>