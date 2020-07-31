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
 * 屏幕1 监控对象列表
 * @param {*} params
 */
export function monitorinList(params) {
  return request({
    url: FINANCE_URL + '/finance/getScreen1',
    method: 'post',
    data: params
  })
}

/**
 * 长期在制订单
 * @param {*} params
 */
export function getWipaufnrReport(params) {
  return request({
    url: FINANCE_URL + '/finance/getWipaufnrReport',
    method: 'post',
    data: params
  })
}


/**
 * 工序外协清单
 * @param {*} params
 */
export function getSubaufnrReport(params) {
  return request({
    url: FINANCE_URL + '/finance/getSubaufnrReport',
    method: 'post',
    data: params
  })
}

/**
 * 完工订单收货报工及时性
 * @param {*} params
 */
export function getOveraufnrReport(params) {
  return request({
    url: FINANCE_URL + '/finance/getOveraufnrReport',
    method: 'post',
    data: params
  })
}


/**
 * 投料率报表
 * @param {*} params
 */
export function getFeedaufnrReport(params) {
  return request({
    url: FINANCE_URL + '/finance/getFeedaufnrReport',
    method: 'post',
    data: params
  })
}

/**
 * 存货差异科目
 * @param {*} params
 */
export function getDifaccountReport(params) {
  return request({
    url: FINANCE_URL + '/finance/getDifaccountReport',
    method: 'post',
    data: params
  })
}


/**
 * 跨期订单报表
 * @param {*} params
 */
export function getOmaufnrReport(params) {
  return request({
    url: FINANCE_URL + '/finance/getOmaufnrReport',
    method: 'post',
    data: params
  })
}







