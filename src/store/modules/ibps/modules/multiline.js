import _ from 'lodash'
import {
    searchBo,
    querySqlTitle,
    pageBtn,
    querySqlList,
    queryDynForm,
    querySqlById,
    // remove,
    getOutlineButtons
} from '@/api/platform/invoice/multilineForm'
import DynamicFormModel from '@/js-model/dynamic-form-model'
import {
    saveFormData
} from '@/api/platform/invoice'

const state = {
    business_type_list: [],
    outline_table_define: {},
    cross_form_data: {},
    step_btns: [],
    tags: [
        {
            describe: '业务类型',
            name: 'business_type'
        }
    ],
    step_val: {},
    business_event_id: '',
    component_type: 'BusinessType',
    current_tag_form_data: DynamicFormModel.parse({})

}
const mutations = {}
_.keys(state).forEach((item) => {
    mutations[_.camelCase(item)] = function(state, payload) {
        state[item] = payload
    }
})

const getters = {}
const actions = {
    async startPayable({ commit, dispatch }, step_val) {
        const { btKey } = step_val
        commit('stepVal', step_val)
        commit('businessEventId', btKey)
        dispatch('getBusinessTypeList', {})
        dispatch('getOutlineTableDefine')
    },

    /**
     * 可用业务类型查询接口
     * @param {*} param0
     * @param {*} param1
     */
    async getBusinessTypeList({ commit, rootState }, { name = '', recently = '' }) {
        const { ibps: { payable: { business_id: ywswId }}} = rootState
        const { data } = await searchBo({
            ywswId: '600000000000000004',
            name,
            recently,
            defId: '619667964924264448',
            nodeId: '',
            bsKey: '600000000000000000'
        })
        commit('businessTypeList', data)
        return data
    },

    async getOutlineTableDefine({ commit, rootState }) {
        const {
            ibps: {
                payable: {
                    business_event_id: ywswid,
                    task_instance_id: id
                }
            }
        } = rootState
        const table_define_list = await Promise.all([
            querySqlTitle({
                ywswId: '600000000000000004'
            }
            ),
            getOutlineButtons({
                ywswId: '600000000000000004',
                defI: '619667964924264448',
                nodeId: '',
                bsKey: '600000000000000000'
            }),
            querySqlList({
                ywswId: '600000000000000004',
                id: '621442187200036864'
            })
            // remove({
            //   ywswId: '600000000000000004',
            //   ids: '621442187200036864'
            // })
        ])
        const [
            { data: table_title_define },
            { data: table_btns },
            { data: table_data }
        ] = table_define_list
        commit('outlineTableDefine', {
            table_title_define,
            table_btns,
            table_data
        })
    },

    async getFormDefine({
        commit, rootState,
        state: { cross_form_data, current_tag_form_data }
    },
    {
        business_name = '', ywlxId, data_id = null, nodeId = ''
    }) {
        const {
            ibps: {
                payable: {
                    business_id: bsKey,
                    task_process_id: defId
                }
            }
        } = rootState

        const data = await queryDynForm({
            ywlxId,
            bsKey,
            defId,
            nodeId
        })
        const { tableName } = data
        if (data_id) {
            const { data: form_data_values } = await querySqlById({ id: data_id, tableName })
            cross_form_data[ywlxId] = form_data_values
        } else if (!cross_form_data[ywlxId]) {
            cross_form_data[ywlxId] = {}
        }
        data['formData'] = cross_form_data[ywlxId]
        commit('currentTagFormData', data)
        return current_tag_form_data
    },

    selectBusinessType({ commit, dispatch }, { id: ywlxId, bcDescribe }) {
        /**
         * 右侧tag是基于业务类型选择来的
         */
        commit('tags', [{
            describe: bcDescribe,
            name: bcDescribe,
            ywlxId
        }])
        commit('componentType', 'MultilineDynamicForm')
        dispatch('getFormDefine', { ywlxId })
    },

    selectBusinessTypeDataCreate({ commit }) {
        commit('tags', [{
            describe: '业务类型',
            name: 'business_type'
        }])
        commit('componentType', 'BusinessType')
    },

    async getStepButtons({ commit, rootState }) {
        const { ibps: { payable: { business_id: ywswid }}} = rootState
        const { data } = await
        pageBtn({
            ywswid
        })
        commit('stepBtns', data)
        return data
    },
    multilineSaveFormData({ commit, rootState, state }, info) {
        const {
            ibps: {
                payable: {
                    table_head_id: tableHeadId,
                    pro_inst_id: proInstId,
                    business_id: bsKey,
                    task_process_id: defId
                }
            }
        } = rootState
        saveFormData({
            map: info.val,
            tableName: info.data.tableName,
            ywswId: state.business_event_id,
            headId: rootState.ibps.payable.table_head_id,
            headFlag: info.data.headFlag,
            defId: rootState.ibps.payable.task_process_id,
            proInstId: rootState.ibps.payable.pro_inst_id
        }).then((res) => {
            console.log('保存成功')
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
