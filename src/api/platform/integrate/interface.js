import request from '@/utils/request'
import { COMP_URL, DATA_URL } from '@/api/baseUrl'
/**
 * 集成系统接口查询
 * @param {*} params
 */
export function integInterfaceQuery(data) {
  return request({
    url: COMP_URL + '/integApi/query',
    method: 'post',
    data: data
  })
}



/**
 * 集成系统定义增加//编辑
 * @param {*} params
 */
export function integInterfaceAddEdit(params) {
  return request({
    url: COMP_URL + '/integApi/save',
    method: 'post',
    data: params
  })
}

/**
 * 集成系统定义删除
 * @param {*} params
 */
export function integInterfaceRemove(params) {
  return request({
    url: COMP_URL + '/integApi/remove',
    method: 'post',
    params: params
  })
}


/**
 * 所属系统下拉框服务
 * @param {*} params
 */
export function integSysSelect(params) {
  return request({
    url: COMP_URL + '/integSys/query',
    method: 'post',
    data: params
  })
}



/**
 * 业务对象选择器 
 * @param {*} params
 */
export function boQuery(params) {
  return request({
    url: DATA_URL + '/model/v3/bo/def/query',
    method: 'post',
    data: params
  })
}



