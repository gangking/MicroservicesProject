<template>
  <el-form :model="formData" label-width="120px" size="mini" class="template-display-column">
    <el-form-item label="显示名称">
      <el-input v-model="formData.label" placeholder="显示名称" />
    </el-form-item>
    <el-form-item label="权限">
      <rights-selector v-model="formData.rights" />
    </el-form-item>
    <el-form-item label="无权限样式">
      <el-select v-model="formData.noRightStyle" placeholder="无权限样式">
        <el-option value="" label="不显示" />
        <el-option value="asterisk" label="星号(*)" />
      </el-select>
    </el-form-item>
    <el-form-item label="允许排序">
      <el-switch v-model="formData.sortable" />
    </el-form-item>
    <el-form-item label="对齐方式">
      <el-radio-group v-model="formData.align">
        <el-radio-button label="left">左对齐</el-radio-button>
        <el-radio-button label="center">居中对齐</el-radio-button>
        <el-radio-button label="right">右对齐</el-radio-button>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="跟字段控件一致">
      <el-switch v-model="formData.same" active-value="Y" inactive-value="N" />
    </el-form-item>
    <!--控件类型-->
    <template v-if="formData.same === 'N'">
      <el-form-item label="显示格式">
        <el-select v-model="formData.field_type">
          <el-option
            v-for="item in showTypesOptions"
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
      <!-- 数字格式 -->
      <el-form-item v-if="formData.field_type === 'number'" label="数字格式">
        <el-select v-model="formData.field_options.number_type">
          <el-option
            v-for="item in numberOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <!-- 枚举值格式 -->
      <el-form-item v-if="formData.field_type === 'select'" label-width="0">
        <field-options v-model="formData.field_options.options" />
      </el-form-item>
      <!-- 数据字典 -->
      <el-form-item v-if="formData.field_type === 'dictionary'" label="数据字典">
        <ibps-type-select
          v-model="formData.field_options.dictionary"
          category-key="DIC_TYPE"
          node-key="typeKey"
          clearable
        />
      </el-form-item>
      <!-- 选择器 -->
      <template v-if="formData.field_type === 'selector'">
        <el-form-item label="选择器类型">
          <el-select v-model="formData.field_options.selector_type">
            <el-option
              v-for="item in selectorTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="存储格式">
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

      <!-- 自定义对话框 TODO: -->
      <el-form-item v-if="formData.field_type === 'customDialog'" label="自定义对话框">
        <el-select v-model="formData.field_options" value-key="dialog" filterable clearable placeholder="请选择自定义对话框">
          <el-option
            v-for="item in customDialogOptions"
            :key="item.dialog"
            :label="item.dialog_name"
            :value="item"
          />
        </el-select>
      </el-form-item>

      <el-form-item v-if=" formData.field_type === 'customDialog'" label="存储格式">
        <el-select v-model="formData.field_options.store_mode">
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

import RightsSelector from '@/business/platform/rights/config/selector'
import { selectorTypeOptions, dateOptions, showTypesOptions, numberOptions, storageFormatOptions, customDialogOptions } from '../constants/editor-column'

import FieldOptions from '../components/field/options'
import IbpsTypeSelect from '@/business/platform/cat/type/select'

export default {
  components: {
    RightsSelector,
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
      showTypesOptions,
      selectorTypeOptions,
      dateOptions,
      numberOptions,
      storageFormatOptions,
      customDialogOptions,
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
.template-display-column {
  .el-select {
    width:100%;
  }
}
</style>

