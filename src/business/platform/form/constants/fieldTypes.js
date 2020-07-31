import { tableButtonType } from './buttonTypes'
/* 字段类型 */
const fieldTypes = {
  // =============布局控件===================
  'grid': {
    'label': '栅格布局',
    'icon': 'ibps-icon-columns',
    'group': 'layout',
    'is_input': false,
    defaultAttributes: function (attrs) { // 默认值
      attrs.field_options = {
        gutter: 0,
        justify: 'start',
        align: 'top',
        columns: [
          {
            span: 12,
            fields: []
          },
          {
            span: 12,
            fields: []
          }
        ]
      }
      return attrs
    }
  },
  // 'pageHeader': {
  //   'label': '分组标题',
  //   'icon': 'ibps-icon-text',
  //   'group': 'layout',
  //   defaultAttributes: function(attrs) { // 默认值
  //     return attrs
  //   }
  // },
  // =============通用字段===================
  'text': {
    'label': '单行文本',
    'icon': 'ibps-icon-font',
    'order': 1,
    'group': 'common',
    defaultAttributes: function (attrs) { // 默认值
      attrs.field_options = {
        default_value_type: 'fixed',
        placeholder: '请输入',
        required: false,
        is_min_length: false,
        is_max_length: false,
        hide_rights: false,
        read_rights: false
      }
      return attrs
    }
  },
  'textarea': {
    'label': '多行文本',
    'icon': 'ibps-icon-list',
    'order': 2,
    'group': 'common',
    defaultAttributes: function (attrs) { // 默认值
      attrs.field_options = {
        default_value_type: 'fixed',
        placeholder: '请输入',
        required: false,
        is_min_length: false,
        is_max_length: false,
        hide_rights: false,
        read_rights: false
      }
      return attrs
    }
  },
  'number': {
    'label': '数字',
    'icon': 'ibps-icon-number',
    'order': 3,
    'group': 'common',
    defaultAttributes: function (attrs) { // 默认值
      attrs.field_options = {
        default_value_type: 'fixed',
        placeholder: '请输入',
        required: false,
        is_min: false,
        is_max: false,
        hide_rights: false,
        read_rights: false
      }
      return attrs
    }
  },
  'radio': {
    'label': '单选框',
    'icon': 'ibps-icon-check-circle',
    'order': 4,
    'group': 'common',
    defaultAttributes: function (attrs) { // 默认值
      attrs.field_options = {
        required: false,
        hide_rights: false,
        read_rights: false,
        default_value_type: 'fixed',
        datasource: 'custom',
        options: [{
          val: '1',
          label: '选项一',
          checked: false
        }, {
          val: '2',
          label: '选项二',
          checked: false
        }]
      }
      return attrs
    }
  },
  'checkbox': {
    'label': '多选框',
    'icon': 'ibps-icon-check-square',
    'order': 5,
    'group': 'common',
    defaultAttributes: function (attrs) { // 默认值
      attrs.field_options = {
        required: false,
        is_min_mum: false,
        is_max_mum: false,
        hide_rights: false,
        read_rights: false,
        default_value_type: 'fixed',
        placeholder: '请选择',
        datasource: 'custom',
        options: [{
          val: '1',
          label: '选项一',
          checked: false
        }, {
          val: '2',
          label: '选项二',
          checked: false
        }]

      }
      return attrs
    }
  },
  'select': {
    'label': '下拉框',
    'icon': 'ibps-icon-caret-square-o-down',
    'order': 6,
    'group': 'common',
    defaultAttributes: function (attrs) { // 默认值
      attrs.field_options = {
        required: false,
        hide_rights: false,
        read_rights: false,
        default_value_type: 'fixed',
        placeholder: '请选择',
        datasource: 'custom',
        options: [{
          val: '1',
          label: '选项一',
          checked: false
        }, {
          val: '2',
          label: '选项二',
          checked: false
        }]
      }
      return attrs
    }
  },
  // 'switch': {
  //   'label': '开关',
  //   'icon': 'ibps-icon-toggle-on',
  //   'order': 7,
  //   'group': 'common',
  //   defaultAttributes: function(attrs) { // 默认值
  //     return attrs
  //   }
  // },
  // 'slider': {
  //   'label': '滑块',
  //   'icon': 'ibps-icon-sliders',
  //   'order': 8,
  //   'group': 'common',
  //   defaultAttributes: function(attrs) { // 默认值
  //     return attrs
  //   }
  // },
  'datePicker': {
    'label': '日期控件',
    'icon': 'ibps-icon-calendar',
    'order': 9,
    'group': 'common',
    defaultAttributes: function (attrs) { // 默认值
      attrs.field_options = {
        default_value_type: 'fixed',
        placeholder: '请选择',
        datefmt_type: 'date',
        datefmt: 'yyyy-MM-dd',
        required: false,
        is_start_date: false,
        is_end_date: false,
        hide_rights: false,
        read_rights: false
      }
      return attrs
    }
  },
  'hidden': {
    'label': '隐藏域',
    'icon': 'ibps-icon-eye-slash',
    'order': 10,
    'group': 'common',
    defaultAttributes: function (attrs) { // 默认值
      attrs.field_options = {
        default_value_type: 'fixed'
      }
      return attrs
    }
  },
  'table': {
    'label': '子表单',
    'icon': 'ibps-icon-table',
    'order': 11,
    'group': 'common',
    'sub': false,
    defaultAttributes: function (attrs) { // 默认值
      attrs.field_options = {
        default_value_type: 'fixed',
        required: false,
        hide_rights: false,
        read_rights: false,
        mode: 'inner',
        buttons: [tableButtonType('add'), tableButtonType('remove')],
        columns: []
      }
      return attrs
    }

  },
  'remoteSearch': {
    'label': '联动查询',
    'icon': 'ibps-icon-search',
    'order': 13,
    'group': 'common',
    defaultAttributes: function (attrs) { // 默认值
      attrs.field_options = {
        default_value_type: 'fixed',
        placeholder: '请输入',
        clearFields: [],//清空的字段
        isAuto: false,//是否自动带出
        isUpdate: false,//是否自动带出
        search_url: "", // 值来源查询id
        data_chain: [],//值来源联动数据
        data_condition: [],//值来源条件数据
        remote_name: "",
        required: false,
        hide_rights: false,
        read_rights: false,
      }
      return attrs
    }
  },
  // =============增强字段===================
  'editor': {
    'label': '富文本',
    'icon': 'ibps-icon-paragraph',
    'order': 1,
    'group': 'advanced',
    'sub': false,
    defaultAttributes: function (attrs) { // 默认值
      attrs.field_options = {
        default_value_type: 'fixed',
        required: false,
        hide_rights: false,
        read_rights: false,
        toolbars: [
          'source', 'bold', 'italic', 'underline', 'fontborder', 'strikethrough', 'pasteplain', '|',
          'forecolor', 'backcolor', 'selectall', 'cleardoc', 'fontfamily', 'fontsize'
        ]
      }

      return attrs
    }
  },
  'dictionary': {
    'label': '数据字典',
    'icon': 'ibps-icon-book',
    'order': 2,
    'group': 'advanced',
    defaultAttributes: function (attrs) { // 默认值
      attrs.field_options = {
        default_value_type: 'fixed',
        required: false,
        hide_rights: false,
        read_rights: false,
        placeholder: '请选择',
        multiple: false,
        select_mode: 'leaf',
        display_mode: 'path',
        split: '/'
      }
      return attrs
    }
  },
  'autoNumber': {
    'label': '自动编号',
    'icon': 'ibps-icon-list-ol',
    'order': 3,
    'group': 'advanced',
    defaultAttributes: function (attrs) { // 默认值
      attrs.field_options = {
        placeholder: '表单提交后展示',
        init: false
      }
      return attrs
    }
  },
  'attachment': {
    'label': '上传附件',
    'icon': 'ibps-icon-upload',
    'order': 4,
    'group': 'advanced',
    defaultAttributes: function (attrs) { // 默认值
      attrs.field_options = {
        default_value_type: 'fixed',
        required: false,
        hide_rights: false,
        read_rights: false,
        placeholder: '请选择',
        media_type: '',
        store: 'id'
      }
      return attrs
    }
  },
  'selector': {
    'label': '选择器',
    'icon': 'ibps-icon-search',
    'order': 5,
    'group': 'advanced',
    defaultAttributes: function (attrs) { // 默认值
      attrs.field_options = {
        default_value_type: 'fixed',
        placeholder: '请选择',
        selector_type: 'user',
        store: 'id',
        multiple: true,
        filter: [],
        required: false,
        hide_rights: false,
        read_rights: false
      }
      return attrs
    }
  },

  // 'linkdata': {
  //   'label': '关联数据',
  //   'icon': 'ibps-icon-gg',
  //   'order': 7,
  //   'group': 'advanced',
  //   defaultAttributes: function(attrs) { // 默认值
  //     attrs.field_options = {
  //       default_value_type: 'fixed',
  //       placeholder: '请选择',
  //       multiple: 'N',
  //       linkdata: '',
  //       required: false,
  //       hide_rights: false,
  //       read_rights: false
  //     }
  //     return attrs
  //   }
  // },
  'address': {
    'label': '地址',
    'icon': 'ibps-icon-building',
    'order': 8,
    'group': 'advanced',
    defaultAttributes: function (attrs) { // 默认值
      attrs.field_options = {
        default_value_type: 'fixed',
        placeholder: '请选择',
        top: 'country',
        level: 'district',
        is_street: true,
        required: false,
        hide_rights: false,
        read_rights: false
      }
      return attrs
    }
  },
  'signature': {
    'label': '签名',
    'icon': 'ibps-icon-pencil-square-o',
    'order': 9,
    'group': 'advanced',
    'sub': false,
    defaultAttributes: function (attrs) { // 默认值
      attrs.field_options = {
        default_value_type: 'fixed',
        placeholder: '请在这里输入您的签名',
        required: false,
        hide_rights: false,
        read_rights: false
      }
      return attrs
    }
  },
  'image': {
    'label': '图片',
    'icon': 'ibps-icon-image',
    'order': 10,
    'group': 'advanced',
    'sub': false,
    defaultAttributes: function (attrs) { // 默认值
      attrs.field_options = {
        default_value_type: 'fixed',
        placeholder: '请选择',
        accept: '',
        uploadType: 'attachment',
        required: false,
        hide_rights: false,
        read_rights: false
      }
      return attrs
    }
  },

  'fsscCustom': {
    'label': '自定义对话框',
    'icon': 'ibps-icon-search-plus',
    'order': 6,
    'group': 'advanced',
    defaultAttributes: function (attrs) { // 默认值
      attrs.field_options = {
        default_value_type: 'fixed',
        placeholder: '请选择',
        multiple: 'N',
        store: 'id',
        dialog_type: 'dialog',
        icon: 'search-plus',
        required: false,
        hide_rights: false,
        read_rights: false,
        search_url: "", // 值来源查询id
        data_chain: [],//值来源联动数据
        data_condition: [],//值来源条件数据
        remote_name: "",//名字
      }
      return attrs
    }
  },
  // 'customDialog': {
  //   'label': '自定义对话框',
  //   'icon': 'ibps-icon-search-plus',
  //   'order': 6,
  //   'group': 'advanced',
  //   defaultAttributes: function (attrs) { // 默认值
  //     attrs.field_options = {
  //       default_value_type: 'fixed',
  //       placeholder: '请选择',
  //       multiple: 'N',
  //       store: 'id',
  //       dialog_type: 'dialog',
  //       icon: 'search-plus',
  //       required: false,
  //       hide_rights: false,
  //       read_rights: false
  //     }
  //     return attrs
  //   }
  // },
  // =============系统字段===================

  // 'currentUser': {
  //   'label': '当前用户',
  //   'icon': 'ibps-icon-user-circle',
  //   'order': 1,
  //   'group': 'system',
  //   defaultAttributes: function(attrs) { // 默认值
  //     attrs.field_options = {
  //       default_value_type: 'present',
  //       placeholder: null,
  //       selector_type: 'user',
  //       store: 'id',
  //       multiple: false,
  //       filter: [],
  //       required: false,
  //       hide_rights: false,
  //       read_rights: true
  //     }

  //     return attrs
  //   }
  // },
  // 'currentOrg': {
  //   'label': '当前组织',
  //   'icon': 'ibps-icon-group',
  //   'order': 2,
  //   'group': 'system',
  //   defaultAttributes: function(attrs) { // 默认值
  //     attrs.field_options = {
  //       default_value_type: 'present',
  //       placeholder: null,
  //       selector_type: 'org',
  //       store: 'id',
  //       multiple: false,
  //       filter: [],
  //       required: false,
  //       hide_rights: false,
  //       read_rights: true
  //     }

  //     return attrs
  //   }
  // },
  // 'currentTime': {
  //   'label': '当前时间',
  //   'icon': 'ibps-icon-clock-o',
  //   'order': 3,
  //   'group': 'system',
  //   defaultAttributes: function(attrs) { // 默认值
  //     attrs.field_options = {
  //       default_value_type: 'today',
  //       placeholder: '请选择',
  //       datefmt_type: 'date',
  //       datefmt: 'yyyy-MM-dd HH:mm:ss',
  //       required: false,
  //       hide_rights: false,
  //       read_rights: true
  //     }
  //     return attrs
  //   }
  // },
  // 'currentDate': {
  //   'label': '当前日期',
  //   'icon': 'ibps-icon-calendar',
  //   'order': 4,
  //   'group': 'system',
  //   defaultAttributes: function(attrs) { // 默认值
  //     attrs.field_options = {
  //       default_value_type: 'today',
  //       placeholder: '请选择',
  //       datefmt_type: 'date',
  //       datefmt: 'yyyy-MM-dd',
  //       required: false,
  //       hide_rights: false,
  //       read_rights: true
  //     }
  //     return attrs
  //   }
  // },

  // =============流程字段===================
  // 'flow_diagram': {
  //   'label': '流程图',
  //   'icon': 'ibps-icon-image',
  //   'order': 1,
  //   'group': 'process',
  //   'is_input': false,
  //   'sub': false,
  //   defaultAttributes: function(attrs) { // 默认值
  //     return attrs
  //   }
  // },
  // 'approval_history': {
  //   'label': '审批历史',
  //   'icon': 'ibps-icon-list-alt',
  //   'order': 2,
  //   'group': 'process',
  //   'is_input': false,
  //   'sub': false,
  //   defaultAttributes: function(attrs) { // 默认值
  //     return attrs
  //   }
  // },
  // 'approval_opinion': {
  //   'label': '审批意见',
  //   'icon': 'ibps-icon-id-card-o',
  //   'order': 3,
  //   'group': 'process',
  //   'is_input': false,
  //   'sub': false,
  //   defaultAttributes: function(attrs) { // 默认值
  //     attrs.field_options = {
  //       placeholder: '请输入意见',
  //       common_statment: true,
  //       approval_button: true,
  //       arrangement: 'horizontal',
  //       options: [{
  //         checked: true,
  //         value: 'auditorName',
  //         label: '审批人'
  //       }, {
  //         checked: true,
  //         value: 'completeTime',
  //         label: '审批时间'
  //       }, {
  //         checked: true,
  //         value: 'statusName',
  //         label: '审批状态'
  //       }, {
  //         checked: true,
  //         value: 'opinion',
  //         label: '审批意见'
  //       }]
  //     }
  //     return attrs
  //   }
  // },
  // =============流程字段===================
  'desc': {
    'label': '描述',
    'icon': 'ibps-icon-exclamation-circle',
    'order': 1,
    'group': 'other',
    'is_input': false,
    'sub': false,
    defaultAttributes: function (attrs) { // 默认值
      attrs.field_options = {
        split_line: false,
        line_style: 'dashed'
      }
      return attrs
    }
  },
  'label': {
    'label': '文本',
    'icon': 'ibps-icon-detail',
    'order': 2,
    'group': 'other',
    'is_input': false,
    defaultAttributes: function (attrs) { // 默认值
      attrs.field_options.default_value_type = 'fixed'
      return attrs
    }
  }
  // 'hyperlink': {
  //   'label': '链接',
  //   'icon': 'ibps-icon-link',
  //   'order': 3,
  //   'group': 'other',
  //   'is_input': false,
  //   defaultAttributes: function(attrs) { // 默认值
  //     attrs.field_options = {
  //       showType: 'link',
  //       type: 'primary',
  //       textType: 'fixed',
  //       text: '链接',
  //       linkType: 'fixed', // 链接的类型
  //       link: '', // 链接的值
  //       text_javascript: '' // js 脚本的值
  //     }
  //     return attrs
  //   }
  // }

}

/**
 * 获取子表允许的字段类型
 *
 */
const getTableFieldTypes = function () {
  const tableFieldTypes = []
  let group
  for (const type in fieldTypes) {
    const field = fieldTypes[type]
    if ((typeof (field.sub) === 'boolean' && field.sub === false) ||
      (typeof (field.is_input) === 'boolean' && field.is_input === false)) {
      continue
    }
    field.divided = group && group !== field.group
    group = field.group
    tableFieldTypes.push(field)
  }
  return tableFieldTypes
}

export const tableFieldTypes = getTableFieldTypes()

export default fieldTypes
