import request from '@/utils/request'
import { FINANCE_URL, IMAGE_URL } from '@/api/baseUrl'

/**
 * 查詢所有 公司代码BUKRS 公司的名称BUTXT
 * @param {*} params
 */
export function getButxt(data) {
  return request({
    url: FINANCE_URL + '/TboCompanyCodeService/getTboCompanyCodePos',
    method: 'get',
    params: data
  })
}

/**
 * 传公司代码 获取工厂数据
 * @param {*} params
 */
export function getFactory(params) {
  return request({
    url: FINANCE_URL + '/TboWerksService/getTboWerksPos',
    method: 'get',
    params: params
  })
}



/**
 * 完工订单及时性 发送
 * @param {*} params
 */
export function sendTimely(params) {
  return request({
    url: IMAGE_URL + '/jsxService/jsx',
    method: 'post',
    data: params
  })
}

/**
 * 工序外协 发送
 * @param {*} params
 */
export function sendOutsour(params) {
  return request({
    url: IMAGE_URL + '/takedeliveryt/find',
    method: 'post',
    data: params
  })
}
/**
 * 跨期打开 发送
 * @param {*} params
 */
export function sendOpen(params) {
  return request({
    url: IMAGE_URL + '/KqdkddcxService/kqdkddcx',
    method: 'post',
    data: params
  })
}


/**
 * 长期在制 发送
 * @param {*} params
 */
export function sendLong(params) {
  return request({
    url: IMAGE_URL + '/cqService/cq',
    method: 'post',
    data: params
  })
}



/**
 *  完工订单投料率 发送
 * @param {*} params
 */
export function sendFeeding(params) {
  return request({
    url: IMAGE_URL + '/WgddtllService/wgddtlljk',
    method: 'post',
    data: params
  })
}

/**
 *  存货差异 发送
 * @param {*} params
 */
export function sendDiff(params) {
  return request({
    url: IMAGE_URL + '/inventVariation/find',
    method: 'post',
    data: params
  })
}






/**
 * 完工订单及时性 搜索
 * @param {*} params
 */
export function searchTimely(params) {
  return request({
    url: FINANCE_URL + '/finance/overaufnr',
    method: 'post',
    data: params
  })
}

/**
 * 工序外协 搜索 
 * @param {*} params
 */
export function searchOutsour(params) {
  return request({
    url: FINANCE_URL + '/finance/subaufnr',
    method: 'post',
    data: params
  })
}
/**
 * 跨期打开 搜索 
 * @param {*} params
 */
export function searchOpen(params) {
  return request({
    url: FINANCE_URL + '/finance/omaufnr',
    method: 'post',
    data: params
  })
}

/**
 * 长期在制 搜索 
 * @param {*} params
 */
export function searchLong(params) {
  return request({
    url: FINANCE_URL + '/finance/wipaufnr',
    method: 'post',
    data: params
  })
}

/**
 * 完工订单投料率 搜索 
 * @param {*} params
 */
export function searchFeeding(params) {
  return request({
    url: FINANCE_URL + '/finance/feedaufnr',
    method: 'post',
    data: params
  })
}

/**
 * 存货差异 搜索 
 * @param {*} params
 */
export function searchDiff(params) {
  return request({
    url: FINANCE_URL + '/finance/difaccount',
    method: 'post',
    data: params
  })
}


