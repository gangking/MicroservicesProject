import request from "@/utils/request";
import { INDEX_API,BUSINES_API, REQUEST_TYPE } from "./voucherURL";

var indexApi = {
  /**
   * 获取凭证树形结构
   * @param params
   */
  buildAccTree(params) {
    return request({
      url: INDEX_API.BUILDACC_TREE,
      method: REQUEST_TYPE.POST,
      data: params
    });
  },

  /**
   * 业务场景查询
   * @param params
   */
  queryBssoList(params) {
    return request({
      url: INDEX_API.YWCJ_LIST,
      method: REQUEST_TYPE.GET,
      params: params
    });
  },

  /**
   * 复制凭证规则
   * @param params
   */
  copyRule(params) {
    return request({
      url: INDEX_API.COPY_RULE,
      method: REQUEST_TYPE.GET,
      params: params
    });
  },
  /**
   * 根据业务场景查询业务类型
   * @param params
   */
  queryBsTypeList(params) {
    return request({
      url: INDEX_API.YWLX_LISTBYBS,
      method: REQUEST_TYPE.GET,
      params: params
    });
  },
  /**
   * 规则策略
   * @param params
   */
  queryRuleStrateList(params) {
    return request({
      url: INDEX_API.RULES_STRATE,
      method: REQUEST_TYPE.GET,
      params: params
    });
  },
  /**
   * 凭证模板
   * @param params
   */
  queryAccmodeList(params) {
    return request({
      url: INDEX_API.ACCRULETP_LIST,
      method: REQUEST_TYPE.GET,
      params: params
    });
  },
  /**
   * 保存凭证规则定义
   * 获取到ruleId
   * @param params
   */
  saveAccRuleDef(data) {
    return request({
      url: INDEX_API.SAVE_ACCRULEDEF,
      method: REQUEST_TYPE.POST,
      data: data
    });
  },
  /**
   * 通过规则id查询所有规则
   * @param params
   */
  findAllByRuleId(params) {
    return request({
      url: INDEX_API.FING_ALL_BYRULEID,
      method: REQUEST_TYPE.GET,
      params: params
    });
  },
  /**
   * 保存凭证规则列表
   * @param params
   */
  saveAccRuleField(data) {
    return request({
      url: INDEX_API.SAVE_ACCRULEFIELD,
      method: REQUEST_TYPE.POST,
      data: data
    });
  },
  /**
   * 集成策略配置查询
   * @param params
   */
  queryIntegrationStrategy(data) {
    return request({
      url: INDEX_API.QUERY_INTEGRATION_STRATEGY,
      method: REQUEST_TYPE.POST,
      data: data
    });
  },
  /**
   * 右边业务对象明细字段服务
   * @param params
   */
  leftRightFontServer(data) {
    return request({
      url: BUSINES_API.LEFT_FONT+'?boCode='+data.boCode+'&mode=bo',
      method: REQUEST_TYPE.POST,
      data: data
    });
  },
  /**
   * 左边业务对象明细字段服务
   * @param params
   */
  leftObjectFontServer(data) {
    return request({
      url: INDEX_API.LEFT_FONT_OBJECT+'?boCode='+data.boCode+'&sttId='+data.sttId,
      method: REQUEST_TYPE.POST,
      data: data
    });
  },
  /**
   * 保存集成策略
   * @param params
   */
  sttFieldSave(data) {
    return request({
      url: INDEX_API.STTFIED_SAVE,
      method: REQUEST_TYPE.POST,
      data: data
    });
  }
};

export default indexApi;
