import request from '@/utils/request'
import { COMP_URL } from '@/api/baseUrl'

// 个人资产卡明细台账 查询 
export function getTable(params) {
  return request({
    url: COMP_URL + '/scene/v3/reportform/queryCapital',
    method: 'post',
    data: params
  })
}

// 个人资产卡明细台账 导出
export function downExcel(params) {
  return request({
    url: COMP_URL + '/scene/v3/reportform/exportCapital',
    method: 'post',
    responseType: 'arraybuffer',
    data: params
  })
}

// 合同台账报表 查询 
export function getConTable(params) {
  return request({
    url: COMP_URL + '/scene/v3/reportform/queryContractAccount',
    method: 'post',
    data: params
  })
}

// 合同台账报表 导出
export function downConExcel(params) {
  return request({
    url: COMP_URL + '/scene/v3/reportform/exportContractAccount',
    method: 'post',
    responseType: 'arraybuffer',
    data: params
  })
}
