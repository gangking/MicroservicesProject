import request from '@/utils/request'
import {
  EffectivenessAPI,
  REQUEST_TYPE
} from './EffectivenessURL'

var effectApi = {
  // 有效性检查保存
  effectivenessSave: (data) => {
    return request({
      url: EffectivenessAPI.EFFECTIVENESS_SEVE,
      method: REQUEST_TYPE.POST,
      data
    })
  },
  // 有效性检查修改
  bsCheckStepUpdate: (data) => {
    return request({
      url: EffectivenessAPI.BSCHECKSTEP_UPDATE,
      method: REQUEST_TYPE.POST,
      data
    })
  },
  // 查询步骤列表
  bsCheckStepFindAll: (params) => {
    return request({
      url: EffectivenessAPI.BSCHECKSTEP_FINDALL,
      method: REQUEST_TYPE.GET,
      params: params
    })
  },
  // 查所有业务场景
  bsBasicQueryAll: (params) => {
    return request({
      url: EffectivenessAPI.BSCHECKSTEP_QUERYALL,
      method: REQUEST_TYPE.GET,
      params: params
    })
  },
  // 有效性检查删除
  bsCheckStepDelete: (params) => {
    return request({
      url: EffectivenessAPI.BSCHECKSTEP_DELETE,
      method: REQUEST_TYPE.GET,
      params: params
    })
  },
  //   查询消息类型列表
  findAllForMsgClass: ((params) => {
    return request({
      url: EffectivenessAPI.BSCHECKSTEP_ALLMSGCLASS,
      method: REQUEST_TYPE.GET,
      params: params
    })
  }),
  //   有效消息类型对应的消息文本列表
  findAllByMsgId: ((params) => {
    return request({
      url: EffectivenessAPI.BSCHECKSTEP_ALLBYMSGID,
      method: REQUEST_TYPE.GET,
      params: params
    })
  })
}

export default effectApi
