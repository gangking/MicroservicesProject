<template>
  <el-dialog
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :title="actionName"
    class="bpmn-agree-dialog"
    append-to-body
    top="5vh"
    width="60%"
    @close="closeDialog"
  >
    <el-form
      ref="form"
      :element-loading-text="$t('common.loading')"
      :model="form"
      :rules="rules"
    >
      <el-form-item label="审批意见:" prop="opinion">
        <approval-opinion
          v-model="form.opinion"
        />
      </el-form-item>

    </el-form>
    <div slot="footer" class="el-dialog--center">
      <el-button type="primary" icon="ibps-icon-save" @click="handleSave()">{{ actionName }}</el-button>
      <el-button type="danger" icon="el-icon-circle-close" @click="closeDialog()">取 消</el-button>
    </div>
  </el-dialog>
</template>
<script>
import ApprovalOpinion from '@/business/platform/bpmn/components/approval-opinion'
export default {
  components: {
    ApprovalOpinion
  },
  props: {
    visible: Boolean,
    action: String,
    taskId: String,
    data: [String, Object]
  },
  data() {
    return {
      dialogVisible: this.visible,
      dialogLoading: false,
      formName: 'form',
      formLabelWidth: '130px',
      form: {
        opinion: ''
      },
      rules: {
        opinion: [{ required: true, message: this.$t('validate.required') }]
      }
    }
  },
  computed: {
    actionName() {
      if (this.action === 'agree') {
        return '同意'
      } else {
        return '终止流程'
      }
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
    closeDialog() {
      this.$emit('close', false)
    },
    handleSave() {
      this.$emit('action-event', this.action, {
        opinion: this.form.opinion
      })
    }
  }
}
</script>

