import request from '@/utils/request'
import { COMP_URL, FORM_URL, BASE_GATEWAY_API } from '@/api/baseUrl'

/**
 * 流程定义下拉框服务，根据流程名称模糊查找
 * @param {*} params
 */
export function bpmnDefinition(params) {
  return request({
    url: FORM_URL + '/bpm/v3/bpm/definition/query',
    method: 'post',
    data: params
  })
}



/**
 * 获取流程节点表格
 * @param {*} params
*/
export function getTable(params) {
  return request({
    url: FORM_URL + '/bpm/v3/bpm/form/queryBpmNode',
    method: 'get',
    params: params
  })
}


/**
 * 根据流程定义ID和流程节点ID查询
 * @param {*} params
*/
export function queryTable(params) {
  return request({
    url: COMP_URL + '/procProfAssign/queryList',
    method: 'post',
    data: params
  })
}

/**
 * 根据业务场景查询业务情形
 *  @param {*} params
 *  */
export function queryScene(params) {
  return request({
    url: COMP_URL + '/bsBsi/query',
    method: 'get',
    params: params
  })
}