import request from '@/utils/request'
import { SYSTEM_URL } from '@/api/baseUrl'
/**
 * 查询列表数据
 * @param {*} params
 */
export function queryPageList(params) {
  return request({
    url: SYSTEM_URL + '/base/v3/identity/query',
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
    url: SYSTEM_URL + '/base/v3/identity/remove',
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
    url: SYSTEM_URL + '/base/v3/identity/save',
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
    url: SYSTEM_URL + '/base/v3/identity/get',
    method: 'get',
    params
  })
}
/**
 * 获取数据
 * @param {*} params
 */
export function getByAlias(params) {
  return request({
    url: SYSTEM_URL + '/base/v3/identity/getByAlias',
    method: 'get',
    params
  })
}

/**
 * 预览数据
 * @param {*} params
 */
export function test(params) {
  return request({
    url: SYSTEM_URL + '/base/v3/identity/test',
    method: 'post',
    data: params
  })
}

/**
 * 获取下一个流水号编号
 * @param {*} params
 */
export function getNextIdByAlias(params) {
  return request({
    url: SYSTEM_URL + '/base/v3/identity/getNextIdByAlias',
    method: 'get',
    params: params
  })
}

