import { forEachAssign, resetState } from "@/store/StoreUtils";
import { showLoading, hideLoading } from "@/utils/loading";
import _ from 'lodash'
const formWeakSet = new WeakSet();
// store/action.js
import * as types from "@/store/types";
import {
  getStepPloy,
  getInvoiceInfo,
  getFormStrategy,
  getProcessInfo,
  getBsiCode,
  bsCheckStepQuery,
  getMoneyNum
} from "@/api/platform/invoice";

import flowBtnApi from "@/api/platform/invoice/flowBtn";
// 检测所有的 state 并把 `initState()` 中的属性重置
const _state = {
  /**
   * 应用ID 表示流程定义id与场景id
   */
  appId: null,
  /**
   * 流程实例ID
   */
  instId: null,
  /**
   * 任务ID
   */
  taskId: null,
  /**
   * 表单状态参数
   */
  status: null,
  /**
   * 业务情形
   */
  bsiCode: null,
  /**
   *表头ID
   */
  tableHeaderId: null,

  /**
   * 复合步骤
   */
  steps: [],
  /**
   *
   */
  currentIndex: 0,
  /**
   * 表单抬头信息
   */
  headerInfo: null,

  /**
   * 当前表单流程步骤集合
   */
  processSteps: [],
  /**
   * 例外数量
   */
  formExceptionsCount: 0
};
const state = _.assign(_.clone(_state),
  {
    initState: () => {
      return _state
    }
  });

const mutations = {
  [types.SET_STATE](state, payload) {
    forEachAssign(state, payload);
  },
  [types.RESET_STATES](state, payload) {
    resetState(state);
  },

  setStepVal(state, payload) {
    let currentIndex = state.steps.findIndex((item) => {
      return item.id == payload.id;
    })
    console.log("设置步骤value", currentIndex == -1 ? 0 : currentIndex)
    state.currentIndex = currentIndex == -1 ? 0 : currentIndex;
  }
};

const getters = {
  currentStepVal({ currentIndex, steps }) {
    return steps.length > 0 ? steps[currentIndex] : null;
  },
  /**
   * 流程定义id
   */
  processDefId({ headerInfo }) {
    return headerInfo ? headerInfo.defId : null;
  },
  /**
   * 获取当前步骤的的业务场景ID
   * @param bsKey
   * @returns {*}
   */
  businessSceneId(state, { currentStepVal }) {
    if (currentStepVal) {
      return currentStepVal.bsKey;
    }
    return null;
  },

  businessEventId(state, { currentStepVal }) {
    if (currentStepVal) {
      return currentStepVal.btKey;
    }
    return null;
  },

  businessSceneName({ headerInfo }) {
    return headerInfo ? headerInfo.name : null;
  },

  docNumber({ headerInfo }) {
    return headerInfo ? headerInfo.docNumber : null;
  }
};

const actions = {
  publicSendService(
    { state: { appId, instId, taskId, status, bsiCode } },
    { params, fun }
  ) {
    showLoading()
    return fun({ appId, instId, taskId, status, bsiCode, ...params })
      .then(data => {
        hideLoading()
        return data;

      })
      .catch(req => {
        hideLoading()
        return req;
      });
  },

  initCompostite({ commit, dispatch }, query) {
    // commit(types.RESET_STATES)
    // 初始化金刚

    commit(types.RESET_STATES, {});
    commit(types.SET_STATE, query);
    return dispatch("getBsiCode").then(() => {
      return Promise.all([
        dispatch("getInvoiceHeadInfo"),
        dispatch("startGetSteps"),
        dispatch("getProcessStep"),
        dispatch("ibps/compositeDolog/getFormException", null, { root: true })
      ]);
    });
  },

  getBsiCode({ dispatch, commit }) {
    return dispatch("publicSendService", { params: {}, fun: getBsiCode }).then(
      ({ data: bsiCode }) => {
        commit(types.SET_STATE, { bsiCode });
      }
    );
  },
  /**
   * 获取复合表单头部信息
   * @param commit
   * @param defId(后面4个替掉这1个defId)
   * @returns {Promise<*>}
   */
  async getInvoiceHeadInfo({ commit, dispatch }, params = {}) {
    const headerInfo = await dispatch("publicSendService", {
      params,
      fun: getInvoiceInfo
    });
    console.log(headerInfo);
    commit(types.SET_STATE, { headerInfo });
    return headerInfo;
  },

  /**
   * 获取分步消息
   * @param commit
   * @param scenarioId
   * @returns {PromiseLike<T> | Promise<T> | *}
   */
  async startGetSteps({ commit, dispatch }, params = {}) {
    const { data: steps } = await dispatch("publicSendService", {
      params,
      fun: getStepPloy
    });
    commit(types.SET_STATE, { steps });

    return steps;
  },
  /**
 
  /**
   * 根据业务事务获取分步
   * @param commit
   * @param defId
   * @param bsKey
   * @param btgCode
   * @returns {Promise<void>}
   */
  async getFormStrategy(
    {
      commit,
      dispatch,
      getters: { businessSceneId: bsKey },
      state: { bsiCode: currentBsiCode }
    },
    { btgCode: bsiCode }
  ) {
    if (!bsiCode || currentBsiCode === bsiCode) {
      return 0;
    }
    commit(types.SET_STATE, { bsiCode });
    return dispatch("startGetSteps");
  },

  // 获取流程进度条信息
  async getProcessStep({ commit, dispatch, state: { instId, taskId } }) {
    const params = taskId
      ? { taskId }
      : {
        instId
      };
    const { data: processSteps } = await flowBtnApi.flowHistorySpeed(params);

    commit(types.SET_STATE, { processSteps });
    return processSteps;
  },
  //重新提交
  async getProcessInfo(
    { commit, dispatch, state: { tableHeaderId: headId, taskId } },
    { buttonCode, processParams }
  ) {
    const { data, cause, state } = await dispatch("publicSendService", {
      params: {
        buttonCode,
        headId,
        ...processParams
      },
      fun: getProcessInfo
    });
    console.log("重新提交返回参数", data, cause, state);
    return {
      cause,
      state
    };
  }
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
};
