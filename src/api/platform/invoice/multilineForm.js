import request from '@/utils/request'
// import { COMP_URL } from '@/api/baseUrl'
import { INVOICE_API, REQUEST_TYPE, PAY_BTN_API,CON_FINANCE_API,FLOW_BTN_API } from './InvoiceURL'
import DynamicFormModel from '@/js-model/dynamic-form-model'

/**
 * 可用业务类型查询接口
 * @param {*} params
 */
export function searchBo(data) {
    return request({
        url: INVOICE_API.FIND_YWLX_BYYWSWID,
        method: REQUEST_TYPE.POST,
        data
    })
}

/**
 * 查询动态表单接口
 * @param {*} params
 */
export function queryDynForm(data) {
    return request({
        url: INVOICE_API.QUERY_DYNFORM,
        method: REQUEST_TYPE.POST,
        data
    }).then(({ data }) => {
        return DynamicFormModel.parse(data)
    })
}


/**
 * 查看余额
 * @param {*} params
 */
export function queryViewBalance(params) {
    return request({
        url: FLOW_BTN_API.QUERY_VIEW_BALANCE,
        method: REQUEST_TYPE.GET,
        params
    })
}
/**
 * 余额导出
 * @param {*} data
 */
export function queryViewBalanceOut(data) {
    return request({
        url: INVOICE_API.BLANCE_EXPORT,
        method: REQUEST_TYPE.POST,
        responseType: 'arraybuffer',
        data
    })
}

/**
 * 左侧表头
 * @param {*} params
 */
export function querySqlTitle(params) {
    return request({
        url: INVOICE_API.QUERY_LEFTFORM_TITLE,
        method: REQUEST_TYPE.GET,
        params: params
    })
}

/**
 * 左侧单个表详情
 * @param {*} params
 */
export function querySqlById(params) {
    return request({
        url: INVOICE_API.QUERY_LEFTFORM_BYID,
        method: REQUEST_TYPE.GET,
        params: params
    })
}

/**
 * 左侧列表（动态sql查询列表）
 * @param {*} params
 */
export function querySqlList(params) {
    return request({
        url: INVOICE_API.QUERY_LEFTFORM_LIST,
        method: REQUEST_TYPE.GET,
        params: params
    })
}

/**
 * 左侧列表按钮
 * @param {*} params
 */
export function queryleftFormBtn(data) {
    return request({
        url: INVOICE_API.QUERY_LEFTFORM_BTN,
        method: REQUEST_TYPE.POST,
        data
    })
}
/**
 * 保存数据
 * @param {*} params
 */
export function saveDynForm(data) {
    return request({
        url: INVOICE_API.SAVE_DYNFORM,
        method: REQUEST_TYPE.POST,
        data
    })
}

/** queryDynForm
 * 确认提交
 * @param {*} params
 */
export function confrimSub(data) {
    return request({
        url: INVOICE_API.CONFIRM_SUB,
        method: REQUEST_TYPE.POST,
        data
    })
}

/**
 * 确认提交
 * @param {*} params
 */
export function outlineTableCopy(data) {
    return request({
        url: INVOICE_API.OUTLINE_TABLE_COPY,
        method: REQUEST_TYPE.POST,
        data
    })
}

/**
 * 确认提交
 * @param {*} params
 */
export function pageBtn(data) {
    return request({
        url: INVOICE_API.PAGE_BTN,
        method: REQUEST_TYPE.POST,
        data
    })
}
/**
 * 仅提交流程
 * @param {*} params
 */
export function processSubmit(data) {
    return request({
        url: INVOICE_API.PROCESS_SUBMIT,
        method: REQUEST_TYPE.POST,
        data
    })
}

/**
 * 删除
 * @param {*} params
 */
export function remove(data) {
    return request({
        url: INVOICE_API.DELETE_BYYWSWIDS,
        method: REQUEST_TYPE.POST,
        data
    })
}

/**
 * 发票；列表
 * @param params
 */
export function invoiceList(data) {
    // console.log('INVOICE_API.FORM_TA:' + INVOICE_API.FORM_TAG)
    return request({
        url: FLOW_BTN_API.INVOICE_LIST,
        method: REQUEST_TYPE.POST,
        data
    })
}

/**
 * 通过传入的defid启动提交流程
 * @param {*}
 */
export function defStart(data) {
    return request({
        url: INVOICE_API.DEF_START,
        method: REQUEST_TYPE.POST,
        data
    })
}
/**
 *  左侧栏按钮
 * @param {*}
 */
