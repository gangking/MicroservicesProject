import { BASE_URL, COMP_URL, BPMN_URL,IMAGE_URL } from '@/api/baseUrl'
import _ from 'lodash'
const BASE_INDEX_API = BASE_URL + COMP_URL
const BASE_BPMN_API = BASE_URL + BPMN_URL
const BASE_IBPS_API = BASE_URL + IMAGE_URL
// BPMN_URL: '',
// COMP_URL: '',
// const BASE_INDEX_API = 'http://192.168.30.13:5100/ibps/'
const REQUEST_TYPE = {
    POST: 'post',
    GET: 'get'
}

let INDEX_API = {
    BSCHECKSTEP_QUERYALL: '/bsBasic/queryAllBo', // 查所有业务场景
    YWLX_LISTBYBS:'/certificationRulesService/getBsBc',// 根据业务场景查询业务类型
    RULES_STRATE:'/certificationRulesService/getAllAccRuleSt',// 规则策略
    ACCRULETP_LIST:'/certificationRulesService/getAllAccRuleTp',// 凭证模板
    SAVE_ACCRULEDEF:'/certificationRulesService/saveAccRuleDef',// 保存凭证规则定义
    FING_ALL_BYRULEID:'/certificationRulesService/findAllByRuleId', // 通过规则id查询所有规则
    SAVE_ACCRULEFIELD:'/certificationRulesService/saveAccRuleField', // 保存凭证规则列表
    QUERY_TREE:'/scene/v3/bsAccdoc/queryAccTree',  // 初始化树
    BUILDACC_TREE:'/scene/v3/bsAccdoc/buildAccTree',  // 凭证树
    VOUCHER_SIM:'/accRuleQuery/createVoucher',  // 凭证模拟    
    TAB_TOTAL:'/Voucher/queryBottom',  // 表格金额统计
    TAB_DEF:'/certificationRulesService/queryAccListFieldDef',  // 表格自定义表头
    TAB_CONTENT:'/Voucher/query',  // 表格内容数据
    FORM_DEF:'/certificationRulesService/queryAccItemFormDef',  //  表单label自定义
    FORM_CONTENT:'/certificationRulesService/queryAccItemDataById',  //  表单内容
    COPY_RULE:'/certificationRulesService/copyRule',  //  复制凭证规则
    // ------------集成策略配置--------------------------
    QUERY_INTEGRATION_STRATEGY:'/integStt/queryBoCode', // 集成策略配置查询 Integration strategy
    LEFT_FONT_OBJECT:'/sttField/queryTree', // 左边业务对象明细字段服务 Integration strategy
    STTFIED_SAVE:'/sttField/save',// 保存集成策略
    VOUCHER_GENER_NEW:'/accRuleQuery/sendVoucher', // 生成凭证(新接口)
}
let IBPS_API = {
    VOUCHER_GENER:'/AccountingService/fsSap', // 生成凭证
}

let BUSINES_API = {
    LEFT_FONT:'/page/v3/form/def/buildTree',// 左右边业务对象明细字段服务
}

INDEX_API = _.mapValues(INDEX_API, function(v) {
    return BASE_INDEX_API + v
})

IBPS_API = _.mapValues(IBPS_API, function(v) {
    return BASE_IBPS_API + v
})

BUSINES_API = _.mapValues(BUSINES_API, function(v) {
    return BASE_BPMN_API + v
})

export {
    INDEX_API,
    BUSINES_API,
    REQUEST_TYPE,
    IBPS_API
}
