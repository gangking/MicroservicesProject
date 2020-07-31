import request from '@/utils/request'
import { BPMN_URL } from '@/api/baseUrl'

/**
 * 读取bpmn模型内容
 * @param {*} params
 */
export function getModeler(params) {
  return request({
    url: BPMN_URL + '/bpm/v3/bpm/modeler/getModeler',
    method: 'get',
    params: params
  })
}

/**
 * 保存
 * @param {*} params
 */
export function saveModeler(params) {
  return request({
    url: BPMN_URL + '/bpm/v3/bpm/modeler/save',
    method: 'post',
    data: params
  })
}
