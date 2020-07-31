<template>
  <div class="rules-group-container">
    <div class="rules-group-header">
      <!--规则组条件-->
      <div class="btn-group group-conditions">
        <el-radio-group v-model="rules.condition" size="mini">
          <el-radio-button v-for=" condition in conditions" :key="condition.value" :disabled="!hasMultipleRule" :label="condition.value">{{ condition.label }}</el-radio-button>
        </el-radio-group>
        <!--排序-->
        <div v-if="hasSort" class="drag-handle">
          <i class="el-icon-sort" />
        </div>
      </div>
      <!--规则操作-->
      <div class="btn-group pull-right group-actions">
        <el-button-group>
          <el-button size="mini" type="primary" icon="el-icon-plus" @click="addRule">{{ labels.addRulue }}</el-button>
          <el-button v-if="hasGroup" size="mini" type="success" icon="el-icon-circle-plus-outline" @click="addGroup">{{ labels.addGroup }}</el-button>
          <el-button v-if="depth > 1" size="mini" type="danger" icon="el-icon-close" @click="remove">{{ labels.removeGroup }}</el-button>
        </el-button-group>
      </div>
    </div>
    <!--规则-->
    <div class="rules-group-body">
      <div class="rules-list">
        <component
          :is="child && child.condition?'query-builder-group':'query-builder-rule'"
          v-for="(child, i) in rules[childrenKey]"
          :key="i"
          :rules.sync="child"
          :filters="filters"
          :index="index"
          :max-depth="maxDepth"
          :depth="depth + 1"
          :labels="labels"
          :conditions="conditions"
          :sort="sort"
          @child-deletion-requested="removeChild"
          @update-rules="updateRules"
        />
      </div>
    </div>
  </div>
</template>

<script>
import QueryBuilderRule from './query-builder-rule.vue'
import Utils from '../utils'

export default {
  name: 'query-builder-group',
  components: {
    QueryBuilderRule
  },
  props: {
    type: String,
    rules: Object,
    filters: Array,
    index: [String, Number],
    maxDepth: Number,
    depth: Number,
    labels: Object,
    conditions: Array,
    sort: Boolean,
    childrenKey: {// 儿子key
      type: String,
      default: 'rules'
    },
    conditionKey: {
      type: String,
      default: 'condition'
    }
  },
  data() {
    return {}
  },
  computed: {
    hasMultipleRule() {
      return this.rules[this.childrenKey] && this.rules[this.childrenKey].length > 1
    },
    hasGroup() {
      return !this.maxDepth || (this.maxDepth && this.depth < this.maxDepth)
    },
    hasSort() {
      return this.depth > 1 && this.sort
    }
  },
  methods: {
    // 默认规则
    getDefaultRule() {
      return {
        id: this.filters[0].id,
        operator: this.filters[0].operators[0],
        value: null
      }
    },
    // 添加规则
    addRule() {
      const updatedRules = Utils.deepClone(this.rules)
      const child = this.getDefaultRule()
      updatedRules[this.childrenKey].push(child)
      this.$emit('update-rules', updatedRules, this.index)
    },
    // 添加组
    addGroup() {
      if (!this.hasGroup) { return }
      const updatedRules = Utils.deepClone(this.rules)
      updatedRules[this.childrenKey].push({
        [this.conditionKey]: this.conditions[0].value,
        [this.childrenKey]: [this.getDefaultRule()]
      })
      this.$emit('update-rules', updatedRules, this.index)
    },
    remove() {
      this.$emit('child-deletion-requested', this.index)
    },
    removeChild(index) {
      const updatedRules = Utils.deepClone(this.rules)
      updatedRules[this.childrenKey].splice(index, 1)
      this.$emit('update-rules', updatedRules, this.index)
    },
    updateRules(rules, index) {
      const updatedRules = Utils.deepClone(this.rules)
      if (!updatedRules[this.childrenKey]) updatedRules[this.childrenKey] = []
      updatedRules[this.childrenKey].splice(index, 1, rules)
      this.$emit('update-rules', updatedRules, this.index)
    }
  }
}
</script>
