import { createNamespacedHelpers } from 'vuex';
const { mapActions, mapState, mapGetters } = createNamespacedHelpers('ibps/compositeAssets');
export default {
    methods: {
        ...mapActions(['assetFixedSubmit', 'assetCjguSubmit']),
        // 资产转固
        assectTFA(item) {
            const { target, buttonName } = item;
            if (!this.instId) {
                this.$message("没有实例Id请先保存表单");
                return false;
            } else {
                return this.assetFixedSubmit().then(res => {
                    item.res = { ...res, hasList: false, hasDataMsg: true };
                    item.tabItems = {
                        label: buttonName,
                        name: "invoice-form-assectTFA",
                        componentType: 'invoice-form-asset',
                        key: 'invoice-form-assectTFA',
                        closable: true,
                    };
                    item.openComponentType = "native"
                    target.firstVm().reloadOutlineTableData(0, true, true);
                    return item;

                });
            }
        },
        // 卡片创建并转固
        assectCTFA(item) {
            const { target, buttonName } = item;
            if (!this.instId) {
                this.$message("没有实例Id请先保存表单");
                return Promise.reject();
            } else {
                return this.assetCjguSubmit().then(res => {
                    item.res = { ...res, hasList: false, hasDataMsg: true };
                    item.tabItems = {
                        label: buttonName,
                        name: "invoice-form-assectCTFA",
                        componentType: 'invoice-form-asset',
                        key: 'invoice-form-assectCTFA',
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