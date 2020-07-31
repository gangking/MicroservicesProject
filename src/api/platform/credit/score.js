import request from '@/utils/request'
import { IMAGE_URL } from '@/api/baseUrl'
/**
 * 信用分值前台界面
 * @param {*} params
 */
export function getMx(params) {
  return request({
    url: IMAGE_URL + '/employeeCenterService/getMx',
    method: 'get',
    params: params
  })
}

/**
 * 用户当前信用分值
 * @param {*} params
 */
export function getSumFz(params) {
  return request({
    url: IMAGE_URL + '/employeeCenterService/getSumFz',
    method: 'get',
    params: params
  })
}
/**
*信用分值明细
*/
export function getMxByDocNumber(params) {
  return request({
    url: IMAGE_URL + '/employeeCenterService/getMxByDocNumber',
    method: 'get',
    params: params
  })
}

/**
 * 信用分值 导出
 * @param {*} params
 */
export function downExcel(params) {
  return request({
    url: IMAGE_URL + '/employeeCenterService/exportMxByDocNumber',
    method: 'get',
    responseType: 'arraybuffer',
    params: params
  })
}

