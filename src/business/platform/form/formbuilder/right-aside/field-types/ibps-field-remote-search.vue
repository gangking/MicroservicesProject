<template>
  <div>
    <el-form v-bind="$attrs" v-on="$listeners">
      <!-- 基本属性 -->
      <editor-base :field-item="fieldItem" :bo-data="boData" />
      <!-- 参数设置 -->
      <editor-remote-search :field-item="fieldItem" :formData="formData" />

      <!-- 校验规则 -->
      <editor-rules :field-item="fieldItem" />
      <!-- 字段权限 -->
      <editor-rights :field-item="fieldItem" />
    </el-form>
  </div>
</template>

<script>
import typeMixin from "../mixins/type"; //所有的编辑组件，全部加载进来

export default {
  name: "ibps-field-reomte-search",
  mixins: [typeMixin],
  props: {
    formData: {
      type: Object
    }
  }
};
</script>
