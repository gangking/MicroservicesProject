<template>
  <div class="integrate">
    <el-dialog
      ref="dialog"
      center
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="true"
      class="servey_dialog"
      width="50%"
      @close="closeDialog"
      @open="getFormData"
      append-to-body
    >
      <div v-loading="loading">
        <div class="main-title">{{serveyObj.docnumber}} 丨{{serveyObj.bsDesc}}</div>
        <div
          class="title-tip"
        >{{serveyObj.docDescription}} 丨{{transformTime(serveyObj.completionTime)}}</div>
        <div class="header-input" ref="headerInput">
          <el-form
            :model="formInline"
            class="form-content"
            ref="ruleForm"
            :rules="rules"
            label-position="left"
            label-width="90px"
          >
            <el-form-item label="星级评价" prop="grade" class="big">
              <el-rate v-model="formInline.grade" :disabled="disabled" @change="gradeChange"></el-rate>
            </el-form-item>
            <el-form-item label="评价意见" class="big" prop="suggest" v-show="!showSugges && !disabled">
              <el-input
                type="textarea"
                :disabled="disabled"
                :autosize="{ minRows: 3, maxRows: 8}"
                placeholder="请输入内容"
                v-model="formInline.suggest"
              ></el-input>
            </el-form-item>
          </el-form>
          <div v-show="disabled" class="suggest">{{serveyData.suggest}}</div>
          <div v-show="showSugges" class="tips" @click="handlerSugge">
            <img src="@/assets/images/mycard/sugges.png" /> 请提出您的建议，帮助我们做的更好
          </div>
        </div>

        <div slot="footer" class="dialog-footer">
          <el-button @click="closeDialog">关 闭</el-button>
          <el-button type="primary" v-if="!disabled" @click="confirm">提 交</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { docLook, docSave } from "@/api/platform/servey/servey";

export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    serveyData: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  data() {
    var checkSuggest = (rule, value, callback) => {
      if (this.formInline.grade <= 4 && value == "") {
        this.showSugges = false;
        callback(new Error("评分低于4分,请填写意见"));
      } else {
        callback();
      }
    };
    return {
      showSugges: true,
      disabled: false,
      dialogVisible: false,
      loading: false,
      formInline: {
        grade: null,
        suggest: ""
      },
      serveyObj: {},
      rules: {
        grade: [{ required: true, message: "请选择分数", trigger: "change" }],
        suggest: [{ validator: checkSuggest, trigger: "blur" }]
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
    serveyData: {
      handler: function(val, oldVal) {},
      immediate: true
    }
  },
  methods: {
    handlerSugge() {
      this.showSugges = false;
    },
    //当评分为5时，取消验证
    gradeChange(value) {
      let field = this.$refs["ruleForm"].fields;
      console.log(field);
      field.forEach(item => {
        if (item.prop === "suggest" && value == 5) {
          item.clearValidate();
        }
      });
    },
    // 时间转换
    transformTime(timestamp) {
      if (timestamp) {
        var oDate = new Date(timestamp),
          oYear = oDate.getFullYear(),
          oMonth = oDate.getMonth() + 1,
          oDay = oDate.getDate(),
          oHour = oDate.getHours(),
          oMin = oDate.getMinutes(),
          oSen = oDate.getSeconds(),
          oTime = oYear + "-" + this.addZero(oMonth) + "-" + this.addZero(oDay);
        // this.addZero(oHour) +
        // ":" +
        // this.addZero(oMin) +
        // ":" +
        // this.addZero(oSen);
        return oTime;
      } else {
        return "";
      }
    },
    //添0操作
    addZero(num) {
      if (parseInt(num) < 10) {
        num = "0" + num;
      }
      return num;
    },
    getFormData() {
      this.loading = true;
      this.serveyObj = {};
      docLook({ id: this.serveyData.id }).then(result => {
        this.loading = false;
        this.serveyObj = result.data;
        if (this.serveyObj.grade) {
          this.$set(this.formInline, "grade", this.serveyObj.grade);
          this.$set(this.formInline, "suggest", this.serveyObj.suggest);
          this.$set(this.rules.grade[0], "required", false);
          this.disabled = true;
          this.showSugges = false;
        } else {
          this.$set(this.formInline, "grade", null);
          this.$set(this.formInline, "suggest", "");
          this.$set(this.rules.grade[0], "required", true);
          this.disabled = false;
          this.showSugges = true;
        }
      });
    },
    clearForm() {
      this.$nextTick(() => {
        this.$refs["ruleForm"].resetFields();
      });
    },
    closeDialog() {
      this.$emit("update:visible", false);
    },
    confirm() {
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          console.log(999999999)
          let obj = JSON.parse(JSON.stringify(this.serveyObj));
          Object.assign(obj, this.formInline);
          docSave({
            ...obj
          }).then(response => {
            this.closeDialog();
            this.$emit("upTable");
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
<style lang="scss">
.servey_dialog {
  .el-dialog__header {
    border-bottom: none;
  }
}
</style>
<style scoped lang="scss">
.main-title {
  color: #333;
  font-weight: bold;
  font-size: 16px;
  height: 50px;
  line-height: 50px;
}
.title-tip {
  color: #666;
}
.block {
  display: block;
}
.header-input {
  margin-top: 20px;
  .suggest {
    font-size: 16px;
    line-height: 30px;
  }
}
/deep/ .el-button--small,
.el-button--small.is-round {
  padding: 10px 25px;
}
/deep/.el-dialog--center .el-dialog__body {
  padding-top: 10px;
}
/deep/ .el-rate__icon {
  font-size: 25px;
}
/deep/ .el-dialog__header {
  padding-top: 0px;
}
.dialog-footer {
  margin-top: 70px;
  text-align: center;
}
.tips {
  display: flex;
  align-items: center;
  > img {
    width: 20px;
    height: 20px;
    margin-right: 3px;
  }
}
.big {
  /deep/.el-form-item__label {
    font-size: 16px;
    font-weight: bold;
  }
}
</style>
