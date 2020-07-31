import request from '@/utils/request'
import { FORM_URL, BASE_GATEWAY_API, COMP_URL } from '@/api/baseUrl'

/**
 * 查询列表数据
 * @param {*} params
 */
export function queryPageList(params) {
  return request({
    url: FORM_URL + '/page/v3/form/def/query',
    method: 'post',
    data: params
  })
}
/**
 * 查询列表数据
 * @param {*} params
 */
export function findFormJsonByBo(params) {
  return request({
    url: FORM_URL + '/page/v3/form/def/findFormJsonByBo',
    method: 'get',
    params: params
  })
}

/**
 * 获取业务场景列表接口
 * @param {*} params
 */
export function getRelation(data) {
  const FORM_URL = 'http://172.18.3.81:3000/mock/35'// 线上模拟接口（yapi）
  const FORM_API = {
    getRelation: '/ibps/bsBasic/query',
  }
  // COMP_URL
  return request({
    // url: COMP_URL + FORM_API.getRelation,
    url: COMP_URL + '/bsBasic/query',
    method: 'get',
    params: data
  })
}

/**
 * 删除已选业务场景
 * @param {*} params
 */
export function relationRemove(data) {
  const FORM_URL = 'http://192.168.30.11:5100'// 本地接口（yapi）
  const FORM_API = {
    getRelation: '/ibps/bpmBsRel/remove',
  }
  // COMP_URL
  return request({
    url: FORM_URL + FORM_API.getRelation,
    // url: COMP_URL + '/scene/v3/bpmBsRel/remove',
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
    url: FORM_URL + '/page/v3/form/def/remove',
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
    url: FORM_URL + '/page/v3/form/def/save/vo',
    method: 'post',
    data: params
  })
}

/**
 * 复制前数据请求
 * @param {*} params
 */
export function preCopy(params) {
  return request({
    url: FORM_URL + '/page/v3/form/def/preCopy',
    method: 'post',
    params: params
  })
}

/**
 * 保存复制的数据
 * @param {*} params
 */
export function saveCopy(params) {
  return request({
    url: FORM_URL + '/page/v3/form/def/copy',
    method: 'post',
    data: params
  })
}

/**
 * 判断key是否存在
 * @param {*} params
 */
export function isFormKeyExists(params) {
  return request({
    url: FORM_URL + '/page/v3/form/def/isFormKeyExists',
    method: 'post',
    params
  })
}
/**
 * 设计表单
 * @param {*} params
 */
export function design(params) {
  return request({
    url: FORM_URL + '/page/v3/form/def/design',
    method: 'get',
    params
  })
}

/**
 * 获取数据
 * @param {*} params
 */
export function get(params) {
  return request({
    url: FORM_URL + '/page/v3/form/def/get',
    method: 'get',
    params
  })
}
/**
 * 获取表单定义数据
 * @param {*} params
 */
export function getFormDataByFormDefId(params) {
  return request({
    url: FORM_URL + '/page/v3/form/def/getFormDataByFormDefId',
    method: 'get',
    params
  })
}
/**
 * 通过formkey获取表单定义数据
 * @param {*} params
 */
export function getFormDataByFormKey(params) {
  return request({
    url: FORM_URL + '/page/v3/form/def/getFormDataByFormKey',
    method: 'get',
    params
  })
}

/**
 * 获取表单定义数据
 * @param {*} params
 */
export function getFormData(params) {
  return request({
    url: FORM_URL + '/page/v3/form/def/getFormData',
    method: 'post',
    params
  })
}

/**
 * 构建业务对象树
 * @param {*} params
 */
export function buildTree(params) {
  return request({
    url: FORM_URL + '/page/v3/form/def/buildTree',
    method: 'post',
    params
  })
}

/**
 * 导入文件
 * @param {*} file
 */
export function importForm(file) {
  const data = new FormData() // 创建form对象
  data.append('file', file)
  return request({
    baseURL: BASE_GATEWAY_API,
    url: FORM_URL + '/page/v3/form/def/importForm',
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
    url: FORM_URL + '/page/v3/form/def/exportForm',
    method: 'post',
    responseType: 'arraybuffer',
    params: params
  })
}

/**
 * 根据表单key获取表单字段的意见字段
 * @param {*} params
 */
export function findFormOptionField(params) {
  return request({
    url: FORM_URL + '/page/v3/form/def/findFormOptionField',
    method: 'get',
    params
  })
}

/**
 * 获取表单下拉
 * @param {*} params
 */
export function getFormList(params) {
  return request({
    url: FORM_URL + '/page/v3/form/def/getTableList',
    method: 'get',
    params: params
  })
}

/**
 * 获取表单
 * @param {*} params
 */
export function getFormKey(params) {
  return request({
    url: FORM_URL + '/page/v3/form/def/getMainByFormKey',
    method: 'get',
    params: params
  })
}

