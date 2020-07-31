<template>
  <div class="integrate">
    <el-dialog
      ref="dialog"
      title="查询条件"
      center
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="true"
      class="dialog"
      width="60%"
      @close="closeDialog"
      @open="getFormData"
      append-to-body
    >
      <div>
        <div class="header-input" ref="headerInput">
          <el-form
            :inline="true"
            :model="formInline"
            class="form-content"
            ref="ruleForm"
            :rules="rules"
            label-width="100px"
          >
            <el-form-item label="单据编号">
              <el-input v-model="formInline.docnumber" clearable placeholder="单据编号"></el-input>
            </el-form-item>
            <el-form-item label="业务场景">
              <el-input clearable v-model.number="formInline.BS_DESC" placeholder="业务场景"></el-input>
            </el-form-item>
            <el-form-item label="单据描述">
              <el-input clearable v-model.number="formInline.DOC_DESCRIPTION" placeholder="单据描述"></el-input>
            </el-form-item>
            <el-form-item label="完成时间">
              <el-date-picker
                v-model="formInline.COMPLETION_TIME"
                value-format="yyyy-MM-dd"
                type="date"
                clearable
                placeholder="完成时间"
              ></el-date-picker>
            </el-form-item>
          </el-form>
        </div>

        <div slot="footer" class="dialog-footer">
          <el-button @click="closeDialog">取 消</el-button>
          <el-button type="primary" @click="confirm">确 定</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { creditSave } from "@/api/platform/credit/adjust_reason";
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dialogVisible: false,
      loading: false,
      statusOpen: 1,
      statusClose: 0,
      formInline: {
        docnumber: "",
        BS_DESC: "",
        DOC_DESCRIPTION: "",
        COMPLETION_TIME: null
      },
      rules: {}
    };
  },
  computed: {},
  created() {},
  mounted() {},
  watch: {
    visible: {
      handler: function(val, oldVal) {
        this.dialogVisible = this.visible;
      },
      immediate: true
    }
  },
  methods: {
    getFormData() {},
    clearForm() {
      this.$refs["ruleForm"].resetFields();
    },
    closeDialog() {
      this.$emit("update:visible", false);
    },
    confirm() {
      this.closeDialog();
      this.$emit("formFiled", this.formInline);
    }
  },
  components: {}
};
</script>

<style scoped lang="scss">
.header-input {
  margin-top: 20px;
}
.dialog-footer {
  margin-top: 20px;
  text-align: center;
}
.integrate {
  min-height: 300px;
}
/deep/ .el-input__inner {
  width: 215px;
}
/deep/ .el-textarea {
  width: 215px;
}
</style>
