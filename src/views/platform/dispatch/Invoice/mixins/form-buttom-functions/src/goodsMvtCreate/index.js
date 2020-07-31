import { createNamespacedHelpers } from 'vuex';
const { mapActions, mapState, mapGetters } = createNamespacedHelpers('ibps/compositeAssets');
export default {
    methods: {
        ...mapActions(['goodsmvSubmit']),
        //物料报账 货物移动 存货报废
        goodsMvtCreate(item) {
            const { target, buttonName } = item;
            if (!this.instId) {
                this.$message("没有实例Id请先保存表单");
                return false;
            } else {
                return this.goodsmvSubmit().then(res => {
                    item.res = { ...res };
                    item.tabItems = {
                        label: buttonName,
                        name: "invoice-form-goodsMvtCreate",
                        componentType: 'invoice-form-goods-invoice',
                        key: 'invoice-form-goodsMvtCreate',
                        closable: true,
                    };
                    item.openComponentType = "native"
                    return item;
                });
            }
        },
    },
}