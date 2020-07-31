import _ from 'lodash'
import DynamicFormModel from '@/js-model/dynamic-form-model'
import flowHeadInfoModel from '@/js-model/invoice-flow-headInfo'
import {
    getStepPloy,
    getFormData,
    getFormDefine,
    getFormTag,
    saveFormData,
    getFormStrategy,
    getSingleFormButton,
    getInvoiceInfo,
    getSingleFormPermission
} from '@/api/platform/invoice'

// 导入流程按钮api
import flowBtnApi from '@/api/platform/invoice/flowBtn'

const state = {
    cross_form_data: {},
    invoice_step: [],
    tags: [],
    step_btns: [],
    strategys: [],
    process_val: [],
    invoice_head_info: flowHeadInfoModel.parse({}),
    // 流程定义id
    task_process_id: null,
    // 业务场景id
    business_id: -1,
    // 流程实例id
    task_instance_id: null,
    // 业务事务id
    business_event_id: -1,
    /**
   * 流程实例id
   */
    pro_inst_id: '',
    // 头部id
    table_head_id: '',
    // 时光线数据
    time_line_list: [],

    current_tag_form_data: DynamicFormModel.parse({}),
    current_step_val: {}
}

const mutations = {}
_.keys(state).forEach((item) => {
    mutations[_.camelCase(item)] = function(state, payload) {
        state[item] = payload
    };
})

const getters = {}

const actions = {

    async startPayable({ commit, dispatch }, {
        process_id = null,
        instance_id = null
    }) {
        commit('taskInstanceId', instance_id)
        commit('taskProcessId', process_id)
        dispatch('startGetStepPloy')
        dispatch('getTimeLineList')
        dispatch('getInvoiceHeadInfo')
    },

    /**
     * 获取分步消息
     * @param commit
     * @param scenarioId
     * @returns {PromiseLike<T> | Promise<T> | *}
     */
    async startGetStepPloy({ commit, dispatch, state: { task_process_id: bsKey }}) {
        const { data: step_ploy_data } = await getStepPloy({ bsKey })
        const [first = {}] = step_ploy_data
        const { bsKey: businessId } = first
        commit('invoiceStep', step_ploy_data)
        commit('businessId', businessId)
        return step_ploy_data
    },

    async getInvoiceHeadInfo({ commit, state: { task_process_id: defId }}) {
        const data = await getInvoiceInfo({ defId })
        console.log('更新单据头部数据1',data)
        commit('invoiceHeadInfo', data)
        return data
    },

    async getStepFormTag({ commit, dispatch }, step_val) {
        const { slcfKey } = step_val
        const { data } = await getFormTag({ slcfKey })
        const [first = {}] = data
        commit('tags', data)
        commit('currentStepVal', step_val)
        dispatch('getStepFormDefine', first)
        dispatch('getSingleFormButton', first)
        return data
    },

    /**
     *
     * @param commit
     * @param taskInstanceId
     * @param taskProcessId
     * @param cross_form_data
     * @param slcfTabKey
     * @returns {Promise<{formDefine: *, formData: *, permissions: null, formParams: {}, readonly: boolean, initialization: boolean}>}
     */
    async getStepFormDefine({
        commit,
        state: {
            task_instance_id,
            task_process_id,
            cross_form_data,
            current_tag_form_data,
            business_id: bsKey
        }
    }, { slcfKey: slcfTabKey }) {
        const data = await getSingleFormPermission({ defId: task_process_id, slcfTabKey, bsKey })
        console.log('lkfllf---', data)
        console.log(data)
        if (task_instance_id) {
            const { data: form_data_values } = await getFormData({ task_instance_id, task_process_id })
            cross_form_data[slcfTabKey] = form_data_values
        } else if (!cross_form_data[slcfTabKey]) {
            cross_form_data[slcfTabKey] = {}
        }

        data['formData'] = cross_form_data[slcfTabKey]
        commit('currentTagFormData', data)
        return current_tag_form_data
    },

    async getSingleFormButton({ commit }, { slcfKey }) {
        const { data } = await getSingleFormButton({ slcfKey })
        commit('stepBtns', data)
        return data
    },

    async getFormStrategy({ commit, state: { task_process_id: defId, current_step_val: { bsKey }}}, { btgCode }) {
        const { data } = await getFormStrategy({
            bsKey,
            btgCode,
            defId

        })

        commit('invoiceStep', Object.freeze(data))

        return data
    },

    // 获取审批流程API
    async getTimeLineList({ commit, state: { task_process_id }}) {
        const { data } = await flowBtnApi.flowHistory({
            taskId: ''
        })
        commit('timeLineList', data)
        return data
    },

    saveFormData({ commit, state: { task_process_id }}, { value, data }) {
        return saveFormData({
            map: value,
            tableName: data.tableName,
            ywswId: '',
            headId: '',
            headFlag: data.headFlag,
            defId: task_process_id,
            proInstId: ''
        }).then(({ data }) => {
            commit('proInstId', data.proInstId)
            commit('tableHeadId', data.headId)
        })
    }

}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
}
