import request from '@/utils/request'
import { IMAGE_URL } from '@/api/baseUrl'
/**
 * 信用体系配置 查询
 * @param {*} params
 */
export function creditQuery(params) {
  return request({
    url: IMAGE_URL + '/CreditService/query',
    method: 'post',
    data: params
  })
}


/**
 * 信用体系配置 保存
 * @param {*} params
 */
export function creditSave(params) {
  return request({
    url: IMAGE_URL + '/CreditService/save',
    method: 'post',
    data: params
  })
}

/**
 * 信用体系配置 编辑
 * @param {*} params
 */
export function creditEdit(params) {
  return request({
    url: IMAGE_URL + '/CreditService/get',
    method: 'get',
    params: params
  })
}

/**
 * 信用体系配置 删除
 * @param {*} params
 */
export function creditRemove(params) {
  return request({
    url: IMAGE_URL + '/CreditService/remove',
    method: 'post',
    params: params
  })
}
