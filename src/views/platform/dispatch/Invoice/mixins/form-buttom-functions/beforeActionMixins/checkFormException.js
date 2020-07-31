export default {
    methods: {
        beforeActionsCheck(item) {
            let { bindFunction } = item;
            const checkEventList = ['addTags', 'CRagreeEvent', 'CRrejectEvent', 'returnOfPreExam', 'rejectToStartEvent', 'pushCompoundForm'];
            if (checkEventList.findIndex((item) => bindFunction == item) == -1) {
                return Promise.resolve(item)
            }
            return this.getFormException()
                .then(() => {
                    //console.log("例外判断方法", this.isHasFormExceptions);
                    if (this.isHasFormExceptions) {
                        this.$message.error("您仍有未处理的例外消息，请前往例外区处理。");
                        return Promise.reject(item);
                    }
                    return Promise.resolve(item);
                })
        }
    },
} 