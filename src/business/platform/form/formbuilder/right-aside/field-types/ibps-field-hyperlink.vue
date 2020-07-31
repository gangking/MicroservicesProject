<template>
  <div>
    <el-form v-bind="$attrs" v-on="$listeners">
      <!-- 基本属性 -->
      <editor-base
        :field-item="fieldItem"
        :bo-data="boData"
        types="label,desc"
      />
      <editor-hyperlink
        :field-item="fieldItem"
        :bo-data="boData"
      />
      <!-- 字段权限 -->
      <editor-rights
        :field-item="fieldItem"
        types="hide"
      />
    </el-form>
  </div>
</template>

<script>
import typeMixin from '../mixins/type'

export default {
  name: 'ibps-field-hyperlink',
  mixins: [typeMixin]
}
</script>
