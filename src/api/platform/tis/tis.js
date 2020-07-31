import request from '@/utils/request'
import { IMAGE_URL, SHARE_URL, AUTH_URL } from '@/api/baseUrl'

/**
 * 查询列表数据
 * @param {*} params
 */
export function queryPageList(data) {
  return request({
    url: SHARE_URL + '/payment/query',
    method: 'post',
    data: data
  })
}

/**
 * 根据公司代码，获取付款账户
 * @param {*} params
 */
export function paymentSelect(params) {
  return request({
    url: IMAGE_URL + '/PayParameters/getZfkzhByBukrs',
    method: 'get',
    params: params
  })
}


/**
 * 作废指令
 * @param {*} params
 */
export function toVoid(params) {
  return request({
    url: SHARE_URL + '/payment/cancellation',
    method: 'get',
    params: params
  })
}

/**
 * 发送tis  
 * @param {*} params
 */
export function sendingTis(params) {
  return request({
    url: IMAGE_URL + '/fk/syPay',
    method: 'post',
    data: params
  })
}

/**
 * 支付方式
 * @param {*} params
 */
export function paymentMode(params) {
  return request({
    url: SHARE_URL + '/payment/zlsch',
    method: 'get',
    params: params
  })
}


/**
 * 保存数据
 * @param {*} params
 */
export function save(params) {
  return request({
    // url: IMAGE_URL + '/payment/save',
    url: IMAGE_URL + '/payment/saveList',
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













/**
 * 获取权限过滤的全部数据
 * @param {*} params
 */
export function getAuthData(params) {
  return request({
    url: SHARE_URL + '/zlymk/query',
    method: 'post',
    data: params
  })
}






/**
 * 编辑权限过滤接口
 * @param {*} params
 */
export function editAuth(params) {
  return request({
    url: SHARE_URL + '/zlymk/get',
    method: 'get',
    params: params
  })
}

/**
 * 删除单个权限过滤接口
 * @param {*} params
 */
export function deletedAuth(params) {
  return request({
    url: SHARE_URL + '/zlymk/removeNew',
    method: 'get',
    params: params
  })
}


/**
 * 删除数据
 * @param {*} params
 */
export function remove(params) {
  return request({
    url: AUTH_URL + '/user/v3/auth/value/remove',
    method: 'post',
    params: params
  })
}
/**
 * 获取列表单条数据
 * @param {*} params
 */
export function get(params) {
  return request({
    url: AUTH_URL + '/user/v3/auth/value/get',
    method: 'get',
    params: params
  })
}



/**
 * 获取付款方式
 * @param {*} params
 */
export function getZfkfs(params) {
  return request({
    url: IMAGE_URL + '/PayParameters/getZlschs',
    method: 'post',
    data: params
  })
}

/**
 * 获取业务范围
 * @param {*} params
 */
export function getGsber(params) {
  return request({
    url: IMAGE_URL + '/PayParameters/getYewuFanWeis',
    method: 'get',
    params: params
  })
}

/**
 * 获取特别总账标识
 * @param {*} params
 */
export function getUmskz(params) {
  return request({
    url: IMAGE_URL + '/PayParameters/getBoTranSactionTypes',
    method: 'get',
    params: params
  })
}


/**
 * 获取收款银行账号
 * @param {*} params
 */
export function getZbanknSk(params) {
  return request({
    url: IMAGE_URL + '/PayParameters/getZyhzhs',
    method: 'post',
    data: params
  })
}


/**
 * 获取收款银行账号
 * @param {*} params
 */
export function verifyTisItemList(params) {
  return request({
    url: IMAGE_URL + '/tisTtemCompensation/verifyTisItemList',
    method: 'get',
    params: params
  })
}
