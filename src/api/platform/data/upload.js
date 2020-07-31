import request from '@/utils/request'
import { DATA_URL, BASE_URL, COMP_URL, IMAGE_URL } from '@/api/baseUrl'

/**
 * 上传数据
 * @param {*} params
 */
// export function queryPageList(data) {
//   return request({
//     url: DATA_URL + /page/v3/data/template/upload',
//     method: 'post',
//     data: data
//   })
// }
/**
 * 上传选择字段列表
 * @param {*} params
 */
export function fieldSelect(params) {
  return request({
    url: BASE_URL + DATA_URL + '/page/v3/form/data/template/saveUpload',
    method: 'post',
    data: params
  })
}
/**
 * 下载
 * @param {*} params
 */
export function downSelect(params) {
  return request({
    url: '/scene/v3/complexService/downloadDataExcelNew',
    method: 'post',
    responseType: 'arraybuffer',
    data: params
  })
}

/**
 * 模板下载
 * @param {*} params
 */
export function templateDown(params) {
  return request({
    url: COMP_URL + '/scene/v3/complexService/downloadDataExcelNew',
    method: 'post',
    responseType: 'arraybuffer',
    data: params
  })
}

/**
 * 上传选择字段列表
 * @param {*} params
 */
export function cardCreation(params) {
  return request({
    url: IMAGE_URL + '/AssetcreateService/cardCreation',
    method: 'post',
    data: params
  })
}