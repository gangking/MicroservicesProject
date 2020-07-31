import request from '@/utils/request'
import { INDEX_API, REQUEST_TYPE,IBPS_API } from './voucherURL'

var previewApi = {
/**
 * 初始化凭证树
 * @param data
 */
queryAccTree(data) {
    return request({
        url: INDEX_API.QUERY_TREE,
        method: REQUEST_TYPE.POST,
        data: data
    })
},
/**
 * 获取凭证树
 * @param data
 */
buildAccTree(data) {
    return request({
        url: INDEX_API.BUILDACC_TREE,
        method: REQUEST_TYPE.POST,
        data: data
    })
},

/**
 *  凭证模拟
 * @param params
 */
voucherSim(params) {
    return request({
        url: INDEX_API.VOUCHER_SIM,
        method: REQUEST_TYPE.POST,
        data: params
    })
},
/**
 * 生成凭证
 * @param params
 */
voucherGener(params) {
    return request({
        url: IBPS_API.VOUCHER_GENER,
        method: REQUEST_TYPE.GET,
        params: params
    })
},
/**
 * 生成凭证新方法
 * @param data
 */
voucherGenerNew(data) {
    return request({
        url: INDEX_API.VOUCHER_GENER_NEW,
        method: REQUEST_TYPE.POST,
        data: data
    })
},

/**
 * 表格自定义表头
 * @param params
 */
tabDef(params) {
    return request({
        url: INDEX_API.TAB_DEF,
        method: REQUEST_TYPE.GET,
        params: params
    })
},
/**
 * 表格数据
 * @param params
 */
tabContent(data) {
    return request({
        url: INDEX_API.TAB_CONTENT,
        method: REQUEST_TYPE.POST,
        data: data
    })
},
/**
 * 表格统计金额
 * @param params
 */
tabTotal(data) {
    return request({
        url: INDEX_API.TAB_TOTAL,
        method: REQUEST_TYPE.POST,
        data: data
    })
},
/**
 * 表单自定义
 * @param params
 */
formDef(params) {
    return request({
        url: INDEX_API.FORM_DEF,
        method: REQUEST_TYPE.GET,
        params: params
    })
},
/**
 * 表单内容数据
 * @param params
 */
formContent(params) {
    return request({
        url: INDEX_API.FORM_CONTENT,
        method: REQUEST_TYPE.GET,
        params: params
    })
},
}

export default previewApi
