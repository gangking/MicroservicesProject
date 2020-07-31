import request from '@/utils/request'
import { FINANCE_URL } from '@/api/baseUrl'

/**
 * 上传 
 * @param {*} params
 */
export function uploadContract(data, type) {
  return request({
    url: FINANCE_URL + '/TboCmmdHeadService/uploadContract' + type,
    method: 'post',
    params: data
  })
}

/**
 * 下载
 * @param {*} params
 */
export function exportContract(type) {
  return request({
    url: FINANCE_URL + '/TboCmmdHeadExportService/exportContract' + type,
    method: 'get',
    responseType: 'arraybuffer',
  })
}
