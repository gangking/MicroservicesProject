import { BASE_URL, COMP_URL, BPMN_URL } from '@/api/baseUrl'
import _ from 'lodash'

const BASE_INVOICE_API = BASE_URL + COMP_URL
const BASE_BPMN_API = BASE_URL + BPMN_URL
// const BASE_INVOICE_API = 'http://192.168.30.13:5100/ibps/'
const REQUEST_TYPE = {
    POST: 'post',
    GET: 'get'
}

let INVOICE_API = {
    PAGE_LIST: '/scene/v3/bpmBsRel/listAll',
    YWCJ_LIST: '/bsBasic/query',
    REMOVE: '/scene/v3/bpmBsRel/remove',
    RELEASE: '/scene/v3/bpmBsRel/publish',
    SAVE: '/scene/v3/bpmBsRel/save',
    BAK: '/'
}

let BPMN_API = {
    YWLC_LIST: '/bpm/v3/bpm/definition/findByBoCode',
    BO_LIST: '/model/v3/bo/def/query',
    FORMBO_LIST: '/page/v3/form/def/findFormJsonByBo'
}
INVOICE_API = _.mapValues(INVOICE_API, function(v) {
    return BASE_INVOICE_API + v
})
BPMN_API = _.mapValues(BPMN_API, function(v) {
    return BASE_BPMN_API + v
})

// INVOICE_API.FORM_DEF = "http://172.18.3.81:3000/mock/35/ibps/form/def/getFormDataByKey";
export {
    INVOICE_API,
    BPMN_API,
    REQUEST_TYPE
}
