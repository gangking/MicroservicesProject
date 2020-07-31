<template>
  <div class="integrate">
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
            :inline="true"
            :model="formInline"
            class="form-content"
            ref="ruleForm"
            :rules="rules"
            label-width="125px"
          >
            <el-form-item label="调整原因" prop="causeDescribe">
              <el-input v-model="formInline.causeDescribe" placeholder="调整原因"></el-input>
            </el-form-item>
            <el-form-item label="调整分值" prop="resizeScore">
              <el-input v-model.number="formInline.resizeScore" type="number" placeholder="调整分值"></el-input>
            </el-form-item>
            <el-form-item label="状态" prop="status">
              <el-select v-model="formInline.status" clearable placeholder="请选择状态">
                <el-option label="停用" :value="statusClose"></el-option>
                <el-option label="启用" :value="statusOpen"></el-option>
              </el-select>
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
    },
    title: {
      type: String,
      default: ""
    },
    adjustType: {
      type: String,
      default: "",
      required: true
    },
    creditData: {
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
      formInline: {
        causeDescribe: "",
        resizeScore: "",
        status: 1
      },
      rules: {
        causeDescribe: [
          { required: true, message: "请填写调整原因", trigger: "blur" }
        ],
        resizeScore: [
          { required: true, message: "请填写调整分值", trigger: "blur" }
        ],
        status: [{ required: true, message: "请选择状态", trigger: "change" }]
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
    creditData: {
      handler: function(val, oldVal) {
        this.changeData(val);
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    getFormData() {
      if (!this.creditData.id) {
        this.$set(this.formInline, "status", 1);
      }
    },
    //转换值
    changeData(changeObj) {
      for (const key in this.formInline) {
        if (this.formInline.hasOwnProperty(key)) {
          const element = changeObj[key];
          this.$set(this.formInline, key, element);
        }
      }
    },
    clearForm() {
      this.$refs["ruleForm"].resetFields();
    },
    closeDialog() {
      this.$emit("update:visible", false);
    },
    confirm() {
      console.log(this.creditData, "this.creditData");
      //this.closeDialog();
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          if (this.creditData.id) {
            creditSave({
              serialNumber: this.creditData.serialNumber,
              id: this.creditData.id,
              adjustType: this.creditData.adjustType,
              adjustDes: this.creditData.adjustDes,
              ...this.formInline
            }).then(response => {
              this.closeDialog();
              this.$emit("upTable");
            });
          } else {
            creditSave({
              id: "",
              adjustType: this.adjustType,
              ...this.formInline
            }).then(response => {
              this.$emit("upTable");
              this.closeDialog();
            });
          }
        } else {
          return false;
        }
      });
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
