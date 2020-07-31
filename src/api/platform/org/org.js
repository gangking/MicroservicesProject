import request from '@/utils/request'
import ActionUtil from '@/utils/action'
import { ORG_URL } from '@/api/baseUrl'

/**
 * 查询列表数据
 * @param {*} params
 */
export function queryPageList(params) {
  return request({
    url: ORG_URL + '/user/v3/org/query',
    method: 'post',
    data: params
  })
}
/**
 * 删除数据
 * @param {*} params
 */
export function remove(params) {
  return request({
    url: ORG_URL + '/user/v3/org/remove',
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
    url: ORG_URL + '/user/v3/org/save',
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
    url: ORG_URL + '/user/v3/org/get',
    method: 'get',
    params
  })
}

// 组织树信息
export function findTreeData(params) {
  return request({
    url: ORG_URL + '/user/v3/org/findTreeData',
    method: 'post',
    data: ActionUtil.formatParams(params)
  })
}

// 获取分段组织树信息
export function newFindTreeData(data,params) {
  const BPMN_URL = 'http://192.168.30.24:5100/ibps'
  const FORM_API = {
    newFindTreeData: '/user/v3/org/findTreeDataNew',
  }
  return request({
    // url: BPMN_URL + FORM_API.newFindTreeData,
    url: ORG_URL + FORM_API.newFindTreeData,
    method: 'post',
    data: ActionUtil.formatParams(data),
    params: params
  })
}

/**
 *  保存移动的组织
 * @param {*} params
 */
export function saveMove(params) {
  return request({
    url: ORG_URL + '/user/v3/org/saveMove',
    method: 'post',
    params: params
  })
}
/**
 *  保存组织排序
 * @param {*} params
 */
export function saveSort(params) {
  return request({
    url: ORG_URL + '/user/v3/org/saveSort',
    method: 'post',
    params: params
  })
}

/**
 * 添加组织角色
 * @param {*} params
 */
export function assignRole(params) {
  return request({
    url: ORG_URL + '/user/v3/org/assignRole',
    method: 'post',
    params: params
  })
}

/**
 * 移除组织角色
 * @param {*} params
 */
export function removeRole(params) {
  return request({
    url: ORG_URL + '/user/v3/org/removeRole',
    method: 'post',
    params: params
  })
}

