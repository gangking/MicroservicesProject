import { createNamespacedHelpers } from 'vuex';
const { mapActions, mapState, mapGetters } = createNamespacedHelpers('ibps/compositeAssets');
import { verifyTisItemList } from '@/api/platform/tis/tis'
export default {
    methods: {
        ...mapActions(['paySendSubmit']),
        // 付款
        payEvent(item) {
            const { target, buttonName } = item;
            if (!this.instId) {
                this.$message("没有实例Id请先保存表单");
                return false;
            } else {
                return this.paySendSubmit().then(res => {
                    item.res = { ...res };
                    item.tabItems = {
                        label: buttonName,
                        name: "invoice-form-payEvent",
                        componentType: 'invoice-form-pay-invoice',
                        key: 'invoice-form-payEvent',
                        closable: true,
                    };
                    item.openComponentType = "native"
                    return item;
                });
            }
        },
        async paySalary(item) {
            if (!this.instId) {
                this.$message("没有实例Id请先保存表单");
                return false;
            } else {
                let result = await verifyTisItemList({ instId: this.instId })
                if (result.state === 200) {
                    this.$message({
                        message: '支付成功',
                        type: 'success'
                    });
                } else if (result.state === 500) {
                    this.$message(result.message);

                }
                return false;
            }


        }
    },
}