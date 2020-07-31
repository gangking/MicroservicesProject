import request from '@/utils/request'
import { IMAGE_URL } from '@/api/baseUrl'
/**
 * 信用明细 查询
 * @param {*} params
 */
export function creditQuery(params) {
  return request({
    url: IMAGE_URL + '/CreditStandService/xymxcx',
    method: 'post',
    data: params
  })
}

/**
 * 信用明细 导出
 * @param {*} params
 */
export function downExcel(params) {
  return request({
    url: IMAGE_URL + '/CreditExcel/exportExcelXycxmx',
    method: 'post',
    responseType: 'arraybuffer',
    data: params
  })
}

