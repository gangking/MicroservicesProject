<template>
  <el-tabs v-model="activeTabName" @tab-click="handleClick">
    <el-tab-pane label="基本信息" name="basic-info">
      <basic-info
        :id="id"
        ref="basic"
        :form-data="boDef"
        :parent-data="parentData"
        :readonly="readonly"
        :is-master="isMaster"
        @change="handleBoDef"
      />
    </el-tab-pane>
    <el-tab-pane label="对象属性" name="bo-attr">
      <object-attr
        ref="attr"
        :readonly="readonly"
        :form-data="boDef"
        :attrs="boDef.attrs"
        :action="action"
        :toolbars="isToolbars"
        :height="height"
        @change="handleAttrs"
      />
    </el-tab-pane>
    <el-tab-pane label="其他属性" name="other-attr">
      <other-attr
        :id="id"
        ref="other"
        :options="boDef.options"
        :form-data="boDef"
        :parent-data="parentData"
        :readonly="readonly"
        @change="handleOtherAttr"
      />
    </el-tab-pane>
  </el-tabs>
</template>
<script>
import BasicInfo from './basic-info'
import ObjectAttr from './object-attr'
import OtherAttr from './other-attr'

export default {
  components: {
    BasicInfo,
    ObjectAttr,
    OtherAttr
  },
  props: {
    readonly: {
      type: Boolean,
      default: false
    },
    formData: {
      type: Object,
      default: () => {}
    },
    id: String,
    action: String,
    parentData: Object,
    toolbars: Boolean,
    isMaster: {
      type: Boolean,
      default: true
    },
    height: [String, Number]
  },
  data() {
    return {
      activeTabName: 'basic-info',
      boDef: this.formData
    }
  },
  computed: {
    isToolbars() {
      return this.toolbars
    }
  },
  watch: {
    boDef: {
      handler: function(val, oldVal) {
        this.$emit('change', val)
      },
      deep: true
    },
    formData: {
      handler: function(val, oldVal) {
        this.boDef = val
        console.log(val)
      },
      deep: true
    }
  },
  methods: {
    initActive(value) {
      this.activeTabName = value
    },
    handleBoDef(data) {
      this.boDef = data
    },
    handleAttrs(attrs) {
      this.boDef.attrs = attrs
      this.$refs['other'].struTypeChange(attrs)
      this.$refs['basic'].pkChange(attrs)
    },
    handleOtherAttr(options) {
      this.boDef.options = options
    },
    handleClick(tab, event) {
      this.$refs['basic'].formValidate()
    },
    formValidate() {
      this.$refs.basic.formValidate()
    }
  }
}
</script>
