import request from '@/utils/request'
import { INVOICE_API, BPMN_API, REQUEST_TYPE } from './indexURL'

/**
 * 列表
 * @param params
 */
export function queryPageList(data) {
    return request({
        url: INVOICE_API.PAGE_LIST,
        method: REQUEST_TYPE.POST,
        data
    })
}

/**
 * 业务对象查询
 * @param params
 */
export function queryBOList(data) {
    return request({
        url: BPMN_API.BO_LIST,
        method: REQUEST_TYPE.POST,
        data
    })
}
/**
 * 业务场景查询
 * @param params
 */
export function queryYWCJList(params) {
    return request({
        url: INVOICE_API.YWCJ_LIST,
        method: REQUEST_TYPE.GET,
        params: params
    })
}
/**
 *业务流程id
 * @param params
 */
export function queryYWLCByIdList(params) {
    return request({
        url: BPMN_API.YWLC_LIST,
        method: REQUEST_TYPE.GET,
        params: params
    })
}
/**
 * 业务流程技术表单定义
 * 根据bo对象编码获取表单定义列表
 * @param params
 */
export function queryFormByBoList(params) {
    return request({
        url: BPMN_API.FORMBO_LIST,
        method: REQUEST_TYPE.GET,
        params: params
    })
}
/**
 * 保存
 * @param params
 */
export function saveScene(data) {
    return request({
        url: INVOICE_API.SAVE,
        method: REQUEST_TYPE.POST,
        data
    })
}
/**
 * 删除
 * @param params
 */
export function removeScene(data) {
    return request({
        url: INVOICE_API.REMOVE,
        method: REQUEST_TYPE.POST,
        data
    })
}
/**
 * 发布
 * @param params
 */
export function releaseOK(params) {
    return request({
        url: INVOICE_API.RELEASE,
        method: REQUEST_TYPE.GET,
        params: params
    })
}

