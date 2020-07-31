<template>
  <div>
    <el-dialog
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      class="form-renderer-dialog"
      fullscreen
      destroy-on-close
      append-to-body
      @open="loadFormData"
      @close="closeDialog"
    >
      <div
        v-loading.fullscreen.lock="dialogLoading"
        :element-loading-text="$t('common.loading')"
      >
        <template v-if="dialogVisible">
          <template v-if="formModel.type === 'INNER'">
            <!---在线表单--->
            <formrender
              v-if="formDef"
              ref="formrender"
              :form-def="formDef"
              :buttons="buttons"
              :data="formData"
              :params="formParams"
              :readonly="readonly"
              @action-event="(actionKey,args)=>emitEventHandler(actionKey,args)"
              @callback="callback"
              @close="closeDialog"
            />
          </template>
          <!---内嵌url表单--->
          <template
            v-else-if="formModel.type === 'URL_LOAD'"
          >
            <form-toolbar
              :buttons="buttons"
              @validate="validateForm"
              @action-event="(actionKey,args)=>emitEventHandler(actionKey,args)"
              @callback="callback"
              @close="closeDialog"
            />
            <component
              :is="formUrlName"
              ref="formrender"
              :params="formParams"
              :readonly="readonly"
            />
          </template>
          <!---外部url表单--->
          <iframe
            v-else-if="formModel.type === 'FRAME'"
            ref="bpmnFormIframe"
            class="ibps-container-frame"
            frameborder="0"
          />
        </template>
      </div>
    </el-dialog>
    <!--流程图-->
    <flow-diagram-dialog
      :visible="flowDiagramVisible"
      :def-id="defId"
      :task-id="taskId"
      :inst-id="instanceId"
      @close="visible => flowDiagramVisible= visible"
    />
    <!--流程历史-->
    <approval-history-dialog
      :visible="approvalHistoryVisible"
      :task-id="taskId"
      :inst-id="instanceId"
      @close="visible => approvalHistoryVisible= visible"
    />
    <!--流程实例-->
    <instance-detail
      :visible="instanceDetailVisible"
      :bpmn-inst-id="instanceId"
      @close="visible => instanceDetailVisible= visible"
    />

    <!--启动流程-->
    <start-flow-dialog
      :visible="startFlowDialogVisible"
      :def-id="defId"
      :data="submitFormData"
      @close="visible => startFlowDialogVisible= visible"
      @action-event="saveStartFlow"
    />

    <!--同意 -->
    <agree-dialog
      :visible="agreeDialogVisible"
      :action="actionName"
      :task-id="taskId"
      :version="version"
      @close="visible => agreeDialogVisible= visible"
      @action-event="handleActionEvent"
    />

    <!--驳回-->
    <reject-dialog
      :visible="rejectDialogVisible"
      :action="actionName"
      :task-id="taskId"
      @close="visible => rejectDialogVisible= visible"
      @action-event="handleActionEvent"
    />
    <!--终止流程-->
    <approve-dialog
      :visible="approveDialogVisible"
      :action="actionName"
      :task-id="taskId"
      @close="visible => approveDialogVisible= visible"
      @action-event="handleActionEvent"
    />
    <!--转办-->
    <delegate-dialog
      :visible="delegateDialogVisible"
      :action="actionName"
      :task-id="taskId"
      title="任务转办"
      @close="visible => delegateDialogVisible= visible"
      @callback="callback"
    />

  </div>
</template>
<script>
import { getFormData, getInstFormData } from '@/api/platform/bpmn/bpmInst'
import { getTaskFormData } from '@/api/platform/bpmn/bpmTask'
import ActionMixin from './action'
import BpmnButton from './button'

import Formrender from '@/business/platform/form/formrender/index.vue'
import FormToolbar from '@/business/platform/form/formrender/toolbar.vue'

