<template>
  <div class="integrate">
    <el-dialog
      ref="dialog"
      title="审批驳回"
      center
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="true"
      class="dialog"
      width="50%"
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
            <el-form-item label="返回方式" prop="destination" class="block">
              <el-radio-group v-model="formInline.destination">
                <el-radio label="direct">回到本节点</el-radio>
                <el-radio label="normal">按流程图执行</el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item label="调整原因" prop="creditCaseId" class="block">
              <el-cascader
                :options="optionsType"
                :props="props"
                clearable
                v-model="creditCaseIdsArr"
                @clear="clearReason"
                @change="creditReasonchange"
              ></el-cascader>
            </el-form-item>

            <el-form-item label="审批意见" prop="opinion" class="block areaWidth">
              <el-input
                type="textarea"
                :autosize="{ minRows: 4, maxRows: 8}"
                v-model="formInline.opinion"
              ></el-input>
            </el-form-item>
          </el-form>
        </div>

        <div slot="footer" class="dialog-footer">
          <el-button @click="closeDialog">取 消</el-button>
          <el-button type="primary" @click="confirm">驳 回</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  creditStatus,
  getCreditAdjustPoList
} from "@/api/platform/credit/adjust_type";
import { showLoading, hideLoading } from "@/utils/loading";

export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    itemVal: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  data() {
    var validateCreditCaseId = (rule, value, callback) => {
      if (this.creditCaseIdsArr.length === 0) {
        callback(new Error("请选择调整原因"));
      } else {
        callback();
      }
    };
    return {
      dialogVisible: true,
      props: { multiple: true },
      loading: false,
      optionsType: [],
      optionsReason: [],
      creditCaseIdsArr: [],
      creditReasonIds: [],
      formInline: {
        destination: "",
        opinion: "",
        creditCaseIds: "",
        creditAdjustId: ""
      },
      rules: {
        destination: [
          { required: true, message: "请选择返回方式", trigger: "change" }
        ],
        creditCaseId: [
          { required: true, validator: validateCreditCaseId, trigger: "change" }
        ],
        opinion: [
          { required: true, message: "请输入审批意见", trigger: "blur" }
        ]
      }
    };
  },
  inject: {
    ibpsPayable: {
      from: "ibpsPayable",
      default() {
        return this;
      }
    },
    outerSkin: {
      from: "outerSkin",
      default() {
        return this;
      }
    }
  },
  computed: {},
  created() {},
  mounted() {
    this.getFormData();
  },
  watch: {},
  methods: {
    getFormData() {
      getCreditAdjustPoList({ bpmKey: this.itemVal.creditData.appId }).then(
        res => {
          for (const key in res.data) {
            if (res.data.hasOwnProperty(key)) {
              const ressonList = res.data[key];
              let optionList = {};
              optionList.label = key;
              optionList.children = [];
              ressonList.forEach((item, index) => {
                optionList.children.push({
                  label: item.causeDescribe,
                  value: item.id
                });
                this.optionsReason.push({
                  label: item.causeDescribe,
                  value: item.id
                });

                optionList.value = item.adjustType;
              });

              this.optionsType.push(optionList);
            }
          }
        }
      );
    },
    clearReason() {
      this.formInline.opinion = "";
    },
    //调整原因带出 文字
    creditReasonchange(ids) {
      this.formInline.opinion = "";
      this.creditReasonIds = []
      this.creditCaseIdsArr.forEach(list => {
        this.optionsReason.forEach(reson => {
          if (reson.value == list[1]) {
            this.formInline.opinion += reson.label + ",";
            this.creditReasonIds.push(list[1]);
          }
        });
      });
    },
    clearForm() {
      this.$refs["ruleForm"].resetFields();
    },
    closeDialog() {
      this.dialogVisible = false;
    },
    confirm() {
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          showLoading();
          this.formInline.creditCaseIds = this.creditReasonIds.join(",");
          creditStatus({
            ...this.formInline,
            ...this.itemVal.creditData
          }).then(res => {
            hideLoading();
            if (res.state == 200) {
              this.$message({
                message: "成功",
                type: "success"
              });
              this.outerSkin.handleClose();
              this.ibpsPayable.$emit("exit-multi-form", "exit-multi-form");
              this.closeDialog();
            }
          });
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
.block {
  width: 70%;
}
/deep/.el-form-item__content {
  width: calc(100% - 125px);
}
.areaWidth {
  width: 100%;
  /deep/.el-form-item__content {
    width: calc(100% - 125px);
    .el-textarea {
      width: 80%;
    }
  }
}
.dialog-footer {
  margin-top: 20px;
  text-align: center;
}
/deep/ .el-cascader {
  width: 100%;
}
/deep/ .el-textarea {
  width: 215px;
}
</style>
