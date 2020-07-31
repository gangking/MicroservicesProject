import request from '@/utils/request'
import { IMAGE_URL } from '@/api/baseUrl'


/**
 * 大屏数据查询
 * @param {*} params
 */
export function getScreen(params) {
  return request({
    url: IMAGE_URL + '/OperationalIndicatorsService/getScreen',
    method: 'get',
    params: params
  })
}

/**
 * 本月新增单据量排行
 * @param {*} params
 */
export function getShareXzDjlPh(params) {
  return request({
    url: IMAGE_URL + '/OperationalIndicatorsService/getShareXzDjlPh',
    method: 'get',
    params: params
  })
}

/**
 * 共享中心今日新增单据量
 * @param {*} params
 */
export function getShareXzDjlPhDay(params) {
  return request({
    url: IMAGE_URL + '/OperationalIndicatorsService/getShareXzDjlPhDay',
    method: 'get',
    params: params
  })
}

/**
 * 共享中心本月已处理单据量排行
 * @param {*} params
 */
export function getShareYclDklphMonth(params) {
  return request({
    url: IMAGE_URL + '/OperationalIndicatorsService/getShareYclDklphMonth',
    method: 'get',
    params: params
  })
}

/**
 * 共享中心今日已处理单据量排行
 * @param {*} params
 */
export function getShareYclDklphDay(params) {
  return request({
    url: IMAGE_URL + '/OperationalIndicatorsService/getShareYclDklphDay',
    method: 'get',
    params: params
  })
}


/**
 * 获取组的名字
 * @param {*} params
 */
export function getGroupName(params) {
  return request({
    url: IMAGE_URL + '/OperationalIndicatorsService/getGroupName',
    method: 'get',
    params: params
  })
}