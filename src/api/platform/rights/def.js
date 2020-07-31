import request from '@/utils/request'
import { PLATFORM_URL } from '@/api/baseUrl'

/**
 * 通过key获取权限类型
 * @param {*} params
 */
export function findRightsTypeByKey(params) {
  return request({
    url: PLATFORM_URL + '/user/v3/rights/def/findRightsTypeByKey',
    method: 'get',
    params
  })
}

/**
 * 根据类型和id获取权限配置数据
 * @param {*} params
 */
export function findByTypeId(params) {
  return request({
    url: PLATFORM_URL + '/user/v3/rights/def/findByTypeId',
    method: 'get',
    params
  })
}

/**
 * 保存数据
 * @param {*} params
 */
export function save(params) {
  return request({
    url: PLATFORM_URL + '/user/v3/rights/def/save/vo',
    method: 'post',
    data: params
  })
}
