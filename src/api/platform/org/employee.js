import request from '@/utils/request'
import { ORG_URL } from '@/api/baseUrl'
/**
 * 查询列表数据
 * @param {*} params
 */
export function queryPageList(params) {
  return request({
    url: ORG_URL + '/user/v3/employee/query',
    method: 'post',
    data: params
  })
}
/**
 * 删除数据
 * @param {*} params
 */
export function remove(params) {
  return request({
    url: ORG_URL + '/user/v3/employee/remove',
    method: 'post',
    params: params
  })
}

/**
 * 创建数据
 * @param {*} params
 */
export function create(params) {
  return request({
    url: ORG_URL + '/user/v3/employee/create',
    method: 'post',
    data: params
  })
}

/**
 * 保存数据
 * @param {*} params
 */
export function update(params) {
  return request({
    url: ORG_URL + '/user/v3/employee/update',
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
    url: ORG_URL + '/user/v3/employee/get',
    method: 'get',
    params
  })
}

/**
 * 获取数据
 * @param {*} params
 */
export function load(params) {
  return request({
    url: ORG_URL + '/user/v3/employee/load',
    method: 'get',
    params
  })
}

/**
 * 用户激活
 * @param {*} params
 */
export function active(params) {
  return request({
    url: ORG_URL + '/user/v3/employee/active',
    method: 'post',
    params: params
  })
}
/**
 * 用户激活
 * @param {*} params
 */
export function disable(params) {
  return request({
    url: ORG_URL + '/user/v3/employee/disable',
    method: 'post',
    params: params
  })
}

/**
 * 员工列表分页(带组织名称)
 * @param {*} params
 */
export function queryWithOrg(params) {
  return request({
    url: ORG_URL + '/user/v3/employee/queryWithOrg',
    method: 'post',
    data: params
  })
}

/**
 * 添加岗位人员
 * @param {*} params
 */
export function addPositionUser(params) {
  return request({
    url: ORG_URL + '/user/v3/employee/addPositionUser',
    method: 'post',
    params: params
  })
}

/**
 * 移除岗位人员
 * @param {*} params
 */
export function removePositionUser(params) {
  return request({
    url: ORG_URL + '/user/v3/employee/removePositionUser',
    method: 'post',
    params: params
  })
}

// ==========================组织人员======================
/**
 * 获取组织人员
 * @param {*} params
 */
export function queryOrgUser(params) {
  return request({
    url: ORG_URL + '/user/v3/employee/queryOrgUser',
    method: 'post',
    data: params
  })
}

/**
 * 移除组织人员
 * @param {*} params
 */
export function removeOrgUser(params) {
  return request({
    url: ORG_URL + '/user/v3/employee/removeOrgUser',
    method: 'post',
    params: params
  })
}
/**
 * 添加组织人员数据
 * @param {*} params
 */
export function addOrgUser(params) {
  return request({
    url: ORG_URL + '/user/v3/employee/addOrgUser',
    method: 'post',
    params: params
  })
}
/**
 * 获取未分配组织人员列表
 * @param {*} params
 */
export function queryWoutOrg(params) {
  return request({
    url: ORG_URL + '/user/v3/employee/queryWoutOrg',
    method: 'post',
    data: params
  })
}
// ==========================上下级======================

// 员工下属列表分页
export function queryUnderPageList(params) {
  return request({
    url: ORG_URL + '/user/v3/employee/queryUnder',
    method: 'post',
    data: params
  })
}
// 员工上级列表分页
export function querySuperiorPageList(params) {
  return request({
    url: ORG_URL + '/user/v3/employee/querySuperior',
    method: 'post',
    data: params
  })
}

// 添加员工下属
export function addUnder(params) {
  return request({
    url: ORG_URL + '/user/v3/employee/addUnder',
    method: 'post',
    params: params
  })
}

// 移除员工下属
export function removeUnder(params) {
  return request({
    url: ORG_URL + '/user/v3/employee/removeUnder',
    method: 'post',
    params: params
  })
}

// ===================组织负责人管理============================================

/**
 * 查询组织负责人数据
 * @param {*} params
 */
export function queryOrgManager(params) {
  return request({
    url: ORG_URL + '/user/v3/employee/queryOrgManager',
    method: 'post',
    data: params
  })
}
/**
 * 删除组织负责人数据
 * @param {*} params
 */
export function removeOrgManager(params) {
  return request({
    url: ORG_URL + '/user/v3/employee/removeOrgManager',
    method: 'post',
    params: params
  })
}
/**
 * 保存组织负责人数据
 * @param {*} params
 */
export function addOrgManager(params) {
  return request({
    url: ORG_URL + '/user/v3/employee/addOrgManager',
    method: 'post',
    params: params
  })
}

// ===================角色人员管理============================================

/**
 * 获取角色人员数据
 * @param {*} params
 */
export function queryByRoleId(params) {
  return request({
    url: ORG_URL + '/user/v3/employee/queryByRoleId',
    method: 'post',
    data: params
  })
}

/**
 * 员工列表分页
 * @param {*} params
 */
export function queryWithOrg4Position(params) {
  return request({
    url: ORG_URL + '/user/v3/employee/queryWithOrg4Position',
    method: 'post',
    data: params
  })
}

/**
 * 添加角色人员数据
 * @param {*} params
 */
export function addRoleUser(params) {
  return request({
    url: ORG_URL + '/user/v3/role/addUser',
    method: 'post',
    params: params
  })
}

/**
 * 移除角色人员
 * @param {*} params
 */
export function removeRoleUser(params) {
  return request({
    url: ORG_URL + '/user/v3/role/removeUser',
    method: 'post',
    params: params
  })
}
