import request from '@/utils/request'
import { CODEGEN_URL } from '@/api/baseUrl'

/**
 * 查询列表数据
 * @param {*} params
 */
export function queryPageList(data) {
  return request({
    url: CODEGEN_URL + '/codegen/template/query',
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
    url: CODEGEN_URL + '/codegen/template/remove',
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
    url: CODEGEN_URL + '/codegen/template/save',
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
    url: CODEGEN_URL + '/codegen/template/get',
    method: 'get',
    params: params
  })
}

/**
 * 重置列表
 * @param {*} params
 */
export function init(params) {
  return request({
    url: CODEGEN_URL + '/codegen/template/init',
    method: 'post',
    params: params
  })
}

/**
 * 设置分类
 * @param {*} params
 */
export function setCategory(params) {
  return request({
    url: CODEGEN_URL + '/codegen/template/setCategory',
    method: 'post',
    params
  })
}

