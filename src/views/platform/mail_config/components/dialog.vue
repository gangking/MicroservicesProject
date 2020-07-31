<template>
  <div class="addNewMailCont" id="addNewMailCont">
    <el-dialog
      ref="dialog"
      :title="title"
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
            :model="ruleForm"
            :rules="rules"
            ref="ruleForm"
            label-width="100px"
            :inline="true"
          >
            <el-form-item label="邮件标题" prop="emailTitle">
               <el-input type="textarea" tyle="line-height: normal" v-model="ruleForm.emailTitle"></el-input>
            </el-form-item>
            <el-form-item label="邮件类型" prop="emailType">
              <el-input v-model="ruleForm.emailType"></el-input>
            </el-form-item>
            <el-form-item label="邮件规则" prop="rule">
              <el-input v-model="ruleForm.rule"></el-input>
            </el-form-item>
            <el-form-item label="邮件内容" prop="emailContent">
              <el-input type="textarea" tyle="line-height: normal" v-model="ruleForm.emailContent"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="confirm('ruleForm')">确定</el-button>
              <el-button @click="closeDialog">取 消</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  addNewMailConf,
  editMailConf
} from "@/api/platform/mailConfig/mailConfig";
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ""
    },
    mailData: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  data() {
    return {
      dialogVisible: false,
      loading: false,
      statusOpen: 1,
      statusClose: 0,
      ruleForm: {
        emailTitle: "",
        emailContent: "",
        emailType: "",
        rule: ""
      },
      rules: {
        emailTitle: [
          { required: true, message: "请填写邮件标题", trigger: "blur" }
        ],
        emailContent: [
          { required: true, message: "请填写邮件内容", trigger: "blur" }
        ],
        emailType: [
          { required: true, message: "请填写邮件类型", trigger: "blur" }
        ]
      }
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
    },
    mailData: {
      handler: function(val, oldVal) {
        this.changeData(val);
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    //转换值
    changeData(changeObj) {
      for (const key in this.ruleForm) {
        if (this.ruleForm.hasOwnProperty(key)) {
          const element = changeObj[key];
          this.$set(this.ruleForm, key, element);
        }
      }
    },
    // 获取编辑的数据
    getFormData() {
      if (this.mailData.id) {
        this.$set(this.ruleForm);
      }
    },
    closeDialog() {
      this.$emit("update:visible", false);
    },
    // 提交
    confirm() {
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          if (this.mailData.id) {
            editMailConf({
              id: this.mailData.id,
              emailTitle: this.ruleForm.emailTitle,
              emailContent: this.ruleForm.emailContent,
              // emailTitle: this.preText(this.ruleForm.emailTitle),
              // emailContent: this.preText(this.ruleForm.emailContent),
              emailType: this.ruleForm.emailType,
              rule: this.ruleForm.rule || ""
            }).then(response => {
              console.log("修改邮件", response);
              this.closeDialog();
              this.$emit("upTable");
            });
          } else {
            addNewMailConf({
              // emailTitle: this.preText(this.ruleForm.emailTitle),
              // emailContent: this.preText(this.ruleForm.emailContent),
              emailTitle: this.ruleForm.emailTitle,
              emailContent: this.ruleForm.emailContent,
              emailType: this.ruleForm.emailType,
              rule: this.ruleForm.rule || ""
            }).then(response => {
              console.log("新增邮件", response);
              this.$emit("upTable");
              this.closeDialog();
            });
          }
        } else {
          return false;
        }
      });
    },
    // 保留格式
    preText (pretext) {
　　　　return pretext.replace(/\n/g,"\\n");
    }
  }
};
</script>

<style scoped lang="scss">
.header-input {
  form {
    display: flex;
    flex-direction: column;
    width: 100%;
    .el-form-item {
      display: flex;
      justify-content: left;
      /deep/.el-form-item__label {
        text-align: left;
      }
      /deep/.el-form-item__content {
        flex: 1;
      }
    }
  }
}
</style>