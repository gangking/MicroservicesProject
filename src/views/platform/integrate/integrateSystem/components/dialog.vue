<template>
  <div class="integrate">
    <el-dialog
      ref="dialog"
      title="新增/编辑"
      center
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="true"
      class="dialog"
      width="60%"
      @close="closeDialog"
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
            label-width="80px"
          >
            <el-form-item label="系统编码" prop="sysCode">
              <el-input v-model="formInline.sysCode" placeholder="系统编码"></el-input>
            </el-form-item>
            <el-form-item label="系统描述" prop="sysDesc">
              <el-input v-model="formInline.sysDesc" placeholder="系统描述"></el-input>
            </el-form-item>
            <el-form-item label="状态" prop="status">
              <el-select v-model="formInline.status" clearable placeholder="请选择状态">
                <el-option label="停用" value="0"></el-option>
                <el-option label="启用" value="1"></el-option>
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
import { integSysAddEdit } from "@/api/platform/integrate/system";
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    integrateData: {
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
        sysCode: "",
        sysDesc: "",
        status: ""
      },
      rules: {
        sysCode: [
          { required: true, message: "请填写系统编码", trigger: "blur" }
        ],
        sysDesc: [
          { required: true, message: "请填写系统描述", trigger: "blur" }
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
    integrateData: {
      handler: function(val, oldVal) {
        this.changeData(val);
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
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
      console.log(this.integrateData, "this.integrateData");
      //this.closeDialog();
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          if (this.integrateData.id) {
            integSysAddEdit({
              id: this.integrateData.id,
              ...this.formInline
            }).then(response => {
              this.closeDialog();
              this.$emit("upTable");
            });
          } else {
            integSysAddEdit({
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
