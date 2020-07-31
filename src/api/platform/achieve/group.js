import request from '@/utils/request'
import { IMAGE_URL } from '@/api/baseUrl'


/**
 * 本月处理单据量排行
 * @param {*} params
 */
export function getGroupCldjlPh(params) {
  return request({
    url: IMAGE_URL + '/OperationalIndicatorsService/getGroupCldjlPh',
    method: 'post',
    data: params
  })
}

/**
 * 本月新增单据量/XX组 本月已处理单据量
 * @param {*} params
 */
export function getGroupXzYclDjl(params) {
  return request({
    url: IMAGE_URL + '/OperationalIndicatorsService/getGroupXzYclDjl',
    method: 'post',
    data: params
  })
}

/**
 * 月单据处理时效
 * @param {*} params
 */
export function getMonthDjclsx(params) {
  return request({
    url: IMAGE_URL + '/OperationalIndicatorsService/getMonthDjclsx',
    method: 'post',
    data: params
  })
}



/**
 * 今日处理单据量排行/ 组今日处理单据量
 * @param {*} params
 */
export function getDaycldjlph(params) {
  return request({
    url: IMAGE_URL + '/OperationalIndicatorsService/getDaycldjlph',
    method: 'post',
    data: params
  })
}




/**
 * 本日和   30日新增单据量
 * @param {*} params
 */
export function getPastThirty(params) {
  return request({
    url: IMAGE_URL + '/OperationalIndicatorsService/getPastThirty',
    method: 'post',
    data: params
  })
}


/**
 * 获取组的名字
 * @param {*} params
 */
export function getGroupName(params) {
  return request({
    url: IMAGE_URL + '/OperationalIndicatorsService/getGroupName',
    method: 'get',
    params: params
  })
}
