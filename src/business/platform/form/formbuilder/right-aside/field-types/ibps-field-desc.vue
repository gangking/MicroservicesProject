<template>
  <div>
    <el-form v-bind="$attrs" v-on="$listeners">
      <!-- 基本属性 -->
      <editor-base
        :field-item="fieldItem"
        types="label,desc,splitLine,lineStyle"
      />

    </el-form>
  </div>
</template>

<script>
import typeMixin from '../mixins/type'

export default {
  name: 'ibps-field-desc',
  mixins: [typeMixin]
}
</script>
