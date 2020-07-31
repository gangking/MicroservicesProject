<template>
  <el-dialog top="5vh" :visible.sync="dialogVisible" @close="closeDialog" :close-on-click-modal="closeOnClickModal" title="添加条件" width="70%" class="dialog" append-to-body @open="open">
    <el-form ref="form" v-loading="dialogLoading" :element-loading-text="$t('common.loading')" :model="form" :rules="rules" :label-width="formLabelWidth">
      <el-form-item label="代理人" prop="agenterId">
        <ibps-employee-selector :editeValue="{id:form.agenterId,name:form.agenterName}" v-model="form.agenterId" @callback="callbackAgenterInfo" />
      </el-form-item>
      <el-form-item label="条件名称" prop="name">
        <el-input v-model="form.name" placeholder="请输入内容" />
      </el-form-item>
      <el-form-item label="条件描述">
        <el-input v-model="form.desc" :rows="2" placeholder="请输入内容" type="textarea" />
      </el-form-item>
      <el-form-item label="规则表达式">
        <div style="margin-bottom: 8px;">
          <el-button type="primary" @click="getForm">变量表单</el-button>
        </div>
        <el-input v-model="form.condition" :rows="8" placeholder="请输入内容" type="textarea" tabindex resize="none" />
        <div>这个脚本需要使用返回语句(return)返回布尔值，返回true流程将跳转到指定的节点。</div>
      </el-form-item>
    </el-form>

    <div slot="footer" class="el-dialog--center">
      <ibps-toolbar :actions="toolbars" @action-event="handleActionEvent" />
    </div>

    <!-- 添加变量 -->
    <el-dialog title="添加变量" :visible.sync="addvisible" class="selectBox" :close-on-click-modal="false" :show-close="false" :modal="true" :append-to-body="true" width="70%" top="7vh">
      <div class="searchPerson">
        <div class="option">
          <span>变量名称:</span>
          <el-input v-model="varName"></el-input>
        </div>
        <el-button type="primary" plain class="elbtn" @click="loadData">
          <i class="iconfont icon-search iconbtn" />
          <span class="icontext">搜索</span>
        </el-button>
      </div>
      <div class="addTable">
        <el-table :data="selTableData" height="100%" style="width: 100%" v-loading="selloading" element-loading-background="rgba(250, 250, 250, 0.5)" :header-cell-style="{color:'#000'}" @selection-change="getAddRow" ref="multipleTable" :default-sort="{prop: 'name', order: 'descending'}">
          <el-table-column type="selection" width="45" align="center"></el-table-column>
          <el-table-column prop="name" label="变量名称" sortable></el-table-column>
          <el-table-column prop="key" label="key名称" sortable></el-table-column>
          <el-table-column prop="type" label="类型" sortable></el-table-column>
        </el-table>
      </div>
      <div class="combtn">
        <el-button type="primary" class="btn" @click="saveCom">确定</el-button>
        <el-button type="primary" class="btn" @click="cancelCom">取消</el-button>
      </div>
    </el-dialog>
  </el-dialog>
</template>

