import request from '@/utils/request'
import { IMAGE_URL, SYSTEM_URL } from '@/api/baseUrl'

/**
 * 查詢 事业部
 * @param {*} params
 */
export function getOrgtext(data) {
  return request({
    url: IMAGE_URL + '/OperationalIndicatorsService/bu',
    method: 'get',
    params: data
  })
}


/**
 * 查詢 流程节点
 * @param {*} params
 */
export function getProcessCode(data) {
  return request({
    url: IMAGE_URL + '/OperationalIndicatorsService/getLcjd',
    method: 'get',
    params: data
  })
}

/**
 * 查詢 流程人员
 * @param {*} params
 */
export function getProcessPerson(data) {
  return request({
    url: IMAGE_URL + '/OperationalIndicatorsService/getLcry',
    method: 'get',
    params: data
  })
}

/**
 * 查詢 公司代码
 * @param {*} params
 */
export function getButxt(data) {
  return request({
    url: IMAGE_URL + '/OperationalIndicatorsService/getBukrs',
    method: 'get',
    params: data
  })
}

/**
 * 查詢 业务场景
 * @param {*} params
 */
export function getbBCode(data) {
  return request({
    url: IMAGE_URL + '/OperationalIndicatorsService/getYwcj',
    method: 'get',
    params: data
  })
}

/**
 * 查詢 共享审核组
 * @param {*} params
 */
export function getShzList(data) {
  return request({
    url: IMAGE_URL + '/OperationalIndicatorsService/getGxshz',
    method: 'get',
    params: data
  })
}







/**
 * 平台工作指标查询
 * @param {*} params
 */
export function plaWorkSearch(params) {
  return request({
    url: IMAGE_URL + '/OperationalIndicatorsService/ptgzzbcx',
    method: 'post',
    data: params
  })
}

/**
 * 业务工作指标查询
 * @param {*} params
 */
export function businWorkSearch(params) {
  return request({
    url: IMAGE_URL + '/OperationalIndicatorsService/ywgzzb',
    method: 'post',
    data: params
  })
}


/**
 * 共享工作指标查询
 * @param {*} params
 */
export function shareWorkSearch(params) {
  return request({
    url: IMAGE_URL + '/OperationalIndicatorsService/gxgzzb',
    method: 'post',
    data: params
  })
}



/**
 * 平台绩效指标查询
 * @param {*} params
 */
export function platformAchSearch(params) {
  return request({
    url: IMAGE_URL + '/OperationalIndicatorsService/ptjxzbcx',
    method: 'post',
    data: params
  })
}

/**
 * 业务绩效指标查询
 * @param {*} params
 */
export function businAchSearch(params) {
  return request({
    url: IMAGE_URL + '/OperationalIndicatorsService/ywjxzbcx',
    method: 'post',
    data: params
  })
}

/**
 * 共享绩效指标查询
 * @param {*} params
 */
export function shareAchSearch(params) {
  return request({
    url: IMAGE_URL + '/OperationalIndicatorsService/ywjxzbcx',
    method: 'post',
    data: params
  })
}

/** 
*人员选择器
*
*/

export function personSelector(params) {
  return request({
    url: SYSTEM_URL + '/user/v3/employee/queryWithShift',
    method: 'post',
    data: params
  })

}