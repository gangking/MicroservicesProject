import request from '@/utils/request'
import { COMP_URL } from '@/api/baseUrl'

/**
 * 业务场景移动端摘要 获取表格
 *  @param {*} params
 *  */
export function getConfig(params) {
    return request({
        url: COMP_URL + '/bsMobSummary/query',
        method: 'get',
        params: params
    })
}
/**
 * 业务场景移动端摘要 保存 新增和编辑
 * @param {*} params
*/
export function saveConfig(params) {
    return request({
        url: COMP_URL + '/bsMobSummary/save',
        method: 'post',
        data: params
    })
}

/**
 * 业务场景移动端摘要 删除批量
 * @param {*} params
*/
export function deleConfig(params) {
    return request({
        url: COMP_URL + '/bsMobSummary/remove',
        method: 'post',
        data: params
    })
}

/**
 * 业务场景移动端摘要 排序保存
 * @param {*} params
*/
export function batchSave(params) {
    return request({
        url: COMP_URL + '/bsMobSummary/batchSave',
        method: 'post',
        data: params
    })
}

