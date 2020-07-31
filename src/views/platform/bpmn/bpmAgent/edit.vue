<template>
  <!-- 流程代理 -->
  <el-dialog :title="title" :visible.sync="dialogVisible" :close-on-click-modal="false" :close-on-press-escape="false" class="bpmn-agent-dialog" width="80%" top="5vh" @open="getFormData" @close="closeDialog">
    <el-form ref="agentForm" v-loading="dialogLoading" :element-loading-text="$t('common.loading')" :model="bpmAgent" :rules="rules" :label-width="formLabelWidth">
      <el-form-item label="标题:" prop="title">
        <el-input v-if="!readonly" v-model="bpmAgent.title" />
        <span v-else>{{ bpmAgent.title }}</span>
      </el-form-item>
      <el-row>
        <el-col :span="12" col>
          <el-form-item label="代理类型:" prop="agentType">
            <el-radio-group v-if="!readonly" v-model="bpmAgent.agentType">
              <el-radio v-for="option in agentTypeOptions" :key="option.value" :label="option.value">{{ option.label }}</el-radio>
            </el-radio-group>
            <el-tag v-else :type="bpmAgent.agentType|optionsFilter(agentTypeOptions,'type')">{{ bpmAgent.agentType|optionsFilter(agentTypeOptions,'label') }}</el-tag>
          </el-form-item>
        </el-col>
        <el-col :span="12" col>
          <el-form-item label="是否启用:" prop="isEnabled">
            <el-switch v-if="!readonly" v-model="bpmAgent.isEnabled" active-value="enabled" inactive-value="disabled" />
            <el-tag v-else :type="bpmAgent.isEnabled|optionsFilter(statusOptions,'type')">{{ bpmAgent.isEnabled|optionsFilter(statusOptions,'label') }}</el-tag>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="委托人:" prop="delegatorId">
        <ibps-employee-selector v-if="!readonly" v-model="bpmAgent.delegatorId" @callback="callbackDelegatorrInfo" />
        <span v-else>{{ bpmAgent.delegatorName }}</span>
      </el-form-item>
      <el-row>
        <el-col :span="12" col>
          <el-form-item label="生效时间:" prop="effectiveTime">
            <el-date-picker v-if="!readonly" v-model="bpmAgent.effectiveTime" type="date" style="width：100%;" />
            <span v-else>{{ bpmAgent.effectiveTime }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12" col>
          <el-form-item label="失效时间:" prop="expiryTime">
            <el-date-picker v-if="!readonly" v-model="bpmAgent.expiryTime" type="date" style="width：100%;" />
            <span v-else>{{ bpmAgent.expiryTime }}</span>
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 全部代理 || 部分代理 -->
      <el-form-item v-if="bpmAgent.agentType === 'all' || bpmAgent.agentType === 'part'" label="代理人:">
        <ibps-employee-selector v-if="!readonly" v-model="bpmAgent.agenterId" @callback="callbackAgenterInfo" />
        <span v-else>{{ bpmAgent.agenterName }}</span>
      </el-form-item>

      <div v-if="bpmAgent.agentType === 'part'">
        <el-form-item label="流程定义">
          <div v-if="!readonly" class="dialog-right">
            <bpm-definition-selector button multiple @callback="updateDefine" />
            <el-button class="ibps-icon-remove" type="danger" @click="handleDelete(multipleSelection)">删除</el-button>
          </div>
        </el-form-item>
        <el-form-item v-loading="rowLoading" label-width="20px" :element-loading-text="$t('common.loading')">
          <el-table ref="multipleTable" border :data="bpmAgent.bpmAgentDefPoList" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="40" />
            <el-table-column label="流程名称">
              <template slot-scope="scope">{{ scope.row.procDefName?scope.row.procDefName:scope.row.name }}</template>
            </el-table-column>
            <el-table-column label="操作" width="55">
              <template slot-scope="scope">
                <el-button type="danger" icon="el-icon-delete" circle @click="handleDelete(scope.$index, scope.row)" />
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
      </div>

      <!-- 条件代理 -->
      <div v-if="bpmAgent.agentType === 'condition'">
        <!-- 根据业务对象名称再选业务场景名称和流程名称 -->
        <el-form-item label="业务对象:">
          <!-- <bpm-definition-selector v-model="bpmAgent.procDefId" :disabled="readonly" /> -->
          <el-input v-model="businessObjName" placeholder="请选择业务对象" :readonly="true" class="selinp">
            <el-button slot="append" icon="el-icon-plus" @click="getBusinessObj"></el-button>
          </el-input>
        </el-form-item>
        <el-form-item label="流程名称:">
          <!-- <bpm-definition-selector v-model="bpmAgent.procDefId" :disabled="readonly" /> -->

          <el-select v-model="processId" multiple filterable placeholder="请选择流程名称" @change="getProNameIds" class="elsel" :loading="selectLoading">
            <el-option v-for="item in proNameOptions" :key="item.defId" :label="item.name" :value="item.defId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="业务场景应用:">
          <!-- <bpm-definition-selector v-model="bpmAgent.procDefId" :disabled="readonly" /> -->
          <el-select v-model="businessAppId" multiple filterable placeholder="请选择业务场景应用" class="elsel" @change="getBusApp" @visible-change="getBusAppOptions(true,processIds)" :loading="selLoading">
            <el-option v-for="item in busAppOptions" :key="item.key" :label="item.describe" :value="item.key"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="流程代理条件">
          <div v-if="!readonly" class="dialog-right">
            <el-button class="ibps-icon-add" type="primary" @click="openConditionDialog">添加</el-button>
            <el-button class="ibps-icon-remove" type="danger">删除</el-button>
          </div>
        </el-form-item>
        <el-form-item v-loading="rowLoading" label-width="20px" :element-loading-text="$t('common.loading')">
          <el-table ref="multipleTable" :data="bpmAgent.bpmAgentConditionPoList" tooltip-effect="dark" style="width: 100%" @selection-change="handleConditionChange">
            <el-table-column type="selection" width="55" />
            <el-table-column label="代理人">
              <template slot-scope="scope">{{ scope.row.agenterName }}</template>
              <!-- <template slot-scope="scope">{{ scope.row.name }}</template> -->
            </el-table-column>
            <el-table-column label="条件名称">
              <template slot-scope="scope">{{ scope.row.name }}</template>
            </el-table-column>
            <el-table-column prop="address" label="管理" width="100px" show-overflow-tooltip>
              <template slot-scope="scope">
                <!-- <el-button type="primary" icon="el-icon-edit" circle @click="handleEdit(scope.$index, scope.row)" /> -->
                <el-button type="primary" icon="el-icon-edit" circle @click="openConditionDialog(scope.$index, scope.row, '编辑')" />
                <el-button type="danger" icon="el-icon-delete" circle @click="handleRemove(scope.$index, scope.row)" />
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
      </div>


    </el-form>
    <div slot="footer" class="el-dialog--center">
      <ibps-toolbar :actions="toolbars" @action-event="handleActionEvent" />
    </div>
    <!-- 添加规则弹窗 -->
    <condition :conditionEdit="conditionEdit" @closeDialogTwo="closeDialogTwo" :editeFrom="editeFrom" ref="condit" :bpmAgent="bpmAgent" :def-id="bpmAgent.procDefId" :visible="conditionDialogVisible" :businessObjId="businessObjId" @edit="editcallbackBpmAgentConditionPoList" @callback="callbackBpmAgentConditionPoList" @close="visible => conditionDialogVisible = visible" />
    <addBusObj ref="busObj" :visible="addBusObjVisible" :dialogVisible="addBusObjVisible" @handleClose="closeBusObj" @getProNameOptions="getProNameOptions" @open="openBusObj" @cleanAll="cleanAll" />
  </el-dialog>
</template>

<script>
import { save, get } from '@/api/platform/bpmn/bpmAgent';
import { agentTypeOptions, statusOptions } from './constants';
import ActionUtils from '@/utils/action';
import IbpsEmployeeSelector from '@/business/platform/org/employee/selector';
import BpmDefinitionSelector from '@/business/platform/bpmn/definition/selector';
import Condition from './condition';
import { setTimeout } from 'timers';
import request from '@/utils/request';
import { FORM_URL, BASE_GATEWAY_API, COMP_URL } from '@/api/baseUrl';
import addBusObj from './addBusObj';
import addProName from './addProName';
import addBusApp from './addBusApp';

export default {
  components: {
    IbpsEmployeeSelector,
    BpmDefinitionSelector,
    Condition,
    addBusObj,
    addProName,
    addBusApp
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    readonly: {
      type: Boolean,
      default: false
    },
    id: String,
    title: String
  },
  data() {
    return {
      conditionEdit:false,
      editeFrom: {},
      selectLoading: false,
      selLoading: false,
      proNameOptions: [],
      busAppOptions: [],
      addBusObjVisible: false,
      addProNameVisible: false,
      addBusAppVisible: false,
      selecForm: {},
      currentpage: 1,
      businessObjId: '',
      businessObjName: '',
      processId: [],
      processIds: '',
      processName: '',
      businessAppId: [],
      businessAppName: '',
      formName: 'agentForm',
      formLabelWidth: '120px',
      dialogVisible: this.visible,
      conditionDialogVisible: false, // 条件规则界面
      dialogLoading: false,
      rowLoading: false,
      statusOptions: statusOptions,
      agentTypeOptions: agentTypeOptions,
      defaultForm: {},
      multipleSelection: [],
      conditionSelection: [],
      bpmAgent: {
        title: '',
        procDefId: '',
        procDefKey: '',
        delegatorId: this.$store.getters.userId,
        delegatorName: this.$store.getters.name,
        effectiveTime: new Date(),
        expiryTime: new Date(),
        agenterId: '',
        agenterName: '',
        agentType: 'all',
        isEnabled: 'enabled',
        bpmAgentDefPoList: [],
        bpmAgentConditionPoList: [],
        poListObj: {},
        proNameIds: '',
        boCode: '',
        procDefKeys: '',
        key: ''
      },
      rules: {
        title: [{ required: true, message: this.$t('validate.required') }]
      },
      toolbars: [
        {
          key: 'save',
          hidden: () => {
            return this.readonly;
          }
        },
        { key: 'cancel' }
      ]
    };
  },
  computed: {
    formId() {
      return this.id;
    }
  },
  watch: {
    visible: {
      handler: function(val, oldVal) {
        this.dialogVisible = this.visible;
      },
      immediate: true
    }
    // businessObjId: {
    //   handler: function(val, oldVal) {
    //     console.log('watchbusinessObjId',val);

    //   },
    //   immediate: true
    // }
  },
  created() {
    this.defaultForm = JSON.parse(JSON.stringify(this.bpmAgent));
  },
  methods: {
    closedialogVisible(){
      this.$emit('closedialogVisible')
    },
    getBusApp(val) {
      console.log('getBusApp', val);
      this.bpmAgent.bsaKeys = val.toString();
    },
    // 选择流程名称
    getProNameIds(val) {
      console.log('name', this.processName);
      this.businessAppId = '';
      console.log('businessAppIdval', val);
      this.processIds = this.processId.toString();
      this.bpmAgent.proNameIds = this.processIds;
    },
    // 根据业务对象id获取流程名称
    getProNameOptions(businessObjId) {
      this.selectLoading = true;
      return request({
        baseURL: BASE_GATEWAY_API,
        url: FORM_URL + '/bpm/v3/bpm/definition/findByBoCode?boCode=' + businessObjId,
        method: 'get',
        data: {}
      })
        .then(res => {
          console.log('getProNameOptions', res);
          this.proNameOptions = res.data;
          this.selectLoading = false;
          this.dialogLoading = false;
        })
        .catch(res => {
          this.selectLoading = false;
          this.dialogLoading = false;
          // this.$message.error("消息类重复!");
        });
    },
    getProNameOption(businessObjId) {
      return request({
        baseURL: BASE_GATEWAY_API,
        url: FORM_URL + '/bpm/v3/bpm/definition/findByBoCode?boCode=' + businessObjId,
        method: 'get',
        data: {}
      })
        .then(res => {
          console.log('getProNameOption', res);

          if (res.data.length == 0) {
            this.processIds = '';
            this.businessAppId = [];
            this.busAppOptions = [];
            this.proNameOptions = [];
          } else {
            this.proNameOptions = res.data;
            this.processId = this.processId.concat(this.bpmAgent.procDefKeys.split(','));
            this.processIds = this.processId.toString();
            this.getBusAppOptions(true, this.processIds);
            this.businessAppId = this.businessAppId.concat(this.bpmAgent.bsaKeys.split(','));
          }
          this.dialogLoading = false;
        })
        .catch(res => {
          this.dialogLoading = false;
          // this.$message.error("消息类重复!");
        });
    },
    // 根据流程id获取业务场景应用
    getBusAppOptions(event, Ids) {
      if (event == true) {
        this.selLoading = true;
        return request({
          baseURL: BASE_GATEWAY_API,
          url: COMP_URL + '/scene/v3/bpmBsRel/queryByDefIds?defIds=' + Ids,
          method: 'get',
          data: {}
        })
          .then(res => {
            console.log('getBusAppOptions', res);
            this.busAppOptions = res.data;
            this.selLoading = false;
          })
          .catch(res => {
            this.selLoading = false;
            // this.$message.error("消息类重复!");
          });
      }
    },
    closeBusObj(id, name) {
      if (id != undefined && name != undefined) {
        this.businessObjId = id;
        this.businessObjName = name;
        console.log('this.businessObjId', this.businessObjId);
        console.log('this.businessObjName', this.businessObjName);

        this.getProNameOptions(this.businessObjId);
      }
      this.addBusObjVisible = false;
    },
    openBusObj() {
      this.addBusObjVisible = true;
    },
    openProName() {
      this.addBusObjVisible = true;
    },
    openBusApp() {
      this.addBusObjVisible = true;
    },
    getBusinessObj() {
      this.openBusObj();
      this.$refs.busObj.loadData();
    },
    cleanAll() {
      this.businessObjName = '';
      this.processId = [];
      this.processIds = '';
      this.businessAppId = [];
      this.busAppOptions = [];
      this.proNameOptions = [];
    },
    getProcessName() {
      this.$refs.proName.loadData();
    },
    getBusinessApp() {
      this.$refs.busApp.loadData();
    },
    handleEdit() {
      this.rowLoading = true;
      setTimeout(() => {
        this.rowLoading = false;
        // todo
      });
    },
    handleRemove(index, arr) {
      this.rowLoading = true;
      setTimeout(() => {
        if (arr !== []) {
          this.bpmAgent.bpmAgentConditionPoList.splice(index, 1);
        } else {
          arr.forEach(i => {
            this.bpmAgent.bpmAgentConditionPoList.forEach(l => {
              if (i.procDefKey === l.procDefKey) {
                this.bpmAgent.bpmAgentConditionPoList.splice(l, 1);
              }
            });
          });
        }
        this.rowLoading = false;
      });
    },
    // 获取添加对象给table赋值
    callbackBpmAgentConditionPoList(data) {
      const { agenterId, agenterName, condition, desc, id, name } = data;
      this.poListObj = { agenterId, agenterName, condition, desc, id, name };
      this.bpmAgent.bpmAgentConditionPoList.push(this.poListObj);
      console.log('this.bpmAgent.bpmAgentConditionPoList', this.bpmAgent.bpmAgentConditionPoList);
    },
    editcallbackBpmAgentConditionPoList(data) {
      const { agenterId, agenterName, condition, desc, id, name } = data;
      this.poListObj = { agenterId, agenterName, condition, desc, id, name };
      var list = JSON.parse(JSON.stringify(this.bpmAgent));
      for(var i = 0; i < list.bpmAgentConditionPoList.length;i++) {
        var item = list.bpmAgentConditionPoList[i];
        if (item.id == this.editeFrom.id) {
          list.bpmAgentConditionPoList[i] = this.poListObj;
        }
      }
      this.bpmAgent = list;
      // this.bpmAgent.bpmAgentConditionPoList = [this.poListObj];
    },
    handleDelete(index, arr) {
      this.rowLoading = true;
      setTimeout(() => {
        if (arr !== []) {
          this.bpmAgent.bpmAgentDefPoList.splice(index, 1);
        } else {
          arr.forEach(i => {
            this.bpmAgent.bpmAgentDefPoList.forEach(l => {
              if (i.procDefKey === l.procDefKey) {
                this.bpmAgent.bpmAgentDefPoList.splice(l, 1);
              }
            });
          });
        }
        this.rowLoading = false;
      });
    },
    handleSelectionChange(val) {
      console.log('Selection', val);
      this.multipleSelection = val;
    },
    handleConditionChange(val) {
      console.log('ConditionChange', val);
      this.conditionSelection = val;
    },
    handleActionEvent({ key }) {
      switch (key) {
        case 'save':
          this.handleSave();
          break;
        case 'cancel':
          this.closeDialog();
          break;
        default:
          break;
      }
    },
    // 保存数据
    handleSave() {
      this.$refs[this.formName].validate(valid => {
        if (valid) {
          this.saveData();
        } else {
          ActionUtils.saveErrorMessage();
        }
      });
    },
    // 提交保存数据
    saveData() {
      if (this.bpmAgent.bpmAgentConditionPoList.length > 0) {
        this.bpmAgent.agenterId = this.bpmAgent.bpmAgentConditionPoList[0].agenterId?this.bpmAgent.bpmAgentConditionPoList[0].agenterId:this.bpmAgent.bpmAgentConditionPoList[0].id;
        this.bpmAgent.agenterName = this.bpmAgent.bpmAgentConditionPoList[0].agenterName;
        this.bpmAgent.boCode = this.businessObjId;
        this.bpmAgent.procDefKeys = this.processIds;
        const data = JSON.parse(JSON.stringify(this.bpmAgent));
        console.log('data', data);
        save(data)
          .then(response => {
            this.$emit('callback', this);
            ActionUtils.saveSuccessMessage(response.message, rtn => {
              if (this.$utils.isEmpty(this.formId)) {
                this.$refs[this.formName].resetFields();
              }
              if (rtn) {
                this.closeDialog();
              }
            });
          })
          .catch(err => {
            console.info(err);
          });
      } else {
        this.$message.error('请选择一个代理人!');
      }
    },
    // 关闭当前窗口
    closeDialog() {
      // this.$emit('closedialogVisible');
      this.$emit('close');
      this.$refs[this.formName].resetFields();
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
    /**
     * 获取表单数据
     */
    getFormData() {
      this.businessObjName = '';
      this.processId = [];
      this.businessAppId = [];
      if (this.$utils.isEmpty(this.formId)) {
        // 重置表单
        this.bpmAgent = JSON.parse(JSON.stringify(this.defaultForm));
        this.formValidate();
        return;
      }
      this.dialogLoading = true;
      get({
        id: this.formId
      })
        .then(response => {
          this.bpmAgent = response.data;
          this.businessObjId = this.bpmAgent.boCode;
          console.log('getFormData', this.bpmAgent);
          this.formValidate();
          this.getFormInfo();
          // this.dialogLoading = false;
        })
        .catch(() => {
          this.dialogLoading = false;
        });
    },
    getFormInfo() {
      return request({
        baseURL: BASE_GATEWAY_API,
        url: FORM_URL + '/model/v3/bo/def/query',
        method: 'post',
        data: {
          parameters: [
            { key: 'Q^TYPE_ID_^S', value: '' },
            { key: 'Q^CODE_^SL', value: this.bpmAgent.boCode }
          ],
          requestPage: {
            pageNo: this.currentpage,
            limit: 10,
            totalCount: null
          },
          sorts: []
        }
      }).then(res => {
        this.businessObjName = res.data.dataResult[0].name;
        this.getProNameOption(this.bpmAgent.boCode);
        console.log('this.proNameOption', this.proNameOptions);

        // for (let index = 0; index < this.proNameOption.length; index++) {
        //   for (let index = 0; index < array.length; index++) {
        //     const element = array[index];
        //   }
        // }
        console.log('getFormInfo', res);
      });
    },
    addDef() {
      alert('打开流程选择器');
    },
    callbackDelegatorrInfo(data) {
      this.bpmAgent.delegatorName = data.name;
    },
    callbackAgenterInfo(data) {
      // console.log('全权代理委托人',data)
      this.bpmAgent.bpmAgentConditionPoList.push(data);
      // this.bpmAgent.agenterName = data.name;
    },
    updateDefine(data) {
      this.rowLoading = true;
      setTimeout(() => {
        this.bpmAgent.bpmAgentDefPoList = data.map(item => {
          return {
            id: '',
            agenterId: '',
            procDefKey: item.defKey,
            nodeId: '',
            name: item.name
          };
        });
        this.rowLoading = false;
      });
    },
    // 打开添加弹窗
    openConditionDialog(...arg) {
      console.log('打开添加弹窗', arg);
      this.bpmAgent.procDefId = this.processIds;
      this.conditionEdit = false;
      console.log('this.bpmAgent.procDefId', this.bpmAgent.procDefId);
      this.$refs.condit.clearForm();
      if (this.$utils.isEmpty(this.bpmAgent.procDefId)) {
        this.$message.closeAll();
        this.$message({
          message: '请选择流程！',
          type: 'warning'
        });
        return;
      }
      // 编辑
      if (arg.length == 3) {
        if (arg[2] == '编辑') {
          this.editeFrom = {
            id: arg[1].id,
            agentId: arg[1].agentId,
            agenterId: arg[1].agenterId,
            agenterName: arg[1].agenterName,
            name: arg[1].name,
            desc: arg[1].desc,
            condition: arg[1].condition
          };
          this.conditionEdit = true;
        }
      }

      this.conditionDialogVisible = true;
    },
    closeDialogTwo() {
      this.conditionDialogVisible = false;
    }
  }
};
</script>

<style lang="scss" scoped>
// 弹窗内容高度
/deep/ .el-dialog__body {
  height: 450px;
  overflow: auto;
}
/deep/ .el-select {
  width: 100% !important;
}
/deep/ .el-tag.el-tag--info {
  color: #409eff !important;
  background: #ecf5ff !important;
}
.bpmn-agent-dialog {
  .el-dialog__body {
    height: calc(100vh - 110px) !important;
  }
  .dialog-right {
    float: right;

    div {
      display: inline-block;
    }
  }
}
.selinp {
  cursor: pointer;
}
</style>

