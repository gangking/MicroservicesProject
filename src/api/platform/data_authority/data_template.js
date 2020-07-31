import request from '@/utils/request'
import { ORG_URL, SHARE_URL, AUTH_URL } from '@/api/baseUrl'

/**
 * 查询列表数据
 * @param {*} params
 */
export function queryPageList(data) {
  return request({
    url: AUTH_URL + '/user/v3/auth/value/query',
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
    url: AUTH_URL + '/user/v3/auth/value/remove',
    method: 'post',
    params: params
  })
}
/**
 * 获取列表单条数据
 * @param {*} params
 */
export function get(params) {
  return request({
    url: AUTH_URL + '/user/v3/auth/value/get',
    method: 'get',
    params: params
  })
}



/**
 * zz查询  下拉选择
 * @param {*} params
 */
export function businesSelect(params) {
  return request({
    url: SHARE_URL + '/qxdx/queryAucode',
    method: 'post',
    data: params
  })
}

/**
 * 权限权限对象描述和权限对象字段 查询  
 * @param {*} params
 */
export function authoritySelect(params) {
  return request({
    url: SHARE_URL + '/qxdx/queryClumByAuCode',
    method: 'get',
    params: params
  })
}




/**
 * 获取权限过滤的全部数据
 * @param {*} params
 */
export function getAuthData(params) {
  return request({
    url: SHARE_URL + '/zlymk/query',
    method: 'post',
    data: params
  })
}



/**
 * 保存数据
 * @param {*} params
 */
export function save(params) {
  return request({
    url: SHARE_URL + '/zlymk/save',
    method: 'post',
    data: params
  })
}


/**
 * 编辑权限过滤接口
 * @param {*} params
 */
export function editAuth(params) {
  return request({
    url: SHARE_URL + '/zlymk/get',
    method: 'get',
    params: params
  })
}

/**
 * 删除单个权限过滤接口
 * @param {*} params
 */
export function deletedAuth(params) {
  return request({
    url: SHARE_URL + '/zlymk/removeNew',
    method: 'get',
    params: params
  })
}
