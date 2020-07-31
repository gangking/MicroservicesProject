<template>
  <div>
    <div class="setting-title" @click="onTitle">全局设置</div>
    <el-collapse v-model="activeNames">
      <el-collapse-item title="业务对象绑定" name="boSetting">
        <bo-setting :data="boData" />
      </el-collapse-item>

      <el-collapse-item title="表单设置" name="formSeting">
        <form-setting
          :data="formData"
          :bo-data="boData"
          :def-key="defKey"
          :form-opinions="formOpinions"
          form-type="flow"
          @change-form="changeForm"
        />
      </el-collapse-item>

      <el-collapse-item title="表单设置" name="formSeting">
        <form-setting
          :data="formData"
          :bo-data="boData"
          :def-key="defKey"
          :form-opinions="formOpinions"
          form-type="flow"
          @change-form="changeForm"
        />
      </el-collapse-item>
      <!-- 隐藏掉 -->
      <el-collapse-item title="实例表单设置" name="instFormSetting" v-if="false">
        <form-setting :data="instFormData" :def-key="defKey" :bo-data="boData" form-type="inst" />
      </el-collapse-item>

      <el-collapse-item title="流程变量设置" name="varSetting">
        <variable-setting :data="variables" />
      </el-collapse-item>
      <!-- <el-collapse-item name="endNotify">
        <template slot="title">
          办结抄送设置
          <el-tooltip class="item" effect="light" content="进行设置流程结束时抄送给某批人！" placement="bottom">
            <i class="header-icon el-icon-info" />
          </el-tooltip>
        </template>
        <notify-setting :data="procNotify" />
      </el-collapse-item>-->
      <el-collapse-item title="其他设置" name="otherAttribute">
        <other-attribute :data="attributes" />
      </el-collapse-item>
    </el-collapse>
  </div>
</template>
<script>
import mixins from "../mixins/type";
export default {
  mixins: [mixins],
  props: {
    defKey: String
  },
  data() {
    return {
      activeNames: [
        "boSetting",
        "businessScenarios",
        "formSeting",
        "instFormSetting",
        "varSetting",
        "endNotify",
        "otherAttribute"
      ]
    };
  },
  computed: {
    // 业务对象
    boData() {
      return this.data ? this.data.bo || {} : {};
    },
    //
    boCode() {
      return this.boData ? this.boData.code || "" : "";
    },
    // 表单
    formData() {
      return this.data ? this.data.form || {} : {};
    },
    // 业务场景
    businessData() {
      return this.data ? this.data.business || {} : {};
    },
    // 实例表单
    instFormData() {
      return this.data ? this.data.instForm || {} : {};
    },
    // 表单意见
    formOpinions() {
      return this.data ? this.data.formOpinions || {} : {};
    },
    // 流程变量
    variables() {
      return this.data ? this.data.variables || [] : [];
    },
    // 抄送
    procNotify() {
      return this.data ? this.data.procNotify || [] : [];
    },
    // 其它属性
    attributes() {
      return this.data ? this.data.attributes || {} : {};
    }
  },
  methods: {
    getselectorValue(val) {
      this.$emit("getselectorValue", val);
    },
    handleData(key, data) {
      this.$emit("input", data);
    },
    changeForm(key, value) {
      this.instFormData[key] = value;
    }
  }
};
</script>

