import { createNamespacedHelpers } from 'vuex';
const { mapActions } = createNamespacedHelpers('ibps/compositeMultiline');
export default {
    methods: {
        ...mapActions(['multilineSaveFormData']),
        multiFormSave(item) {
            
            const { args: [value, data], target } = item;
            console.log("stepVal", target)
            return this.multilineSaveFormData({ val: value, data, stepVal: target.stepVal }).then((res) => {
                if (res) {
                    this.$message({
                        message: "保存成功",
                        type: "success"
                    });
                    //刷新
                    target.multiline.reloadOutlineTableData(0, false, true)
                } else {
                    this.$message({
                        type: "error",
                        message: "保存失败"
                    });
                }
                return res;
            })

        },
        createMultiFormSave(item) {
            const { args: [value, data], target } = item;
            return this.multilineSaveFormData({ val: value, data, stepVal: target.stepVal }).then(res => {
                return res;
            })
        },
    }
}