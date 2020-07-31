<template>
  <el-form :model="formData" style="height:400px;" label-width="120px" size="mini">
    <el-form-item label="过滤名称">
      <el-input v-model="formData.label" placeholder="过滤名称" />
    </el-form-item>
    <el-form-item label="权限">
      <rights-selector v-model="formData.rights" />
    </el-form-item>
    <ibps-query-builder
      ref="queryBuilder"
      v-model="formData.rules"
      :filters="filters"
      :conditions="conditions"
    />
  </el-form>
</template>
<script>
import RightsSelector from '@/business/platform/rights/config/selector'
import IbpsQueryBuilder from '@/components/ibps-query-builder'

export default {
  components: {
    RightsSelector,
    IbpsQueryBuilder
  },
  props: {
    data: {
      type: Object
    },
    fields: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      conditions: {
        'and': '并且',
        'or': '或者'
      },
      formData: {}
    }
  },
  computed: {
    filters() {
      const filters = []
      if (this.fields.length === 0) return []
      this.fields.forEach(field => {
        filters.push({
          id: field.key,
          label: field.name
        })
      })
      return filters
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

