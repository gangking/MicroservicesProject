import request from '@/utils/request'
import { IMAGE_URL, DATA_URL ,COMP_URL} from '@/api/baseUrl'
/**
 * 信用 查询
 * @param {*} params
 */
export function creditQuery(params) {
  return request({
    url: IMAGE_URL + '/CreditStandService/xyFind',
    method: 'get',
    params: params
  })
}


/**
 * 信用 重置
 * @param {*} params
 */
export function creditReset(params) {
  return request({
    url: IMAGE_URL + '/CreditStandService/xycz',
    method: 'post',
    data: params
  })
}
/**
 * 信用 导出
 * @param {*} params
 */
export function downExcel(params) {
  return request({
    url: IMAGE_URL + '/CreditExcel/exportExcelXycx',
    method: 'post',
    responseType: 'arraybuffer',
    data: params
  })
}



/**
 * 根据参数查询类型
 * @param {*} params
 */
export function getTemplateData(params) {
  return request({
    url: DATA_URL + '/page/v3/data/template/queryData',
    method: 'post',
    data: params
  })

}

