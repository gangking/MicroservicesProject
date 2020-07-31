
import { createNamespacedHelpers } from 'vuex';
const { mapActions, mapState, mapGetters } = createNamespacedHelpers('ibps/compositeAssets');
export default {
    methods: {
        ...mapActions(['createFpSubmit']),
        // 发票创建 两分钟之内不允许再次点击
        invoiceCreate(item) {
            const { target, buttonName } = item;
            if (!this.instId) {
                this.$message("没有实例Id请先保存表单");
                return false;
            } else {
                return this.createFpSubmit().then(res => {
                    item.res = { ...res };
                    item.tabItems = {
                        label: buttonName,
                        name: "invoice-form-invoiceCreate",
                        componentType: 'invoice-form-invoice',
                        key: 'invoice-form-invoiceCreate',
                        closable: true,
                    };
                    item.openComponentType = "native"
                    return item;
                });
            }
        },
    },
}