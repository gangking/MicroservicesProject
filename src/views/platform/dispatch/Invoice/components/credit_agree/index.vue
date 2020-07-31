<template>
  <div class="credit_agree">
    <div class="content">
      <el-form
        :inline="true"
        :model="formInline"
        class="form-content"
        ref="ruleForm"
        :rules="rules"
        label-width="125px"
      >
        <el-form-item label="调整类型" prop="creditAdjustId" class="block">
          <el-select
            v-model="formInline.creditAdjustId"
            @change="creditTypechange"
            clearable
            @clear="clearAdjust"
            placeholder="请选择"
          >
            <el-option
              v-for="item in optionsType"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="调整原因" prop="creditCaseId" class="block">
          <el-select
            v-model="formInline.creditCaseId"
            clearable
            @clear="clearReason"
            @change="creditReasonchange"
            placeholder="请选择"
          >
            <el-option
              v-for="item in optionsReason"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="审批意见" prop="opinion" class="block areaWidth">
          <el-input
            type="textarea"
            :autosize="{ minRows: 4, maxRows: 8}"
            v-model="formInline.opinion"
          ></el-input>
        </el-form-item>
      <div class="btnbox">
        <el-button type="success" plain @click="confirm">同 意</el-button>
      </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import {
  creditStatus,
  getCreditAdjustPoList,
  getCreditAdjustReson
} from "@/api/platform/credit/adjust_type";
import { showLoading, hideLoading } from "@/utils/loading";

import { createNamespacedHelpers } from "vuex";
const { mapState: baseMapState, mapGetters } = createNamespacedHelpers(
  "ibps/compositeBase"
);
const { mapState: dilogMapState, mapActions } = createNamespacedHelpers(
  "ibps/compositeDolog"
);

export default {
  name: "credit-agree",
  props: {
    tagVal: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  data() {
    return {
      loading: false,
      optionsType: [], // 调整类型
      optionsReason: [], // 调整原因
      formInline: {
        creditCaseId: "",
        creditAdjustId: "",
        opinion: ""
      },
      creditData: {},
      rules: {
        // creditCaseId: [
        //   { required: true, message: "请选择调整原因", trigger: "change" }
        // ],
        // creditAdjustId: [
        //   { required: true, message: "请选择调整类型", trigger: "change" }
        // ],
        // opinion: [
        //   { required: true, message: "请输入审批意见", trigger: "blur" }
        // ]
      }
    };
  },
  computed: {
    ...baseMapState(["appId", "instId", "taskId", "bsiCode", "tableHeaderId"])
  },
  created() {
    this.refresh();
  },
  methods: {
    refresh() {
      this.loading = true;
      this.creditData = {
        appId: this.appId, //  应用ID
        instId: this.instId, // 流程实例ID
        taskId: this.taskId, // 任务ID
        status: "approverProcess", //固定
        bsiCode: this.bsiCode, // 业务情形
        buttonCode: this.tagVal.buttonCode, // 按钮this.buttonCode
        headId: this.tableHeaderId, // 表单头id
        actionName: "agree"
      };
      console.log("----------", this.creditData);
      getCreditAdjustPoList({ bpmKey: this.appId }).then(res => {
        console.log("调整类型 数据", res);
        this.loading = false;
        this.optionsType = res.data.map(item => {
          return {
            label: item.adjustDescribe,
            value: item.adjustType
          };
        });
      });
    },
    // 清空调整类型
    clearAdjust() {
      this.optionsReason = [];
      this.formInline.creditCaseId = "";
    },
    // 清空调整原因
    clearReason() {
      this.formInline.opinion = "";
    },
    // 调整类型数据
    creditTypechange(typeId) {
      console.log("调整类型", typeId);
      this.formInline.creditCaseId = "";
      getCreditAdjustReson({
        parameters: [
          {
            key: "Q^ADJUST_TYPE^SL",
            value: typeId
          }
        ],
        requestPage: {
          limit: 1000,
          pageNo: 1
        },
        sorts: [
          {
            field: "SERIAL_NUMBER_",
            order: "SERIAL_NUMBER_"
          }
        ]
      }).then(res => {
        console.log("调整原因的数据", res);
        let data = res.data.dataResult.filter(item => {
          return item.status == 1;
        });
        this.optionsReason = data.map(item => {
          return {
            label: item.causeDescribe,
            value: item.id
          };
        });
      });
    },
    creditReasonchange(id) {
      let resonIndex = this.optionsReason.findIndex(item => item.id == id);
      this.formInline.opinion = this.optionsReason[resonIndex].causeDescribe;
    },
    clearForm() {
      this.$refs["ruleForm"].resetFields();
    },
    confirm() {
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          showLoading();
          creditStatus({
            ...this.formInline,
            ...this.creditData
          }).then(res => {
            hideLoading();
            if (res.state == 200) {
              this.$message({
                message: "成功",
                type: "success"
              });
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
.credit_agree {
  height: 100%;
  .content {
    height: calc(100% - 40px);
    padding: 10px;
    box-sizing: border-box;
  }
  .btnbox {
    text-align: left;
    padding: 20px 0 0 120px;
  }
  /deep/ .form-content {
    width: 100%;
    text-align: left;
  }
  /deep/ .el-form--inline .el-form-item {
    display: block;
  }
}
</style>
