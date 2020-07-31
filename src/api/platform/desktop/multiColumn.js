import request from '@/utils/request'
import { SYSTEM_URL } from '@/api/baseUrl'

/**
 * 查询列表数据
 * @param {*} params
 */
export function queryPageList(data) {
  return request({
    url: SYSTEM_URL + '/base/v3/desktop/columnNew/query',
    method: 'post',
    data: data
  })
  // return request({
  //   url: 'http://192.168.30.21:5100/ibps/desktop/columnNew/query',
  //   method: 'post',
  //   data: data
  // })
}
/**
 * 删除数据
 * @param {*} params
 */
export function remove(params) {
  return request({
    url: SYSTEM_URL + '/base/v3/desktop/columnNew/remove',
    method: 'post',
    params: params
  })
  // return request({
  //   url: 'http://192.168.30.21:5100/ibps/desktop/columnNew/remove',
  //   method: 'post',
  //   params: params
  // })
}
/**
 * 保存数据
 * @param {*} params
 */
export function save(params) {
  return request({
    url: SYSTEM_URL + '/base/v3/desktop/columnNew/save',
    method: 'post',
    data: params
  })
  // return request({
  //   url: 'http://192.168.30.21:5100/ibps/desktop/columnNew/save',
  //   method: 'post',
  //   data: params
  // })
}

/**
 * 获取数据
 * @param {*} params
 */
export function get(params) {
  return request({
    url: SYSTEM_URL + '/base/v3/desktop/columnNew/get',
    method: 'get',
    params: params
  })
  // return request({
  //   url: 'http://192.168.30.21:5100/ibps/desktop/columnNew/get',
  //   method: 'get',
  //   params: params
  // })
}

/**
 * 初始化模版
 * @param {*} params
 */
export function initTemplate() {
  return request({
    url: SYSTEM_URL + '/base/v3/desktop/columnNew/initTemplate',
    method: 'post'
  })
}

/**
 * 设置 桌面栏目 启用/禁用
 * @param {*} params
 */
export function setEnable(params) {
  return request({
    url: SYSTEM_URL + '/base/v3/desktop/columnNew/setEnable',
    method: 'post',
    params: params
  })
  // return request({
  //   url: 'http://192.168.30.21:5100/ibps/desktop/columnNew/setEnable',
  //   method: 'post',
  //   params: params
  // })

}

/**
 * 获得有权限的桌面栏目
 */
export function findHashRightsColumn(params) {
  return request({
    url: SYSTEM_URL + '/base/v3/desktop/columnNew/findHashRightsColumn',
    method: 'get',
    params: params
  })
}

/**
 * 获取每个栏目的数据
 * @param {*} params 参数
 * <p>
 *    alias 栏目别名
 *    params 参数 包含分页或者其他固定参数
 * </p>
 */
export function getData({ alias, dataMode, dataFrom }, params) {

}
