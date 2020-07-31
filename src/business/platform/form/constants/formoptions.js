const FormOptions = {
    t: {},
    options: {}
}

FormOptions.t = {
    // 权限
    PERMISSIONS: {
        READ: 'r', // 只读
        EDIT: 'e', // 编辑
        REQUIRED: 'b', // 必填
        SHOW: 's', // 显示，针对子表按钮
        HIDE: 'h'// 隐藏
    },
    // 默认日期格式
    DATE_FORMATS: {
        'date': 'yyyy-MM-dd',
        'datetime': 'yyyy-MM-dd HH:mm:ss',
        'time': 'HH:mm:ss'
    },
    // 数据格式(正则表达式)
    DATA_FORMAT: {
        'phone': /^((\(\d{2,3}\))|(\d{3}\-))?1\d{10}$/,
        'telephone': /^((\(0[0-9]{2,3}\))|(0[0-9]{2,3})\-)?([2-9][0-9]{6,7})(\-[0-9]{1,4})?$/,
        'zip': /^\d{6}$/,
        'idcard': /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
        'email': /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/
    },
    // 字段类型
    INPUT_FIELD_TYPES: ['hidden', 'text', 'textarea', 'editor', 'number', 'numberRange',
        'radio', 'checkbox', 'select', 'dictionary', 'datePicker',
        'dateRange', 'autoNumber', 'attachment', 'selector',
        'customDialog', 'linkdata', 'address', 'signature', 'office', 'bpmInstHis', 'table'],
    // 子表支持的字段类型
    SUBTABLE_FIELD_TYPE: ['hidden', 'text', 'textarea', 'radio', 'checkbox', 'select', 'number', 'datePicker', 'dictionary', 'attachment', 'selector', 'customDialog', 'linkdata', 'address'],
    // 不用输入字段类型，
    NON_INPUT_FIELD_TYPES: ['flow_diagram',
        'approval_history',
        'tab_break',
        'page_break',
        'desc',
        'label',
        'hyperlink',
        'fold_card',
        'section_break'],
    // 不用提交值字段类型，
    NON_MODEL_FIELD_TYPES: ['flow_diagram',
        'approval_history',
        'tab_break',
        'page_break',
        'desc',
        'hyperlink',
        'fold_card',
        'section_break']
}

export default FormOptions
