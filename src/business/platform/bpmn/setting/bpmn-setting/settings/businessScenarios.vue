<template>
  <div class="panel-body">
    <el-form ref="formSet" v-model="form" label-width="100px">
      <el-form-item label="业务场景：" prop="formValue">
        <BpmBsRelSelector
          v-model="form.formValue"
          :value-key="'key'"
          :bo-code="boCode"
          :toolbar="formToolbar"
          :flow-key="flowKey"
          :node-id="nodeId"
          :parent-flow-key="parentFlowKey"
          :is-inst="formType==='inst'"
          :rights-type="rightsType"
          :disabled="$utils.isEmpty(form.type)"
          :selectdata="data"
          data-type="business"
          @change="changeFormKey"
          @action-event="handleFormActionEvent"
          @rights-callback="handleRightsData"
          @getselectorValue="getselectorValue"
        />
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import BpmBsRelSelector from '@/business/platform/form/form-def/bpmBsRelSelector'

export default {
  components: {
    BpmBsRelSelector
  },
  props: {
    formType: {// 表单类型，form：表单,inst：实例表单，inner：业务场景表单
      type: String,
      default: 'flow'
    },
    data: Object, // 表单数据
    formOpinions: Object, // 表单意见的数据
    boData: Object, // 数据对象code
    defKey: String, // 流程定义key
    nodeId: String, // 节点ID
    parentFlowKey: String
  },
  data() {
    return {
      formOpinionVisible: false
    }
  },
  computed: {
    // 工具栏
    formToolbar() {
      const toolbar = [{
        key: 'rechoose',
        type: 'primary',
        label: '重选'
      }, {
        key: 'remove',
        type: 'danger',
        label: '删除'
      }, {
        key: 'rights',
        type: 'success',
        label: '权限'
      }]
      return toolbar
    },
    form() {
      return this.data
    },
    // 业务对象编码
    boCode() {
      return this.boData ? this.boData.code || '' : ''
    },
    boVersion() {
      return this.boData ? this.boData.version || '' : ''
    },
    rightsType() {
      return this.formType
    },
    formKey() {
      return this.form.formValue
    },
    flowKey() {
      return this.defKey
    }
  },
  watch: {
    boCode(val, oldVal) {
      if (this.$utils.isEmpty(val)) {
        if (this.form.type === 'inner') {
          this.form.formValue = ''
        }
      }
    }
  },
  methods: {
    getselectorValue(activedata){
      this.$emit('getselectorValue',activedata)
    },
    changeFormType(value) {
      if (this.formType === 'flow') {
        this.$emit('change-form', 'type', value)
      }
    },
    changeFormKey(value) {
      if (this.formType === 'flow') {
        this.$emit('change-form', 'formValue', this.$utils.isEmpty(value) ? '' : value.key)
      }
    },
    handleFormActionEvent(key) {
      if (key === 'opinion') {
        this.formOpinionVisible = true
      }
    },
    handleRightsData(data) {
      this.form.editFormRights = data
    }
  }
}
</script>

