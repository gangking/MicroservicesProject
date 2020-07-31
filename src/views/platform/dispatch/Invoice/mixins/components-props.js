import { createNamespacedHelpers } from 'vuex'
const { mapActions, mapState, mapGetters } = createNamespacedHelpers('ibps/compositeBase');
export default {
    props: {
        itemVal: {
            type: Object,
            default: () => { }
        }
    },
    computed: {
        ...mapState(['steps', 'instId', 'taskId', 'tableHeaderId', 'bsiCode']),
        ...mapGetters(['processDefId']),
        tagVal() {
            return this.itemVal.value || {}
        },
        stepVal() {
            //这个是应为要原生引入，才加入的
            if (this.stepContainer == this) {
                return this.payable.stepValue;
            }
            return this.stepContainer.stepVal;
        }
    },
    inject: {
        payable: {
            from: 'payable',
            default() {
                return this;
            }
        },
        stepContainer: {
            from: 'stepContainer',
            default() {
                return this;
            }
        }
    },


}