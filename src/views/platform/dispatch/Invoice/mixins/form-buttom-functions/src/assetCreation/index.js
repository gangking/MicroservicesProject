import { createNamespacedHelpers } from 'vuex';
const { mapActions, mapState, mapGetters } = createNamespacedHelpers('ibps/compositeAssets');
export default {
    methods: {
        ...mapActions(['assetZcbfSubmit', 'assetCardmovSubmit', 'assetCardmovSubmit', 'assetBfCardSubmit']),
        //资产新建
        assetCreation(item) {
            const { buttonName } = item;
            item.tabItems = {
                label: buttonName,
                name: "invoice-form-preview-assetCreation",
                componentType: 'invoice-asset-creation',
                key: 'invoice-form-preview-assetCreation',
                closable: true,
            };
            //item.openComponentType = "DAILOG"
            //item.openComponentType = "native"
            return item;
        },
        // 资产报废
        assectScrap(item) {
            const { target, buttonName } = item;
            if (!this.instId) {
                this.$message("没有实例Id请先保存表单");
                return false;
            } else {
                return this.assetZcbfSubmit().then(res => {
                    item.res = { ...res, hasList: false, hasDataMsg: true };
                    item.tabItems = {
                        label: buttonName,
                        name: "invoice-form-assectScrap",
                        componentType: 'invoice-form-asset',
                        key: 'invoice-form-assectScrap',
                        closable: true,
                    };
                    item.openComponentType = "native"
                    target.firstVm().reloadOutlineTableData(0, true, true);
                    return item;
                });
            }
        },
        // 资产创建卡片并转换
        assectTransformation(item) {
            const { target, buttonName } = item;
            if (!this.instId) {
                this.$message("没有实例Id请先保存表单");
                return Promise.reject();
            } else {
                return this.assetCardmovSubmit().then(res => {
                    item.res = { ...res, hasList: false, hasDataMsg: true };
                    item.tabItems = {
                        label: buttonName,
                        name: "invoice-form-assectScrap",
                        componentType: 'invoice-form-asset',
                        key: 'invoice-form-assectScrap',
                        closable: true,
                    };
                    item.openComponentType = "native"
                    target.firstVm().reloadOutlineTableData(0, true, true);
                    return item;
                });
            }
        },
        // 资产报废并创建卡片
        assectScrapC(item) {
            const { target, buttonName } = item;
            if (!this.instId) {
                this.$message("没有实例Id请先保存表单");
                return false;
            } else {
                return this.assetBfCardSubmit().then(res => {
                    item.res = { ...res, hasList: false, hasDataMsg: true };
                    item.tabItems = {
                        label: buttonName,
                        name: "invoice-form-assectScrap",
                        componentType: 'invoice-form-asset',
                        key: 'invoice-form-assectScrap',
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