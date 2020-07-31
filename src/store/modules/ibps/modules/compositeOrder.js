import { forEachAssign, resetState } from "@/store/StoreUtils";
import * as types from "@/store/types";
import {

    crossOrderButtons,

} from '@/api/platform/invoice/multilineForm'
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

import {
    assetFixedButtons
} from '@/api/platform/invoice/multilineForm';
const actions = {
    publicSendService({ dispatch }, { params, fun }) {
        return dispatch(
            "ibps/compositeBase/publicSendService",
            { params, fun },
            { root: true }
        );
    },

    /**
    * 跨境订单
    * @param {*} param
    * @param {*} info
    */
    async crossOrderSubmit({ commit, dispatch, rootState }) {
        const {
            ibps: { compositeBase: { tableHeaderId: table_head_id, instId } }
        } = rootState
        let params = {}
        if (instId) {
            params = { table_head_id }
            return dispatch('publicSendService', { params, fun: crossOrderButtons })
        } else {
            return Promise.reject('表单流程是实例ID为空');
        }

    },
}


export default {
    namespaced: true,
    state,
    actions,
    mutations,
    getters
};
