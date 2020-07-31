import indexApi from "@/api/platform/shared_operation/shared_task_management";
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
        var data = {
          info: req,
          state: "8848"
        };

        return { data: data };
      });
  },
  // 合同权限分配列表
  contractQuery({ dispatch }, params) {
    return dispatch("publicSendService", {
      params,
      fun: indexApi.contractQuery
    }).then(({ data }) => {
      return data;
    });
  },
  // 新增合同权限
  contractAdd({ dispatch }, params) {
    return dispatch("publicSendService", {
      params,
      fun: indexApi.contractAdd
    }).then(({ data }) => {
      return data;
    });
  },
  // 删除合同权限
  contractRemove({ dispatch }, params) {
    return dispatch("publicSendService", {
      params,
      fun: indexApi.contractRemove
    }).then(({ data }) => {
      return data;
    });
  },
  // 异常派单列表
  exceptionList({ dispatch }, params) {
    return dispatch("publicSendService", {
      params,
      fun: indexApi.exceptionList
    }).then(({ data }) => {
      return data;
    });
  },
  // 已派任务管理列表
  deliverList({ dispatch }, params) {
    return dispatch("publicSendService", {
      params,
      fun: indexApi.deliverList
    }).then(({ data }) => {
      return data;
    });
  },
  // 回收任务池
  deliverRecover({ dispatch }, params) {
    return dispatch("publicSendService", {
      params,
      fun: indexApi.deliverRecover
    }).then(({ data }) => {
      return data;
    });
  },
  // 指定人员派工
  deliverAssign({ dispatch }, params) {
    return dispatch("publicSendService", {
      params,
      fun: indexApi.deliverAssign
    }).then(({ data }) => {
      return data;
    });
  },
  // 任务退回管理列表
  charaeeBackList({ dispatch }, params) {
    return dispatch("publicSendService", {
      params,
      fun: indexApi.charaeeBackList
    }).then(({ data }) => {
      return data;
    });
  },
  // 任务退回  转派
  returnTransfer({ dispatch }, params) {
    return dispatch("publicSendService", {
      params,
      fun: indexApi.returnTransfer
    }).then(({ data }) => {
      return data;
    });
  },
  // 任务退回审核
  returnTaskAudit({ dispatch }, params) {
    return dispatch("publicSendService", {
      params,
      fun: indexApi.returnTaskAudit
    }).then(({ data }) => {
      return data;
    });
  },
  // 共享池监控未派任务列表
  undeliveredList({ dispatch }, params) {
    return dispatch("publicSendService", {
      params,
      fun: indexApi.undeliveredList
    }).then(({ data }) => {
      return data;
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
  // 未派超时列表
  qutstandingTimeout({ dispatch }, params) {
    return dispatch("publicSendService", {
      params,
      fun: indexApi.qutstandingTimeout
    }).then(({ data }) => {
      return data;
    });
  },
  // 已派超时列表
  dispatchedTimeout({ dispatch }, params) {
    return dispatch("publicSendService", {
      params,
      fun: indexApi.dispatchedTimeout
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
