import { BASE_URL, COMP_URL, BPMN_URL } from '@/api/baseUrl'
import _ from 'lodash'
// BPMN_URL: ''
// COMP_URL: ''
const BASE_INDEX_API = BASE_URL + COMP_URL
const BASE_BPMN_API = BASE_URL + BPMN_URL
// const BASE_INDEX_API = 'http://192.168.30.13:5100/ibps/'
const REQUEST_TYPE = {
    POST: 'post',
    GET: 'get'
}

let INDEX_API = {
    RULESTEP_ADD: '/bsSubstitution/add',
    RULESTEP_UPDATE: '/bsSubstitution/update',
    RULESTEP_REMOVE: '/bsSubstitution/delete',
    RULESTEP_GET: '/bsSubstitution/findById',
    RULESTEP_LIST: '/bsSubstitution/findAll',
    BSCHECKSTEP_QUERYALL: '/bsBasic/queryAllBo', // 查所有业务场景
    RULES_ADD: '/bsSubstitution/addRules',
    RULES_UPDATE: '/bsSubstitution/updateRules',
    RULES_REMOVE: '/bsSubstitution/deleteRules',
    RULES_CHECKBACK: '/replaceAndCheck/replace', // 替代规则校验后台逻辑
    BAK: '/'
}

let BPMN_API = {
    YWLC_LIST: '/bpm/v3/bpm/definition/findByBoCode',
    BO_LIST: '/model/v3/bo/def/query',
    FORMBO_LIST: '/page/v3/form/def/findFormJsonByBo'
}
INDEX_API = _.mapValues(INDEX_API, function(v) {
    return BASE_INDEX_API + v
})
BPMN_API = _.mapValues(BPMN_API, function(v) {
    return BASE_BPMN_API + v
})

export {
    INDEX_API,
    BPMN_API,
    REQUEST_TYPE
}
