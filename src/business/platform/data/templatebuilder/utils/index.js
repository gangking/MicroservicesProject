
const helpers = {

  defaultTemplateAttrs: function(templateType, data) {
    var attrs
    if (data && data.showType === 'compose') {
      attrs = []
      var composeType = data.composeType
      if (composeType === 'treeList') {
        attrs.push(this.defaultTemplateAttrs('composeTree'))
        attrs.push(this.defaultTemplateAttrs('composeList'))
      } else if (composeType === 'listTree') {
        attrs.push(this.defaultTemplateAttrs('composeList'))
        attrs.push(this.defaultTemplateAttrs('composeTree'))
      }
      return attrs
    } else {
      attrs = {}
      attrs['template_type'] = templateType
      return attrs
    }
  },
  defaultListAttrs: function() {
    return {
      attrs: {
        'data_title': {
          type: 'first'
        },
        'init_query': 'Y',
        'need_page': 'Y',
        'page_size': 20
      },
      buttons: {
        function_buttons: [
          {
            $index: 1,
            button_type: 'search',
            canReAdd: false,
            label: '搜索'
          },
          {
            $index: 2,
            button_type: 'resetSearch',
            canReAdd: false,
            label: '重置'
          },
          {
            $index: 3,
            button_type: 'add',
            canReAdd: false,
            label: '添加'
          },
          {
            $index: 4,
            button_type: 'remove',
            canReAdd: false,
            label: '删除'
          },
          {
            $index: 5,
            button_type: 'edit',
            canReAdd: false,
            label: '编辑'
          },
          {
            $index: 6,
            button_type: 'detail',
            canReAdd: false,
            label: '明细'
          }
        ],
        edit_buttons: [
          {
            $index: 1,
            button_type: 'close',
            canReAdd: false,
            label: '关闭'
          },
          {
            $index: 2,
            button_type: 'save',
            canReAdd: false,
            label: '保存'
          }
        ]
      }
    }
  },
  defaultDialogAttrs: function() {
    return {
      attrs: {
        multi: 'Y',
        width: '80',
        height: '80'
      },
      buttons: {
        'dialog_buttons': [{
          button_type: 'ok',
          label: '确定'
        }, {
          button_type: 'clean',
          label: '清空'
        }, {
          button_type: 'cancel',
          label: '取消'
        }]
      }
    }
  }
}

export default helpers
