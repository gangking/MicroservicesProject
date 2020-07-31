import { forEachAssign, resetState } from "@/store/StoreUtils";
import * as types from "@/store/types";
import {
    assetFixedButtons,
    createInvoiceButtons,
    assetCardAddButtons,
    captureValueButtons,
    mantGetButtons,
    goodsmvButtons,
    assetZcbfButtons,
    assetCardmovButtons,
    assetBfCardButtons,
    paySendNewButtons,
    paySendButtons,
    assetCjguButtons,
    assetCardupButtons,
    assetMovButtons
} from '@/api/platform/invoice/multilineForm';
const state = {

}

const mutations = {
    [types.SET_STATE](state, payload) {
        forEachAssign(state, payload);
    },
    [types.RESET_STATES](state, payload) {
        resetState(state);
    }
};

const getters = {

}


const actions = {
    publicSendService({ dispatch }, { params, fun }) {
        return dispatch(
            "ibps/compositeBase/publicSendService",
            { params, fun },
            { root: true }
        );
    },
    /**
     * 资产转固
     */
    async assetFixedSubmit({ commit, dispatch, rootState }) {
        const {
            ibps: { compositeBase: { tableHeaderId: table_head_id } }
        } = rootState
        let params = { table_head_id }
        return dispatch('publicSendService', { params, fun: assetFixedButtons })
    },

    /**
    * 发票创建
    * @param {*} param
    * @param {*} info
    */
    async createFpSubmit({ commit, dispatch, rootState }) {
        console.log(`rootState=====`, rootState)
        const {
            ibps: { compositeBase: { tableHeaderId: table_head_id, instId } }
        } = rootState
        let params = { table_head_id }
        return dispatch('publicSendService', { params, fun: createInvoiceButtons })
    },
    /**
     * 卡片创建
     * @param {*} param
     * @param {*} info
     */
    async assetCardAddSubmit({ commit, dispatch, rootState }) {
        const {
            ibps: { compositeBase: { tableHeaderId: table_head_id } }
        } = rootState
        let params = { table_head_id };
        return dispatch('publicSendService', { params, fun: assetCardAddButtons })

        // return { state: 200, message: '操作成功！' }
    },

    /**
    * 获取价值
    * @param {*} param
    * @param {*} info
    */
    async captureValueSubmit({ commit, dispatch, rootState }) {
        const {
            ibps: { compositeBase: { tableHeaderId: table_head_id } }
        } = rootState
        let params = { table_head_id };
        return dispatch('publicSendService', { params, fun: captureValueButtons })

    },
    /**
     * 库存检查
     * @param {*} param
     * @param {*} info
     */
    async matstockSubmit({ commit, dispatch, rootState }) {
        const {
            ibps: { compositeBase: { tableHeaderId: table_head_id } }
        } = rootState
        let params = { table_head_id };
        return dispatch('publicSendService', { params, fun: mantGetButtons });
    },
    /**
     * 货物移动
     * @param {*} param
     * @param {*} info
     */
    async goodsmvSubmit({ commit, dispatch, rootState }) {
        console.log(`rootState=====`, rootState)

        const {
            ibps: { compositeBase: { tableHeaderId: table_head_id } }
        } = rootState
        let params = { table_head_id };
        return dispatch('publicSendService', { params, fun: goodsmvButtons });

    },

    /**
      * 报废
      */
    async assetZcbfSubmit({ commit, dispatch, rootState }) {

        const {
            ibps: { compositeBase: { tableHeaderId: table_head_id } }
        } = rootState
        let params = { table_head_id };
        return dispatch('publicSendService', { params, fun: assetZcbfButtons });

    },
    /**
      *  创建卡片并转换
      */
    async assetCardmovSubmit({ commit, dispatch, rootState }) {
        const {
            ibps: { compositeBase: { tableHeaderId: table_head_id } }
        } = rootState
        let params = { table_head_id };
        return dispatch('publicSendService', { params, fun: assetCardmovButtons });

    },
    /**
      *  报废并创建卡片
      */
    async assetBfCardSubmit({ commit, dispatch, rootState }) {
        const {
            ibps: { compositeBase: { tableHeaderId: table_head_id } }
        } = rootState
        let params = { table_head_id };
        return dispatch('publicSendService', { params, fun: assetBfCardButtons });
    },
    /**
     * 付款发送
     * @param {*} param
     * @param {*} info
     */
    async paySendSubmit({ commit, dispatch, rootState }) {
        const {
            ibps: { compositeBase: { tableHeaderId: table_head_id } }
        } = rootState
        let params = { table_head_id };
        return dispatch('publicSendService', { params, fun: paySendNewButtons });

    },

    /**
  * 付款返回信息
  * @param {*} param
  * @param {*} info
  */
    async paySendReqInfo({ commit, dispatch, rootState }) {
        const {
            ibps: { compositeBase: { tableHeaderId: table_head_id } }
        } = rootState
        let params = { table_head_id };
        return dispatch("publicSendService", { params, fun: paySendButtons })
    },

    /**
      *  创建转固
      */
    async assetCjguSubmit({ commit, dispatch, rootState }) {
        const {
            ibps: { compositeBase: { tableHeaderId: table_head_id } }
        } = rootState
        let params = { table_head_id };
        return dispatch("publicSendService", { params, fun: assetCjguButtons })

    },

    /**
       * 卡片维护
       */
    async assetCardupSubmit({ commit, dispatch, rootState }) {
        const {
            ibps: { compositeBase: { tableHeaderId: table_head_id } }
        } = rootState
        let params = { table_head_id };
        return dispatch("publicSendService", { params, fun: assetCardupButtons })

        // return { state: 200, message: '操作成功！' }
    },
    /**
        *  转移接口服务
        */
    async assetMovSubmit({ commit, dispatch, rootState }) {
        const {
            ibps: { compositeBase: { tableHeaderId: table_head_id } }
        } = rootState
        let params = { table_head_id };
        return dispatch("publicSendService", { params, fun: assetMovButtons })


    },

}


export default {
    namespaced: true,
    state,
    actions,
    mutations,
    getters
};
