export const actionOptions = [{
  value: 'agree',
  label: '同意'
}, {
  value: 'oppose',
  label: '反对',
  type: 'danger'
}, {
  value: 'reject',
  label: '驳回',
  type: 'danger'
}, {
  value: 'rejectToStart',
  label: '驳回发起人',
  type: 'danger'
},
{
  value: 'abandon',
  label: '弃权',
  type: 'info'
}
]

/**
 * 任务类型
 */
export const taskTypeOptions = [
  {
    value: 'NORMAL',
    label: '待办',
    type: 'primary'
  },
  {
    value: 'AGENT',
    label: '代理',
    type: 'danger'
  },
  {
    value: 'DELIVERTO',
    label: '转交',
    type: 'yellow'
  }
]

export const statusOptions = [
  {
    value: 'end',
    label: '结束',
    type: 'danger'
  },
  {
    value: 'suspend',
    label: '挂起',
    type: 'danger'
  },
  {
    value: 'running',
    label: '正在运行',
    type: 'success'
  },
  {
    value: 'manualend',
    label: '人工结束',
    type: 'warning'
  }
]

export const changeTypeOptions = [
  {
    value: 'assignee',
    label: '代理'
  },
  {
    value: 'shift',
    label: '转办'
  }
]

export const changeTypeStatusOptions = [
  {
    value: 'running',
    label: '运行中'
  },
  {
    value: 'finish',
    label: '完成'
  },
  {
    value: 'cancel',
    label: '取消'
  }
]

export const endOptions = [
  {
    value: 'true',
    label: '是'
  },
  {
    value: 'false',
    label: '否'
  }
]

export const status = [
  {
    value: 'end',
    label: '结束',
    type: 'danger'
  },
  {
    value: 'manualend',
    label: '人工结束',
    type: 'warning'
  }
]
