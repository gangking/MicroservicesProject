import request from '@/utils/request'
import { IMAGE_URL } from '@/api/baseUrl'



/**
 * 处理单据排行榜
 * @param {*} params
 */
export function getRanking(params) {
  return request({
    url: IMAGE_URL + '/OperationalIndicatorsService/getRanking',
    method: 'post',
    data: params
  })
}





/**
 * 本月逾期处理单据量
 * @param {*} params
 */
export function getMonthlyQuantity(params) {
  return request({
    url: IMAGE_URL + '/OperationalIndicatorsService/getMonthlyQuantity',
    method: 'post',
    data: params
  })
}

/**
 * 日处理单据 日平均处理单据量  日最高处理单据量
 * @param {*} params
 */
export function getAvgMaxDjl(params) {
  return request({
    url: IMAGE_URL + '/OperationalIndicatorsService/getAvgMaxDjl',
    method: 'post',
    data: params
  })
}

/**
 *  本月处理单据量   上月处理单据量   本月处理单据量比率
 * @param {*} params
 */
export function getMonthAndtre(params) {
  return request({
    url: IMAGE_URL + '/OperationalIndicatorsService/getMonthAndtre',
    method: 'post',
    data: params
  })
}

/**
 *  //本月新增单据量 /上月新增单据量/本月新增单据量比率
 * @param {*} params
 */
export function getByxzsyxz(params) {
  return request({
    url: IMAGE_URL + '/OperationalIndicatorsService/getByxzsyxz	',
    method: 'post',
    data: params
  })
}

/**
 * 加签单据量  加签单据最高时长/  加签单据最低时长/ 加签单据平均时长
 * @param {*} params
 */
export function getCountersign(params) {
  return request({
    url: IMAGE_URL + '/OperationalIndicatorsService/getCountersign',
    method: 'post',
    data: params
  })
}

/**
 * 本日和   30日新增单据量
 * @param {*} params
 */
export function getPastThirty	(params) {
  return request({
    url: IMAGE_URL + '/OperationalIndicatorsService/getPastThirty',
    method: 'post',
    data: params
  })
}


/**
 *本日和   30日逾期单据量
 * @param {*} params
 */
export function getPastThirtyOverdue(params) {
  return request({
    url: IMAGE_URL + '/OperationalIndicatorsService/getPastThirtyOverdue',
    method: 'post',
    data: params
  })
}


/**
 * 每单处理时长
 * @param {*} params
 */
export function getIndividualProcessingTime(params) {
  return request({
    url: IMAGE_URL + '/OperationalIndicatorsService/getIndividualProcessingTime',
    method: 'post',
    data: params
  })
}


/**
 * 逾期处理量占比   累计已处理单据量
 * @param {*} params
 */
export function getYqycldhlzb(params) {
  return request({
    url: IMAGE_URL + '/OperationalIndicatorsService/getYqycldhlzb',
    method: 'post',
    data: params
  })
}


/**
 * 待处理单据量
 * @param {*} params
 */
export function getSddcldjlfb(params) {
  return request({
    url: IMAGE_URL + '/OperationalIndicatorsService/getSddcldjlfb ',
    method: 'post',
    data: params
  })
}
/**
 * //超时待处理单据量 4H-8H-24H-48H-48以上 人
 * @param {*} params
 */
export function getOverNormal(params) {
  return request({
    url: IMAGE_URL + '/OperationalIndicatorsService/getOverNormal',
    method: 'post',
    data: params
  })
}


/**
 * //超时待处理单据量 4H-8H-24H-48H-48以上 组
 * @param {*} params
 */
export function getOverNormalGroup(params) {
  return request({
    url: IMAGE_URL + '/OperationalIndicatorsService/getOverNormalGroup',
    method: 'post',
    data: params
  })
}


/**
 * 人组，成员超时处理单据量   柱状图
 * @param {*} params
 */
export function getZztJk(params) {
  return request({
    url: IMAGE_URL + '/OperationalIndicatorsService/getZztJk',
    method: 'post',
    data: params
  })
}
