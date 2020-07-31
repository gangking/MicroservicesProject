import request from '@/utils/request'
import { COMP_URL } from '@/api/baseUrl'
/**
 * 集成系统定义查询
 * @param {*} params
 */
export function integSysQuery(data) {
  return request({
    url: COMP_URL + '/integSys/query',
    method: 'post',
    data: data
  })
}



/**
 * 集成系统定义增加//编辑
 * @param {*} params
 */
export function integSysAddEdit(params) {
  return request({
    url: COMP_URL + '/integSys/save',
    method: 'post',
    data: params
  })
}

/**
 * 集成系统定义删除
 * @param {*} params
 */
export function integSysRemove(params) {
  return request({
    url: COMP_URL + '/integSys/remove',
    method: 'post',
    params: params
  })
}

