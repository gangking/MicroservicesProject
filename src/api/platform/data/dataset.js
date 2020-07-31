import request from '@/utils/request'
import { DATA_URL, IMAGE_URL } from '@/api/baseUrl'

/**
 * 查询列表数据
 * @param {*} params
 */
export function queryPageList(data) {
  return request({
    url: DATA_URL + '/page/v3/data/dataset/query',
    method: 'post',
    data: data
  })
}
/**
 * 删除数据
 * @param {*} params
 */
export function remove(params) {
  return request({
    url: DATA_URL + '/page/v3/data/dataset/remove',
    method: 'post',
    params: params
  })
}
/**
 * 保存数据
 * @param {*} params
 */
export function save(params) {
  return request({
    url: DATA_URL + '/page/v3/data/dataset/save',
    method: 'post',
    data: params
  })
}

/**
 * 获取数据
 * @param {*} params
 */
export function get(params) {
  return request({
    url: DATA_URL + '/page/v3/data/dataset/get',
    method: 'get',
    params: params
  })
}

/**
 * 获取数据
 * @param {*} params
 */
export function getByKey(params) {
  return request({
    url: DATA_URL + '/page/v3/data/dataset/getByKey',
    method: 'get',
    params: params
  })
}

/**
 * 动态获取form数据
 * @param {*} params
 */
export function getTableOrViewList(params) {
  return request({
    url: DATA_URL + '/page/v3/data/dataset/tableOrViewList',
    method: 'post',
    data: params
  })
}
/**
 * 设置分类
 * @param {*} params
 */
export function setCategory(params) {
  return request({
    url: DATA_URL + '/page/v3/data/dataset/setCategory',
    method: 'post',
    params
  })
}

/**
 * 数据源查询
 * @param {*} params
 */
export function queryDataSource(params) {
  return request({
    url: DATA_URL + '/page/v3/data/dataset/query/dataSource',
    method: 'get',
    params: params
  })
}

/**
 *
获取数据集树结构
 * @param {*} params
 */
export function getDatasetTree(params) {
  return request({
    url: DATA_URL + '/page/v3/data/dataset/getDatasetTree',
    method: 'get',
    params: params
  })
}

/**
 *
根据数据集key构建树
 * @param {*} params
 */
export function buildTree(params) {
  return request({
    url: DATA_URL + '/page/v3/data/dataset/buildTree',
    method: 'post',
    params: params
  })
}

/**
 * 动态获取值来源
 * @param {*} params
 */
export function getRemoteSearch(params) {
  return request({
    url: DATA_URL + '/page/v3/data/template/queryNew',
    method: 'post',
    data: params
  })
}
/**
 * 根据值来源  动态获取返回字段 
 * @param {*} params
 */
export function queryRemoteData(params) {
  return request({
    url: DATA_URL + '/page/v3/data/template/getTpl',
    method: 'get',
    params: params
  })

}

/**
 * 根据传入值来源的id  获取返回的查询参数value
 * @param {*} params
 */
export function getRemoteParameter(params) {
  return request({
    url: DATA_URL + '/page/v3/data/template/getDataNew',
    method: 'post',
    params: params
  })

}



/**
 *凭证查看
 * @param {*} params
 */
export function getVoucher(params) {
  return request({
    url: IMAGE_URL + '/AccountingService/ckpz',
    method: 'get',
    params: params
  })

}

