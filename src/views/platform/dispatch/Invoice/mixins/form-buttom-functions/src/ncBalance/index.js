import { createNamespacedHelpers } from 'vuex';
const { mapActions, mapState } = createNamespacedHelpers('ibps/compositeSingle');
export default {
    computed: {
        ...mapState(['current_final_form_data'])
    },
    methods: {
        //nc 余额
        NcBalanceInquiry(item) {
            const { buttonName } = item;
            item.tabItems = {
                label: buttonName,
                name: "invoice-nc-balance",
                componentType: 'invoice-nc-balance',
                key: 'invoice-nc-balance'
            };
            item.openComponentType = "native";
            item.headId = this.table_head_id;
            item.tableName = this.current_final_form_data.tableName;
            return item;
        },
    }
}