<template>
  <div>
    <!--描述-->
    <ibps-desc
      v-if="field.field_type==='desc'"
      :item="field"
    />
    <!--流程图-->
    <flow-diagram
      v-if="field.field_type==='flow_diagram'"
      ref="flowDiagram"
      :def-id="defId"
      :task-id="taskId"
      :inst-id="instanceId"
    />
    <!--流程历史-->
    <approval-history
      v-if="field.field_type==='approval_history'"
      ref="approvalHistory"
      :task-id="taskId"
      :inst-id="instanceId"
    />
  </div>
</template>
<script>
import IbpsDesc from './components/desc'
import FlowDiagram from '@/business/platform/bpmn/components/flow-diagram'
import ApprovalHistory from '@/business/platform/bpmn/components/approval-history'

export default {
  components: {
    IbpsDesc,
    FlowDiagram,
    ApprovalHistory
  },
  props: {
    models: Object, // 所有对象数据
    field: Object, // 字段
    params: Object
  },
  computed: {
    defId() {
      return this.params ? this.params.defId : null
    },
    taskId() {
      return this.params ? this.params.taskId : null
    },
    instanceId() {
      return this.params ? this.params.instanceId : null
    }
  },
  watch: {
    params: {
      handler(val) {
        if (this.field.field_type === 'flow_diagram' &&
         (this.$utils.isNotEmpty(this.defId) ||
         this.$utils.isNotEmpty(this.taskId) ||
         this.$utils.isNotEmpty(this.instanceId))) {
          this.$nextTick(() => {
            this.$refs.flowDiagram.getFormData()
          })
        }
        if (this.field.field_type === 'approval_history' &&
         (this.$utils.isNotEmpty(this.defId) ||
         this.$utils.isNotEmpty(this.taskId) ||
         this.$utils.isNotEmpty(this.instanceId))) {
          this.$nextTick(() => {
            this.$refs.approvalHistory.getFormData()
          })
        }
      },
      immediate: true,
      deep: true
    }
  }
}
</script>

