<template>
  <el-dialog
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    title="上传附件"
    class="bpmn-agree-dialog"
    append-to-body
    top="1vh"
    width="80%"
    @close="closeDialog"
  >
    <div class="viewbox">
      <iframe :src="url" class="view"></iframe>
    </div>
  </el-dialog>
</template>
<script>
import ApprovalOpinion from "@/business/platform/bpmn/components/approval-opinion";
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
      formName: "form",
      formLabelWidth: "130px",
      form: {
        jumpType: "common",
        opinion: ""
      },
      rules: {},
      url:
        "http://39.104.59.29:6886/#/file/fileUpload?user_code=006&billNo=A00005"
    };
  },
  computed: {},
  watch: {
    visible: {
      handler: function(val, oldVal) {
        this.dialogVisible = this.visible;
      },
      immediate: true
    }
  },
  methods: {
    closeDialog() {
      this.$emit("close", false);
    },
    handleSave() {
      this.$emit("action-event", this.action, {
        opinion: this.form.opinion
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.viewbox {
  
  .view {
    position: relative;
    top: 0;
    left: 0;
    width: 1000px;
    height: 700px;
  }
}
</style>
