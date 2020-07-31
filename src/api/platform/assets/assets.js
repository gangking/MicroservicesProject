import request from '@/utils/request'
import { IMAGE_URL, INFO_URL } from '@/api/baseUrl'

/**
 * 获取用户信息
 * @param {*} params
 */
export function getUserNo(params) {
  return request({
    url: INFO_URL + '/user/v3/employee/getSuper',
    method: 'get',
    params: params
  })
}
/**
 * 个人名下资产
 * @param {*} params
 */
export function getGrmxzc(params) {
  return request({
    url: IMAGE_URL + '/employeeCenterService/getGrmxzc',
    method: 'get',
    params: params
  })
}

/**
 * 部门 资产
 * @param {*} params
 */
export function getBmzc(params) {
  return request({
    url: IMAGE_URL + '/employeeCenterService/getBmzc',
    method: 'get',
    params: params
  })
}


/**
 * 资产 导出
 * @param {*} params
 */
export function downExcel(params) {
  return request({
    url: IMAGE_URL + '/employeeCenterService/exportBmByUserNo',
    method: 'get',
    responseType: 'arraybuffer',
    params: params
  })
}

