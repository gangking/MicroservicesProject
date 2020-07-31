export default {
    methods: {
        //信用 同意
        CRagreeEvent(item) {
            const { buttonName } = item;
            item.tabItems = {
                label: buttonName,
                name: "invoice-credit-agree",
                componentType: 'invoice-credit-agree',
                key: 'invoice-credit-agree',
            };
            // console.log("看一下", this.instId, this.taskId)
            item.openComponentType = "native"
            item.creditData = {
                "appId": this.appId,	//表单的业务情形 
                "instId": this.instId,
                "taskId": this.taskId,
                "status": "approverProcess",//固定
                "bsiCode": this.bsiCode,
                "buttonCode": item.buttonCode, //按钮
                "headId": this.table_head_id,// 表单头id
                "actionName": "agree"
            }
            return item;
        },
        //信用 驳回
        CRrejectEvent(item) {
            const { buttonName } = item;
            item.tabItems = {
                label: buttonName,
                name: "invoice-credit-rejec",
                componentType: 'invoice-credit-rejec',
                key: 'invoice-credit-rejec',
            };
            item.openComponentType = "native"
            item.creditData = {
                "appId": this.appId,	//表单的业务情形 
                "instId": this.instId,
                "taskId": this.taskId,
                "status": "approverProcess",//固定
                "bsiCode": this.bsiCode,
                "buttonCode": item.buttonCode, //按钮
                "headId": this.table_head_id,// 表单头id
                "actionName": "rejectToStart"
            }
            return item
        },
    },
}