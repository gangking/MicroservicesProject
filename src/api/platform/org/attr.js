import request from '@/utils/request'
import { ORG_URL } from '@/api/baseUrl'
/**
 * 查询列表数据
 * @param {*} params
 */
export function queryPageList(params) {
  return request({
    url: ORG_URL + 'user/v3/attr/query',
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
    url: ORG_URL + 'user/v3/attr/remove',
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
    url: ORG_URL + 'user/v3/attr/save',
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
    url: ORG_URL + 'user/v3/attr/get',
    method: 'get',
    params
  })
}
/**
 * 获取数据(包含选项数据)
 * @param {*} params
 */
export function load(params) {
  return request({
    url: ORG_URL + 'user/v3/attr/load',
    method: 'get',
    params
  })
}

/**
 * 查询扩展属性
 * @param {*} params
 */
export function findByTypeAndPartyType(params) {
  return request({
    url: ORG_URL + 'user/v3/attr/findByTypeAndPartyType',
    method: 'get',
    params
  })
}

/**
 * 根据用户ID查询扩展属性(编辑页面)
 * @param {*} params
 */
export function findByPartyTypeUserId4Edit(params) {
  return request({
    url: ORG_URL + '/user/v3/attr/findByPartyTypeUserId4Edit',
    method: 'get',
    params
  })
}

/**
 * 获取参与者属性选项
 * @param {*} params
 */
export function findByAttrId(params) {
  return request({
    url: ORG_URL + 'user/v3/attr/opt/findByAttrId',
    method: 'get',
    params
  })
}
