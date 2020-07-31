import request from '@/utils/request'
import { CAT_URL, BASE_GATEWAY_API } from '@/api/baseUrl'

// let BUS_URL = 'http://192.168.30.12:5100/ibps'
/**
 * 删除数据
 * @param {*} params
 */
export function remove(params) {
  return request({
    url: 'http://192.168.30.12:5100/ibps/ibpsBizType/delete',
    // url: CAT_URL + '/system/v3/cat/type/remove',
    method: 'get',
    params: params
  })
}

/**
 * 保存数据
 *
 *
 * @param {*} params
 */
export function save(params) {
  return request({
    // url: FORM_URL + '/model/v3/bo/def/save/vo',
    // url: 'http://172.18.3.81:3000/mock/35/ibps/ibpsBizType/add',
    url: 'http://192.168.30.12:5100/ibps/ibpsBizType/add',
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
    url: 'http://192.168.30.12:5100/ibps/ibpsBizType/findById?',
    // url: CAT_URL + '/system/v3/cat/type/get',
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
    // url: CAT_URL + '/system/v3/cat/type/findTreeData',
    // url: 'http://172.18.3.81:3000/mock/35/ibps/ibpsBizType/findAll',
    url: 'http://192.168.30.12:5100/ibps/ibpsBizType/findAll',

    method: 'get',
    params
  })
}
