import request from '@/utils/request'
import { ORG_URL, OAUTH2_URL } from '@/api/baseUrl'

/**
 *修改密码
 * @param {*} params
 */
export function changePassword(params) {
  return request({
    url: ORG_URL + '/user/v3/user/change/passwd',
    method: 'post',
    data: params
  })
}

/**
 * 查询列表数据[用于用户选择器使用]
 * @param {*} params
 */
export function query(type, params) {
  var url = '/user/v3/employee/query'
  if (type === 'org') {
    url = '/user/v3/user/query4Org'
  } else if (type === 'position') {
    url = '/user/v3/user/query4Position'
  } else if (type === 'role') {
    url = '/user/v3/user/query4Role'
  } else if (type === 'group') {
    url = '/user/v3/user/query4Group'
  }
  return request({
    url: ORG_URL + url,
    method: 'post',
    data: params
  })
}

/**
 * 获取用户信息
 * @param {*} params
 */
export function get(params) {
  return request({
    url: ORG_URL + '/user/v3/user/get',
    method: 'get',
    params: params
  })
}

/**
 * 通过账号获取用户信息
 * @param {*} params
 */
export function getByAccount(params) {
  return request({
    url: ORG_URL + '/user/v3/user/getByAccount',
    method: 'get',
    params: params
  })
}

/**
 *修改密码(注册用户认证服务)
 * @param {*} params
 */
export function registerChangePassword(params) {
  return request({
    url: OAUTH2_URL + '/user/v3/user/register/change/passwd',
    method: 'post',
    data: params
  })
}