<script>
import IbpsEmployeeSelector from '@/business/platform/org/employee/selector';
import FormRule from '@/business/platform/form/rule';
import ActionUtils from '@/utils/action';
import request from '@/utils/request';
import { FORM_URL, BASE_GATEWAY_API } from '@/api/baseUrl';
export default {
  components: {
    IbpsEmployeeSelector,
    FormRule
  },
  props: {
    conditionEdit:{
      type: Boolean,
      default: false
    },
    bpmAgent: {
      type: Object,
      default() {
        return {};
      }
    },
    editeFrom: {
      type: Object,
      default() {
        return {};
      }
    },
    visible: {
      type: Boolean,
      default: false
    },
    defId: String,
    businessObjId: String
  },
  data() {
    return {
      bpmAgentObj: {},
      selItems: '',
      selData: [],
      varName: '',
      pageAll: {},
      currentpage: 1,
      selTableData: [],
      selloading: false,
      dialogVisible: this.visible,
      closeOnClickModal: false,
      formLabelWidth: '120px',
      formName: 'form',
      dialogLoading: false,
      addvisible: false,
      busObjId: '',
      form: {
        id: '',
        agentId: '',
        agenterId: '',
        agenterName: '',
        name: '',
        desc: '',
        condition: 'return true:'
      },
      rules: {
        agenterId: [{ required: true, message: this.$t('validate.required') }],
        name: [{ required: true, message: this.$t('validate.required') }]
      },
      toolbars: [{ key: 'save', label: '保存' }, { key: 'cancel' }]
    };
  },
  computed: {},
  watch: {
    visible: {
      handler: function(val, oldVal) {
        this.dialogVisible = this.visible;
      },
      immediate: true
    },
    editeFrom: {
      handler: function(val, oldVal) {
        if (JSON.stringify(val) != '{}') {
          this.form = val;
        }
      },
      immediate: true
    },
    bpmAgent: {
      handler: function(val, oldVal) {
        this.bpmAgentObj = val;
        this.busObjId = this.bpmAgentObj.boCode;
        console.log('bpmAgentObj', this.bpmAgentObj);
        if (this.bpmAgentObj.bpmAgentConditionPoList[0]) {
          this.form.agenterId = this.bpmAgentObj.agenterId;
          this.form.agenterName = this.bpmAgentObj.agenterName;
          this.form.name = this.bpmAgentObj.bpmAgentConditionPoList[0].name;
          this.form.desc = this.bpmAgentObj.bpmAgentConditionPoList[0].desc;
          this.form.condition = this.bpmAgentObj.bpmAgentConditionPoList[0].condition;
          console.log('form', this.form);
        }
      },
      immediate: true
    },
    // businessObjId: {
    //   handler: function(val, oldVal) {
    //     this.busObjId = val;
    //     console.log('businessObjId',val);

    //   },
    //   immediate: true
    // },
    form: {
      handler: function(val, oldVal) {
        // if (val.agentId !== "") {
        //   this.$refs[this.formName].clearValidate("agentId");
        // } else {
        //   this.formValidate();
        // }
      },
      deep: true
    }
  },
  methods: {
    closeDialog(){
      this.$emit('closeDialog')
    },
    clearForm() {
      Object.keys(this.form).forEach(key => (this.form[key] = ''));
      this.form.condition = 'return true:';
    },
    handleFormVar(node) {
      let data = '';
      if (node.attrType === 'field' || 'subField') {
        if (node.type === 'string') {
          data = node.tableName + '.getString("' + node.key + '")';
        } else if (node.type === 'number') {
          data = node.tableName + '.getInt("' + node.key + '")';
        } else if (node.type === 'date') {
          data = node.tableName + '.getDate("' + node.key + '")';
        } else {
          data = node.tableName + '.get("' + node.key + '")';
        }
      } else if (node.attrType === 'var') {
        data = node.key;
      } else if (node.attrType === 'bpmConstants') {
        data = node.key;
      } else {
        return;
      }
      this.selItems += data + ' ';
      console.log('this.selItems', this.selItems);
    },
    saveCom() {
      this.selItems = '';
      this.selData.forEach(item => {
        this.handleFormVar(item);
      });
      this.form.condition += this.selItems;
      this.addvisible = false;
    },
    cancelCom() {
      this.addvisible = false;
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.currentpage = val;
    },
    handleSelCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.currentpage = val;
      this.loadData();
    },
    loadData() {
      let list = this.selTableData;
      let len = list.length;
      let selArr = [];
      let reg = new RegExp(this.varName);
      if (this.varName != '') {
        for (var i = 0; i < len; i++) {
          if (list[i].name.match(reg)) {
            selArr.push(list[i]);
          }
        }
        this.selTableData = selArr;
      } else {
        this.getForm();
      }
      console.log('selArr', selArr);
    },
    getAddRow(val) {
      this.selData = val;
      console.log('selData', this.selData);
    },
    getForm() {
      this.addvisible = true;
      this.selloading = true;
      return request({
        baseURL: BASE_GATEWAY_API,
        url: FORM_URL + '/model/v3/bo/def/getBoTree?code=' + this.busObjId,
        method: 'post',
        data: {}
      })
        .then(res => {
          this.selTableData = res.data;
          this.selloading = false;
          console.log('getForm', res);
        })
        .catch(() => {
          this.selloading = false;
        });
    },
    callbackAgenterInfo(data) {
      console.log('callbackAgenterInfo', data);

      this.form.agenterName = data.name;
      this.form.agenterId = data.userId;
    },
    open() {
      this.formValidate();
    },
    /**
     * 表单验证
     */
    formValidate() {
      if (this.readonly) return;
      this.$nextTick(() => {
        this.$refs[this.formName].validate(() => {});
      });
    },
    handleActionEvent({ key }) {
      switch (key) {
        case 'save':
          this.handleConfirm();
          break;
        case 'cancel':
          this.closeDialog();
          break;
        default:
          break;
      }
    },
    // 关闭当前窗口
    closeDialog() {
      this.$emit('close', false);
      this.$refs[this.formName].resetFields();
    },
    handleConfirm() {
      this.$refs[this.formName].validate(valid => {
        if (valid) {
          if (this.conditionEdit) {
            this.$emit('edit', this.form);
          } else {
            this.$emit('callback', this.form);
          }
          
        } else {
          ActionUtils.saveErrorMessage();
        }
      });
      this.$emit('close', false);
    }
  }
};
</script>

<style lang="scss" scoped>
.selectBox {
  /deep/ .el-dialog__body {
    padding: 0px 20px 20px !important;
  }
  .searchPerson {
    margin-top: 10px;
    margin-bottom: 10px;
    .el-input {
      width: 250px;
      .el-input__inner {
        height: 28px;
        line-height: 28px;
        width: 150px;
      }
    }
    .option {
      display: inline-block;
      width: 34%;
      p {
        margin-bottom: 5px;
      }
    }
    .elbtn {
      padding: 8px 15px;
    }
  }
}

.addTable {
  height: 448px;
}
.combtn {
  margin-top: 15px;
  padding-left: 35%;
  .btn {
    margin: 0 30px;
  }
}
</style>
