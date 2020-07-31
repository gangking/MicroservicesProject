import { BASE_URL, INFO_URL, DATA_URL, COMP_URL } from "@/api/baseUrl";
import _ from "lodash";
const BASE_PLATFORM_API = BASE_URL + INFO_URL; // 
const BASE_BUSINESS_API = BASE_URL + DATA_URL; // 
const BASE_BIZCONFIG_API = BASE_URL + COMP_URL; // 
const REQUEST_TYPE = {
  POST: "post",
  GET: "get",
  PUT: "put",
  DELETE: "delete"
};

let PLATFORM_API = {
  SHARED_POLL_LIST: "/user/v3/group/query", // 共享池列表  sharedPollList
  SAVE_CASCDE: "/user/v3/group/saveCascade", // 新增或修改共享池
  STOP_DELETE: "/group", // 停用 删除
  USER_LIST: "/user/v3/employee/queryWithShift" // 查询员工
};
let BUSINESS_API = {
  BO_LIST: "/bo/def/query", // 业务对象查询接口
  BO_LIST_TREE: "/form/def/buildTree", // 业务对象树查询接口
  RULE_WORKER: "/bpm/v3/bpm/deliver/assign/rule", // 指定规则派工 Rule worker
  DEFINITION_QUERY: '/bpm/v3/bpm/definition/query', // 查流程
  BPM_NODE_QUERY: '/bpm/v3/bpm/form/queryBpmNode', // 流程查环节
  GET_BO_LIST:'/bpm/v3/bpm/triger/flow/srcRead', // 根据业务对象查bo字段
};
let BIZCONFIG_API = {
  GROUP_ADD: "/user/v3/org/group", // 新增组织 编辑：请求参数中加个id   组织停用/删除把type参数加上
  GROUP_LIST: "/user/v3/org/group/list", // 组织列表
  GROUP_TREE: "/scene/v3/business/group/tree", // 业务组树形
  BUS_GROUP_LIST: "/scene/v3/business/group/list", // 业务组列表查询
  BUS_GROUP_ADD_EDIT: "/scene/v3/business/group", // 业务组新增 修改
  GROUP_MEMBER_LIST: "/scene/v3/business/group/member/list", // 业务组成员查询列表
  GROUP_MEMBER_STOP: "/scene/v3/business/group/member", // 删除停用成员
  GROUP_MEMBER_ASSIGN: "/scene/v3/business/group/member/assign", // 分派成员
  RANGE_LIST: "/scene/v3/business/range/list", // 派单范围列表
  RANGE_ADD: "/scene/v3/business/range", // 派单范围新增
  RANGE_TASK_SAVA: "//business/group/task", // 保存一级派单范围
  QUERY_ALL_BO: "/scene/v3/bpmBsRel/listAll", // 查询所有的业务场景应用
  RANGE_STOP_DELETE: "/scene/v3/business/range", // 派单范围停用删除
  GOBAL_PARAM_LIST: "/gobalParam/def/list", // 全局参数列表
  GOBAL_PARAM_ADD_EDIT: "/gobalParam/def", // 全局参数新增修改
  WORKING_DATE_LIST: "/workingDate/def/list", // 工作日列表查询
  WORKING_DATE_ADD_EDIT: "/workingDate/def", // 工作日新增修改 删除 停用
  PRIORITY_LIST: "/priority/def/list", // 优先级列表查询
  PRIORITY_ADD_EDIT: "/priority/def", // 优先级新增修改  删除 停用
  DELIVER_RULE_LIST: "/scene/v3/deliver/bill/rule/list", // 派单策略  派单规则列表
  DELIVER_RULE_SAVE: "/scene/v3/business/group/rule", // 保存派单策略分配
  DELIVER_RULE_DELETE_STOP: "/scene/v3/deliver/bill/rule", // 派单策略  派单规则删除停用  新增修改
  AUDIT_RULE_LIST: "/audit/rule/list", // 稽核规则查询列表
  AUDIT_RULE_DELETE_ADD_EDIT: "/audit/rule", // 稽核规则新增 删除 编辑
  AUDIT_PLAN_LIST: "/audit/plan/list", // 稽核顺序查询列表
  AUDIT_PLAN_DELETE_ADD_EDIT: "/audit/plan", // 稽核顺序新增 删除 编辑
  AUDIT_TASK_LIST: "/audit/task/list", // 稽核任务查询列表
  AUDIT_TASK_DELETE_ADD_EDIT: "/audit/task", // 稽核任务新增 删除 编辑
  AUDIT_ADJUST_LIST: "/audit/modify/list", // 稽核调整单查询列表 Adjustment
  AUDIT_ADJUST_DELETE_ADD_EDIT: "/audit/modify", // 稽核调整单新增 删除 编辑
};

PLATFORM_API = _.mapValues(PLATFORM_API, function(v) {
  return BASE_PLATFORM_API + v;
});

BIZCONFIG_API = _.mapValues(BIZCONFIG_API, function(v) {
  return BASE_BIZCONFIG_API + v;
});

BUSINESS_API = _.mapValues(BUSINESS_API, function(v) {
  return BASE_BUSINESS_API + v;
});

export { REQUEST_TYPE, PLATFORM_API, BUSINESS_API, BIZCONFIG_API };
