import request from '@/utils/request'
import { ORG_URL, SHARE_URL, AUTH_URL } from '@/api/baseUrl'
/**
 * 查询关联角色对象
 * @param {*} params
 */
export function getRole(params) {
  return request({
    url: ORG_URL + '/user/v3/role/queryWithSysBySysId',
    method: 'post',
    data: params
  })
}

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
 * 根据权限对象编码查询所有字段值,权限赋值
 * @param {*} params
 */
export function getPermissionSelect(params) {
  return request({
    url: SHARE_URL + '/qxdx/queryAuValue',
    method: 'get',
    params: params
  })
}

// export function getPermissionSelect(params) {
//   return request({
//     url: 'http://192.168.30.30:5100/ibps/qxdx/queryAucode',
  
//     method: 'get',
//     params: params
//   })
// }


/**
 * 保存数据
 * @param {*} params
 */
export function save(params) {
  return request({
    url: AUTH_URL + '/user/v3/auth/value/save',
    method: 'post',
    data: params
  })
}
