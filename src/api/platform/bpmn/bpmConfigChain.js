import request from '@/utils/request'
import { COMP_URL } from '@/api/baseUrl'

// /**
//  * =获取业务配置场景文件关联表格数据
//  * @param {*} params  
//  */
// export function getTable(params) {
//   return request({
//     url: COMP_URL + '/bpm/v3/bpm/modeler/getModeler',
//     method: 'get',
//     params: params
//   })
// }
/**
 * =获取配置流程文件id 统一下拉
 * @param {*} params
 */
export function getProcessSelect(params) {
  return request({
    url: COMP_URL + '/bsConfigFile/queryList',
    method: 'post',
    data: params
  })
}
/**
 * =根据业务场景 获取业务场景配置下拉选择框
 * @param {*} params
 */
export function getBussitionSelect(params) {
  return request({
    url: COMP_URL + '/procBtnProfDef/query',
    method: 'post',
    data: params
  })
}

/**
 * 保存整个表格数据
 * @param {*} params
 */
export function saveConfig(params) {
  return request({
    url: COMP_URL + '/procProfAssign/batchInsert ',
    method: 'post',
    data: params
  })
}
