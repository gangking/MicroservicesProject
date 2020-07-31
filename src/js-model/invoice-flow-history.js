import Model from 'js-model'

const flowHistoryModel = new Model({
  data: {
    type: String,
    default: [{
        content: '业务申请',
        message: 'message',
        timestamp: '2018-04-03 20:46',
        color: '#0bbd87',
        size: 'normal',
        icon: 'icon-uniE0D0'
      },
      {
        content: '业务审核',
        message: 'message',
        timestamp: '2018-04-03 20:46',
        color: 'red',
        size: 'sanytimeline-item-dotted',
        icon: 'icon-uniE0D0'
      }
    ]
  }
})
export default flowHistoryModel
