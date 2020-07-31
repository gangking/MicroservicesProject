import request from '@/utils/request'
import { IMAGE_URL } from '@/api/baseUrl'

/**
 * 查询所有邮件配置信息数据
 * @param {*} params
 */
export function queryAllEmailConf(params) {
  return request({
    url: IMAGE_URL + '/emailConfig/getEmailConfigInfo',
    method: 'post',
    data: params
  })
}

/**
 * 新增邮件配置信息
 * @param {*} params
 */
export function addNewMailConf(params) {
  return request({
    url: IMAGE_URL + '/emailConfig/saveEmailCofigInfo',
    method: 'post',
    data: params
  })
}

/**
 * 编辑邮件配置信息
 * @param {*} params
 */
export function editMailConf(params) {
  return request({
    url: IMAGE_URL + '/emailConfig/editEmailConfigInfo',
    method: 'post',
    data: params
  })
}


