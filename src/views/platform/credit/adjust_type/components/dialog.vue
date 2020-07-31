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
            <el-form-item label="状态" prop="status">
              <el-select v-model="formInline.status" clearable placeholder="请选择状态">
                <el-option label="停用" :value="statusClose"></el-option>
                <el-option label="启用" :value="statusOpen"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="调整类型" prop="adjustDescribe">
              <el-input v-model="formInline.adjustDescribe" placeholder="调整类型"></el-input>
            </el-form-item>

            <el-form-item label="信用体系描述" prop="creditSysId">
              <el-select v-model="formInline.creditSysId" placeholder="请选择信用体系">
                <el-option
                  v-for="item in optionsType"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
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
import { creditSave, creditDescribe } from "@/api/platform/credit/adjust_type";
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
      optionsType: [],
      statusOpen: 1,
      statusClose: 0,
      dialogVisible: false,
      loading: false,
      formInline: {
        adjustDescribe: "",
        status: "",
        creditSysId: ""
      },
      rules: {
        adjustDescribe: [
          { required: true, message: "请填写调整类型描述", trigger: "blur" }
        ],
        status: [{ required: true, message: "请选择状态", trigger: "change" }],
        creditSysId: [
          { required: true, message: "请选择信用体系描述", trigger: "change" }
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
    getFormData() {
      creditDescribe().then(res => {
        this.optionsType = res.data.map(item => {
          return {
            value: item.id,
            label: item.creditDescribe
          };
        });
      });
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
