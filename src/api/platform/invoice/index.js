import request from '@/utils/request'
import { INVOICE_API, REQUEST_TYPE } from './InvoiceURL'
import DynamicFormModel from '@/js-model/dynamic-form-model'
import InvoiceFlowHeadInfo from '@/js-model/invoice-flow-headInfo'
import qs from 'qs'

/**
 * 请求分步数据
 * @param params
 */
export function getStepPloy(data) {
    return request({
        url: INVOICE_API.STEOP_PLOY,
        method: REQUEST_TYPE.POST,
        data
    })
}

/**
 * 获取分步tag
 * @param params
 */
export function getFormTag(data) {
    console.log('INVOICE_API.FORM_TA:' + INVOICE_API.FORM_TAG)
    return request({
        url: INVOICE_API.FORM_TAG,
        method: REQUEST_TYPE.POST,
        data
    })
}

/**
 * 获取统计金额及及脚本样式
 * @param params
 */
export function getMoneyNum(data) {
    return request({
        url: INVOICE_API.BT_LEFT_RULES,
        method: REQUEST_TYPE.POST,
        data
    })
}


/**
 *
 * @param params
 */
export function getFormDefine(data) {
    return request({
        url: INVOICE_API.FORM_DEF,
        method: REQUEST_TYPE.POST,
        data
    }).then(({ data }) => {
        return DynamicFormModel.parse(data)
    })
}

/**
 *
 * @param data
 */
export function saveFormData(info) {
    // console.log('开始表单保存',info)
    var data = JSON.parse(JSON.stringify(info))
    for(var key in data) {
        if(key == 'map') {
            for(var key2 in data[key]) {
                // console.log('打印信息',typeof data[key][key2])
                if (typeof data[key][key2] == 'string') {
                    if(data[key][key2].indexOf('\n') >= 0) {
                    // console.log('打印有换行信息',key2,data[key][key2])
                    data[key][key2] = data[key][key2].replace(/\n/g,"\\n");
                }
                }
                
            }
        }
    }
    return request({
        url: INVOICE_API.DEF_START,
        method: REQUEST_TYPE.POST,
        data
    })
}

// 灵活上载
export function flexibleUploadCol(params) {
  const data = new FormData() // 创建form对象
  data.append('file', params.file)
  data.append('dto', params.dto)
  return request({
    url: INVOICE_API.FLEXIBLE_UPLOAD,
    method: REQUEST_TYPE.POST,
    data: data
  })
}

// 灵活下载
export function downloadExcel(data) {
  return request({
    url: INVOICE_API.DOWNLOAD_EXCEL,
    method: REQUEST_TYPE.POST,
    responseType: 'arraybuffer',
    data: data
  })
}

export function getFormData(params) {
    return request({
        url: INVOICE_API.FORM_GET_DATA,
        method: REQUEST_TYPE.GET,
        params: params
    })
}

export function getFormStrategy(data) {
    return request({
        url: INVOICE_API.BUSINESS_EVENT_GROUP,
        method: REQUEST_TYPE.POST,
        data
    })
}

export function getSingleFormButton(data) {
    return request({
        url: INVOICE_API.SINGLE_FORM_BUTTON,
        method: REQUEST_TYPE.POST,
        data
    })
}
/**
 * 获取头部信息
 * @param {*} params
 */
export function getInvoiceInfo(data) {
    return request({
        url: INVOICE_API.INVOCIE_HEAD_INFO,
        method: REQUEST_TYPE.POST,
        data
    }).then(({ data }) => {
        return InvoiceFlowHeadInfo.parse(data)
    })
}

export function getSingleFormPermission(data) {
    return request({
        url: INVOICE_API.SINGLE_FROM_PERMISSION,
        method: REQUEST_TYPE.POST,
        data
    }).then(({ data }) => {
        return DynamicFormModel.parse(data)
    })
}

export function getProcessButtonQuery(data) {
    return request({
        url: INVOICE_API.PROCESS_BUTTON_QUERY,
        method: REQUEST_TYPE.POST,
        data
    })
}
/**
 * 流程驳回
 * @param {*} data
 */
export function getProcessInfo(data) {
    return request({
        url: INVOICE_API.REJECT_PROCESS,
        method: REQUEST_TYPE.POST,
        data
    })
}

/**
 * 查询例外消息
 * @param {*} data
 */
export function bsCheckStepQuery(data) {
    return request({
        url: INVOICE_API.BSCHCKSTEP_QUERY,
        method: REQUEST_TYPE.POST,
        data
    })
}
/**
 * 保存  已读未读标识
 * @param {*} data
 */
export function saveCheck(params) {
    return request({
        url: INVOICE_API.SAVE_CHECK,
        method: REQUEST_TYPE.GET,
        params: params
    })
}


export function getBsiCode(data) {
    return request({
        url: INVOICE_API.BSI_CODE_QUERY,
        method: REQUEST_TYPE.POST,
        data
    })
}
