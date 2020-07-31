import request from '@/utils/request'
import { BPMN_URL } from '@/api/baseUrl'

/**
 * 查询列表数据
 * @param {*} params
 */
export function queryPageList(data) {
  return request({
    url: BPMN_URL + '/bpm/v3/bpm/common/statment/query',
    method: 'post',
    data: data
  })
}
/**
 * 删除数据
 * @param {*} params
 */
export function remove(params) {
  return request({
    url: BPMN_URL + '/bpm/v3/bpm/common/statment/remove',
    method: 'post',
    params: params
  })
}
/**
 * 保存数据
 * @param {*} params
 */
export function save(params) {
  return request({
    url: BPMN_URL + '/bpm/v3/bpm/common/statment/save',
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
    url: BPMN_URL + '/bpm/v3/bpm/common/statment/get',
    method: 'get',
    params: params
  })
}

/**
 * 设置默认值
 * @param {*} params
 */
export function setDefault(params) {
  return request({
    url: BPMN_URL + '/bpm/v3/bpm/common/statment/setDefault',
    method: 'post',
    params: params
  })
}

/**
 * 根据参与者类型查询等级数据
 * @param {*} params
 */
export function getCommonStatment(params) {
  return request({
    url: BPMN_URL + '/bpm/v3/bpm/common/statment/getCommonStatment',
    method: 'get',
    params: params
  })
}

