import request from '@/utils/request'
import { FLOW_BTN_API, REQUEST_TYPE } from './InvoiceURL'

var flowBtnApi = {
  // 启动获取流程按钮
  getFormData: (params) => {
    return request({
      url: FLOW_BTN_API.FORM_DATA,
      method: REQUEST_TYPE.GET,
      params: params
    })
  },
  // 保存为草稿
  saveDraft: (data) => {
    return request({
      url: FLOW_BTN_API.SAVE_DRAFT,
      method: REQUEST_TYPE.POST,
      data
    })
  },
  // 获取流程图
  flowImageXml: (params) => {
    return request({
      url: FLOW_BTN_API.FLOW_IMG,
      method: REQUEST_TYPE.GET,
      params: params
    })
  },
  // 获取表单打印列表
  formPrintingList: (params) => {
    return request({
      url: FLOW_BTN_API.DO_LIST_PRINTTING,
      method: REQUEST_TYPE.GET,
      params: params
    })
  },
  // 表单打印
  formPrintingDown: (data) => {
    return request({
      url: FLOW_BTN_API.DO_DWON_PRINTTING,
      method: REQUEST_TYPE.POST,
      data: data,
    })
  },
  // 表单预览
  formPrintingYuLan: (params) => {
    return request({
      url: FLOW_BTN_API.DO_YULAN_PRINTTING,
      method: REQUEST_TYPE.GET,
      params: params,
      responseType:'blob'
    })
  },
  // 从草稿状态启动
  draftStart: (data) => {
    return request({
      url: FLOW_BTN_API.DRAFT_START,
      method: REQUEST_TYPE.POST,
      data
    })
  },
  // 同意/反对按钮
  agreeAgainst: (data) => {
    return request({
      url: FLOW_BTN_API.COMPLETE,
      method: REQUEST_TYPE.POST,
      data
    })
  },
  // 审批历史
  flowHistory: (data) => {
    return request({
      url: FLOW_BTN_API.FLOW_HISTORY,
      method: REQUEST_TYPE.POST,
      data
    })
  },
  // 审批历史进度条
  flowHistorySpeed: (data) => {
    return request({
      url: FLOW_BTN_API.FLOW_HISTORY_TWO,
      method: REQUEST_TYPE.POST,
      data
    })
  },
  // 终止进程
  draftStart: (data) => {
    return request({
      url: FLOW_BTN_API.DO_END_PROCESS,
      method: REQUEST_TYPE.POST,
      data
    })
  },

}

export default flowBtnApi
