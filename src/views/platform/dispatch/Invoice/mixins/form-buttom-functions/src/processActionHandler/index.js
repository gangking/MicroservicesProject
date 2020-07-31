import {
    createNamespacedHelpers
} from 'vuex'
const {
    mapActions,
    mapState,
    mapGetters
} = createNamespacedHelpers('ibps/compositeBase')
/* {
    "headId":"",     //头表id
    "opinion":"",     //审批意见
    "actionName":"",    // 同意:agree   不同意：oppose    驳回按钮：reject  驳回上一步：rejectToPrevious   驳回发起人：rejectToStart
    "taskId":"",     //任务id
    "rejectMode":"",//   reject  驳回按钮、驳回上一步、驳回发起人 都是这个值
    "backHandMode":"",  //驳回按钮、驳回上一步：direct     驳回发起人：normal
    "destination":"",   //没值
    "buttonCode":""    //流程按钮code  阿彪接口有返回
    } */
export default {
    methods: {
        ...mapActions(['getProcessInfo']),
        seveFormDataProcess(data, type) {
            console.log('this.outerSkin', this.outerSkin)
            return this.getProcessInfo(data).then(() => {
                this.ibpsPayable.$emit('process-event', type)
            }).then(() => this.outerSkin.handleClose())
        },
        pushAgreeEvent({ args: [data] }) {
            console.log('pushAgreeEvent', data)
            return this.seveFormDataProcess(data, 'pushAgreeEvent')
        },
        pushPayEvent({ args: [data] }) {
            console.log('pushPayEvent', data)
            return this.seveFormDataProcess(data, 'pushPayEvent')
        },

        pushOpposeEvent({ args: [data] }) {
            return this.seveFormDataProcess(data, 'pushOpposeEvent')
        },

        pushRejectEvent({ args: [data] }) {
            return this.seveFormDataProcess(data, 'pushRejectEvent')
        },
        pushAddAccEvent({ args: [data] }) {
            return this.seveFormDataProcess(data, 'pushAddAccEvent')
        },

        pushrejectToStartEvent({ args: [data] }) {
            return this.seveFormDataProcess(data, 'pushrejectToStartEvent')
        },
        pushdelegateEvent({ args: [data] }) {
            return this.seveFormDataProcess(data, 'pushdelegateEvent')
        }
    }
}
