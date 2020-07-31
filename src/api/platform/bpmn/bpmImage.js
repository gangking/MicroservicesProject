import request from '@/utils/request'
import { BPMN_URL } from '@/api/baseUrl'

/**
 * 获取流程图
 * @param {*} params
 */
export function getFlowDiagram(params) {
  return request({
    url: BPMN_URL + '/bpm/v3/bpm/instance/flowImageXml',
    method: 'get',
    params: params
  })
}
