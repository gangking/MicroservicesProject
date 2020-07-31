import { createNamespacedHelpers } from 'vuex';
const { mapActions, mapState, mapGetters } = createNamespacedHelpers('ibps/compositeAssets');
export default {
    methods: {
        ...mapActions(['matstockSubmit']),
        // 库存检查
        matStockQuery(item) {
            const { target } = item;
            if (!this.instId) {
                this.$message("没有实例Id请先保存表单");
                return Promise.reject();
            } else {
                return this.matstockSubmit()
                    .then(res => {
                        const { state, message, cause } = res

                        this.$message(state == '200' ? message : cause);

                        target.firstVm().reloadOutlineTableData(0, true, true);
                    })

            }
        },
    },
}