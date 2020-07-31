<template>
  <div class="panel panel-default">
    <div class="panel-heading">
      <span><i :class="icon" />{{ label }}</span>
      <div v-if="types.includes('switchFieldType')" class="ibps-fr">
        <el-dropdown @command="switchFieldType">
          <span class="el-dropdown-link">
            更换控件
            <i class="el-icon-arrow-down el-icon--right" />
          </span>
          <el-dropdown-menu slot="dropdown" class="field-type-dropdown">
            <el-scrollbar
              tag="div"
              wrap-class="el-select-dropdown__wrap"
              view-class="el-select-dropdown__list"
            >
              <template v-for="field in fieldTypes">
                <el-dropdown-item
                  :key="field.key"
                  :command="field.field_type"
                  :divided="field.divided"
                  :disabled="field.field_type===fieldItem.field_type"
                >
                  <i :class="field.icon" />{{ field.label }}
                </el-dropdown-item>
              </template>
            </el-scrollbar>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <div class="panel-body">
      <el-form-item v-if="types.includes('label')" prop="label">
        <template slot="label">标题<help-tip prop="label" /></template>
        <el-input v-model="fieldItem.label" />
      </el-form-item>
      <el-form-item v-if="types.includes('name')" prop="name">
        <template slot="label">属性<help-tip prop="name" /></template>
        <ibps-bo-select v-model="fieldItem.name" :data="fields" :empty-text="emptyText" @change="changeBoName" />
      </el-form-item>
      <el-form-item v-if="types.includes('key')" prop="name">
        <template slot="label">属性key<help-tip prop="key" /></template>
        <el-input v-model="fieldItem.name" />
      </el-form-item>
      <el-form-item v-if="types.includes('datefmt')" prop="datefmt">
        <template slot="label">日期格式<help-tip prop="datefmt" /></template>
        <el-select v-model="fieldOptions.datefmt_type" style="width:100%;">
          <el-option v-for="item in datefmtTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
        <div v-if="fieldOptions.datefmt_type === 'custom'" class="ibps-pt-5">
          <el-input v-model="fieldOptions.datefmt" />
        </div>
      </el-form-item>
      <el-form-item v-if="types.includes('defaultValue')">
        <template slot="label">默认值<help-tip prop="defaultValue" /></template>
        <el-select v-model="fieldOptions.default_value_type" style="width:100%;" @change="changeDefaultValueType">
          <el-option v-for="item in defauleValueOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
        <div v-if="!fieldOptions.default_value_type|| fieldOptions.default_value_type === 'fixed'" class="ibps-pt-5">
          <el-input v-if="fieldType=== 'text'||fieldType=== 'hidden'||fieldType=== 'link'" v-model="fieldOptions.default_value" clearable />
          <el-input v-else-if="fieldType=== 'textarea'" v-model="fieldOptions.default_value" type="textarea" clearable />
          <el-input v-else-if="fieldType=== 'number'" v-model.number="fieldOptions.default_value" clearable />
          <template v-else> <slot :name="fieldOptions.default_value_type+'Value'" /></template>
        </div>
        <template v-else-if="fieldOptions.default_value_type === 'today' || fieldOptions.default_value_type === 'present'">
          <slot :name="fieldOptions.default_value_type+'Value'" />
        </template>
        <div v-else class="ibps-pt-5">
          <el-button type="primary" plain style="width:100%;" @click="handleDefaultValue">{{ fieldOptions.default_value_type| optionsFilter(defauleValueTypeOptions) }}</el-button>
        </div>
      </el-form-item>
      <el-form-item v-if="types.includes('units')" prop="units">
        <template slot="label">单位<help-tip prop="units" /></template>
        <el-input v-model="fieldOptions.units" />
      </el-form-item>

      <el-form-item v-if="types.includes('placeholder')">
        <template slot="label">提示文字<help-tip prop="placeholder" /></template>
        <el-input v-model="fieldOptions.placeholder" type="textarea" />
      </el-form-item>
      <el-form-item v-if="types.includes('desc')">
        <template slot="label">描述信息<help-tip prop="desc" /></template>
        <el-input v-model="fieldItem.desc" type="textarea" />
      </el-form-item>
      <div v-if="types.includes('isPk')" class="el-form-item">
        <el-checkbox v-model="fieldOptions.is_pk">是否主键</el-checkbox>
      </div>

      <div v-if="types.includes('splitLine')" class="el-form-item">
        <el-checkbox v-model="fieldOptions.split_line">显示分割线</el-checkbox>
      </div>
      <el-form-item v-if="types.includes('lineStyle') && fieldOptions.split_line">
        <template slot="label">分割线样式</template>
        <el-select v-model="fieldOptions.line_style">
          <el-option value="dashed" label="虚线" />
          <el-option value="solid" label="实线" />
        </el-select>
      </el-form-item>
    </div>

    <formula-edit
      :visible="formulaEditVisible"
      :name="fieldItem.label"
      :bo-data="boData"
      :data="fieldItem.field_options.default_value"
      @callback="setDefaultValue"
      @close="visible => formulaEditVisible = visible"
    />

    <dynamic-script
      :visible="dynamicScriptVisible"
      :name="fieldItem.label"
      :bo-data="boData"
      :data="fieldItem.field_options.default_value"
      @callback="setDefaultValue"
      @close="visible => dynamicScriptVisible = visible"
    />

    <linkage-data
      :visible="linkageDataVisible"
      :label="fieldItem.label"
      :bo-data="boData"
      :data="fieldItem.field_options.default_value"
      @callback="setDefaultValue"
      @close="visible => linkageDataVisible = visible"
    />
  </div>
