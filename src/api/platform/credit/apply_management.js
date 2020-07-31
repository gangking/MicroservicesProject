import request from '@/utils/request'
import { IMAGE_URL } from '@/api/baseUrl'
/**
 * 信用应用管理 查询
 * @param {*} params
 */
export function creditQuery(params) {
  return request({
    url: IMAGE_URL + '/CreditBpmService/referBpm',
    method: 'post',
    data: params
  })
}
/**
 * 信用应用管理 保存
 * @param {*} params
 */
export function CreditBpmSave(params) {
  return request({
    url: IMAGE_URL + '/CreditBpmService/save',
    method: 'post',
    data: params
  })
}

/**
 * 信用应用管理 批量保存
 * @param {*} params
 */
export function CreditBpmService(params) {
  return request({
    url: IMAGE_URL + '/CreditBpmService/saveList',
    method: 'post',
    data: params
  })
}



/**
 * 信用应用管理 关闭 开启
 * @param {*} params
 */
export function editStatus(params) {
  return request({
    url: IMAGE_URL + '/CreditBpmService/editStatus',
    method: 'post',
    data: params
  })
}

/**
 * 信用体系查询 全部 下拉框
 * @param {*} params
 */
export function CreditService(params) {
  return request({
    url: IMAGE_URL + '/CreditService/findAll',
    method: 'get',
    params: params
  })
}
