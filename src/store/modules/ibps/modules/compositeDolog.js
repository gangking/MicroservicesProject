import flowBtnApi from "@/api/platform/invoice/flowBtn";
import previewApi from "@/api/platform/voucher/preview.js";
import { bsCheckStepQuery, saveCheck } from "@/api/platform/invoice";
import { forEachAssign, resetState } from "@/store/StoreUtils";
import * as types from "@/store/types";

const state = {
  /**
   * 表单打印列表
   */
  formPrintingList: [],
  /**
   * 表单例外消息列表
   */
  formExceptions: null
};

const mutations = {
  [types.SET_STATE](state, payload) {
    forEachAssign(state, payload);
  },
  setFormPrintingList(state, payload) {
    state.formPrintingList = payload.data;
  },
  setFormExceptions(state, payload) {
    state.formExceptions = payload.data;
  }
};

const getters = {
  /**
   * 例外消息提交判断
   */
  isHasFormExceptions({ formExceptions }) {
    console.log("获取例外消息列表", formExceptions);
    if (!formExceptions) {
      return false;
    }
    var list = formExceptions.dataResult;
    var count = list.length;
    for (var i = 0; i < list.length; i++) {
      var item = list[i];
      // console.log('警告消息校验tem.msgty',item.msgty)
      if (item.msgty == "W") {
        // console.log('警告消息校验',item.msgty == 'W' && item.status=='Y')
        if (item.status == "Y") {
          count--;
        }
      } else if (item.msgty != "E" && item.msgty != "X") {
        // console.log('错误危险消息消息校验',item.msgty != 'E' && item.msgty != 'X')
        count--;
      }
    }
    console.log("当前表单未标记的警告消息和错误且危险的数目为", count);
    return count > 0;
  }
};

const actions = {
  /**
   * 五大金刚绑定
   * @param {}} param0
   */
  publicSendService({ dispatch }, { params, fun }) {
    return dispatch(
      "ibps/compositeBase/publicSendService",
      { params, fun },
      { root: true }
    );
  },
  /**
   * 获取表单打印列表
   * @param {}} param0
   */
  async getFormPrintingList({ rootState, commit }) {
    const {
      ibps: {
        compositeBase: { appId, bsiCode }
      }
    } = rootState;
    // console.log("打印列表请求参数:", appId, bsiCode);
    return flowBtnApi
      .formPrintingList({
        appId: appId,
        bsiCode: bsiCode
      })
      .then(res => {
        // console.log("获取打印列表成功", res);
        commit("setFormPrintingList", res);
        return res.data;
      })
      .catch(req => {
        commit("setFormPrintingList", {
          data: []
        });
        return [];
      });
  },
  /**
   * 获取表单例外消息列表
   * @param {}} param0
   * @param {*} query
   */
  async getFormException({ rootState, dispatch, commit }) {
    const {
      ibps: {
        compositeBase: { instId }
      }
    } = rootState;
    // console.log("获取例外消息的instId", instId);
    if (instId) {
      const { data } = await dispatch("publicSendService", {
        params: {
          parameters: [
            {
              key: "Q^INST_ID_^SL",
              value: instId
              //  value: ''
            }
          ],
          requestPage: {
            pageNo: 1,
            limit: 100,
            totalCount: 100
          },
          sorts: []
        },
        fun: bsCheckStepQuery
      });
      console.log("获取例外消息的data", data);
      commit("setFormExceptions", { data });
      // commit("formExceptions", data);
      commit(
        `ibps/compositeBase/${types.SET_STATE}`,
        { formExceptionsCount: data.dataResult.length },
        { root: true }
      );
      return data;
    } else {
      return [];
    }
  },
  /**
   * 标记已读
   */
  async hideException({ rootState }, params) {
    console.log("标记已读参数", params);
    return saveCheck(params)
      .then(res => {
        console.log("标记已读参数fsss", res);
        return true;
      })
      .catch((req) => {
        console.log("标req记已读参数fsss", req);
        return false;
      });
  },
  /**
   * 获取会计凭证树形数据
   */
  async getFetchVoucherTreeList({ rootState }) {
    const {
      ibps: {
        compositeBase: { instId }
      }
    } = rootState;
    return previewApi
      .buildAccTree({
        instId: instId
      })
      .then(res => {
        var list = [];
        if (res.data) {
          list = res.data;
        }
        return list;
      })
      .catch(req => {
        return false;
      });
  },
  /**
   * 初始化树
   */
  async getQueryVoucherTreeList({ rootState }) {
    const {
      ibps: {
        compositeBase: { instId }
      }
    } = rootState;

    return previewApi
      .queryAccTree({
        instId: instId
      })
      .then(res => {
        console.log("凭证规则树形结构", res.data);
        var list = [];
        if (res.data) {
          list = res.data;
        }
        return list;
      })
      .catch(req => {
        return false;
      });
  },
  /**
   * 获取或刷新表头数据
   */
  async getFetchTabDef({ rootState }) {
    const {
      ibps: {
        compositeBase: { instId }
      }
    } = rootState;
    // var testid = "647855691616223232";
    return previewApi
      .tabDef({
        instId: instId
        // instId: testid
      })
      .then(res => {
        return res.data;
      })
      .catch(req => {
        return false;
      });
  },
  /**
   * 获取表格内容数据
   */
  async getFetchTabCon({ }, id, pageNo) {
    return previewApi
      .tabContent({
        extraParameters: {
          ids: id
        },
        requestPage: {
          pageNo: pageNo,
          limit: 9999
        }
      })
      .then(res => {
        return {
          tabContent: res.data,
          pageAll: res.data.pageResult
        };
      })
      .catch(req => {
        return false;
      });
  },
  /**
   * 获取tab底部统计金额信息
   */
  async getFetchTotalInfo({ }, id) {
    return previewApi
      .tabTotal({
        extraParameters: {
          ids: id
        }
      })
    /* .then(res => {
      return res.data;
    })
    .catch(req => {
      return false;
    }); */
  },
  /**
   * 获取表单头部信息
   */
  async getFetchDefForm({ rootState }) {
    const {
      ibps: {
        compositeBase: { instId }
      }
    } = rootState;
    // var testid = "647855691616223232";
    return previewApi
      .formDef({
        instId: instId
        // instId: testid
      })
      .then(res => {
        return res.data;
      })
      .catch(req => {
        return false;
      });
  },
  /**
   * 获取表单数据信息
   */
  async getFetchFormCon({ }, id) {
    return previewApi
      .formContent({
        id: id
      })
      .then(res => {
        return res.data;
      })
      .catch(req => {
        return false;
      });
  },
  /**
   * 凭证预览
   */
  async setVoucherModel({ rootState }) {
    const {
      ibps: {
        compositeBase: { instId }
      }
    } = rootState;

    return previewApi
      .voucherSim({
        instId: instId
      })
      .then(res => {
        console.log("凭证预览", res);
        if (res.state === 200) {
          return true;
        } else {
          return false;
        }
      })
      .catch(req => {
        return false;
      });
  },
  /**
   * 生成凭证
   */
  async setGenerVoucher({ rootState }) {
    const {
      ibps: {
        compositeBase: { instId }
      }
    } = rootState;

    return previewApi
      .voucherGenerNew({
        instIds: [instId]
      })
      .then(res => {
        console.log("凭证生成", res);
        if (res.state === 200) {
          return true;
        } else {
          return false;
        }
      })
      .catch(req => {
        return false;
      });
  }
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
};
