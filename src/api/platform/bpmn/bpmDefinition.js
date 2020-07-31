import request from '@/utils/request'
import { BPMN_URL, BASE_URL, BASE_GATEWAY_API, COMP_URL } from '@/api/baseUrl'
import qs from 'qs'

/**
 * 查询列表数据
 * @param {*} params
 */
export function queryPageList(params) {
  return request({
    url: BPMN_URL + '/bpm/v3/bpm/definition/query',
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
    url: BPMN_URL + '/bpm/v3/bpm/definition/remove',
    method: 'post',
    params: params
  })
}

/**
 * 获取数据
 * @param {*} params
 */
export function get(params) {
  return request({
    url: BPMN_URL + '/bpm/v3/bpm/definition/get',
    method: 'get',
    params: params
  })
}
/**
 * 通过流程定义Key获取数据
 * @param {*} params
 */
export function getByDefKey(params) {
  return request({
    url: BPMN_URL + '/bpm/v3/bpm/definition/getByDefKey',
    method: 'get',
    params: params
  })
}

/**
 * 通过流程定义Key获取数据
 * @param {*} params
 */
export function checkExist(params) {
  return request({
    url: BPMN_URL + '/bpm/v3/bpm/definition/checkExist',
    method: 'get',
    params: params
  })
}

/**
 * 发布流程定义
 * @param {*} params
 */
export function deploy(params) {
  return request({
    url: BPMN_URL + '/bpm/v3/bpm/definition/deploy',
    method: 'post',
    params: params
  })
}

/**
 * 清除流程定义
 * @param {*} params
 */
export function cleanData(params) {
  return request({
    url: BPMN_URL + '/bpm/v3/bpm/definition/cleanData',
    method: 'post',
    params: params
  })
}

/**
 * 获取流程变量树
 * @param {*} params
 */
export function getTreeData(params) {
  return request({
    url: BPMN_URL + '/bpm/v3/bpm/definition/buildFormVars',
    method: 'get',
    params: params
  })
}

/**
 * 导入文件
 * @param {*} file
 */
export function importBpm(file) {
  const data = new FormData() // 创建form对象
  data.append('multipartFile', file)
  return request({
    baseURL: BASE_GATEWAY_API,
    url: BPMN_URL + '/bpm/v3/bpm/definition/importBpm',
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
    url: BPMN_URL + '/bpm/v3/bpm/definition/export',
    method: 'post',
    responseType: 'arraybuffer',
    params: params
  })
}
/**
 * 获取设置的数据
 * @param {*} params
 */
export function setting(params) {
  return request({
    url: BPMN_URL + '/bpm/v3/bpm/definition/setting',
    method: 'get',
    params: params
  })
}

/**
 * 保存设置的数据
 * @param {*} params
 */
export function saveSetting(data) {
  return request({
    url: BPMN_URL + '/bpm/v3/bpm/definition/saveSetting/vo',
    method: 'post',
    data: data
  })
}

/**
 * 保存设置的流程表单业务场景的数据
 * @param {*} params
 */
export function saveRelation(data) {
  const BPMN_URL = 'http://172.18.3.81:3000/mock/35'// 线上模拟接口（yapi）
  const FORM_API = {
    saveRelation: '/ibps/bpmBsRel/save',
  }
  // COMP_URL
  return request({
    // url: COMP_URL + FORM_API.saveRelation,
    url: COMP_URL + '/scene/v3/bpmBsRel/save',
    method: 'post',
    data: data
  })
}

/**
 * 获取已选业务场景
 * @param {*} params
 */
export function getActiveRelation(data) {
  const BPMN_URL = 'http://172.18.3.81:3000/mock/35'// 线上模拟接口（yapi）
  const FORM_API = {
    getActiveRelation: '/ibps/bpmBsRel/query',
  }
  // COMP_URL
  return request({
    // url: COMP_URL + FORM_API.getActiveRelation,
    url: COMP_URL + '/scene/v3/bpmBsRel/query',
    method: 'get',
    params: data
  })
}


/**
 * 设置分类
 * @param {*} params
 */
export function setCategory(params) {
  return request({
    url: BPMN_URL + '/bpm/v3/bpm/definition/setCategory',
    method: 'post',
    params
  })
}

/**
 * 批量挂起
 * @param {*} params
 */
export function batchSuspend(params) {
  return request({
    url: BPMN_URL + '/bpm/v3/bpm/definition/batchSuspend',
    method: 'post',
    params
  })
}

/**
 * 批量恢复
 * @param {*} params
 */
export function batchRecover(params) {
  return request({
    url: BPMN_URL + '/bpm/v3/bpm/definition/batchRecover',
    method: 'post',
    params
  })
}

/**
 * 复制【流程定义】信息
 * @param {*} params
 */
export function copy(params) {
  return request({
    url: BPMN_URL + '/bpm/v3/bpm/definition/copy',
    method: 'post',
    params
  })
}
/**
 * 节点下的按钮初始化
 * @param {*} params
 */
export function initButton(params) {
  return request({
    url: BPMN_URL + '/bpm/v3/bpm/definition/initButton',
    method: 'get',
    params
  })
}
/**
 * 节点下的按钮
 * @param {*} params
 */
export function getButton(params) {
  return request({
    url: BPMN_URL + '/bpm/v3/bpm/definition/editButton',
    method: 'get',
    params
  })
}
/**
 * 获取xml
 * @param {*} params
 */
export function getXml(params) {
  return BASE_URL + BPMN_URL + '/bpm/v3/bpm/definition/bpmnXml?' + qs.stringify(params)
}

