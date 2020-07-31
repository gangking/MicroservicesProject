import { BASE_URL, COMP_URL, BPMN_URL,IMAGE_URL,FINANCE_URL } from '@/api/baseUrl'
import _ from 'lodash'

const BASE_INVOICE_API = BASE_URL + COMP_URL
const FLOW_INVOICE_API = BASE_URL + BPMN_URL
const PAY_INVOICE_API = BASE_URL + IMAGE_URL
const BAS_FINANCE_API = BASE_URL + FINANCE_URL
// const COMP_URL = 'http://192.168.30.26:5100/ibps'
const REQUEST_TYPE = {
    POST: 'post',
    GET: 'get'
}

let INVOICE_API = {
    STEOP_PLOY: '/bsStepStrategy/queryStep',
    FORM_TAG: '/bsSlcfTabs/queryTabs',
    FORM_DEF: '/bsSlcfTabsAssignform/getFormByKey',
    FORM_DATA_SAVE: '/scene/v3/complexService/createBo',
    FORM_GET_STRATEGY: '/bsStepStrategy/queryByParams',
    FORM_GET_DATA: '/bsBasic/getBoByInstid',
    SINGLE_FORM_BUTTON: '/bsSlcfAssignButton/queryByPermission',
    INVOCIE_HEAD_INFO: '/bsBasic/queryTop',
    OUTLINE_TABLE_BTN: '/scene/v3/complexService/getAssignbutton',
    OUTLINE_TABLE_COPY: '/scene/v3/complexService/copyNew',
    FIND_YWLX_BYYWSWID: '/scene/v3/complexService/findYwlxByYwswid',
    QUERY_DYNFORM: '/scene/v3/complexService/fingPropertyWord',
    SAVE_DYNFORM: '/complexForm/save',
    SINGLE_FROM_PERMISSION: '/bsSlcfTabsAssignform/queryByPermission',
    QUERY_LEFTFORM_TITLE: '/scene/v3/complexService/getLeftProperty',
    QUERY_LEFTFORM_BYID: '/scene/v3/complexService/getByTableAndId',
    QUERY_LEFTFORM_LIST: '/scene/v3/complexService/getListByYwswIdAndId',
    CONFIRM_SUB: '/scene/v3/complexService/confirmToSubmitTest',
    PAGE_BTN: '/scene/v3/complexService/getYwswButton',
    DELETE_BYYWSWIDS: '/scene/v3/complexService/deleteItemsByIds',
    DEF_START: '/scene/v3/complexService/createNew',
    BUSINESS_EVENT_GROUP: '/bsStepStrategy/queryByPermission',
    PROCESS_SUBMIT: '/scene/v3/complexService/submit',
    PROCESS_BUTTON_QUERY: '/btnDef/queryProcBtn',
    REJECT_PROCESS: '/scene/v3/complexService/complete',
    BSCHCKSTEP_QUERY: '/bsCheckStep/query',
    SAVE_CHECK: '/bsCheckStep/updateMsgStatus',    
    BSI_CODE_QUERY: '/bsBsi/getBsiCode',    
    BT_LEFT_RULES: '/btLeftRules/query', // 金额统计接口
    FLEXIBLE_UPLOAD:'/scene/v3/complexService/uploadItems', // 灵活上载
    DOWNLOAD_EXCEL:'/scene/v3/complexService/downloadExcel', // 灵活下载
    VOUCHER_INFO:'/scene/v3/bsAccdoc/query', // 查询凭证信息接口
    OFFVOUCHER_DATA:'/offVoucher/sendSap',// 冲销接口
    COLUMN_EXPORT:'/bsLoadConf/query',// 行项目导出
    TRANSACTION_EXPORT:'/bsExcel/exportExcel', // 业务事务导出
    BLANCE_EXPORT:'/supplierbalance/export' // 余额导出
}

let FLOW_BTN_API = {
    FORM_DATA: '/bpm/v3/bpm/instance/getFormData',
    FLOW_IMG: '/bpm/v3/bpm/instance/flowImageXml',
    SAVE_DRAFT: '/bpm/v3/bpm/instance/saveDraft',
    DRAFT_START: '/bpm/v3/bpm/instance/start',
    COMPLETE: '/bpm/v3/bpm/task/complete',
    FLOW_HISTORY: '/bpm/v3/bpm/instance/flowHistory',
    FLOW_HISTORY_TWO: '/bpm/v3/bpm/instance/progress',
    DO_END_PROCESS: '/bpm/v3/bpm/task/doEndProcess',
    DO_LIST_PRINTTING: '/page/v3/form/print/template/queryFormPrintVoByAppId',
    DO_DWON_PRINTTING: '/page/v3/form/print/template/pdf/print',
    DO_YULAN_PRINTTING: '/page/v3/form/print/template/pdf/preview',
    INVOICE_LIST: '/page/v3/data/template/queryData',
    QUERY_VIEW_BALANCE: '/bpm/v3/bpm/balance/query',// 查看余额 queryViewBalance
}

// 
let PAY_BTN_API={
    PAY_SEND: '/tisItem/getTisItemList',
    PAY_SEND_New: '/tisItem/verifyTisItemList',
    PAY_SEND_REQ: '/tisItem/verifyTisItemList',
    INVOICE_ADD: '/VerifyService/invoiceVerify',
    MATNR_GET: '/matnr/get',
    GOODSMV_GET: '/ChbfService/chbfCreate',
    CROSS_ORDER: '/crossOrder/update',
    ASSET_CARDADD:'/ZckapianchuangjianService/zckapianchuangjian',          //资产卡片创建
    ASSET_FIXED:'/ZcZjgczgService/zcZjgczg',          //资产在建工程转固
    ASSET_CARDUP:'/ZcCardMaintenanceService/zckpwh',          //资产卡片维护
    ASSET_ZCBF:'/ZcBaofeiService/zcbf',          //资产报废服务
    ASSET_CARDGU: '/ZcZjgczgService/zcCpcjzg',         //资产卡片创建并转固
    ASSET_MOV: '/ZcZhuanYiService/zczy',         //资产转移接口服务
    CAPTURE_VALUE: '/ZcJzService/zcjz',         //资产价值
    ASSET_CARDMOV: '/ZccjbzhService/ccjbzh',         //资产创建卡片并转换
    ASSET_ZCBFCARD: '/ZcBaofeiService/zcbfljcl',         //资产报废并创建卡片
    
} 
//nonProContract/list
let CON_FINANCE_API ={
    CHANGE_CONTRACT:'/nonProContract/list',   //变更预览
    LINENO_CONTRACT:'/nonProContract/getItemlist'   //关联行项目
    
}
INVOICE_API = _.mapValues(INVOICE_API, function(v) {
    return BASE_INVOICE_API + v
})

FLOW_BTN_API = _.mapValues(FLOW_BTN_API, function(v) {
    return FLOW_INVOICE_API + v
})
PAY_BTN_API = _.mapValues(PAY_BTN_API, function(v) {
    return PAY_INVOICE_API + v
})
CON_FINANCE_API = _.mapValues(CON_FINANCE_API, function(v) {
    return BAS_FINANCE_API + v
})

console.log(FLOW_BTN_API)

// INVOICE_API.FORM_DEF = "http://172.18.3.81:3000/mock/35/ibps/form/def/getFormDataByKey";
export {
    INVOICE_API,
    REQUEST_TYPE,
    FLOW_BTN_API,
    CON_FINANCE_API,
    PAY_BTN_API
}
