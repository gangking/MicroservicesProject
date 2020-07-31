import request from '@/utils/request'
import { CODEGEN_URL } from '@/api/baseUrl'

/**
 * 查询列表数据
 * @param {*} params
 */
export function queryPageList(data) {
  return request({
    url: CODEGEN_URL + '/codegen/do/type/query',
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
    url: CODEGEN_URL + '/codegen/do/type/remove',
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
    url: CODEGEN_URL + '/codegen/do/type/save',
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
    url: CODEGEN_URL + '/codegen/do/type/get',
    method: 'get',
    params: params
  })
}
/**
 * 获取子集KEY数据
 * @param {*} params
 */
export function getDoTypeOrTemplateList(params) {
  return request({
    url: CODEGEN_URL + '/codegen/do/type/doTypeOrTemplateListJson',
    method: 'get',
    params: params
  })
}
/**
 * 获取生成类型列表json
 * @param {*} params
 */
export function doTypeListJson(params) {
  return request({
    url: CODEGEN_URL + '/codegen/do/type/doTypeListJson',
    method: 'get',
    params: params
  })
}
