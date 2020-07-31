import request from "@/utils/request";
import { INDEX_API, REQUEST_TYPE } from "./reprocessingURL";

var indexApi = {
  /**
   * 获取流程异常重处理表格数据
   * @param params
   */
  reprocessingList(params) {
    return request({
      url: INDEX_API.BUDGETPRE_QUERYLIST,
      method: REQUEST_TYPE.POST,
      data: params
    });
  },
  /**
   * 流程异常重处理
   * @param params
   */
  exceptionReprocessing(params) {
    return request({
      url: INDEX_API.AGIN_COMPLETE+"?auditIds="+params.auditIds,
      method: REQUEST_TYPE.POST,
      data: {}
    });
  },
  /**
   * 删除
   * @param params
   */
  deleteReprocessing(params) {
    return request({
      url: INDEX_API.DELETE_COMPLETE+"?auditIds="+params.auditIds,
      method: REQUEST_TYPE.POST,
      data: {}
    });
  }
};

export default indexApi;