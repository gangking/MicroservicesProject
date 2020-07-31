import { forEachAssign, resetState } from "@/store/StoreUtils";
import * as types from "@/store/types";
import { ExitButton, exceptionButton } from "@/js-model/static-btns";
import ActionUtils from "@/utils/action";
import fecha from "@/utils/fecha";

import {
  getFormData,
  getFormTag,
  saveFormData,
  getSingleFormButton,
  getSingleFormPermission,
  getProcessButtonQuery
} from "@/api/platform/invoice";
import {
  searchBo,
  querySqlTitle,
  pageBtn,
  querySqlList,
  queryDynForm,
  querySqlById,
  processSubmit,
  paySendButtons,
  remove,
  outlineTableCopy,
  getOutlineButtons
} from "@/api/platform/invoice/multilineForm";
import {
  getMoneyNum,
  flexibleUploadCol,
  downloadExcel
} from "@/api/platform/invoice";
const state = {
  isRefresh: false,
  ywswId: "",
  ywlxId: "",
  invoiceInfo: {},
  tableData: [],
  // 摘要列表数据
  summary_table_info: {}
};

const mutations = {
  [types.SET_STATE](state, payload) {
    forEachAssign(state, payload);
  },
}

const getters = {};

const actions = {
  initSingeForm({ commit, dispatch }, currentStepsVal) {
    commit(types.SET_STATE, { currentStepsVal });
  },

  publicSendService({ dispatch }, { params, fun }) {
    return dispatch(
      "ibps/compositeBase/publicSendService",
      { params, fun },
      { root: true }
    );
  },


  // 用于发票预览
  setInvoiceInfo({ commit }, info) {
    commit(types.SET_STATE, { invoiceInfo: info });
  },

  async getBtnsAndTags({ dispatch }, { btKey: ywswId }) {
    const params = { ywswId, nodeId: "" };
    const [{ data: funcBtns }, { data: rightsBtns = [] }] = await Promise.all([
      dispatch("publicSendService", { params, fun: pageBtn }),
      dispatch("publicSendService", { params: {}, fun: getProcessButtonQuery })
    ]);
    return {
      funcBtns: [ExitButton, ...funcBtns],
      rightsBtns: [exceptionButton, ...rightsBtns]
    };
    //return { funcBtns, rightsBtns }
  },

  /**
   * 摘要表数据
   * @param {}} param0
   * @param {*} param1
   */
  async getOutlineTableDefine(
    { commit, dispatch, rootState, rootGetters },
    info
  ) {
    const {
      ibps: {
        compositeBase: { tableHeaderId }
      }
    } = rootState;
    // debugger;
    const ywswId = info.btKey;
    const table_define_list = await Promise.all([
      dispatch("publicSendService", {
        params: {
          ywswId
        },
        fun: querySqlTitle
      }),

      dispatch("publicSendService", {
        params: {
          ywswId,
          nodeId: ""
        },
        fun: getOutlineButtons
      }),
      tableHeaderId
        ? querySqlList({
          ywswId,
          id: tableHeaderId
        })
        : Promise.resolve({ data: [] }),
      // 获取统计金额脚本及样式
      dispatch("publicSendService", {
        params: {
          btKey: ywswId
        },
        fun: getMoneyNum
      })
    ]);
    const [
      { data: table_title_define },
      { data: table_btns },
      { data: table_data },
      { data: message_data }
    ] = table_define_list;

    commit(types.SET_STATE, { tableData: table_data });
    return {
      table_title_define,
      table_btns,
      table_data,
      message_data
    };
  },

  /**
   * 获取表单定义
   */
  async _getFormDefine(
    { dispatch, rootGetters },
    { ywlxId, data_id = null, nodeId = "" }
  ) {
    const defId = rootGetters["ibps/compositeBase/processDefId"];
    const data = await dispatch("publicSendService", {
      params: {
        ywlxId,
        defId,
        nodeId
      },
      fun: queryDynForm
    });
    data["ywlxId"] = ywlxId;
    return data;
  },
  /**
   * 仅提交流程
   * @param {*} param
   * @param {*} info
   */
  multilineProcessSubmit({ rootState, dispatch }, { buttonCode }) {
    const {
      ibps: {
        compositeBase: { tableHeaderId: headId }
      }
    } = rootState;
    // console.log('value----' + value)
    // info.val.parentId = table_head_id

    return dispatch("publicSendService", {
      params: { headId, buttonCode },
      fun: processSubmit
    });
  },
  /**
   * 查询多行表单
   * @param {*} param0
   * @param {*} param1
   */
  async getFormDefineById(
    { commit, dispatch, rootGetters },
    { tagVal, btype, dataId, stepVal }
  ) {
    // debugger;
    const ywswId = stepVal.btKey;
    const ywlxId = btype.id;

    const data = await dispatch("_getFormDefine", { ywlxId });
    data["formData"] = {};
    if (dataId) {
      const { data: form_data_values } = await querySqlById({
        id: dataId,
        ywswId,
        ywlxId
      });
      data["formData"] = form_data_values;

    }



    return data;
  },
  async getBusinessTypeList(
    { commit, dispatch, rootGetters },
    { name = "", recently = "", businessEventId: ywswId }
  ) {
    const { data } = await dispatch("publicSendService", {
      params: {
        ywswId,
        name,
        recently,
        nodeId: "" // 默认吧
      },
      fun: searchBo
    });

    return data;
  },
  /**
   * 复制项目
   * @param {*} param0
   * @param {*} info
   */
  copyOutlineTableData({ dispatch }, { stepVal, outlineTableSelections }) {
    const ywswId = stepVal.btKey;
    const ids = outlineTableSelections
      .map(item => {
        return item.id;
      })
      .join(",");
    return dispatch("publicSendService", {
      params: { ywswId, ids },
      fun: outlineTableCopy
    })
      .then(res => {
        return true;
      })
      .catch(req => {
        return false;
      });
  },
  /**
   * 删除项目
   * @param {*} param0
   * @param {*} info
   */
  removeOutlineTableFormData(
    { dispatch },
    { stepVal, outlineTableSelections }
  ) {
    const ywswId = stepVal.btKey;
    const ids = outlineTableSelections
      .map(item => {
        return item.id;
      })
      .join(",");
    return dispatch("publicSendService", {
      params: { ywswId, ids },
      fun: remove
    })
      .then(res => {
        return true;
      })
      .catch(req => {
        return false;
      });
  },
  /**
   * 灵活上载
   * @param {*} param0
   * @param {*} info
   */
  flexibleUploadFunc({ rootState, rootGetters, dispatch }, { file, stepVal }) {
    const ywswId = stepVal.btKey;
    const {
      ibps: {
        compositeBase: {
          tableHeaderId: table_head_id,
          bsiCode: bsiCode,
          appId: appId,
          instId: instId,
          taskId: taskId,
          status: status
        },
        compositeSingle: { tableName }
      }
    } = rootState;
    var dto = {
      appId: appId,
      instId: instId,
      taskId: taskId,
      status: status,
      bsiCode: bsiCode,
      tableName: tableName,
      ywswId: ywswId,
      headId: table_head_id
    };
    var data = {
      file: file,
      dto: JSON.stringify(dto)
    };
    // console.log("灵活上载参数", data, dto);
    return flexibleUploadCol(data)
      .then(res => {
        return res;
      })
      .catch(req => {
        return false;
      });
  },
  /**
   * 灵活下载
   */
  downloadExcelFunc({ commit, rootState, state, rootGetters, dispatch }, info) {
    const {
      ibps: {
        compositeBase: {
          appId: appId,
          instId: instId,
          taskId: taskId,
          status: status,
          bsiCode: bsiCode
        }
      }
    } = rootState;
    const defId = rootGetters["ibps/compositeBase/processDefId"];
    var data = {
      appId: appId,
      bsiCode: bsiCode,
      defId: defId,
      instId: instId,
      nodeId: "",
      status: status,
      taskId: taskId,
      ywlxId: info.id
    };
    // console.log("灵活下载参数", data);
    return downloadExcel(data)
      .then(res => {
        if (!res) {
          return false;
        }
        ActionUtils.exportFile(
          res.data,
          info.bcDescribe + fecha.formatDate("yyyyMMddHHmmss") + ".xls"
        );
        return true;
      })
      .catch(req => {
        return false;
      });
  },
  /**
   * 多行表单保存
   * @param {*} param0
   * @param {*} info
   */
  multilineSaveFormData(
    { commit, rootState, state, rootGetters, dispatch },
    info
  ) {
    const {
      ibps: {
        compositeBase: { tableHeaderId }
      }
    } = rootState;
    // info.val.parentId = table_head_id
    console.log("多行表单保存参数", info, '业务事务ID', info.stepVal);
    return dispatch("publicSendService", {
      params: {
        map: info.val,
        tableName: info.data.tableName,
        ywswId: info.stepVal.btKey,
        ywlxId: info.data.ywlxId,
        headId: tableHeaderId,
        headFlag: info.data.headFlag,
        //bcCode: 'BC0104'
        bcCode: info.data.bcCode,
      },
      fun: saveFormData
    })
      .then(res => {
        console.log("表单保存结果返回", res);
        // 更新例外消息
        dispatch("ibps/compositeDolog/getFormException", {}, { root: true });
        return res;
      })
      .catch(req => {
        return false;
      });
  },
  /**
   * 多行表单保存(用于发票导入)
   * @param {*} param0
   * @param {*} info
   */
  multilineInvioImportData(
    { commit, rootState, state: { isRefresh }, rootGetters, dispatch },
    info
  ) {
    const {
      ibps: {
        compositeBase: { tableHeaderId }
      }
    } = rootState;
    // info.val.parentId = table_head_id
    console.log("多行表单保存参数", info, '业务事务ID', info.stepVal);
    return dispatch("publicSendService", {
      params: {
        map: info.val,
        tableName: info.data.tableName,
        ywswId: info.stepVal.btKey,
        ywlxId: info.data.ywlxId,
        headId: tableHeaderId,
        headFlag: info.data.headFlag,
        bcCode: 'BC0104'
      },
      fun: saveFormData
    })
      .then(res => {
        console.log("表单保存结果返回", res);

        //commit(types.SET_STATE, { isRefresh: isRefresh?false:true });
        // 更新例外消息
        dispatch("ibps/compositeDolog/getFormException", {}, { root: true });
        return res;
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
