import request from '@/utils/request'
import { INDEX_API, BPMN_API, REQUEST_TYPE } from './rulesURL'

var rulesApi = {

    /**
 * 替代规则步骤添加
 * @param params
 */
    effectivenessSave(data) {
        return request({
            url: INDEX_API.RULESTEP_ADD,
            method: REQUEST_TYPE.POST,
            data
        })
    },
    /**
 * 替代规则步骤修改
 * @param params
 */
    bsCheckStepUpdate(data) {
        return request({
            url: INDEX_API.RULESTEP_UPDATE,
            method: REQUEST_TYPE.POST,
            data
        })
    },
    /**
 * 替代规则步骤详情
 * @param params
 */
    ruleStepGet(params) {
        return request({
            url: INDEX_API.RULESTEP_GET,
            method: REQUEST_TYPE.GET,
            params: params
        })
    },
    /**
 * 替代规则步骤列表
 * @param params
 */
    bsCheckStepFindAll(params) {
        return request({
            url: INDEX_API.RULESTEP_LIST,
            method: REQUEST_TYPE.GET,
            params: params
        })
    },
    // 查所有业务场景
    bsBasicQueryAll: (params) => {
        return request({
            url: INDEX_API.BSCHECKSTEP_QUERYALL,
            method: REQUEST_TYPE.GET,
            params: params
        })
    },
    /**
 * 替代规则步骤删除
 * @param params
 */
    bsCheckStepDelete(params) {
        return request({
            url: INDEX_API.RULESTEP_REMOVE,
            method: REQUEST_TYPE.GET,
            params: params
        })
    }
//     /**
//  * 替代规则新增
//  * @param params
//  */
//     rulesAdd(data) {
//         return request({
//             url: INDEX_API.RULES_ADD,
//             method: REQUEST_TYPE.POST,
//             data
//         })
//     },
//     /**
//  * 替代规则更新
//  * @param params
//  */
//     rulesUpdate(data) {
//         return request({
//             url: INDEX_API.RULES_UPDATE,
//             method: REQUEST_TYPE.POST,
//             data
//         })
//     },
//     /**
//  * 替代规则删除
//  * @param params
//  */
//     rulesRemove(params) {
//         return request({
//             url: INDEX_API.RULES_REMOVE,
//             method: REQUEST_TYPE.GET,
//             params: params
//         })
//     },
//     /**
//      * 替代规则校验后台逻辑
//      * @param params
//      */
//     rulesCheckBack(data) {
//         return request({
//             url: INDEX_API.RULES_CHECKBACK,
//             method: REQUEST_TYPE.POST,
//             data
//         })
//     }
}

export default rulesApi
