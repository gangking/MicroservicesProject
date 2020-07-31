import request from '@/utils/request'
import { IMAGE_URL, COMP_URL } from '@/api/baseUrl'
/**
 * 信用调整类型 查询
 * @param {*} params
 */
export function CreditAdjustService(params) {
  return request({
    url: IMAGE_URL + '/CreditAdjustService/query',
    method: 'post',
    data: params
  })
}


/**
 * 信用调整类型 导出
 * @param {*} params
 */
export function downExcel(params) {
  return request({
    url: IMAGE_URL + '/CreditExcel/exportExcelCreditAdjust',
    method: 'post',
    responseType: 'arraybuffer',
    data: params
  })
}


/**
 * 信用调整类型 删除
 * @param {*} params
 */
export function adjustRemove(params) {
  return request({
    url: IMAGE_URL + '/CreditAdjustService/remove',
    method: 'post',
    params: params
  })
}




/**
 * 信用调整类型 开启 关闭
 * @param {*} params
 */
export function editStatus(params) {
  return request({
    url: IMAGE_URL + '/CreditAdjustService/editStatus',
    method: 'post',
    data: params
  })
}


/**
 * 信用调整类型 保存 
 * @param {*} params
 */
export function creditSave(params) {
  return request({
    url: IMAGE_URL + '/CreditAdjustService/save',
    method: 'post',
    data: params
  })
}

/**
 * 信用体系描述 下拉选择
 * @param {*} params
 */
export function creditDescribe(params) {
  return request({
    url: IMAGE_URL + '/CreditService/findAll',
    method: 'get',
    params: params
  })
}


/**
 * 信用调整 类型下拉
 * @param {*} params
 */
export function getCreditAdjustPoList(params) {
  return request({
    url: IMAGE_URL + '/CreditAdjustService/getCreditAdjustPoListByBpmKey',
    method: 'get',
    params: params
  })
}


/**
 * 信用调整原因 查询
 * @param {*} params
 */
export function getCreditAdjustReson(params) {
  return request({
    url: IMAGE_URL + '/CreditResizeCauseService/query',
    method: 'post',
    data: params
  })
}



/**
 * 信用同意 驳回
 * @param {*} params
 */
export function creditStatus(params) {
  return request({
    url: COMP_URL + '/scene/v3/complexService/credit/complete',
    method: 'post',
    data: params
  })

}