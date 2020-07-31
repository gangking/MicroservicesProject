import indexApi from "@/api/platform/shared_operation/shared_workbench";
import { showLoading, hideLoading } from "@/utils/loading";

const mutations = {};

const state = {
  test: "hahah"
};

const actions = {
  publicSendService(
    {
      state: { test }
    },
    { params, fun }
  ) {
    showLoading();
    return fun({ ...params })
      .then(data => {
        hideLoading();
        return data;
      })
      .catch(req => {
        hideLoading();
        // return Promise.reject(req);
        console.log("接口报错", req);
        var data = {
          info: req,
          state: "8848"
        };

        return { data };
      });
  },
  // 共享任务未审核列表
  unAuditedList({ dispatch }, params) {
    return dispatch("publicSendService", {
      params,
      fun: indexApi.unAuditedList
    }).then(({ data }) => {
      return data;
    });
  },
  // 生成调整单
  creasteAdjustmentFunc({ dispatch }, params) {
    return dispatch("publicSendService", {
      params,
      fun: indexApi.creasteAdjustmentFunc
    }).then(({ data }) => {
      return data;
    });
  },
  // 共享任务已审核列表
  auditedList({ dispatch }, params) {
    return dispatch("publicSendService", {
      params,
      fun: indexApi.auditedList
    }).then(({ data }) => {
      return data;
    });
  },
  // 挂起取消
  pendingCancel({ dispatch }, params) {
    return dispatch("publicSendService", {
      params,
      fun: indexApi.pendingCancel
    }).then(({ data }) => {
      return data;
    });
  },
  // 退回申请
  chargeback({ dispatch }, params) {
    return dispatch("publicSendService", {
      params,
      fun: indexApi.chargeback
    }).then(({ data }) => {
      return data;
    });
  },
  // 查询我的业务组列表
  queryMyGroupList({ dispatch }, params) {
    return dispatch("publicSendService", {
      params,
      fun: indexApi.queryMyGroupList
    }).then(({ data }) => {
      return data;
    });
  },
  // 提取任务
  taskExtraction({ dispatch }, params) {
    return dispatch("publicSendService", {
      params,
      fun: indexApi.taskExtraction
    }).then(({ data }) => {
      return data;
    });
  },
  // 稽核提取任务
  taskAuditExtraction({ dispatch }, params) {
    return dispatch("publicSendService", {
      params,
      fun: indexApi.taskAuditExtraction
    }).then(({ data }) => {
      return data;
    });
  },
  // 是否在岗状态查询
  queryIsDuty({ dispatch }, params) {
    return dispatch("publicSendService", {
      params,
      fun: indexApi.queryIsDuty
    }).then(({ data }) => {
      return data;
    });
  },
  // 改变在岗状态(在岗/离岗)
  setDuty({ dispatch }, params) {
    return dispatch("publicSendService", {
      params,
      fun: indexApi.setDuty
    }).then(({ data }) => {
      return data;
    });
  },
  // 已办稽核列表
  auditedAuditList({ dispatch }, params) {
    return dispatch("publicSendService", {
      params,
      fun: indexApi.auditedAuditList
    }).then(({ data }) => {
      return data;
    });
  },
  // 稽核任务调整列表
  unrevisedList({ dispatch }, params) {
    return dispatch("publicSendService", {
      params,
      fun: indexApi.unrevisedList
    }).then(({ data }) => {
      return data;
    });
  },
  // 稽核任务调整中列表
  reviseLoadingList({ dispatch }, params) {
    return dispatch("publicSendService", {
      params,
      fun: indexApi.reviseLoadingList
    }).then(({ data }) => {
      return data;
    });
  },
  // 稽核任务已调整列表
  revisedYesList({ dispatch }, params) {
    return dispatch("publicSendService", {
      params,
      fun: indexApi.revisedYesList
    }).then(({ data }) => {
      return data;
    });
  },
  // 未稽核
  thisUnauditedList({ dispatch }, params) {
    return dispatch("publicSendService", {
      params,
      fun: indexApi.thisUnauditedList
    }).then(({ data }) => {
      return data;
    });
  },
  // 稽核审核(合格or不合格)
  isQualified({ dispatch }, params) {
    return dispatch("publicSendService", {
      params,
      fun: indexApi.isQualified
    }).then(({ data }) => {
      return data;
    });
  },
  // 稽核挂起取消挂起
  isSuspend({ dispatch }, params) {
    return dispatch("publicSendService", {
      params,
      fun: indexApi.isSuspend
    }).then(({ data }) => {
      return data;
    });
  },
  // 待整改
  thisUnrevisedList({ dispatch }, params) {
    return dispatch("publicSendService", {
      params,
      fun: indexApi.thisUnrevisedList
    }).then(({ data }) => {
      return data;
    });
  },
  // 待整改撤回
  withdrawFunction({ dispatch }, params) {
    return dispatch("publicSendService", {
      params,
      fun: indexApi.withdrawFunction
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
