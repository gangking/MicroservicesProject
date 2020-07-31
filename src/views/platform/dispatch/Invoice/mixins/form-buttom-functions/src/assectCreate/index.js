import { createNamespacedHelpers } from 'vuex';
const { mapActions, mapState, mapGetters } = createNamespacedHelpers('ibps/compositeAssets');
export default {
    data() {
        return {

        }
    },
    methods: {

        ...mapActions(['assetCardAddSubmit', 'assetCardupSubmit']),
        // 卡片维护
        assectModification(item) {
            const { target, buttonName } = item;
            if (!this.instId) {
                this.$message("没有实例Id请先保存表单");
                return false;
            } else {
                return this.assetCardupSubmit().then(res => {

                    item.res = { ...res, hasList: true, hasDataMsg: false };
                    item.tabItems = {
                        label: buttonName,
                        name: "invoice-form-assectModification",
                        componentType: 'invoice-form-asset',
                        key: 'invoice-form-assectModification',
                        closable: true,
                    };
                    item.openComponentType = "native";

                    target.firstVm().reloadOutlineTableData(0, true, true);
                    return item;
                });
            }
        },
        // 卡片创建
        assectCreate(item) {
            const { target, buttonName } = item;


            if (!this.instId) {
                this.$message("没有实例Id请先保存表单");
                return false;
            } else {
                return this.assetCardAddSubmit().then(res => {
                    item.res = { ...res, hasList: true, hasDataMsg: false };
                    item.tabItems = {
                        label: buttonName,
                        name: "invoice-form-assectCreate",
                        componentType: 'invoice-form-asset',
                        key: 'invoice-form-assectCreate',
                        closable: true,
                    };
                    item.openComponentType = "native"
                    target.firstVm().reloadOutlineTableData(0, true, true);
                    return item;
                })
            }
        }
    },

}