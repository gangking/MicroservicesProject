import request from "@/utils/request";
import {
  PLATFORM_API,
  BUSINESS_API,
  BIZCONFIG_API,
  REQUEST_TYPE
} from "./sharedTaskUrl";

var indexApi = {
  // 合同权限分配列表
  contractQuery(data) {
    return request({
      url: BIZCONFIG_API.CONTRACT_QUERY,
      method: REQUEST_TYPE.POST,
      data
    });
  },
  // 新增合同权限
  contractAdd(data) {
    return request({
      url: BIZCONFIG_API.CONTRACT_COPY,
      method: REQUEST_TYPE.POST,
      data
    });
  },
  // 删除合同权限
  contractRemove(data) {
    return request({
      url: BIZCONFIG_API.CONTRACT_COPY,
      method: REQUEST_TYPE.DELETE,
      data
    });
  },
  // 异常派单列表
  exceptionList(data) {
    return request({
      url: BUSINESS_API.EXCEPTTION_LIST,
      method: REQUEST_TYPE.POST,
      data
    });
  },
  // 已派任务管理列表
  deliverList(data) {
    return request({
      url: BUSINESS_API.DELIVER_LIST,
      method: REQUEST_TYPE.POST,
      data
    });
  },
  // 回收任务池
  deliverRecover(data) {
    return request({
      url: BUSINESS_API.DELIVER_RECOVER,
      method: REQUEST_TYPE.POST,
      data
    });
  },
  // 指定人员派工
  deliverAssign(data) {
    return request({
      url: BUSINESS_API.DELIVER_ASSIGN,
      method: REQUEST_TYPE.POST,
      data
    });
  },
  // 任务退回管理列表
  charaeeBackList(data) {
    return request({
      url: BUSINESS_API.CHARGEBACK_LIST,
      method: REQUEST_TYPE.POST,
      data
    });
  },
  // 任务退回  转派
  returnTransfer(data) {
    return request({
      url: BUSINESS_API.RETURN_TRANSFER,
      method: REQUEST_TYPE.POST,
      data
    });
  },
  // 任务退回审核
  returnTaskAudit(data) {
    return request({
      url: BUSINESS_API.RETURN_AUDIT,
      method: REQUEST_TYPE.POST,
      data
    });
  },
  // 共享池监控未派任务列表
  undeliveredList(data) {
    return request({
      url: BUSINESS_API.UN_DELIVERED_LIST,
      method: REQUEST_TYPE.POST,
      data
    });
  },
  // 未派超时列表
  qutstandingTimeout(data) {
    return request({
      url: BUSINESS_API.OUTSTANDING_TIMEOUT_LIST,
      method: REQUEST_TYPE.POST,
      data
    });
  },
  // 已派超时列表
  dispatchedTimeout(data) {
    return request({
      url: BUSINESS_API.DISPATCHED_TIMEOUT_LIST,
      method: REQUEST_TYPE.POST,
      data
    });
  },
};

export default indexApi;