import FlowDiagramDialog from '../components/flow-diagram/dialog'
import ApprovalHistoryDialog from '../components/approval-history/dialog'
import InstanceDetail from '@/views/platform/bpmn/bpmInst/detail'

import StartFlowDialog from '@/business/platform/bpmn/form-ext/start-flow'
import AgreeDialog from '@/business/platform/bpmn/form-ext/agree'
import RejectDialog from '@/business/platform/bpmn/form-ext/reject'
import ApproveDialog from '@/business/platform/bpmn/form-ext/approve'
import DelegateDialog from '@/business/platform/bpmn/task-change/edit'
const _import = require('@/router/_import_' + process.env.NODE_ENV)

export default {
    components: {
        Formrender,
        FormToolbar,
        FlowDiagramDialog,
        ApprovalHistoryDialog,
        InstanceDetail,
        StartFlowDialog,
        AgreeDialog,
        RejectDialog,
        ApproveDialog,
        DelegateDialog
    },
    mixins: [
        ActionMixin
    ],
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        defId: {// 流程定义ID
            type: String
        },
        proInstId: {// 草稿流程实例ID
            type: String
        },
        instanceId: {// 流程实例ID
            type: String
        },
        taskId: {// 流程任务ID
            type: String
        }
    },
    data() {
        return {
            dialogVisible: this.visible,
            flowDiagramVisible: false,
            approvalHistoryVisible: false,
            instanceDetailVisible: false,
            startFlowDialogVisible: false,
            agreeDialogVisible: false, // 同意
            rejectDialogVisible: false,
            delegateDialogVisible: false,
            addSignTaskDialogVisible: false,
            approveDialogVisible: false,

            actionName: '',
            version: '',
            // ========表单的数据=======
            dialogLoading: false,
            formUrlName: '',

            formModel: {
                type: 'INNER'
            },
            formDef: null,
            buttons: [],
            formData: {},
            attributes: {}, // 新增扩展属性
            formParams: {}, // 表单流程扩展参数
            readonly: false,

            submitFormData: {}
        }
    },
    watch: {
        visible: {
            handler: function(val, oldVal) {
                this.dialogVisible = this.visible
            },
            immediate: true
        }
    },
    methods: {
    // 获取数据
        loadFormData() {
            this.dialogLoading = true
            this.formDef = null
            this.buttons = null
            this.formData = null
            this.$nextTick(() => {
                this.readonly = false
                if (this.$utils.isNotEmpty(this.taskId)) { // 处理流程任务
                    this.getTaskFormData()
                } else if (this.$utils.isNotEmpty(this.defId)) { // 启动 或者草稿流程启动
                    this.getDefinitionFormData()
                } else if (this.$utils.isNotEmpty(this.instanceId)) { // 流程实例
                    this.getInstanceFormData()
                }
            })
        },

        /**
     * 启动 或者草稿流程
     */
        getDefinitionFormData() {
            this.formParams.defId = this.defId
            this.formParams.proInstId = this.proInstId || null
            getFormData({
                defId: this.defId,
                proInstId: this.proInstId || null
            }).then(response => {
                this.dialogLoading = false
                this.buildFormData(response.data)
            }).catch(() => {
                this.dialogLoading = false
            })
        },
        /**
     * 获取流程任务表单
     */
        getTaskFormData() {
            this.dialogLoading = true
            this.formParams.taskId = this.taskId || null
            getTaskFormData({
                taskId: this.taskId
            }).then(response => {
                this.dialogLoading = false
                this.buildFormData(response.data)
            }).catch(() => {
                this.dialogLoading = false
            })
        },
        /**
     * 流程实例 的表单数据
     */
        getInstanceFormData() {
            this.readonly = true
            this.formParams.instanceId = this.instanceId || null
            getInstFormData({
                instId: this.instanceId
            }).then(response => {
                this.dialogLoading = false
                this.buildFormData(response.data)
            }).catch(() => {
                this.dialogLoading = false
            })
        },
        /**
     * 构建表单相关数据
     */
        buildFormData(data) {
            if (this.$utils.isEmpty(data)) {
                this.$alert(`未获取到数据`).then(() => {
                    this.closeDialog()
                })
                return
            }
            const formModel = data.formModel

            // 判断是否设置表单
            if (this.$utils.isEmpty(formModel)) {
                this.$alert(`未设置表单,请流程定义中设置表单`).then(() => {
                    this.closeDialog()
                })
                return
            }
            this.formModel = formModel
            // ============在线表单 ================
            if (formModel.type === 'INNER') {
                if (this.$utils.isEmpty(formModel.formData)) {
                    this.$alert(`未设置在线表单`).then(() => {
                        this.closeDialog()
                    })
                }

                // 表单定义
                this.formDef = this.$utils.parseData(formModel.formData) || {}

                this.formData = {
                    // 表单数据
                    responses: this.$utils.parseData(data.boData) || {},
                    // 表单权限
                    permissions: this.$utils.parseData(data.permissions) || {}
                }
                //
                this.attributes = this.getAttributes(data)
                // 操作按钮
                this.buttons = this.buildButtons(data.buttons, this.attributes) || []
                // 版本号
                this.version = data.version

                //  ============内嵌表单[按钮这边提供] ================
            } else if (formModel.type === 'URL_LOAD') {
                const formUrlName = 'IbpsBpmnFormUrl'
                this.$options.components[formUrlName] = _import(formModel.formValue)
                this.formUrlName = formUrlName
                this.attributes = this.getAttributes(data)
                // 操作按钮
                this.buttons = this.buildButtons(data.buttons, this.attributes) || []
                //  ============外部表单【iframe】 ================
            } else if (formModel.type === 'FRAME') {
                this.$refs.bpmnFormIframe.src = formModel.formValue.startWith('http') ? formModel.formValue : formModel.formValue
                // 传递消息
                this.$refs.bpmnFormIframe.contentWindow.postMessage({ data: 'xxx' }, '*')
            }
        },
        getAttributes(data) {
            const attributes = data.attributes || {}
            return {
                title: this.title,
                defId: this.defId,
                proInstId: this.proInstId,
                taskId: this.taskId,
                nodeId: this.nodeId,
                lockUser: attributes.lockUser,
                curUserId: attributes.curUserId,
                suspendState: attributes.suspendState,
                printTemplateId: data.formModel.templateId,
                version: data.version,
                firstNodeUserAssign: attributes.firstNodeUserAssign
            }
        },
        /**
     * 构建操作按钮
     */
        buildButtons(buttons, params) {
            if (this.$utils.isEmpty(buttons)) {
                buttons = []
            }
            buttons.unshift({
                alias: 'close'
            })
            const btn = new BpmnButton({
                buttons: buttons,
                params: params
            })
            return btn.response_buttons
        },
        getFormData() {
            return this.$refs.formrender.getFormData()
        },
        // 后置事件
        afterScript(key) {
            return this.$refs.formrender.afterScript(key)
        },
        callback() {
            this.closeDialog()
            this.$emit('callback', true)
        },
        // 关闭当前窗口
        closeDialog() {
            this.$emit('close', false)
        },
        // 验证表单if()
        validateForm(callback) {
            if (!this.$refs.formrender.validate) {
                callback(true)
                return
            }
            this.$refs.formrender.validate((valid, invalidFields) => {
                callback(valid, invalidFields)
            })
        }
    }
}
</script>
<style lang="scss" >
  .form-renderer-dialog{
    .el-dialog__header{
      padding: 0;
      border-bottom:0;
    }
    .el-dialog__body {
      padding: 0;
    }
     .el-dialog__headerbtn{
      z-index: 99999;
    }
    .ibps-container-frame {
        position: absolute;
        top: 0px;
        left: 0px;
        height: 100%;
        width: 100%;
    }
  }
</style>

