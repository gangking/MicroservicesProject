import { createNamespacedHelpers } from 'vuex';
const { mapActions, mapState, mapGetters } = createNamespacedHelpers('ibps/compositeAssets');
export default {
    methods: {
        ...mapActions(['captureValueSubmit']),
        // 获取价值
        assectValue(item) {
            const { target, buttonName } = item;

            if (!this.instId) {
                this.$message("没有实例Id请先保存表单");
                return Promise.reject();
            } else {
                return this.captureValueSubmit().then(res => {

                    item.res = { ...res, hasList: false, hasDataMsg: true };
                    item.tabItems = {
                        label: buttonName,
                        name: "invoice-form-assectValue",
                        componentType: 'invoice-form-asset',
                        key: 'invoice-form-assectValue',
                        closable: true,
                    };
                    item.openComponentType = "native"
                    target.firstVm().reloadOutlineTableData(0, true, true);
                    return item;
                });
            }
        },
    },
}