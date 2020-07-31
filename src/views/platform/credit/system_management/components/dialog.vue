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
            <el-form-item label="信用体系描述" prop="creditDescribe">
              <el-input v-model="formInline.creditDescribe" placeholder="信用体系描述"></el-input>
            </el-form-item>
            <el-form-item label="分值上限" prop="scoreLimit">
              <el-input v-model.number="formInline.scoreLimit" type="number" placeholder="分值上限"></el-input>
            </el-form-item>
            <el-form-item label="基准分值" prop="benchmarkScores">
              <el-input
                v-model.number="formInline.benchmarkScores"
                type="number"
                placeholder="基准分值"
              ></el-input>
            </el-form-item>
            <el-form-item label="月分值上限" prop="monthlyPoints">
              <el-input v-model.number="formInline.monthlyPoints" type="number" placeholder="月分值上限"></el-input>
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
import { creditSave } from "@/api/platform/credit/system_management";
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
      formInline: {
        benchmarkScores: "",
        creditDescribe: "",
        monthlyPoints: "",
        scoreLimit: ""
      },
      rules: {
        benchmarkScores: [
          { required: true, message: "请填写基准分值", trigger: "blur" }
        ],
        creditDescribe: [
          { required: true, message: "请填写信用体系描述", trigger: "blur" }
        ],
        monthlyPoints: [
          { required: true, message: "请填写月分值上限", trigger: "blur" }
        ],
        scoreLimit: [
          { required: true, message: "请填写分值上限", trigger: "blur" }
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
    creditData: {
      handler: function(val, oldVal) {
        this.changeData(val);
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    getFormData() {},
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
              ...this.formInline
            }).then(response => {
              this.closeDialog();
              this.$emit("upTable");
            });
          } else {
            creditSave({
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
