import { forEachAssign, resetState } from "@/store/StoreUtils";
import { ExitButton, exceptionButton } from "@/js-model/static-btns";
import DynamicFormModel from '@/js-model/dynamic-form-model'
import * as types from "@/store/types";
import {
  getFormData,
  getFormTag,
  saveFormData,
  getSingleFormButton,
  getSingleFormPermission,
  getProcessButtonQuery
} from "@/api/platform/invoice";
import { changeContractButtons } from '@/api/platform/invoice/multilineForm'
const state = {
  /**
   * 表名
   */
  tableName: "",
  // 会议信息
  meetingTabInfo: [],
  current_tag_form_data: DynamicFormModel.parse({}),
  current_final_form_data: {}
};

const mutations = {
  [types.SET_STATE](state, payload) {
    forEachAssign(state, payload);
  },

  meetingTabInfo(state, payload) {
    state.meetingTabInfo = payload.list;
  },
  currentFinalFormData(state, payload) {
    state.current_final_form_data = payload;
  },
};

const getters = {};

const actions = {
  initSingeForm({ commit, dispatch }, currentStepsVal) {
    commit(types.SET_STATE, { currentStepsVal });
    return dispatch("getStepFormTag", currentStepsVal);
  },

  publicSendService({ dispatch }, { params, fun }) {
    return dispatch(
      "ibps/compositeBase/publicSendService",
      { params, fun },
      { root: true }
    );
  },
  /**
   * 变更合同
   */
  async changeContractSubmit({ commit, dispatch, state, rootState }) {
    const {
      current_tag_form_data: { formData: { CONTRACTNO: contract_id } }
    } = state
    //  console.log("合同变更", state)
    let params = {}
    //   console.log(`CONTRACTNO66===`,contract_id);

    params = {
      contractNo: contract_id
    }

    return dispatch("publicSendService", { params, fun: changeContractButtons }).then((res) => {
      // console.log(`合同掉接口成功`, res);
      return {
        flag: res.state,
        msg: res.message ? res.message : res.cause,
        data: res.data
      };
    }).catch((req) => {
      //  console.log(`合同掉接口失败`, req);
      return {
        flag: false,
        msg: req.message ? req.message : req.cause,
      };
    })

  },
  /**
   *
   * @param {*} param0
   * @param {*} tag
   */
  async getStepFormDefine(
    { commit, dispatch, rootState, rootGetters },
    { tag, stepVal }
  ) {
    const { id: slcfTabKey } = tag;
    //console.log("stepVal", stepVal)
    const { bsKey: ywcjId } = stepVal;
    const {
      ibps: {
        compositeBase: { bsiCode, instId }
      }
    } = rootState;

    const data = await dispatch("publicSendService", {
      params: { slcfTabKey },
      fun: getSingleFormPermission
    });
    data["formData"] = { BSI_CODE: bsiCode };
    data["slcfTabKey"] = slcfTabKey;
    if (instId) {
      const { data: form_data_values } = await dispatch("publicSendService", {
        params: { ywcjId },
        fun: getFormData
      });
      console.log("getDinfe", data);
      const { id_, ID_ } = form_data_values;
      commit(
        `ibps/compositeBase/${types.SET_STATE}`,
        { tableHeaderId: id_ || ID_ },
        { root: true }
      );
      data["formData"] = form_data_values;
      // commit('setTableName',)
    }
    console.log("表头名", data.tableName);

    commit(types.SET_STATE, { current_tag_form_data: data, tableName: data.tableName })

    console.log('getStepFormDefine方法返回数据', data)
    return data;
  },

  /**
   * 保存抬头表单树
   * @param {}} param0
   * @param {*} param1
   */
  saveFormData({ commit, rootState, rootGetters, dispatch }, item) {
    console.log("单行表单保存对象", item)
    const { value, data, stepVal: { btKey: ywswId } } = item;
    const {
      ibps: {
        compositeBase: { tableHeaderId }
      }
    } = rootState;
    return dispatch("publicSendService", {
      params: {
        map: value,
        tableName: data.tableName,
        ywswId,
        headId: tableHeaderId,
        headFlag: data.headFlag,
        slcfTabKey: data.slcfTabKey
      },
      fun: saveFormData
    }).then(({ data }) => {
      commit(
        `ibps/compositeBase/${types.SET_STATE}`,
        { instId: data.proInstId, tableHeaderId: data.headId },
        { root: true }
      );
      // 更新例外消息
      dispatch("ibps/compositeDolog/getFormException", {}, { root: true });
      dispatch("ibps/compositeBase/getProcessStep", {}, { root: true });
      dispatch("ibps/compositeBase/getInvoiceHeadInfo", {}, { root: true });
      return data;
    });
  },
  async getBtnsAndTags({ dispatch, commit }, { slcfKey }) {
    const params = { slcfKey };
    let [
      { data: tabs = [] },
      { data: funcBtns = [] },
      { data: rightsBtns = [] }
    ] = await Promise.all([
      dispatch("publicSendService", { params, fun: getFormTag }),
      dispatch("publicSendService", { params, fun: getSingleFormButton }),
      dispatch("publicSendService", { params, fun: getProcessButtonQuery })
    ]);
    funcBtns = funcBtns ? funcBtns : [];
    rightsBtns = rightsBtns ? rightsBtns : [];

    // 会议信息按钮点击展示需求 start
    // tabs.splice(tabs.findIndex(item => item.describe ==='会议信息'), 1)
    // tabs2.splice(tabs2.findIndex(item => item.describe !='会议信息'), 1)
    // 当有会议信息时，先不展示，通过按钮点出来
    var tabs1 = [];
    var tabs2 = [];
    for (var i = 0; i < tabs.length; i++) {
      var item = tabs[i];
      for (var key in item) {
        if (key == 'describe') {
          if (item.describe === '会议信息') {
            tabs2.push(item)
          } else {
            tabs1.push(item)
          }
        }
      }
    }

    // 仅当有会议信息的情况下替换
    if (tabs2.length > 0) {
      tabs = tabs1;
    }
    // 更新会议信息
    commit('meetingTabInfo', { list: tabs2 });
    // 会议信息按钮点击展示需求 end

    return {
      tabs,
      funcBtns: [ExitButton, ...funcBtns],
      rightsBtns: [exceptionButton, ...rightsBtns]
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
