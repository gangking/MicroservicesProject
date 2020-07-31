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

let PLATFORM_API = {};
let BUSINESS_API = {
  EXCEPTTION_LIST: "/bpm/v3/bpm/deliver/exception/list", // 异常派单列表
  DELIVER_LIST: "/bpm/v3/bpm/deliver/already/deliver/list", // 已派任务管理列表
  CHARGEBACK_LIST: "/bpm/v3/bpm/deliver/chargeback/list", // 任务退回管理列表
  RETURN_TRANSFER: "/bpm/v3/bpm/deliver/transfer", // 任务退回转派
  RETURN_AUDIT: "/bpm/v3/bpm/deliver/chargeback/audit", // 任务退回审核
  DELIVER_RECOVER: "/bpm/v3/bpm/deliver/recover", // 回收任务池
  DELIVER_ASSIGN: "/bpm/v3/bpm/deliver/assign", // 指定人员派工
  UN_DELIVERED_LIST: "/bpm/v3/bpm/deliver/not/deliver/list", // 共享池监控未派任务列表 undeliveredList
  OUTSTANDING_TIMEOUT_LIST:'/bpm/v3/bpm/deliver/not/deliver/overtime/list', // 未派超时列表 Outstanding timeout
  DISPATCHED_TIMEOUT_LIST:'/bpm/v3/bpm/deliver/already/deliver/overtime/list', // 已派派超时列表 Dispatched timeout
};
let BIZCONFIG_API = {
  CONTRACT_QUERY:'/user/v3/contract/query', // 查询合同权限分配表
  CONTRACT_COPY:'/user/v3/contract/copy', // 新增或删除合同权限
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
