import Utils from '@/utils/util'

export default {
  methods: {
    handleMenuSelect(index, indexPath, item) {
      // 清除缓存
      localStorage.removeItem('codeEdit');
      if (item && item.$attrs.type && item.$attrs.type === 'header') {
        // 设置左侧的菜单
        return this.$store.dispatch('ibps/menu/activeHeaderSet', index)
      }
      if (/^ibps-menu-empty-\d+$/.test(index) || index === undefined) {
        this.$message.closeAll()
        this.$message.warning('临时菜单')
      } else if (/^https:\/\/|http:\/\//.test(index)) {
        Utils.open(index)
      } else if (Utils.IS_PAYABLE_FORM.test(index)) {
        this.ibpsPayable.setPayableParams(
          Utils.queryToJson(index)
        )
      } else {
        console.log('跳转url 。。。。。。。', index)
        this.$router.push({
          path: index
        })
      }
    }
  }
}
