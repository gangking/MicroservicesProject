import request from '@/utils/request'
import { IMAGE_URL, SHARE_URL, AUTH_URL } from '@/api/baseUrl'

/**
 * 查询列表数据
 * @param {*} params
 */
export function queryPageList(params) {
  return request({
    url: IMAGE_URL + '/payment/fkjd', // 支付查询新接口
    method: 'post',
    data: params
  })
}

/**
 * 付款 导出
 * @param {*} params
 */
export function downTisExcel(params) {
  return request({
    url: IMAGE_URL + '//payment/exportExcel',
    method: 'post',
    responseType: 'arraybuffer',
    data: params
  })
}



