<template>
  <div class="panel-body">
    <el-form ref="formSet" v-model="form" label-width="100px">
      <el-form-item label="表单类型：" prop="type">
        <el-radio-group v-model="form.type" @change="changeFormType">
          <el-radio label="inner">在线表单</el-radio>
          <!-- <el-radio label="urlLoad">URL表单</el-radio>
          <el-radio label="frame">内嵌URL表单</el-radio>-->
        </el-radio-group>
      </el-form-item>
      <el-form-item label="表单：" prop="formValue">
        <form-def-selector
          v-if="form.type=='inner'||form.type==''"
          v-model="form.formValue"
          :value-key="'key'"
          :bo-code="boCode"
          :toolbar="formToolbar"
          :flow-key="flowKey"
          :node-id="nodeId"
          :parent-flow-key="parentFlowKey"
          :is-inst="formType==='inst'"
          :rights-type="rightsType"
          :disabled="$utils.isEmpty(form.type)"
          data-type="bo"
          @change="changeFormKey"
          @action-event="handleFormActionEvent"
          @rights-callback="handleRightsData"
        />
        <el-input
          v-if="form.type=='frame'||form.type=='urlLoad'"
          v-model="form.formValue"
          placeholder="表单URL"
        />
        <el-input
          v-if="form.type=='frame'"
          v-model="form.editUrl"
          placeholder="明细URL"
          class="ibps-pt-5"
        />
      </el-form-item>
      <!-- <el-form-item label="打印模版：" prop="formPrint">
        <form-print-selector v-model="form.formPrint" :disabled="$utils.isEmpty(form.formValue)" />
      </el-form-item>

      <template v-if="formType==='flow' || formType==='node' ">
        <el-form-item label="前置处理器：" prop="prevHandler">
          <el-input v-model="form.prevHandler" placeholder="前置处理器" type="textarea" rows="1" />
        </el-form-item>
        <el-form-item label="后置处理器：" prop="postHandler">
          <el-input v-model="form.postHandler" placeholder="后置处理器" type="textarea" rows="1" />
        </el-form-item>
      </template>-->
    </el-form>
    <!-- :node-map="nodeMap" -->
    <!-- <form-opinion
      :form-key="formKey"
      :rights-type="rightsType"
      :form-opinions="formOpinions"
      :visible="formOpinionVisible "
      @close="visible => formOpinionVisible = visible"
    />-->
  </div>
</template>
<script>
import FormDefSelector from "@/business/platform/form/form-def/selector";
// import FormPrintSelector from '@/business/platform/form/form-print/selector'
// import FormOpinion from '../../bpmn-setting/components/form-opinion'

export default {
  components: {
    FormDefSelector
    // FormPrintSelector,
    // FormOpinion
  },
  props: {
    formType: {
      // 表单类型，form：表单,inst：实例表单
      type: String,
      default: "flow"
    },
    data: Object, // 表单数据
    formOpinions: Object, // 表单意见的数据
    boData: Object, // 数据对象code
    defKey: String, // 流程定义key
    nodeId: String, // 节点ID
    parentFlowKey: String
  },
  data() {
    return {
      formOpinionVisible: false
    };
  },
  computed: {
    // 工具栏
    formToolbar() {
      const toolbar = [
        {
          key: "rechoose",
          type: "primary",
          label: "重选"
        },
        {
          key: "remove",
          type: "danger",
          label: "删除"
        },
        {
          key: "rights",
          type: "success",
          label: "权限"
        }
      ];

      // if (this.formType === 'flow') {
      //   toolbar.push({
      //     key: 'opinion',
      //     type: 'warning',
      //     label: '意见'
      //   })
      // }
      return toolbar;
    },
    form() {
      return this.data;
    },
    // 业务对象编码
    boCode() {
      return this.boData ? this.boData.code || "" : "";
    },
    boVersion() {
      return this.boData ? this.boData.version || "" : "";
    },
    rightsType() {
      return this.formType;
    },
    formKey() {
      return this.form.formValue;
    },
    flowKey() {
      return this.defKey;
    }
  },
  watch: {
    boCode(val, oldVal) {
      if (this.$utils.isEmpty(val)) {
        if (this.form.type === "inner") {
          this.form.formValue = "";
        }
      }
    },
    data: {
      handler(val, oldVal) {
        //console.log('表单设置数据',val);
      },
     immediate: true
    }
  },
  methods: {
    changeFormType(value) {
      if (this.formType === "flow") {
        this.$emit("change-form", "type", value);
      }
    },
    changeFormKey(value) {
      if (this.formType === "flow") {
        this.$emit(
          "change-form",
          "formValue",
          this.$utils.isEmpty(value) ? "" : value.key
        );
      }
    },
    handleFormActionEvent(key) {
      if (key === "opinion") {
        this.formOpinionVisible = true;
      }
    },
    handleRightsData(data) {
      this.form.editFormRights = data;
    }
  }
};
</script>

