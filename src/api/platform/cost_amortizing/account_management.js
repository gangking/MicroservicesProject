import request from '@/utils/request'
import { COMP_URL } from '@/api/baseUrl'

// 资产报账付款明细台账 查询
export function getAssetTable(params) {
  return request({
    url: COMP_URL + '/scene/v3/reportform/findAssetReimbursementPage',
    method: 'post',
    data: params
  })
}

// 资产信息 查询
export function getAsset(parentId) {
  return request({
    url: COMP_URL + '/scene/v3/reportform/getItemOneBYparentId?parentId=' + parentId,
    method: 'get',
  })
}

// 账务信息 查询
export function getAccount(parentId) {
  return request({
    url: COMP_URL + '/scene/v3/reportform/getItemSecBYparentId?parentId=' + parentId,
    method: 'get',
  })
}

// 资产报账付款明细台账 导出
export function downAssetExcel(params) {
  return request({
    url: COMP_URL + '/scene/v3/reportform/exportAssetReimbursement',
    method: 'post',
    responseType: 'arraybuffer',
    data: params
  })
}

// 摊销台账管理 查询
export function getTable(params) {
  return request({
    url: COMP_URL + '/scene/v3/outstandingaccount/findPageList',
    method: 'post',
    data: params
  })
}

// 摊销台账管理 导出
export function downExcel(params) {
  return request({
    url: COMP_URL + '/scene/v3/outstandingaccount/export',
    method: 'post',
    responseType: 'arraybuffer',
    data: params
  })
}

// 摊销台账明细 查询
export function getDelTable(params) {
  return request({
    url: COMP_URL + '/scene/v3/outstandingaccount/findItemPageList',
    method: 'post',
    data: params
  })
}

// 摊销台账明细 导出
export function downDelExcel(params) {
  return request({
    url: COMP_URL + '/scene/v3/outstandingaccount/exportBoAmItem',
    method: 'post',
    responseType: 'arraybuffer',
    data: params
  })
}