</template>
<script>
// import _defaultsDeep from 'lodash.defaultsdeep'
import FIELD_TYPES from '../../../constants/fieldTypes'
import FormOptions from '../../../constants/formoptions'
import { defauleValueTypeOptions, datefmtTypeOptions } from '../../constants'
import IbpsBoSelect from '@/business/platform/bo/def/select'
import { getDefaultAttributes } from '../../utils'
import FormulaEdit from '../components/formula-edit'
import DynamicScript from '../components/dynamic-script'
import LinkageData from '../components/linkage-data'
import EditorMixin from '../mixins/editor'

/**
 *  字段基本属性
 */
export default {
    components: {
        IbpsBoSelect,
        FormulaEdit,
        DynamicScript,
        LinkageData
    },
    mixins: [EditorMixin],
    props: {
        boData: {
            type: Array
        },
        types: {
            type: String,
            default: 'switchFieldType,label,name,defaultValue,placeholder,desc'
        },
        defaultValueTypes: {// 默认值类型
            type: String,
            default: 'fixed,dynamic,linkage,formula'
        }
    },
    data() {
        return {
            defauleValueTypeOptions: defauleValueTypeOptions,
            datefmtTypeOptions: datefmtTypeOptions,
            fixedVisible: false,
            dynamicScriptVisible: false,
            formulaEditVisible: false,
            linkageDataVisible: false
        }
    },
    computed: {
        fieldTypes() {
            const fieldTypes = []
            let group
            for (const type in FIELD_TYPES) {
                const field = FIELD_TYPES[type]
                if ((type === 'table') ||
            (typeof (field.is_input) === 'boolean' && field.is_input === false)) {
                    continue
                }
                if (group && group !== field.group) {
                    field.divided = true
                } else {
                    field.divided = false
                }
                group = field.group
                if (this.isSub) {
                    if (FormOptions.t.SUBTABLE_FIELD_TYPE.includes(type)) {
                        if (type === 'dictionary') {
                            field.divided = true
                        }
                        fieldTypes.push(field)
                    }
                } else {
                    fieldTypes.push(field)
                }
            }

            return fieldTypes
        },
        defauleValueOptions() {
            const options = []
            defauleValueTypeOptions.forEach((type) => {
                if (this.defaultValueTypes.includes(type.value)) {
                    options.push(type)
                }
            })
            return options
        },
        label() {
            return FIELD_TYPES[this.fieldItem.field_type]['label'] || ''
        },
        icon() {
            return FIELD_TYPES[this.fieldItem.field_type]['icon'] || ''
        },
        code() {
            return this.fieldItem.code
        },
        emptyText() {
            return this.isSub && this.$utils.isEmpty(this.code) ? '请选择子表' : '无业务对象属性'
        },
        isSub() {
            return this.fieldItem.isSub
        },
        fields() {
            if (this.fieldItem.field_type === 'table') {
                return this.boData.filter((bo) => {
                    return bo.type === 'table'
                })
            } else {
                if (this.isSub) {
                    if (this.$utils.isNotEmpty(this.code)) {
                        return this.boData.filter((bo) => {
                            return bo.attrType === 'subField' && bo.tableName === this.code
                        })
                    } else {
                        return []
                    }
                } else {
                    return this.boData.filter((bo) => {
                        return bo.attrType === 'field'
                    })
                }
            }
        }
    },
    methods: {
        changeBoName(value, data) {
            if (this.$utils.isNotEmpty(value)) {
                this.fieldItem.label = data.label
            }
        },
        /**
     * 改变默认值
     */
        changeDefaultValueType(type) {
            this.fieldOptions.default_value_type = type
            if (this.fieldOptions.default_value) { this.fieldOptions.default_value = '' }
        },
        handleDefaultValue() {
            switch (this.fieldOptions.default_value_type) {
                case 'fixed':// 固定值
                    this.fixedVisible = true
                    break
                case 'dynamic': // 公式编辑
                    this.dynamicScriptVisible = true
                    break
                case 'linkage': // 联动数据
                    this.linkageDataVisible = true
                    break
                case 'formula': // 公式编辑
                    this.formulaEditVisible = true
                    break
                default:
                    break
            }
        },
        /**
     * 设置默认值
     */
        setDefaultValue(data) {
            this.fieldItem.field_options.default_value = data
        },
        /**
     * 更换控件
     */
        switchFieldType(type) {
            this.fieldItem.field_type = type
            // 有共性的字段替换 (主要是单选、多选、下拉 相互替换),不进行清空
            const field = getDefaultAttributes(this.fieldItem)
            let options = []
            if (this.fieldItem.field_options.options) {
                options = JSON.parse(JSON.stringify(this.fieldItem.field_options.options))
            }
            this.fieldItem.field_options = field.field_options
            if (this.$utils.isNotEmpty(options)) {
                this.fieldItem.field_options.options = options
            }
        }
    }
}
</script>
<style lang="scss" >
.field-type-dropdown.el-dropdown-menu {
  padding: 0;
}

 .el-time-panel {
  /deep/ .el-time-panel__footer{
    // background: red;
    border-top: 1px solid #e4e4e4;
    /* padding: 4px; */
    height: 46px;
    line-height: 0px;
    text-align: right;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
}}

</style>

