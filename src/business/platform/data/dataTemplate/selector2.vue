<template>
  <el-select
    v-model="selectorValue"
    :remote-method="remoteMethod"
    :loading="loading"
    :loading-text="loadingText"
    :placeholder="placeholder"
    filterable
    remote
    reserve-keyword
    clearable
    style="width:100%;"
    @focus="onSelect"
    @change="changeDataSource"
    @clear="onClear"
  >
    <el-option
      v-for="item in options"
      :key="item.key"
      :label="item.name"
      :value="item.key"
    />
  </el-select>
</template>
<script>
import { querySelectorData } from '@/api/platform/data/dataTemplate'
export default {
  props: {
    value: {
      type: String
    },
    type: {
      type: String,
      default: 'valueSource'
    },
    placeholder: String
  },
  data() {
    return {
      loading: false,
      loadingText: '加载中',
      selectorValue: '',
      options: []
    }
  },
  watch: {
    value: {
      handler(val, oldVal) {
        this.selectorValue = val
        // if (!valueEquals(val, oldVal)) {
        //   this.dispatch('ElFormItem', 'el.form.change', val)
        // }
      },
      immediate: true
    },
    selectorValue(val) {
      this.$emit('input', val)
    }
  },
  mounted() {
    this.remoteMethod()
  },
  methods: {
    remoteMethod(query) {
      this.loading = true
      this.loadingText = '加载中'
      querySelectorData({
        type: this.type,
        cascade: true,
        queryName: query || ''
      }).then(response => {
        this.options = response.data || []
        if (this.$utils.isEmpty(this.options)) {
          this.loadingText = '暂无数据'
        } else {
          this.loading = false
        }
      }).catch(() => {
        this.loading = false
      })
    },
    onSelect() {
      this.loading = true
      this.remoteMethod()
    },
    changeDataSource(value) {
      const option = this.options.filter(option => {
        return option.key === value
      })
      this.$emit('change', option ? option[0] : null)
    },
    onClear() {
      this.$emit('input', '')
    }
  }
}
</script>

