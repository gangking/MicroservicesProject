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
  UN_AUDITED_LIST: "/bpm/v3/bpm/deliver/unaudited/list", // 共享任务未审核列表
  AUDITED_LIST: "/bpm/v3/bpm/deliver/audited/list", // 共享任务已审核列表
  PENDING_CANCEL: "/bpm/v3/bpm/deliver/suspend", // 挂起取消  Pending cancel
  CHARGE_BACK: "/bpm/v3/bpm/deliver/chargeback", // 退回申请
  TASK_EXTRACTION: "/bpm/v3/bpm/deliver/manual/pull", // 提取任务 Task extraction
  TASK_EXTRACTION_AUDIT: "/bpm/v3/bpm/audit/manual/pull", // 稽核提取任务 Task extraction
  UN_AUDITED_LIST_TWO: "/bpm/v3/bpm/audit/unaudited/list", // 未稽核
  AUDITED_SETTING: "/bpm/v3/bpm/audit/audit", // 稽核审核
  AUDITED_PENDING_CANCEL: "/bpm/v3/bpm/audit/flag/suspend", // 稽核挂起取消  Pending cancel
  UN_REVISED_LIST: "/bpm/v3/bpm/audit/unrevised/list", // 待整改
  REVISED_REVOKE: "/bpm/v3/bpm/audit/revoke", // 待整改撤回
  AUDIT_AUDITED_LIST: "/bpm/v3/bpm/audit/audited/list", // 已办稽核列表
  AUDITED_UNREVISED_LIST: "/bpm/v3/bpm/audit/auditor/unrevised/list", // 稽核任务调整列表
  AUDITED_REVISE_LIST: "/bpm/v3/bpm/audit/auditor/revise/list", // 稽核任务调整中列表
  AUDITED_REVISED_LIST: "/bpm/v3/bpm/audit/auditor/revised/list" // 稽核任务已调整列表
};
let BIZCONFIG_API = {
  QUERY_MY_GROUP_LIST: "/scene/v3/business/my/group/list", // 查询我的业务组列表
  QUERY_IS_DUTY: "/user/v3/employee/myself/state", // 是否在岗状态查询 duty
  SET_DUTY: "/user/v3/employee/change/myself/state", // 改变在岗状态(在岗/离岗)
  CREATE_ADJUSTTEMENT: "/audit/modify/createModify" // 生成调整单
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
