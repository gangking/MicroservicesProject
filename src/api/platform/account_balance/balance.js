import request from '@/utils/request'
import { DATA_URL, COMP_URL } from '@/api/baseUrl'





/**
 * 前置单据记账余额查询
 * @param {*} params
 */
export function searchPrepose(params) {
  return request({
    url: DATA_URL + '/bpm/v3/bpm/budget/pre/query',
    method: 'get',
    params: params
  })
}

/**
 * 专项记账余额 查询 
 * @param {*} params
 */
export function searchSpecial(params) {
  return request({
    url: DATA_URL + '/bpm/v3/bpm/budget/ef/query',
    method: 'get',
    params: params
  })
}

/**
 * nc余额 查询 
 * @param {*} params
 */
export function queryAssBalance(params) {
  return request({
    url: COMP_URL + '/accRuleQuery/queryAssBalance',
    method: 'post',
    data: params
  })
}