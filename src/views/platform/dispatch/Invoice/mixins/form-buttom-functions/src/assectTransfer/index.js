import { createNamespacedHelpers } from 'vuex';
const { mapActions, mapState, mapGetters } = createNamespacedHelpers('ibps/compositeAssets');
export default {
    methods: {
        ...mapActions(['assetMovSubmit']),
        // 转移接口服务
        assectTransfer(item) {
            const { target, buttonName } = item;
            if (!this.instId) {
                this.$message("没有实例Id请先保存表单");
                return Promise.reject();
            } else {
                return this.assetMovSubmit().then(res => {
                    item.res = { ...res, hasList: false, hasDataMsg: true };
                    item.tabItems = {
                        label: buttonName,
                        name: "invoice-form-assectTransfer",
                        componentType: 'invoice-form-asset',
                        key: 'invoice-form-assectTransfer',
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