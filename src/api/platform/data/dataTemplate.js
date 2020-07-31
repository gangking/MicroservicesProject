import request from '@/utils/request'
import ActionUtil from '@/utils/action'
import { DATA_URL, BASE_GATEWAY_API } from '@/api/baseUrl'
/**
 * 查询列表数据
 * @param {*} params
 */
export function queryPageList(data) {
  return request({
    url: DATA_URL + '/page/v3/data/template/query',
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
    url: DATA_URL + '/page/v3/data/template/remove',
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
    url: DATA_URL + '/page/v3/data/template/save/vo',
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
    url: DATA_URL + '/page/v3/data/template/get',
    method: 'get',
    params: params
  })
}

/**
 * 判断模版key是否存在
 * @param {*} params
 */
export function isKeyExists(params) {
  return request({
    url: DATA_URL + '/page/v3/data/template/isKeyExists',
    method: 'post',
    params: params
  })
}

/**
 * 获取数据
 * @param {*} params
 */
export function getByKey(params) {
  return request({
    url: DATA_URL + '/page/v3/data/template/getByKey',
    method: 'get',
    params: params
  })
}

/**
 * 通过id获取数据
 * @param {*} params
 */
export function getById(params) {
  return request({
    url: DATA_URL + '/page/v3/data/template/getById',
    method: 'get',
    params: params
  })
}

/**
 * 通过id获取数据
 * @param {*} params
 */
export function getBuildDataById(params) {
  return request({
    url: DATA_URL + '/page/v3/data/template/getBuildDataById',
    method: 'get',
    params: params
  })
}

/**
 * 导入文件
 * @param {*} file
 */
export function importTemplate(file) {
  const data = new FormData() // 创建form对象
  data.append('file', file)
  return request({
    baseURL: BASE_GATEWAY_API,
    url: DATA_URL + '/page/v3/data/template/importTemplate',
    method: 'post',
    data: data
  })
}

/**
 * 导出文件
 * @param {*} params
 */
export function exportFile(params) {
  return request({
    url: DATA_URL + '/page/v3/data/template/exportTemplate',
    method: 'post',
    responseType: 'arraybuffer',
    params: params
  })
}

/**
 * 导出数据
 * @param {*} params
 */
export function exportData(params) {
  return request({
    url: DATA_URL + '/page/v3/data/template/exportData',
    method: 'post',
    responseType: 'arraybuffer',
    params: params
  })
}

/**
 * 获取数据模版的数据
 * @param {*} params
 */
export function querySelectorData(params) {
  return request({
    url: DATA_URL + '/page/v3/data/template/SelectorData',
    method: 'post',
    data: ActionUtil.formatParams(params)
  })
}

/**
 * 获取列表数据
 * @param {*} params
 */
export function queryDataTable(params) {
  return request({
    url: DATA_URL + '/page/v3/data/template/Data',
    method: 'post',
    data: params
  })
}

/**
 * 保存表单数据
 * @param {*} params
 */
export function saveFormData(params) {
  return request({
    url: DATA_URL + '/page/v3/data/template/saveFormData/vo',
    method: 'post',
    data: params
  })
}

/**
 * 删除表单数据
 * @param {*} params
 */
export function removeFormData(params) {
  return request({
    url: DATA_URL + '/page/v3/data/template/removeFormData',
    method: 'post',
    params: params
  })
}


/**
 * 获取表单的key
 * @param {*} params
 */
export function getFormKey(params) {
  return request({
    url: DATA_URL + '/page/v3/data/template/get',
    method: 'get',
    params: params
  })
}

