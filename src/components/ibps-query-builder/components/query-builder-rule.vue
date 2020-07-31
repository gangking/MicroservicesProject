<template>
  <div
    :class="{
      'has-error':hasError
    }"
    class="rule-container"
  >
    <div class="rule-header">
      <!--错误提示-->
      <div v-if="hasError" class="error-container">
        <el-tooltip :content="hasError?errors[0].message:''">
          <i class="el-icon-warning" />
        </el-tooltip>
      </div>
      <!--排序-->
      <div v-if="hasSort" class="drag-handle">
        <i class="el-icon-sort" />
      </div>
      <!--规则过滤字段-->
      <div class="rule-filter-container">
        <el-select v-model="selectedFilter" size="small" @change="changeFilter">
          <el-option
            v-for="item in filters"
            :key="item.id"
            :label="item.label"
            :value="item.id"
          />
        </el-select>
      </div>
      <!--规则操作符-->
      <div class="rule-operator-container">
        <el-select v-model="rules.operator" size="small">
          <el-option v-for="operator in selectedFilterObj.operators" :key="operator" :value="operator" :label="$t('components.queryBuilder.operators.'+operator)" />
        </el-select>
      </div>
      <!--规则值-->
      <div v-if="hasRuleValue" class="rule-value-container">
        <el-input v-if="selectedFilterObj.input === 'text'" v-model="rules.value" v-bind="selectedFilterObj.attrs" type="text" size="small" clearable />
        <el-input-number v-else-if="selectedFilterObj.input === 'number'" v-model="rules.value" v-bind="selectedFilterObj.attrs" size="small" />
        <el-date-picker v-else-if="selectedFilterObj.input === 'date' || selectedFilterObj.input === 'datetime'" v-model="rules.value" :editable="false" :type="selectedFilterObj.input+(nbInputs > 1 ? 'range' : '')" v-bind="selectedFilterObj.attrs" value-format="timestamp" />
        <el-radio-group v-else-if="selectedFilterObj.input === 'radio'" v-model="rules.value">
          <el-radio v-for="option in iterateOptions" :key="option.value" :label="option.value">{{ option.label }}</el-radio>
        </el-radio-group>
        <el-checkbox-group v-else-if="selectedFilterObj.input === 'checkbox'" v-model="rules.value" v-bind="selectedFilterObj.attrs">
          <el-checkbox v-for="option in iterateOptions" :key="option" :label="option" :value="option" v-bind="selectedFilterObj.attrs" />
        </el-checkbox-group>
        <el-select v-else-if="selectedFilterObj.input === 'select'" v-model="rules.value" v-bind="selectedFilterObj.attrs">
          <el-option v-for="option in iterateOptions" :key="option.value" :value="option.value" :label="option.label" v-bind="selectedFilterObj.attrs" />
        </el-select>
        <template v-else>
          <component :is="selectedFilterObj.component" v-model="rules.value" v-bind="selectedFilterObj.attrs" />
        </template>
      </div>

      <div class="btn-group pull-right rule-actions">
        <el-button size="small" type="danger" icon="el-icon-delete" @click="remove">{{ labels.removeRule }}</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import Utils from '../utils'
import QueryBuilder from '../constants'

export default {
  name: 'query-builder-rule',
  props: {
    rules: Object,
    index: [String, Number],
    filters: Array,
    depth: Number,
    labels: Object,
    conditions: Array,
    sort: Boolean
  },
  data() {
    return {
      selectedFilterObj: this.filters[0],
      selectedFilter: this.rules.id || this.filters[0].id,
      errors: []
    }
  },
  computed: {
    hasRuleValue() {
      return QueryBuilder.OPERATORS[this.rules.operator].nb_inputs > 0
    },
    nbInputs() {
      return QueryBuilder.OPERATORS[this.rules.operator].nb_inputs
    },
    iterateOptions() {
      if (typeof this.selectedFilterObj.values === 'undefined') {
        return []
      }
      const cleanValues = []
      Utils.iterateOptions(this.selectedFilterObj.values, function(value, label, optgroup) {
        cleanValues.push({
          value: value,
          label: label,
          optgroup: optgroup || null
        })
      })
      return cleanValues
    },
    hasError() {
      return this.errors.length > 0
    },
    hasSort() {
      return this.sort
    }
  },
  mounted() {
    // Set a default value for these types if one isn't provided already
    this.initValue()
    var selectedFilterCopy = this.selectedFilter
    var splitIndex = selectedFilterCopy.indexOf('-')
    if (splitIndex > -1) {
      this.selectedFilter = selectedFilterCopy.substring(0, splitIndex)
    } else {
      this.filters.forEach((rule) => {
        if (rule.id === this.selectedFilter) {
          this.selectedFilterObj = rule
          return false
        }
      })
    }
  },
  methods: {
    // 删除规则
    remove: function() {
      this.$emit('child-deletion-requested', this.index)
    },
    // 改变规则的条件
    changeFilter: function() {
      this.rules.value = null
      this.filters.forEach((filter) => {
        if (filter.id === this.selectedFilter) {
          this.selectedFilterObj = filter
          this.rules.id = this.selectedFilter
          this.initValue()
        }
      })
      this.rules.operator = this.selectedFilterObj.operators[0]
    },
    /**
     * 初始化值
     */
    initValue() {
      this.rules.type = this.selectedFilterObj.type
      if (this.rules.value === null) {
        const updatedRules = Utils.deepClone(this.rules)
        updatedRules.value = null
        if (this.selectedFilterObj.input === 'checkbox') {
          updatedRules.value = []
        } else if (
          this.selectedFilterObj.input === 'select' ||
          this.selectedFilterObj.input === 'radio'
        ) {
          updatedRules.value = this.selectedFilterObj.values[0].value
        } else if (
          this.selectedFilterObj.input === 'time' ||
          this.selectedFilterObj.input === 'date' ||
          this.selectedFilterObj.input === 'datetime'
        ) {
          updatedRules.value = this.nbInputs > 1 ? [] : null
        }
        this.$emit('update-rules', Utils.deepClone(updatedRules), this.index)
      }
    },
    updateRules(value) {
      const updatedRules = Utils.deepClone(this.rules)
      updatedRules.value = value
      this.$emit('update-rules', updatedRules, this.index)
    }
  }
}
</script>

<style lang="scss" scoped>
body /deep/ .el-message .el-icon-warning i{
  font-size: 3px !important;
}
</style>