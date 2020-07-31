export default {
    methods: {
        // 同意
        agreeEvent(item) {
            const { buttonName } = item;
            item.tabItems = {
                label: buttonName,
                name: "open-multil-process-dynamic-agreeEvent",
                componentType: 'invoice-process-dynamic',
                key: 'open-multil-process-dynamic--agreeEvent',
            };
            item.openComponentType = 'native'
            return {
                ...item, ...{
                    actionName: "agree",
                    dialogType: "agree",
                    instId: this.instId,
                    outerSkin: this.outerSkin,
                }
            };

        },
        // 反对
        opposeEvent(item) {
            const { buttonName } = item;
            item.tabItems = {
                label: buttonName,
                name: "open-multil-process-dynamic-opposeEvent",
                componentType: 'invoice-process-dynamic',
                key: 'open-multil-process-dynamic--opposeEvent',
            };
            item.openComponentType = 'native'
            return {
                ...item, ...{
                    actionName: "oppose",
                    dialogType: "agree",
                    taskId: this.taskId,
                    instId: this.instId,
                    outerSkin: this.outerSkin,
                }
            };
        },
        // 驳回
        rejectEvent(item) {
            const { buttonName } = item;
            item.tabItems = {
                label: buttonName,
                name: "open-multil-process-dynamic-rejectEvent",
                componentType: 'invoice-process-dynamic',
                key: 'open-multil-process-dynamic--rejectEvent',

            };
            item.openComponentType = 'native'
            return {
                ...item, ...{

                    actionName: "reject",
                    dialogType: "reject",
                    taskId: this.taskId,
                    instId: this.instId,
                    outerSkin: this.outerSkin,
                }
            };
        },
        // 初审退回
        returnOfPreExam(item) {
            const { buttonName } = item;

            item.tabItems = {
                label: buttonName,
                name: "open-multil-process-dynamic-returnOfPreExam",
                componentType: 'invoice-process-dynamic',
                key: 'open-multil-process-dynamic--returnOfPreExam',


            };
            item.openComponentType = 'native'
            return {
                ...item, ...{
                    actionName: "rejectToStart",
                    actionName2: "returnOfPreExam",
                    dialogType: "reject",
                    taskId: this.taskId,
                    instId: this.instId,
                    outerSkin: this.outerSkin,
                }
            };
        },
        // 单据反冲
        documentBackflush(item) {
            const { buttonName } = item;
            item.tabItems = {
                label: buttonName,
                name: "open-multil-process-dynamic-documentBackflush",
                componentType: 'invoice-process-dynamic',
                key: 'open-multil-process-dynamic--documentBackflush',

            };
            item.openComponentType = 'native'
            return {
                ...item, ...{
                    actionName: "rejectToStart",
                    actionName2: "documentBackflush",
                    dialogType: "reject",
                    taskId: this.taskId,

                    instId: this.instId,
                    outerSkin: this.outerSkin,
                }
            };
        },
        // 驳回发起人
        rejectToStartEvent(item) {
            const { buttonName } = item;
            item.tabItems = {
                label: buttonName,
                name: "open-multil-process-dynamic-rejectToStartEvent",
                componentType: 'invoice-process-dynamic',
                key: 'open-multil-process-dynamic--rejectToStartEvent',
            };
            item.openComponentType = 'native'
            return {
                ...item, ...{
                    actionName: "rejectToStart",
                    actionName2: "rejectToStart",
                    dialogType: "reject",
                    taskId: this.taskId,
                    instId: this.instId,
                    outerSkin: this.outerSkin,
                }
            };
        },
        // 加签功能
        addTags(item) {
            const { buttonName } = item;

            item.tabItems = {
                label: buttonName,
                name: "open-multil-process-dynamic-addTags",
                componentType: 'invoice-process-dynamic',
                key: 'open-multil-process-dynamic--addTags',
            };

            item.openComponentType = 'native'
            return {
                ...item, ...{
                    actionName: "addtags",
                    dialogType: "addtags",
                    taskId: this.taskId,
                    instId: this.instId,
                    outerSkin: this.outerSkin,
                }
            };
        },
        // 转办

        turnCheck(item) {
            const { buttonName } = item;
            item.tabItems = {
                label: buttonName,
                name: "open-multil-process-dynamic-turnCheck",
                componentType: 'invoice-process-dynamic',
                key: 'open-multil-process-dynamic--turnCheck',
            };
            item.openComponentType = 'native'
            return {
                ...item, ...{
                    actionName: "delegate",
                    dialogType: "delegate",
                    taskId: this.taskId,
                    instId: this.instId,
                    outerSkin: this.outerSkin,
                }
            };
        },

    },


}