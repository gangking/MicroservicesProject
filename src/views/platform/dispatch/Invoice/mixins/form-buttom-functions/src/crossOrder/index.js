import { createNamespacedHelpers } from 'vuex';
const { mapActions, mapState, mapGetters } = createNamespacedHelpers('ibps/compositeOrder');


export default {
    methods: {
        ...mapActions(['crossOrderSubmit']),
        // 跨期订单
        crossOrder(item) {
            const { target } = item;
            if (!this.instId) {
                this.$message("没有实例Id请先保存表单");
                return Promise.reject();
            } else {
                return this.crossOrderSubmit()
                    .then(res => {
                        const { state, message, cause } = res

                        this.$message(state == '200' ? message : cause);

                        target.firstVm().reloadOutlineTableData(0, true, true);
                    })

            }
        },
    },
}