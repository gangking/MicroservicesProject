export const typeOptions = [
  {
    value: '',
    label: '全部'
  },
  // {
  //   value: 'normal',
  //   label: '普通',
  //   type: 'primary'
  // },
  {
    value: 'backlog',
    label: '待办',
    type: 'danger'
  },
  {
    value: 'remind',
    label: '提醒',
    type: 'warning'
  },
  {
    value: 'notice',
    label: '通知',
    type: 'primary'
  },
  {
    value: 'other',
    label: '其他',
    type: 'success'
  },
  // {
  //   value: 'system',
  //   label: '系统消息',
  //   type: 'danger'
  // },
  // {
  //   value: 'bulletin',
  //   label: '公告',
  //   type: 'yellow'
  // }
]
export const priorityOptions = [
  {
    value: '',
    label: '全部'
  },
 
  {
    value: '高',
    label: '高',
    type: 'danger'
  },
  {
    value: '中',
    label: '中',
    type: 'warning'
  },
  {
    value: '低',
    label: '低',
    type: 'primary'
  },
  {
    value: '其他',
    label: '其他',
    type: 'success'
  },
]


export const renderHeader = function(h, { column, $index }) {
  return h('span', [
    h('el-tooltip', {
      props: {
        content: '是否已读'
      }
    }, [h('i', { class: 'ibps-icon-envelope-o' })]),
    h('el-tooltip', {
      props: {
        content: '是否有附件'
      }
    }, [h('i', { class: 'ibps-icon-paperclip' })]
    )
  ])
}
export const publicOrCanreplyOptions = [
  {
    value: 0,
    label: '否',
    type: 'danger'
  },
  {
    value: 1,
    label: '是'
  }
]

