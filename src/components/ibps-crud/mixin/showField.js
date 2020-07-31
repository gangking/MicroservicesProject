/**
 * 显示字段
 */
export default {
  props: {
    showField: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      showFieldIndeterminate: false,
      showFieldCheckAll: true,
      checkedShowFields: [],
      showFields: []
    }
  },
  watch: {
    columns: {
      handler(val, oldVal) {
        console.log('列变化',val)
        const checkedShowFields = []
        this.columns.filter((column) => {
          if (!column.hidden) { checkedShowFields.push(column.prop) }
        })
        this.showFieldCheckAll = this.columns.length === checkedShowFields.length
        this.checkedShowFields = checkedShowFields
        this.showFields = checkedShowFields
        // 列变化后刷新一下数据，防止未调接口情况
        // setTimeout(() => {
        //   location.reload()
        // }, 1000);
      },
      immediate: true
    }
  },

  methods: {
    handleShowFieldCheckAllChange(value) {
      this.checkedShowFields = value ? this.columns.map((column) => column.prop) : []
      this.showFieldIndeterminate = false
    },
    handleCheckedShowFieldChange(value) {
      const checkedCount = value.length
      const columnsCount = this.columns.length
      this.showFieldCheckAll = checkedCount === columnsCount
      this.showFieldIndeterminate = checkedCount > 0 && checkedCount < columnsCount
    },
    showFieldVisibleChange(v) {
      this.showFields = JSON.parse(JSON.stringify(this.checkedShowFields))
    }
  }
}
