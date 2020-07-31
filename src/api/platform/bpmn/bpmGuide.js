import request from '@/utils/request'
import { BPMN_URL } from '@/api/baseUrl'

/**
 * 保存数据
 * @param {*} params
 */
export function save(params) {
  return request({
    url: BPMN_URL + '/bpm/v3/bpm/bpmGuide/save',
    method: 'post',
    data: params
  })
}

/**
 * 获取数据
 * @param {*} params
 */
export function get(params) {
  return request({
    url: BPMN_URL + '/bpm/v3/bpm/bpmGuide/get',
    method: 'get',
    params: params
  })
}
