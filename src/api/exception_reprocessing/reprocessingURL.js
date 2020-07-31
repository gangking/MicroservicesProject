import { BASE_URL, COMP_URL} from '@/api/baseUrl'
import _ from 'lodash'
const BASE_INDEX_API = BASE_URL + COMP_URL
const REQUEST_TYPE = {
    POST: 'post',
    GET: 'get'
}

let INDEX_API = {
    BUDGETPRE_QUERYLIST: '/scene/v3/auditStatus/query', // 查流程异常重处理表格数据
    AGIN_COMPLETE: '/scene/v3/complexService/again/complete', // 流程异常重处理
    DELETE_COMPLETE: '/scene/v3/complexService/remove/auditStatus', // 流程异常重处理
}

INDEX_API = _.mapValues(INDEX_API, function(v) {
    return BASE_INDEX_API + v
})


export {
    INDEX_API,
    REQUEST_TYPE
}