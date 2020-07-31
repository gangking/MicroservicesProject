import {
  BASE_URL,
  COMP_URL
} from '@/api/baseUrl'
import _ from 'lodash'

const BASE_INVOICE_API = BASE_URL + COMP_URL

const REQUEST_TYPE = {
  POST: 'post',
  GET: 'get'
}

let EffectivenessAPI = {
  EFFECTIVENESS_SEVE: '/bsCheckStep/add', // 有效性检查保存
  BSCHECKSTEP_UPDATE: '/bsCheckStep/update', // 有效性检查修改
  BSCHECKSTEP_FINDALL: '/bsCheckStep/findAll', // 查询步骤表
  BSCHECKSTEP_QUERYALL: '/bsBasic/queryAllBo', // 查所有业务场景 /bsBasic/queryAllBo
  BSCHECKSTEP_DELETE: '/bsCheckStep/delete', // 有效性检查删除
  BSCHECKSTEP_ALLMSGCLASS: '/bsCheckStep/findAllForMsgClass', // 查询消息类型列表
  BSCHECKSTEP_ALLBYMSGID: '/bsCheckStep/findAllByMsgId', // 有效消息类型对应的消息文本列表
}

EffectivenessAPI = _.mapValues(EffectivenessAPI, function (v) {
  return BASE_INVOICE_API + v
})

export {
  REQUEST_TYPE,
  EffectivenessAPI
}
