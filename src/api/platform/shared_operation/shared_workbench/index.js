import request from "@/utils/request";
import {
  BIZCONFIG_API,
  BUSINESS_API,
  REQUEST_TYPE
} from "./sharedWorkUrl";

var indexApi = {
  // 共享任务未审核列表
  unAuditedList(data) {
    return request({
      url: BUSINESS_API.UN_AUDITED_LIST,
      method: REQUEST_TYPE.POST,
      data
    });
  },
  // 共享任务已审核列表
  auditedList(data) {
    return request({
      url: BUSINESS_API.AUDITED_LIST,
      method: REQUEST_TYPE.POST,
      data
    });
  },
  // 挂起取消
  pendingCancel(data) {
    return request({
      url: BUSINESS_API.PENDING_CANCEL,
      method: REQUEST_TYPE.POST,
      data
    });
  },
  // 退回申请
  chargeback(data) {
    return request({
      url: BUSINESS_API.CHARGE_BACK,
      method: REQUEST_TYPE.POST,
      data
    });
  },
  // 生成调整单
  creasteAdjustmentFunc(data) {
    return request({
      url: BIZCONFIG_API.CREATE_ADJUSTTEMENT,
      method: REQUEST_TYPE.POST,
      data
    });
  },
  // 查询我的业务组列表
  queryMyGroupList(data) {
    return request({
      url: BIZCONFIG_API.QUERY_MY_GROUP_LIST,
      method: REQUEST_TYPE.POST,
      data
    });
  },
  // 提取任务 Task extraction
  taskExtraction(data) {
    return request({
      url: BUSINESS_API.TASK_EXTRACTION,
      method: REQUEST_TYPE.POST,
      data
    });
  },
  // 稽核提取任务 Task extraction
  taskAuditExtraction(data) {
    return request({
      url: BUSINESS_API.TASK_EXTRACTION_AUDIT,
      method: REQUEST_TYPE.POST,
      data
    });
  },
  // 是否在岗状态查询
  queryIsDuty(params) {
    return request({
      url: BIZCONFIG_API.QUERY_IS_DUTY,
      method: REQUEST_TYPE.GET,
      params
    });
  },
  // 改变在岗状态(在岗/离岗)
  setDuty(data) {
    return request({
      url: BIZCONFIG_API.SET_DUTY,
      method: REQUEST_TYPE.POST,
      data
    });
  },
  // 已办稽核列表
  auditedAuditList(data) {
    return request({
      url: BUSINESS_API.AUDIT_AUDITED_LIST,
      method: REQUEST_TYPE.POST,
      data
    });
  },
  // 稽核任务调整列表
  unrevisedList(data) {
    return request({
      url: BUSINESS_API.AUDITED_UNREVISED_LIST,
      method: REQUEST_TYPE.POST,
      data
    });
  },
  // 稽核任务调整中列表
  reviseLoadingList(data) {
    return request({
      url: BUSINESS_API.AUDITED_REVISE_LIST,
      method: REQUEST_TYPE.POST,
      data
    });
  },
  // 稽核任务已调整列表
  revisedYesList(data) {
    return request({
      url: BUSINESS_API.AUDITED_REVISED_LIST,
      method: REQUEST_TYPE.POST,
      data
    });
  },
  // 未稽核
  thisUnauditedList(data) {
    return request({
      url: BUSINESS_API.UN_AUDITED_LIST_TWO,
      method: REQUEST_TYPE.POST,
      data
    });
  },
  // 稽核审核(合格or不合格)
  isQualified(data) {
    return request({
      url: BUSINESS_API.AUDITED_SETTING,
      method: REQUEST_TYPE.POST,
      data
    });
  },
  // 稽核挂起取消挂起
  isSuspend(data) {
    return request({
      url: BUSINESS_API.AUDITED_PENDING_CANCEL,
      method: REQUEST_TYPE.POST,
      data
    });
  },
  // 待整改
  thisUnrevisedList(data) {
    return request({
      url: BUSINESS_API.UN_REVISED_LIST,
      method: REQUEST_TYPE.POST,
      data
    });
  },
  // 待整改撤回
  withdrawFunction(data) {
    return request({
      url: BUSINESS_API.REVISED_REVOKE,
      method: REQUEST_TYPE.POST,
      data
    });
  },

};

export default indexApi;
