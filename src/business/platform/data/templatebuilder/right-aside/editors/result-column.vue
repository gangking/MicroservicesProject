<template>
  <el-form :model="formData" label-width="120px" size="mini" class="template-result-column">
    <el-form-item label="显示名称">
      <el-input v-model="formData.label" placeholder="显示名称" />
    </el-form-item>
    <el-form-item label="跟字段控件一致">
      <el-switch v-model="formData.same" active-value="Y" inactive-value="N" />
    </el-form-item>
    <!--控件类型-->
    <template v-if="formData.same === 'N'">
      <el-form-item label="返回格式">
        <el-select v-model="formData.field_type">
          <el-option
            v-for="item in resultFormatOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <!-- 日期格式 -->
      <el-form-item v-if="formData.field_type === 'date'" label="日期格式">
        <el-select v-model="formData.field_options.datefmt_type">
          <el-option
            v-for="(item,index) in dateOptions"
            :key="index"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-input
          v-if="formData.field_options.datefmt_type ==='custom'"
          v-model="formData.field_options.datafmt"
        />
      </el-form-item>

      <el-form-item v-if="formData.field_type === 'select'" label="枚举值格式">
        <field-options v-model="formData.field_options.options" />
      </el-form-item>

      <el-form-item v-if="formData.field_type === 'dictionary'" label="数据字典">
        <ibps-type-select
          v-model="formData.field_options.dictionary"
          category-key="DIC_TYPE"
          node-key="typeKey"
          clearable
        />
      </el-form-item>
      <el-form-item v-if="formData.field_type === 'selector'" label="选择器类型">
        <el-select v-model="formData.field_options.selector_type">
          <el-option
            v-for="item in selectorTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item v-if="formData.field_type === 'selector'" label="存储格式">
        <el-select v-model="formData.field_options.store">
          <el-option
            v-for="item in storageFormatOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
    </template>
  </el-form>
</template>
<script>
import { resultFormatOptions, dateOptions, selectorTypeOptions, storageFormatOptions } from '../constants/editor-column'

import FieldOptions from '../components/field/options'
import IbpsTypeSelect from '@/business/platform/cat/type/select'

export default {
  components: {
    FieldOptions,
    IbpsTypeSelect
  },
  props: {
    data: {
      type: Object
    }
  },
  data() {
    return {
      resultFormatOptions,
      dateOptions,
      selectorTypeOptions,
      storageFormatOptions,
      formData: {}
    }
  },
  watch: {
    data: {
      handler(val) {
        this.formData = val
      },
      immediate: true
    },
    formData: {
      handler(val) {
        this.$emit('update:data', val)
      },
      deep: true
    }
  }
}
</script>

<style lang="scss">
.template-result-column {
  .el-select {
    width:100%;
  }
}
</style>

