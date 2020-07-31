import { createNamespacedHelpers } from "vuex";
import util from '@/utils/util';
const { mapActions, mapState } = createNamespacedHelpers("ibps/compositeBase");
export default {
    data() {
        return {
            isHshowForm: true
        }
    },
    computed: {
        ...mapState(['bsiCode'])
    },
    methods: {
        ...mapActions(['getFormStrategy']),
        onBusinessValue(btgCode) {
            if (util.isNotEmpty(btgCode) && this.bsiCode != btgCode) {
                this.isHshowForm = false;

                this.getFormStrategy({ btgCode }).then(() => {
                    this.isHshowForm = true;
                })
            }


        },

        onFormDataChange({ field, nval, method }) {
            console.log("响应数据:", field, nval, method)
            this[method] && this[method](nval);
            return false;
        },
    },
}