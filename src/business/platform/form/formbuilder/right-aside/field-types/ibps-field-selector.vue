<template>
  <div>
    <el-form v-bind="$attrs" v-on="$listeners">
      <!-- 基本属性 -->
      <editor-base
        :field-item="fieldItem"
        :bo-data="boData"
        default-value-types="fixed,present,dynamic,linkage,formula"
      >
        <div slot="fixedValue">
          <ibps-user-selector
            v-model="fieldOptions.default_value"
            :multiple="fieldOptions.multiple"
            :store="fieldOptions.store||'id'"
            :type="fieldOptions.selector_type||'employee'"
            placeholder="请选择"
          />
        </div>
        <div slot="presentValue">
          <el-tag type="info" style="width: 100%;" disable-transitions>当前{{ fieldOptions.selector_type | optionsFilter(selectorTypeOptions) }}</el-tag>
        </div>
      </editor-base>
      <!-- 参数设置 -->
      <editor-selector
        :field-item="fieldItem"
      />
      <!-- 校验规则 -->
      <editor-rules
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
import { selectorTypeOptions } from '../../constants'
import IbpsUserSelector from '@/business/platform/org/selector'

export default {
  name: 'ibps-field-selector',
  components: {
    IbpsUserSelector
  },
  mixins: [typeMixin],
  data() {
    return {
      selectorTypeOptions: selectorTypeOptions
    }
  }
}
</script>
