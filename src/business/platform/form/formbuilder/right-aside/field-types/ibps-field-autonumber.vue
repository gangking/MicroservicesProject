<template>
  <div>
    <el-form v-bind="$attrs" v-on="$listeners">
      <!-- 基本属性 -->
      <editor-base
        :field-item="fieldItem"
        :bo-data="boData"
      />
      <!-- 参数设置 -->
      <editor-autonumber
        :field-item="fieldItem"
      />
      <!-- 字段权限 -->
      <editor-rights
        :field-item="fieldItem"
      />
    </el-form>
  </div>
</template>

<script>
import typeMixin from '../mixins/type'

export default {
  name: 'ibps-field-autonumber',
  mixins: [typeMixin]
}
</script>