export function getOutlineButtons(data) {
    return request({
        url: INVOICE_API.OUTLINE_TABLE_BTN,
        method: REQUEST_TYPE.POST,
        data
    })
}
/**
 *  付款发送(老的)
 * @param {*}
 */
export function paySendButtons(params) {
    return request({
        url: PAY_BTN_API.PAY_SEND,
        method: REQUEST_TYPE.GET,
        params: params
    })
}
/**
 *  付款发送(新的)
 * @param {*}
 */
export function paySendNewButtons(params) {
    return request({
        url: PAY_BTN_API.PAY_SEND_New,
        method: REQUEST_TYPE.GET,
        params: params
    })
}
/**
 *  付款发送返回信息
 * @param {*}
 */
export function paySendReqBtn(params) {
    return request({
        url: PAY_BTN_API.PAY_SEND_REQ,
        method: REQUEST_TYPE.GET,
        params: params
    })
}
/**
 * 发票创建
 * @param {*}
 */
export function createInvoiceButtons(data) {
    return request({
        url: PAY_BTN_API.INVOICE_ADD,
        method: REQUEST_TYPE.POST,
        data
    })
}
/**
 *  货物移动
 * @param {*}
 */
export function goodsmvButtons(data) {
    return request({
        url: PAY_BTN_API.GOODSMV_GET,
        method: REQUEST_TYPE.POST,
        data
    })
}
/**
 *  库存检查
 * @param {*}
 */
export function mantGetButtons(data) {
    return request({
        url: PAY_BTN_API.MATNR_GET,
        method: REQUEST_TYPE.POST,
        data
    })
}
/**
 *   跨境订单
 * @param {*}
 */
export function crossOrderButtons(data) {
    return request({
        url: PAY_BTN_API.CROSS_ORDER,
        method: REQUEST_TYPE.POST,
        data
    })
}
/**
 *   获取价值
 * @param {*}
 */
export function captureValueButtons(data) {
    return request({
        url: PAY_BTN_API.CAPTURE_VALUE,
        method: REQUEST_TYPE.POST,
        data
    })
}
/**
 *  卡片创建
 * @param {*}
 */
export function assetCardAddButtons(data) {
    return request({
        url: PAY_BTN_API.ASSET_CARDADD,
        method: REQUEST_TYPE.POST,
        data
    })
}
/**
 *  资产转固
 * @param {*}
 */
export function assetFixedButtons(data) {
    return request({
        url: PAY_BTN_API.ASSET_FIXED,
        method: REQUEST_TYPE.POST,
        data
    })
}
/**
 *  卡片维护
 * @param {*}
 */
export function assetCardupButtons(data) {
    return request({
        url: PAY_BTN_API.ASSET_CARDUP,
        method: REQUEST_TYPE.POST,
        data
    })
}
/**
 *  资产报废服务
 * @param {*}
 */
export function assetZcbfButtons(data) {
    return request({
        url: PAY_BTN_API.ASSET_ZCBF,
        method: REQUEST_TYPE.POST,
        data
    })
}
/**
 *  资产卡片创建并转固
 * @param {*}
 */
export function assetCjguButtons(data) {
    return request({
        url: PAY_BTN_API.ASSET_CARDGU,
        method: REQUEST_TYPE.POST,
        data
    })
}
/**
 *  资产转移接口服务
 * @param {*}
 */
export function assetMovButtons(data) {
    return request({
        url: PAY_BTN_API.ASSET_MOV,
        method: REQUEST_TYPE.POST,
        data
    })
}
/**
 *  资产创建卡片转换
 * @param {*}
 */
export function assetCardmovButtons(data) {
    return request({
        url: PAY_BTN_API.ASSET_CARDMOV,
        method: REQUEST_TYPE.POST,
        data
    })
}
/**
 *  资产报废并创建卡片
 * @param {*}
 */
export function assetBfCardButtons(data) {
    return request({
        url: PAY_BTN_API.ASSET_ZCBFCARD,
        method: REQUEST_TYPE.POST,
        data
    })
}
/**
 *  变更预览
 * @param {*}
 */
export function changeContractButtons(params) {
    return request({
        url: CON_FINANCE_API.CHANGE_CONTRACT,
        method: REQUEST_TYPE.GET,
        params: params
    })
}
/**
 *  关联行项目号
 * @param {*}
 */
export function lineItemContractButtons(params) {
    return request({
        url: CON_FINANCE_API.LINENO_CONTRACT,
        method: REQUEST_TYPE.GET,
        params: params
    })
}
