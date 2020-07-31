import { complete, doEndProcess, lock, unlock, suspendProcess, recoverProcess } from '@/api/platform/bpmn/bpmTask'
import { startFlow, saveDraft } from '@/api/platform/bpmn/bpmInst'

export default {
    methods: {
        emitEventHandler(actionKey) {
            this.actionName = actionKey
            switch (actionKey) {
                case 'close': // 关闭窗口
                    this.closeDialog()
                    break
                case 'flowImage':
                    this.flowDiagramVisible = true
                    break
                case 'approvalHistory':
                    this.approvalHistoryVisible = true
                    break
                case 'instanceDetail':
                    this.instanceDetailVisible = true
                    break
                case 'startFlow':
                    this.handleStartFlow()
                    break
                case 'saveDraft':
                    this.handleSaveDraft()
                    break
                case 'agree':
                case 'oppose':
                case 'abandon':
                    this.agreeDialogVisible = true
                    break
                case 'rejectToPrevious':
                case 'rejectToStart':
                case 'reject':
                    this.rejectDialogVisible = true
                    break
                case 'delegate':
                    this.delegateDialogVisible = true
                    break
                case 'addSign':
                    this.addSignTaskDialogVisible = true
                    break
                case 'endProcess':
                    this.approveDialogVisible = true
                    break
                case 'print':
                    this.handlePrint()
                    break
                case 'lock':
                    this.handleLock()
                    break
                case 'unlock':
                    this.handleUnlock()
                    break
                case 'forceUnlock':
                    this.handleForceUnlock()
                    break
                case 'suspendProcess':
                    this.handleSuspendProcess()
                    break
                case 'recoverProcess':
                    this.handleRecoverProcess()
                    break
                default:
                    break
            }
        },
        handleStartFlow() {
            const firstNodeUserAssign = this.attributes.firstNodeUserAssign || false
            if (firstNodeUserAssign) {
                this.submitFormData = this.getFormData()
                this.startFlowDialogVisible = true
            } else {
                this.saveStartFlow()
            }
        },
        /**
     * 保存启动流程
     * @param {*}
     */
        saveStartFlow(params = {}) {
            const formData = this.getFormData()
            const jsonData = {
                defId: this.defId,
                nodeUsers: params.nodeUsers || '', // 需要传入
                destination: params.destination || '',
                version: this.version || '0',
                proInstId: this.proInstId || '',
                data: JSON.stringify(formData)
            }

            const loading = this.$loading({
                lock: true,
                text: this.$t('common.saving')
            })
            // 1、直接启动
            startFlow(jsonData).then(response => {
                loading.close()
                this.$alert(`启动成功！`, {
                    showClose: false
                }).then(() => {
                    // 后置事件
                    this.afterScript(this.actionName)
                    this.startFlowDialogVisible = false
                    this.callback()
                }).catch(() => {})
            }).catch(() => {
                loading.close()
            })
        },
        /**
     * 保存草稿
     */
        handleSaveDraft() {
            // 表单数据
            const formData = this.getFormData()
            const jsonData = {
                defId: this.defId,
                version: this.version || '',
                proInstId: this.proInstId || '',
                data: JSON.stringify(formData)
            }
            const loading = this.$loading({
                lock: true,
                text: this.$t('common.saving')
            })
            saveDraft(jsonData).then(response => {
                loading.close()
                this.$alert(`保存成功！`, {
                    showClose: false
                }).then(() => {
                    // 后置事件
                    this.afterScript(this.actionName)
                    this.callback()
                }).catch(() => {
                })
            }).catch(() => {
                loading.close()
            })
        },

        handleActionEvent(actionName, params) {
            if (actionName === 'agree' ||
       actionName === 'oppose' ||
       actionName === 'abandon' ||
       actionName === 'rejectToPrevious' ||
       actionName === 'rejectToStart' ||
       actionName === 'reject'
            ) {
                this.handleComplete(actionName, params)
            } else if (actionName === 'endProcess') {
                this.handleEndProgress(params)
            }
        },

        handleComplete(actionName, params = {}) {
            const loading = this.$loading({
                lock: true,
                text: this.$t('common.loading')
            })
            const formData = this.getFormData()
            params.actionName = actionName
            params.taskId = this.taskId
            params.data = JSON.stringify(formData)
            complete(params).then(response => {
                loading.close()
                this.$alert(response.message, {
                    showClose: false
                }).then(() => {
                    this.afterScript(actionName)
                    // 关闭窗口
                    if (actionName === 'agree' || actionName === 'oppose' || actionName === 'abandon') {
                        this.agreeDialogVisible = false
                    } else if (actionName === 'rejectToPrevious' || actionName === 'rejectToStart' || actionName === 'reject') {
                        this.rejectDialogVisible = false
                    }
                    // 回调上一个页面
                    this.callback()
                }).catch(() => {})
            }).catch(() => {
                loading.close()
            })
        },
        /**
     * 处理终止任务
     * @param {*} params
     */
        handleEndProgress(params) {
            doEndProcess({
                taskId: this.taskId,
                endReason: params.opinion
            }).then(response => {
                this.$alert(response.message, {
                    showClose: false
                }).then(() => {
                    this.approveDialogVisible = false
                    // 回调上一个页面
                    this.callback()
                })
            }).catch((err) => {
                console.info(err)
            })
        },
        /**
     * 打印
     */
        handlePrint() {
            // var printTemplateId = null
            // if($.isEmpty(printTemplateId)){
            // window.open(this.$refs.formrender.$el.innerHTML)
            window.print()
        },
        /**
     * 锁定任务
     */
        handleLock() {
            lock({ taskId: this.taskId }).then(response => {
                this.$alert(`锁定任务成功！`, {
                    showClose: false
                }).then(() => {
                    this.afterScript(this.actionName)
                    this.callback()
                }).catch(() => {})
            })
        },

        /**
     * 解锁任务
     */
        handleUnlock() {
            unlock({ taskId: this.taskId }).then(response => {
                this.$alert(`解锁任务成功！`, {
                    showClose: false
                }).then(() => {
                    this.afterScript(this.actionName)
                    this.callback()
                }).catch(() => {})
            })
        },

        /**
     * 解锁任务
     */
        handleForceUnlock() {
            unlock({ taskId: this.taskId }).then(response => {
                this.$alert(`强制解锁任务成功！`, {
                    showClose: false
                }).then(() => {
                    this.afterScript(this.actionName)
                    this.callback()
                }).catch(() => {})
            })
        },
        /**
     * 挂起任务
     */
        handleSuspendProcess() {
            this.$confirm('确定挂起任务', '提示', {
                type: 'warning'
            }).then(() => {
                suspendProcess({ taskId: this.taskId }).then(response => {
                    this.$alert(`挂起任务成功！`, {
                        showClose: false
                    }).then(() => {
                        this.afterScript(this.actionName)
                        this.callback()
                    }).catch(() => {})
                })
            }).catch(() => {})
        },
        /**
     * 恢复任务
     */
        handleRecoverProcess() {
            this.$confirm('确定恢复任务', '提示', {
                type: 'warning'
            }).then(() => {
                recoverProcess({ taskId: this.taskId }).then(response => {
                    this.$alert(`恢复任务成功！`, {
                        showClose: false
                    }).then(() => {
                        this.afterScript(this.actionName)
                        this.callback()
                    })
                })
            }).catch(() => {

            })
        }
    }
}
