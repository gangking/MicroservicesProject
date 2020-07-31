import request from '@/utils/request'
import { JOB_URL } from '@/api/baseUrl'
/**
 * 查询列表数据
 * @param {*} params
 */
export function queryPageList(params, page) {
  return request({
    url: JOB_URL + '/base/v3/job/query',
    method: 'post',
    params: params,
    data: page
  })
}
/**
 * 删除数据
 * @param {*} params
 */
export function remove(params) {
  return request({
    url: JOB_URL + '/base/v3/job/remove',
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
    url: JOB_URL + '/base/v3/job/save',
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
    url: JOB_URL + '/base/v3/job/get',
    method: 'get',
    params
  })
}

/**
 * 定时任务分组列表
 */
export function getGroups(params) {
  return request({
    url: JOB_URL + '/base/v3/job/groups',
    method: 'get'
  })
}

/**
 * 定时任务分组列表
 */
export function validClass(params) {
  return request({
    url: JOB_URL + '/base/v3/job/validClass',
    method: 'get',
    params: params
  })
}

/**
 * 定时任务执行
 * @param {*} params
 */
export function execute(params) {
  return request({
    url: JOB_URL + '/base/v3/job/execute',
    method: 'post',
    params: params
  })
}
