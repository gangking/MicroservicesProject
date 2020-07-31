import indexApi from "@/api/platform/shared_operation/basicConfig";
import { showLoading, hideLoading } from "@/utils/loading";

const mutations = {};

const state = {
  test: "hahah"
};

const actions = {
  publicSendService({ state: { test } }, { params, fun }) {
    showLoading();
    return fun({ ...params })
      .then(data => {
        hideLoading();
        // console.log("接口成功", data);
        return data;
      })
      .catch(req => {
        hideLoading();
        // var a = Promise.resolve(req);
        // a.then(function (result,result2) {
        //   console.log('返回Promise处理',result,result2)
        //  })
        console.log("接口报错", req);
        var data = {
          info: req,
          state: "8848"
        };

        return { data:data };
        // return Promise.reject(req);
      });
  },
  // 查询组织列表
  getGroupList({ dispatch }, params) {
    return dispatch("publicSendService", {
      params,
      fun: indexApi.getGroupList
    }).then(({ data }) => {
      return data;
    });
  },
  // 新增组织   编辑   删除  停用
  addGroup({ dispatch }, params) {
    return dispatch("publicSendService", {
      params,
      fun: indexApi.addGroup
    }).then(({ data }) => {
      return data;
    });
  },
  // 组织   编辑
  editGroup({ dispatch }, params) {
    return dispatch("publicSendService", {
      params,
      fun: indexApi.editGroup
    }).then(({ data }) => {
      return data;
    });
  },
  // 组织   删除  停用
  deleteOrStopGroup({ dispatch }, params) {
    return dispatch("publicSendService", {
      params,
      fun: indexApi.deleteOrStopGroup
    }).then(({ data }) => {
      return data;
    });
  },
  // 业务组树形
  groupTree({ dispatch }, params) {
    return dispatch("publicSendService", {
      params,
      fun: indexApi.groupTree
    }).then(({ data }) => {
      return data;
    });
  },
  // 共享池列表
  sharedPollList({ dispatch }, params) {
    return dispatch("publicSendService", {
      params,
      fun: indexApi.sharedPollList
    }).then(({ data }) => {
      return data;
    });
  },
  // 新增或修改共享池
  saveCascade({ dispatch }, params) {
    return dispatch("publicSendService", {
      params,
      fun: indexApi.saveCascade
    }).then(({ data }) => {
      return data;
    });
  },
  // 停用 删除共享池
  stopOrDeleteShared({ dispatch }, params) {
    return dispatch("publicSendService", {
      params,
      fun: indexApi.stopOrDeleteShared
    }).then(({ data }) => {
      return data;
    });
  },
  // 业务组列表查询
  busGroupList({ dispatch }, params) {
    return dispatch("publicSendService", {
      params,
      fun: indexApi.busGroupList
    }).then(({ data }) => {
      return data;
    });
  },
  // 业务组新增修改
  busGroupAddEdit({ dispatch }, params) {
    // return dispatch("publicSendService", {
    //   params,
    //   fun: indexApi.busGroupAddEdit
    // }).then(({ data }) => {
    //   console.log('业务组新增修改',data)
    //   return data;
    // });
    return dispatch("publicSendService", {
      params,
      fun: indexApi.busGroupAddEdit
    }).then(data => {
      return data;
    });
  },
  // 业务组删除停用
  busGroupDeleteStop({ dispatch }, params) {
    return dispatch("publicSendService", {
      params,
      fun: indexApi.busGroupDeleteStop
    }).then(({ data }) => {
      return data;
    });
  },
  // 业务组成员列表
  groupMemberList({ dispatch }, params) {
    return dispatch("publicSendService", {
      params,
      fun: indexApi.groupMemberList
    }).then(({ data }) => {
      return data;
    });
  },
  // 删除停用成员
  groupMemberStopDelete({ dispatch }, params) {
    return dispatch("publicSendService", {
      params,
      fun: indexApi.groupMemberStopDelete
    }).then(({ data }) => {
      return data;
    });
  },
  // 新增成员
  groupMemberAdd({ dispatch }, params) {
    return dispatch("publicSendService", {
      params,
      fun: indexApi.groupMemberAdd
    }).then(({ data }) => {
      return data;
    });
  },
  // 分派成员
  groupMemberAssign({ dispatch }, params) {
    return dispatch("publicSendService", {
      params,
      fun: indexApi.groupMemberAssign
    }).then(({data}) => {
      // console.log("接口分配报错返回", data);
      return data;
    });
  },
  // 查询员工
  queryUserList({ dispatch }, params) {
    return dispatch("publicSendService", {
      params,
      fun: indexApi.queryUserList
    }).then(({ data }) => {
      return data;
    });
  },
  // 派单范围列表
  queryRangeList({ dispatch }, params) {
    return dispatch("publicSendService", {
      params,
      fun: indexApi.queryRangeList
    }).then(({ data }) => {
      return data;
    });
  },
  // 保存一级派单范围
  rangeTaskSave({ dispatch }, params) {
    return dispatch("publicSendService", {
      params,
      fun: indexApi.rangeTaskSave
    }).then(({ data }) => {
      return data;
    });
  },
  // 派单范围新增
  rangeAdd({ dispatch }, params) {
    return dispatch("publicSendService", {
      params,
      fun: indexApi.rangeAdd
    }).then(({ data }) => {
      return data;
    });
  },
  // 查询所有的业务场景应用
  queryAllBo({ dispatch }, params) {
    return dispatch("publicSendService", {
      params,
      fun: indexApi.queryAllBo
    }).then(({ data }) => {
      return data;
    });
  },
  // 派单范围停用删除
  rangeStopDelete({ dispatch }, params) {
    return dispatch("publicSendService", {
      params,
      fun: indexApi.rangeStopDelete
    }).then(({ data }) => {
      return data;
    });
  },
  // 全局参数列表查询
  gobalParamList({ dispatch }, params) {
    return dispatch("publicSendService", {
      params,
      fun: indexApi.gobalParamList
    }).then(({ data }) => {
      return data;
    });
  },
  // 全局参数新增修改
  gobalParamAddEdit({ dispatch }, params) {
    return dispatch("publicSendService", {
      params,
      fun: indexApi.gobalParamAddEdit
    }).then(({ data }) => {
      return data;
    });
  },
  // 全局参数删除停用
  gobalParamDeleteStop({ dispatch }, params) {
    return dispatch("publicSendService", {
      params,
      fun: indexApi.gobalParamDeleteStop
    }).then(({ data }) => {
      return data;
    });
  },
  // 工作日列表查询
  workingDateList({ dispatch }, params) {
    return dispatch("publicSendService", {
      params,
      fun: indexApi.workingDateList
    }).then(({ data }) => {
      return data;
    });
  },
  // 工作日新增修改
  workingDateAddEdit({ dispatch }, params) {
    return dispatch("publicSendService", {
      params,
      fun: indexApi.workingDateAddEdit
    }).then(({ data }) => {
      return data;
    });
  },
  // 工作日删除停用
  workingDateDeleteStop({ dispatch }, params) {
    return dispatch("publicSendService", {
      params,
      fun: indexApi.workingDateDeleteStop
    }).then(({ data }) => {
      return data;
    });
  },
  // 优先级列表查询
  priorityliST({ dispatch }, params) {
    return dispatch("publicSendService", {
      params,
      fun: indexApi.priorityliST
    }).then(({ data }) => {
      return data;
    });
  },
  // 优先级新增修改
  priorityAddEdit({ dispatch }, params) {
    return dispatch("publicSendService", {
      params,
      fun: indexApi.priorityAddEdit
    }).then(({ data }) => {
      return data;
    });
  },
  // 优先级删除停用
  priorityDeleteStop({ dispatch }, params) {
    return dispatch("publicSendService", {
      params,
      fun: indexApi.priorityDeleteStop
    }).then(({ data }) => {
      return data;
    });
  },
  // 业务对象查询接口
  queryBusObj({ dispatch }, params) {
    return dispatch("publicSendService", {
      params,
      fun: indexApi.queryBusObj
    }).then(({ data }) => {
      return data;
    });
  },
  // 业务对象树查询接口
  queryBusObjTree({ dispatch }, params) {
    return dispatch("publicSendService", {
      params,
      fun: indexApi.queryBusObjTree
    }).then(({ data }) => {
      return data;
    });
  },
  // 指定规则派工
  ruleWorker({ dispatch }, params) {
    return dispatch("publicSendService", {
      params,
      fun: indexApi.ruleWorker
    }).then(({ data }) => {
      return data;
    });
  },
  // 派单策略  派单规则列表
  deliverRuleList({ dispatch }, params) {
    return dispatch("publicSendService", {
      params,
      fun: indexApi.deliverRuleList
    }).then(({ data }) => {
      return data;
    });
  },
  // 派单策略  派单规则删除停用
  deliverRuleDeleteStop({ dispatch }, params) {
    return dispatch("publicSendService", {
      params,
      fun: indexApi.deliverRuleDeleteStop
    }).then(({ data }) => {
      return data;
    });
  },
  // 派单策略  派单规则新增修改
  deliverRuleAddEdit({ dispatch }, params) {
    return dispatch("publicSendService", {
      params,
      fun: indexApi.deliverRuleAddEdit
    }).then(({ data }) => {
      return data;
    });
  },
  // 保存派单策略分配
  deliverRuleSave({ dispatch }, params) {
    return dispatch("publicSendService", {
      params,
      fun: indexApi.deliverRuleSave
    }).then(({ data }) => {
      return data;
    });
  },
  // 稽核规则查询列表
  auditRuleList({ dispatch }, params) {
    return dispatch("publicSendService", {
      params,
      fun: indexApi.auditRuleList
    }).then(({ data }) => {
      return data;
    });
  },
  // 稽核规则新增编辑
  auditRuleListAddEdit({ dispatch }, params) {
    return dispatch("publicSendService", {
      params,
      fun: indexApi.auditRuleListAddEdit
    }).then(({ data }) => {
      return data;
    });
  },
  // 稽核规则删除
  auditRuleListDelete({ dispatch }, params) {
    return dispatch("publicSendService", {
      params,
      fun: indexApi.auditRuleListDelete
    }).then(({ data }) => {
      return data;
    });
  },
  // 稽核顺序查询列表
  auditPlanList({ dispatch }, params) {
    return dispatch("publicSendService", {
      params,
      fun: indexApi.auditPlanList
    }).then(({ data }) => {
      return data;
    });
  },
  // 流程查环节
  queryBpmNode({ dispatch }, params) {
    return dispatch("publicSendService", {
      params,
      fun: indexApi.queryBpmNode
    }).then(({ data }) => {
      return data;
    });
  },
  // 查流程
  definitionQuery({ dispatch }, params) {
    return dispatch("publicSendService", {
      params,
      fun: indexApi.definitionQuery
    }).then(({ data }) => {
      return data;
    });
  },
  // 稽核顺序新增编辑
  auditPlanListAddEdit({ dispatch }, params) {
    return dispatch("publicSendService", {
      params,
      fun: indexApi.auditPlanListAddEdit
    }).then(({ data }) => {
      return data;
    });
  },
  // 稽核顺序删除
  auditPlanListDelete({ dispatch }, params) {
    return dispatch("publicSendService", {
      params,
      fun: indexApi.auditPlanListDelete
    }).then(({ data }) => {
      return data;
    });
  },
  // 稽核任务查询列表
  auditTaskList({ dispatch }, params) {
    return dispatch("publicSendService", {
      params,
      fun: indexApi.auditTaskList
    }).then(({ data }) => {
      return data;
    });
  },
  // 稽核任务新增编辑
  auditTaskListAddEdit({ dispatch }, params) {
    return dispatch("publicSendService", {
      params,
      fun: indexApi.auditTaskListAddEdit
    }).then(({ data }) => {
      return data;
    });
  },
  // 稽核任务删除
  auditTaskListDelete({ dispatch }, params) {
    return dispatch("publicSendService", {
      params,
      fun: indexApi.auditTaskListDelete
    }).then(({ data }) => {
      return data;
    });
  },
  // 稽核调整单查询列表
  auditAdjustmentList({ dispatch }, params) {
    return dispatch("publicSendService", {
      params,
      fun: indexApi.auditAdjustmentList
    }).then(({ data }) => {
      return data;
    });
  },
  // 稽核调整单新增编辑
  auditAdjustmentListAddEdit({ dispatch }, params) {
    return dispatch("publicSendService", {
      params,
      fun: indexApi.auditAdjustmentListAddEdit
    }).then(({ data }) => {
      return data;
    });
  },
  // 稽核调整单删除
  auditAdjustmentListDelete({ dispatch }, params) {
    return dispatch("publicSendService", {
      params,
      fun: indexApi.auditAdjustmentListDelete
    }).then(({ data }) => {
      return data;
    });
  },
  // 根据业务对象查bo字段
  getBoList({ dispatch }, params) {
    return dispatch("publicSendService", {
      params,
      fun: indexApi.getBoList
    }).then(({ data }) => {
      return data;
    });
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
