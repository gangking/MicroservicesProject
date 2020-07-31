import request from '@/utils/request'
import { FORM_URL, SHARE_URL } from '@/api/baseUrl'



/**
 * 查询列表数据
 * @param {*} params
 */
export function queryPageList(data) {
  return request({
    url: SHARE_URL + '/qxdx/query',
    method: 'post',
    data: data
  })
}
/**
 * 根据主键ID修改状态
 * @param {*} params
 */
export function changeStatus(params) {
  return request({
    url: SHARE_URL + '/qxdx/modificationStatusById',
    method: 'get',
    params: params
  })
}

/**
 * 删除数据
 * @param {*} params
 */
export function remove(params) {
  return request({
    url: SHARE_URL + '/qxdx/remove',
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
    url: SHARE_URL + '/qxdx/get',
    method: 'get',
    params: params
  })
}



/**
 * 业务对象查询  下拉选择
 * @param {*} params
 */
export function businesSelect(params) {
  return request({
    url: FORM_URL + '/page/v3/data/dataset/tableOrViewList',
    method: 'post',
    data: params
  })
}

/**
 * 权限业务对象查询  下拉选择
 * @param {*} params
 */
export function authoritySelect(params) {
  return request({
    url: SHARE_URL + '/qxdx/getTable',
    method: 'get',
    params: params
  })
}

/**
 * 保存数据
 * @param {*} params
 */
export function save(params) {
  return request({
    url: SHARE_URL + '/qxdx/save',
    method: 'post',
    data: params
  })
}
/**
* 检查 权限对象编码唯一性
* @param {*} params
*/
export function checkAucode(params) {
  return request({
    url: SHARE_URL + '/qxdx/judgeAuCode',
    method: 'get',
    params: params
  })
}