import request from "@/utils/request";
import {
  PLATFORM_API,
  BUSINESS_API,
  BIZCONFIG_API,
  REQUEST_TYPE
} from "./basicConfigUrl";

var indexApi = {
  // 查询组织列表
  getGroupList(data) {
    return request({
      url: BIZCONFIG_API.GROUP_LIST,
      method: REQUEST_TYPE.POST,
      data
    });
  },
  // 新增组织  编辑   删除  停用
  addGroup(data) {
    return request({
      url: BIZCONFIG_API.GROUP_ADD,
      method: REQUEST_TYPE.POST,
      data
    });
  },
  // 编辑组织
  editGroup(data) {
    return request({
      url: BIZCONFIG_API.GROUP_ADD,
      method: REQUEST_TYPE.PUT,
      data
    });
  },
  // 删除  停用 组织
  deleteOrStopGroup(data) {
    return request({
      url: BIZCONFIG_API.GROUP_ADD,
      method: REQUEST_TYPE.DELETE,
      data
    });
  },
  // 业务组树形
  groupTree(data) {
    return request({
      url: BIZCONFIG_API.GROUP_TREE,
      method: REQUEST_TYPE.GET,
      data
    });
  },
  // 共享池列表
  sharedPollList(data) {
    return request({
      url: PLATFORM_API.SHARED_POLL_LIST,
      method: REQUEST_TYPE.POST,
      data
    });
  },
  // 新增或修改共享池
  saveCascade(data) {
    return request({
      url: PLATFORM_API.SAVE_CASCDE,
      method: REQUEST_TYPE.POST,
      data
    });
  },
  // 停用 删除共享池
  stopOrDeleteShared(data) {
    return request({
      url: PLATFORM_API.STOP_DELETE,
      method: REQUEST_TYPE.DELETE,
      data
    });
  },
  // 业务组列表查询
  busGroupList(data) {
    return request({
      url: BIZCONFIG_API.BUS_GROUP_LIST,
      method: REQUEST_TYPE.POST,
      data
    });
  },
  // 业务组新增修改
  busGroupAddEdit(data) {
    return request({
      url: BIZCONFIG_API.BUS_GROUP_ADD_EDIT,
      method: REQUEST_TYPE.POST,
      data
    });
  },
  // 业务组删除停用
  busGroupDeleteStop(data) {
    return request({
      url: BIZCONFIG_API.BUS_GROUP_ADD_EDIT,
      method: REQUEST_TYPE.DELETE,
      data
    });
  },
  // 业务组成员列表
  groupMemberList(data) {
    return request({
      url: BIZCONFIG_API.GROUP_MEMBER_LIST,
      method: REQUEST_TYPE.POST,
      data
    });
  },
  // 删除停用成员
  groupMemberStopDelete(data) {
    return request({
      url: BIZCONFIG_API.GROUP_MEMBER_STOP,
      method: REQUEST_TYPE.DELETE,
      data
    });
  },
  // 新增成员
  groupMemberAdd(data) {
    return request({
      url: BIZCONFIG_API.GROUP_MEMBER_STOP,
      method: REQUEST_TYPE.POST,
      data
    });
  },
  // 分派成员
  groupMemberAssign(data) {
    return request({
      url: BIZCONFIG_API.GROUP_MEMBER_ASSIGN,
      method: REQUEST_TYPE.POST,
      data
    });
  },
  // 查询员工
  queryUserList(data) {
    return request({
      url: PLATFORM_API.USER_LIST,
      method: REQUEST_TYPE.POST,
      data
    });
  },
  // 派单范围列表
  queryRangeList(data) {
    return request({
      url: BIZCONFIG_API.RANGE_LIST,
      method: REQUEST_TYPE.POST,
      data
    });
  },
  // 保存一级派单范围
  rangeTaskSave(data) {
    return request({
      url: BIZCONFIG_API.RANGE_TASK_SAVA,
      method: REQUEST_TYPE.POST,
      data
    });
  },
  // 派单范围新增
  rangeAdd(data) {
    return request({
      url: BIZCONFIG_API.RANGE_ADD,
      method: REQUEST_TYPE.POST,
      data
    });
  },
  // 查询业务场景
  queryAllBo(data) {
    return request({
      url: BIZCONFIG_API.QUERY_ALL_BO,
      method: REQUEST_TYPE.POST,
      data
    });
  },
  // 派单范围停用删除
  rangeStopDelete(data) {
    return request({
      url: BIZCONFIG_API.RANGE_STOP_DELETE,
      method: REQUEST_TYPE.DELETE,
      data
    });
  },
  // 全局参数列表查询
  gobalParamList(data) {
    return request({
      url: BIZCONFIG_API.GOBAL_PARAM_LIST,
      method: REQUEST_TYPE.POST,
      data
    });
  },
  // 全局参数新增修改
  gobalParamAddEdit(data) {
    return request({
      url: BIZCONFIG_API.GOBAL_PARAM_ADD_EDIT,
      method: REQUEST_TYPE.POST,
      data
    });
  },
  // 全局参数删除停用
  gobalParamDeleteStop(data) {
    return request({
      url: BIZCONFIG_API.GOBAL_PARAM_ADD_EDIT,
      method: REQUEST_TYPE.DELETE,
      data
    });
  },
  // 工作日列表查询
  workingDateList(data) {
    return request({
      url: BIZCONFIG_API.WORKING_DATE_LIST,
      method: REQUEST_TYPE.POST,
      data
    });
  },
  // 工作日新增修改
  workingDateAddEdit(data) {
    return request({
      url: BIZCONFIG_API.WORKING_DATE_ADD_EDIT,
      method: REQUEST_TYPE.POST,
      data
    });
  },
  // 工作日删除停用
  workingDateDeleteStop(data) {
    return request({
      url: BIZCONFIG_API.WORKING_DATE_ADD_EDIT,
      method: REQUEST_TYPE.DELETE,
      data
    });
  },
  // 业务对象查询接口
  queryBusObj(data) {
    console.log('业务对象查询接口',data)
    return request({
      url: BUSINESS_API.BO_LIST+`?boCode=${data.boCode}&boDefId=${data.boDefId}&mode=bo`,
      method: REQUEST_TYPE.POST,
      data
    });
  },
  // 业务对象树查询接口
  queryBusObjTree(params) {
    return request({
      // url: BUSINESS_API.BO_LIST_TREE+`?boCode=${params.boCode}&boDefId=${params.boDefId}&mode=bo`,
      url: BUSINESS_API.BO_LIST_TREE,
      method: REQUEST_TYPE.POST,
      params
    });
  },
  // 指定规则派工
  ruleWorker(data) {
    return request({
      url: BUSINESS_API.RULE_WORKER,
      method: REQUEST_TYPE.POST,
      data
    });
  },
  // 优先级列表查询
  priorityliST(data) {
    return request({
      url: BIZCONFIG_API.PRIORITY_LIST,
      method: REQUEST_TYPE.POST,
      data
    });
  },
  // 优先级新增修改
  priorityAddEdit(data) {
    return request({
      url: BIZCONFIG_API.PRIORITY_ADD_EDIT,
      method: REQUEST_TYPE.POST,
      data
    });
  },
  // 优先级删除停用
  priorityDeleteStop(data) {
    return request({
      url: BIZCONFIG_API.PRIORITY_ADD_EDIT,
      method: REQUEST_TYPE.DELETE,
      data
    });
  },
  // 派单策略  派单规则列表
  deliverRuleList(data) {
    return request({
      url: BIZCONFIG_API.DELIVER_RULE_LIST,
      method: REQUEST_TYPE.POST,
      data
    });
  },
  // 派单策略  派单规则删除停用
  deliverRuleDeleteStop(data) {
    return request({
      url: BIZCONFIG_API.DELIVER_RULE_DELETE_STOP,
      method: REQUEST_TYPE.DELETE,
      data
    });
  },
  // 派单策略  派单规则新增修改
  deliverRuleAddEdit(data) {
    return request({
      url: BIZCONFIG_API.DELIVER_RULE_DELETE_STOP,
      method: REQUEST_TYPE.POST,
      data
    });
  },
  // 保存派单策略分配
  deliverRuleSave(data) {
    return request({
      url: BIZCONFIG_API.DELIVER_RULE_SAVE,
      method: REQUEST_TYPE.POST,
      data
    });
  },
  // 稽核规则查询列表
  auditRuleList(data) {
    return request({
      url: BIZCONFIG_API.AUDIT_RULE_LIST,
      method: REQUEST_TYPE.POST,
      data
    });
  },
  // 稽核规则新增编辑
  auditRuleListAddEdit(data) {
    return request({
      url: BIZCONFIG_API.AUDIT_RULE_DELETE_ADD_EDIT,
      method: REQUEST_TYPE.POST,
      data
    });
  },
  // 稽核规则删除
  auditRuleListDelete(data) {
    return request({
      url: BIZCONFIG_API.AUDIT_RULE_DELETE_ADD_EDIT,
      method: REQUEST_TYPE.DELETE,
      data
    });
  },
  // 稽核顺序查询列表
  auditPlanList(data) {
    return request({
      url: BIZCONFIG_API.AUDIT_PLAN_LIST,
      method: REQUEST_TYPE.POST,
      data
    });
  },
  // 流程查环节
  queryBpmNode(params) {
    return request({
      url: BUSINESS_API.BPM_NODE_QUERY,
      method: REQUEST_TYPE.GET,
      params
    });
  },
  // 查流程
  definitionQuery(data) {
    return request({
      url: BUSINESS_API.DEFINITION_QUERY,
      method: REQUEST_TYPE.POST,
      data
    });
  },
  // 稽核顺序新增编辑
  auditPlanListAddEdit(data) {
    return request({
      url: BIZCONFIG_API.AUDIT_PLAN_DELETE_ADD_EDIT,
      method: REQUEST_TYPE.POST,
      data
    });
  },
  // 稽核顺序删除
  auditPlanListDelete(data) {
    return request({
      url: BIZCONFIG_API.AUDIT_PLAN_DELETE_ADD_EDIT,
      method: REQUEST_TYPE.DELETE,
      data
    });
  },
  // 稽核任务查询列表
  auditTaskList(data) {
    return request({
      url: BIZCONFIG_API.AUDIT_TASK_LIST,
      method: REQUEST_TYPE.POST,
      data
    });
  },
  // 稽核任务新增编辑
  auditTaskListAddEdit(data) {
    return request({
      url: BIZCONFIG_API.AUDIT_TASK_DELETE_ADD_EDIT,
      method: REQUEST_TYPE.POST,
      data
    });
  },
  // 稽核任务删除
  auditTaskListDelete(data) {
    return request({
      url: BIZCONFIG_API.AUDIT_TASK_DELETE_ADD_EDIT,
      method: REQUEST_TYPE.DELETE,
      data
    });
  },
  // 稽核调整单查询列表
  auditAdjustmentList(data) {
    return request({
      url: BIZCONFIG_API.AUDIT_ADJUST_LIST,
      method: REQUEST_TYPE.POST,
      data
    });
  },
  // 稽核调整单新增编辑
  auditAdjustmentListAddEdit(data) {
    return request({
      url: BIZCONFIG_API.AUDIT_ADJUST_DELETE_ADD_EDIT,
      method: REQUEST_TYPE.POST,
      data
    });
  },
  // 稽核调整单删除
  auditAdjustmentListDelete(data) {
    return request({
      url: BIZCONFIG_API.AUDIT_ADJUST_DELETE_ADD_EDIT,
      method: REQUEST_TYPE.DELETE,
      data
    });
  },
  // 根据业务对象查bo字段
  getBoList(params) {
    return request({
      url: BUSINESS_API.GET_BO_LIST,
      method: REQUEST_TYPE.GET,
      params
    });
  },

};

export default indexApi;
