import request from '@/utils/request'
import { FINANCE_URL } from '@/api/baseUrl'



/**
 * 完工订单及时性 导出
 * @param {*} params
 */
export function downTimely(params) {
  return request({
    url: FINANCE_URL + '/finance/downloadoveraufnr',
    method: 'post',
    responseType: 'arraybuffer',
    data: params
  })
}

/**
 * 工序外协 导出 
 * @param {*} params
 */
export function downOutsour(params) {
  return request({
    url: FINANCE_URL + '/finance/downloadsubaufnr',
    method: 'post',
    responseType: 'arraybuffer',
    data: params
  })
}
/**
 * 跨期打开 导出 
 * @param {*} params
 */
export function downOpen(params) {
  return request({
    url: FINANCE_URL + '/finance/downloadomaufnr',
    method: 'post',
    responseType: 'arraybuffer',
    data: params
  })
}

/**
 * 长期在制 导出 
 * @param {*} params
 */
export function downLong(params) {
  return request({
    url: FINANCE_URL + '/finance/downloadwipaufnr',
    method: 'post',
    responseType: 'arraybuffer',
    data: params
  })
}

/**
 * 完工订单投料率 导出 
 * @param {*} params
 */
export function downFeeding(params) {
  return request({
    url: FINANCE_URL + '/finance/feedaufnrupdate',
    method: 'post',
    responseType: 'arraybuffer',
    data: params
  })
}

/**
 * 存货差异 导出 
 * @param {*} params
 */
export function downDiff(params) {
  return request({
    url: FINANCE_URL + '/finance/ifaccountupdate',
    method: 'post',
    responseType: 'arraybuffer',
    data: params
  })
}





/**
 * 完工订单及时性 保存
 * @param {*} params
 */
export function saveTimely(params) {
  return request({
    url: FINANCE_URL + '/finance/overaufnrupdate',
    method: 'post',

    data: params
  })
}

/**
 * 工序外协 保存 
 * @param {*} params
 */
export function saveOutsour(params) {
  return request({
    url: FINANCE_URL + '/finance/subaufnrupdate',
    method: 'post',

    data: params
  })
}
/**
 * 跨期打开 保存 
 * @param {*} params
 */
export function saveOpen(params) {
  return request({
    url: FINANCE_URL + '/finance/omaufnrupdate',
    method: 'post',

    data: params
  })
}

/**
 * 长期在制 保存 
 * @param {*} params
 */
export function saveLong(params) {
  return request({
    url: FINANCE_URL + '/finance/wipaufnrupdate',
    method: 'post',

    data: params
  })
}

/**
 * 完工订单投料率 保存 
 * @param {*} params
 */
export function saveFeeding(params) {
  return request({
    url: FINANCE_URL + '/finance/feedaufnrupdate',
    method: 'post',

    data: params
  })
}

/**
 * 存货差异 保存 
 * @param {*} params
 */
export function saveDiff(params) {
  return request({
    url: FINANCE_URL + '/finance/difaccountupdate',
    method: 'post',

    data: params
  })
}