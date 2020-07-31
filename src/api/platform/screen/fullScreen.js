import request from '@/utils/request'
import { FINANCE_URL } from '@/api/baseUrl'

/**
 * 中间6个 数据展示
 * @param {*} params
 */
export function staticMessage(params) {
  return request({
    url: FINANCE_URL + '/cost/statistic',
    method: 'get',
    params: params
  })
}

/**
 *  存货差异
 * @param {*} params
 */
export function difaccount(params) {
  return request({
    url: FINANCE_URL + '/cost/difaccount',
    method: 'get',
    params: params
  })
}

/**
 *  完工订单及时性监
 * @param {*} params
 */
export function overaufnr(params) {
  return request({
    url: FINANCE_URL + '/cost/overaufnr',
    method: 'get',
    params: params
  })
}

/**
 *  长期在制订单
 * @param {*} params
 */
export function wipaufnr(params) {
  return request({
    url: FINANCE_URL + '/cost/wipaufnr',
    method: 'get',
    params: params
  })
}

/**
 *  投料率
 * @param {*} params
 */
export function feedaufnr(params) {
  return request({
    url: FINANCE_URL + '/cost/feedaufnr',
    method: 'get',
    params: params
  })
}

/**
 *  工序外协
 * @param {*} params
 */
export function subaufnr(params) {
  return request({
    url: FINANCE_URL + '/cost/subaufnr',
    method: 'get',
    params: params
  })
}


