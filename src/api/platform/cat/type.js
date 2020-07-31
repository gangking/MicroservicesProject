import request from '@/utils/request'
import { CAT_URL, BASE_GATEWAY_API } from '@/api/baseUrl'

/**
 * 删除数据
 * @param {*} params
 */
export function remove(params) {
  return request({
    url: CAT_URL + '/system/v3/cat/type/remove',
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
    url: CAT_URL + '/system/v3/cat/type/save',
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
    url: CAT_URL + '/system/v3/cat/type/get',
    method: 'get',
    params
  })
}

/**
 * 导出
 * @param {*} params
 */
export function exportXml(params) {
  return request({
    url: CAT_URL + '/system/v3/cat/type/exportXml',
    method: 'get',
    responseType: 'arraybuffer',
    params: params
  })
}

/**
 * 导入
 * @param {*} params
 */
export function importXml(file, typeId, cover) {
  const data = new FormData() // 创建form对象
  data.append('file', file)
  data.append('typeId', typeId)
  if (cover) data.append(cover)
  return request({
    baseURL: BASE_GATEWAY_API,
    url: CAT_URL + '/system/v3/cat/type/importXml',
    method: 'post',
    data: data
  })
}

/**
 * 查找子节点
 * @param {*} params
 */
export function sortList(params) {
  return request({
    url: CAT_URL + '/system/v3/cat/type/findByParentId',
    method: 'get',
    params
  })
}

/**
 * 保存数据
 * @param {*} params
 */
export function sortSave(params) {
  return request({
    url: CAT_URL + '/system/v3/cat/type/sort',
    method: 'post',
    params: params
  })
}

/**
 * 根据分类组键获取分类信息
 * @param {*} params
 */
export function findTreeData(params) {
  return request({
    url: CAT_URL + '/system/v3/cat/type/findTreeData',
    method: 'get',
    params
  })
}
