<template>
  <div>
    <template v-if="!readonly">
      <ibps-tree-select
        v-model="selectData"
        :data="treeData"
        :props="props"
        :node-key="pkKey"
        :multiple="multiple"
        :placeholder="placeholder"
        :empty-text="emptyText"
        v-bind="$attrs"
      />
    </template>
    <template v-else>
      <el-tag v-if="$utils.isNotEmpty(selectData)">
        {{ selectData|optionsFilter(treeDataOptions,'label') }}
      </el-tag>
    </template>
  </div>
</template>
<script>
import { getByKey } from '@/api/platform/data/dataTemplate'
// import TreeUtils from '@/utils/tree'

import IbpsTreeSelect from '@/components/ibps-tree-select'

export default {
  components: {
    IbpsTreeSelect
  },
  props: {
    value: {
      type: [String, Number, Array, Object],
      default: ''
    },
    typeKey: {// 数据字典类型key
      type: String
    },
    data: {
      type: Array
    },
    multiple: { // 是否多选
      type: Boolean,
      default: false
    },
    readonly: { // 是否只读
      type: Boolean,
      default: false
    },
    placeholder: {// 输入框占位文本
      type: String,
      default: '请选择'
    },
    emptyText: {
      type: String,
      default: '暂无数据'
    },
    store: {// 存储类型 对应[多选]有效，array 数组。string 字符串类型
      type: String,
      default: 'string',
      validator: function(value) {
        return ['array', 'string'].indexOf(value) !== -1
      }
    },
    storeSeparator: {// 存储值分割符，对于设置字符串类型的分隔符
      type: String,
      default: ','
    },
    templateKey: {
      type: String,
      require: true
    }
  },
  data: function() {
    return {
      loading: false,
      props: {
        children: 'children',
        label: 'name'
      },
      pkKey: 'key',
      selectData: null,
      treeData: [],
      treeDataOptions: []
    }
  },
  watch: {
    typeKey: {
      handler(val, oldVal) {
        if (val && !this.data) {
          this.loadTreeData()
        } else {
          this.treeData = this.data || []
        }
      },
      immediate: true
    },
    selectData(val, oldVal) {
      this.$emit('input', this.getStoreValue(val))
    },
    value: {
      handler(val, oldVal) {
        this.handleData()
      },
      immediate: true
    }

  },
  created() {
    this.loadData()
  },
  methods: {
    loadData() {
      getByKey({
        dataTemplateKey: this.templateKey
      }).then(response => {
        this.dataTemplate = this.$utils.parseData(response.data)
        this.initDataTemplate()
      }).catch(() => {
      })
    },
    initDataTemplate() {
      this.valueKey = this.dataTemplate.unique
      const template = this.dataTemplate.templates[0]
      // TODO:
      this.labelKey = template.result_columns ? template.result_columns[0].name : ''
    },
    loadTreeData() {
      // 列表类型
      this.loading = true
      // queryDataTable().then(response => {
      //   this.loading = false

      //   // ActionUtils.handleListData(this, response.data)
      // }).catch(() => {
      //   this.loading = false
      // })
      // TODO:
    },
    handleData() {
      if (this.multiple) {
        this.selectData = this.getArrayValue()
      } else {
        this.selectData = this.value
      }
    },
    getArrayValue() {
      if (this.store === 'string') {
        return this.$utils.isNotEmpty(this.value) ? this.value.split(this.storeSeparator) : []
      } else {
        return this.value || []
      }
    },
    getStoreValue(val) {
      if (this.multiple) {
        if (this.store === 'string') {
          return this.$utils.isNotEmpty(val) ? val.join(this.storeSeparator) : ''
        } else {
          return val || []
        }
      } else {
        return val
      }
    }
  }
}
</script>

