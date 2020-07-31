import request from '@/utils/request'
import { IMAGE_URL, INFO_URL } from '@/api/baseUrl'

/**
 * 单据满意度
 * @param {*} params
 */
export function docQuery(params) {
  return request({
    url: IMAGE_URL + '/DocumentSatisfaction/query',
    method: 'post',
    data: params
  })
}
/**
 * 单据评分保存
 * @param {*} params
 */
export function docSave(params) {
  return request({
    url: IMAGE_URL + '/DocumentSatisfaction/save',
    method: 'post',
    data: params
  })
}

/**
 * 单据 编辑查看
 * @param {*} params
 */
export function docLook(params) {
  return request({
    url: IMAGE_URL + '/DocumentSatisfaction/get',
    method: 'get',
    params: params
  })
}