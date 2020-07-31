import request from '@/utils/request'
import { IMAGE_URL } from '@/api/baseUrl'
/**
 * 信用调整原因 查询
 * @param {*} params
 */
export function creditQuery(params) {
  return request({
    url: IMAGE_URL + '/CreditResizeCauseService/query',
    method: 'post',
    data: params
  })
}


/**
 * 信用调整原因 保存
 * @param {*} params
 */
export function creditSave(params) {
  return request({
    url: IMAGE_URL + '/CreditResizeCauseService/save',
    method: 'post',
    data: params
  })
}

/**
 * 信用调整原因 编辑
 * @param {*} params
 */
export function creditEdit(params) {
  return request({
    url: IMAGE_URL + '/CreditResizeCauseService/get',
    method: 'get',
    params: params
  })
}

/**
 * 信用调整原因 删除
 * @param {*} params
 */
export function creditRemove(params) {
  return request({
    url: IMAGE_URL + '/CreditResizeCauseService/remove',
    method: 'post',
    params: params
  })
}


/**
 * 信用调整原因 导出
 * @param {*} params
 */
export function downExcel(params) {
  return request({
    url: IMAGE_URL + '/CreditExcel/exportExcelCreditCase',
    method: 'post',
    responseType: 'arraybuffer',
    data: params
  })
}