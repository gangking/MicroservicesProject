import request from '@/utils/request'
import { BPMN_URL } from '@/api/baseUrl'
/**
 * 查询列表数据
 * @param {*} params
 */
export function queryPageList(params) {
  return request({
    url: BPMN_URL + '/bpm/v3/bpm/instance/history/query',
    method: 'post',
    data: params
  })
}
/**
 * 获取流程实例信息
 * @param {*} params
 */
export function get(params) {
  return request({
    url: BPMN_URL + '/bpm/v3/bpm/instance/history/get',
    method: 'get',
    params: params
  })
}
/**
 * 流程图
 * @param {*} params
 */
export function flowImage(params) {
  return request({
    url: BPMN_URL + '/bpm/v3/bpm/instance/history/flowImage',
    method: 'get',
    params: params
  })
}
/**
 * 审批历史
 * @param {*} params
 */
export function flowHistory(params) {
  return request({
    url: BPMN_URL + '/bpm/v3/bpm/instance/history/flowHistory',
    method: 'get',
    params: params
  })
}
/**
 * 审批历史
 * @param {*} params
 */
export function instFormInfo(params) {
  return request({
    url: BPMN_URL + '/bpm/v3/bpm/bpmInst/instFormInfo',
    method: 'get',
    params: params
  })
}
/**
 * 删除数据
 * @param {*} params
 */
export function remove(params) {
  return request({
    url: BPMN_URL + '/bpm/v3/bpm/instance/history/remove',
    method: 'post',
    params: params
  })
}
