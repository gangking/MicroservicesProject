import request from "@/utils/request";
import {
  PLATFORM_API,
  BUSINESS_API,
  BIZCONFIG_API,
  REQUEST_TYPE
} from "./BusinessScenarioUrl";

var indexApi = {
  /**
   * 业务对象
   * @param params
   */
  businessObject(data) {
    // 请求参数：{"parameters":[],"requestPage":{"pageNo":1,"limit":20,"totalCount":null},"sorts":[]}
    return request({
      url: BUSINESS_API.BUSINESS_OBJ,
      method: REQUEST_TYPE.POST,
      data
    });
  },
  /**
   * 业务场景查询
   * @param params
   */
  queryPageList(data) {
    // 请求参数：{"parameters":[{"key":"Q^BS_CODE_^SL","value":"SCEX03_BS01"},{"key":"Q^SC_KEY_^S","value":""}],"requestPage":{"pageNo":1,"limit":20,"totalCount":null},"sorts":[]}
    return request({
      url: BIZCONFIG_API.QUERY_PAGE_LIST,
      method: REQUEST_TYPE.POST,
      data
    });
  },
  /**
   * 业务场景配置树
   * @param params
   */
  businessQueryTree(params) {
    return request({
      url: BIZCONFIG_API.BUSINESS_QUERY_TREE,
      method: REQUEST_TYPE.GET,
      params
    });
  },
  /**
   * 业务场景保存
   * @param params
   */
  businessPageSave(data) {
    return request({
      url: BIZCONFIG_API.BUSINESS_PAGE_SAVE,
      method: REQUEST_TYPE.POST,
      data
    });
  },
  /**
   * 业务场景删除
   * @param params
   */
  businessPageRemove(data) {
    return request({
      url: BIZCONFIG_API.BUSINESS_PAGE_REMOVE + "?ids=" + data.ids,
      method: REQUEST_TYPE.POST,
      data
    });
  },

  /**
   * 服务目录分类
   * @param params
   */
  findTreeDataType(params) {
    params = {
      categoryKey: "SC_TYPE"
    };
    return request({
      url: PLATFORM_API.TYPE_FINDTREEDATA,
      method: REQUEST_TYPE.GET,
      params
    });
  },
  // 业务情形方法
  // 查询业务情形
  queryBusinessSituation(params) {
    return request({
      url: BIZCONFIG_API.QUERY_BUSINESS_SITUATION,
      method: REQUEST_TYPE.GET,
      params
    });
  },
  // 保存/新增业务情形
  saveBusinessSituation(data) {
    return request({
      url: BIZCONFIG_API.SAVE_BUSINESS_SITUATION,
      method: REQUEST_TYPE.POST,
      data
    });
  },
  // 删除业务情形
  removeBusinessSituation(data) {
    return request({
      url: BIZCONFIG_API.REMOVE_BUSINESS_SITUATION + "?ids=" + data.ids,
      method: REQUEST_TYPE.POST,
      data
    });
  },
  // 删除业务类型
  removeBusinessType(data) {
    return request({
      url: BIZCONFIG_API.BUSINESS_TYPE_REMOVE + "?ids=" + data.ids,
      method: REQUEST_TYPE.POST,
      data
    });
  },
  // 保存业务类型
  saveBusinessType(data) {
    return request({
      url: BIZCONFIG_API.BUSINESS_TYPE_SAVE,
      method: REQUEST_TYPE.POST,
      data
    });
  },
  // 查询业务类型列表
  queryBusinessTypeList(data) {
    return request({
      url: BIZCONFIG_API.BUSINESS_TYPE_LIST,
      method: REQUEST_TYPE.POST,
      data
    });
  },
  // 查询业务类型列表树
  queryBusinessTypeTree(params) {
    return request({
      url: BIZCONFIG_API.BUSINESS_TYPE_TREE,
      method: REQUEST_TYPE.GET,
      params
    });
  },
  // 单行业务事务表单定义查询
  singleFormDefinition(data) {
    return request({
      url: BIZCONFIG_API.SINGLE_LINE_FORM,
      method: REQUEST_TYPE.POST,
      data
    });
  },
  // 新增/编辑单行业务事务表单定义
  singleFormDefinitionSave(data) {
    return request({
      url: BIZCONFIG_API.SINGLE_LINE_FORM_SAVE,
      method: REQUEST_TYPE.POST,
      data
    });
  },
  // 删除单行业务事务表单定义
  singleFormDefinitionDelete(data) {
    return request({
      url: BIZCONFIG_API.SINGLE_LINE_FORM_DELETE + "?ids=" + data.ids,
      method: REQUEST_TYPE.POST,
      data
    });
  },
  // 单行页签定义查询
  singleFormPageDefinition(data) {
    return request({
      url: BIZCONFIG_API.SINGLE_PAGE_LINE_FORM,
      method: REQUEST_TYPE.POST,
      data
    });
  },
  // 新增/编辑单行业务事务表单页签定义
  singleFormPageDefinitionSave(data) {
    return request({
      url: BIZCONFIG_API.SINGLE_PAGE_LINE_FORM_SAVE,
      method: REQUEST_TYPE.POST,
      data
    });
  },
  // 删除单行业务事务表单页签定义
  singleFormPageDefinitionDelete(data) {
    return request({
      url: BIZCONFIG_API.SINGLE_PAGE_LINE_FORM_DELETE + "?ids=" + data.ids,
      method: REQUEST_TYPE.POST,
      data
    });
  },
  // 单行功能按钮
  singleFormButtonDefinition(params) {
    return request({
      url: BIZCONFIG_API.SINGLE_BUTTON_LINE_FORM,
      method: REQUEST_TYPE.GET,
      params
    });
  },
  // 全局按钮查询
  singleFormButtonAll(data) {
    return request({
      url: BIZCONFIG_API.SINGLE_BUTTON_ALL,
      method: REQUEST_TYPE.POST,
      data
    });
  },
  // 编辑单行业务事务表单功能按钮
  singleFormButtonDefinitionEdit(data) {
    return request({
      url: BIZCONFIG_API.SINGLE_BUTTON_LINE_FORM_SAVE,
      method: REQUEST_TYPE.POST,
      data
    });
  },
  // 新增单行业务事务表单功能按钮
  singleFormButtonDefinitionSave(data) {
    return request({
      url: BIZCONFIG_API.SINGLE_BUTTON_LINE_FORM_EDIT,
      method: REQUEST_TYPE.POST,
      data
    });
  },
  // 删除单行业务事务表单功能按钮
  singleFormButtonDefinitionDelete(data) {
    return request({
      url: BIZCONFIG_API.SINGLE_BUTTON_LINE_FORM_DELETE + "?ids=" + data.ids,
      method: REQUEST_TYPE.POST,
      data
    });
  },
  // 单行具体页签功能按钮
  singleFormButtonItemDefinition(params) {
    return request({
      url: BIZCONFIG_API.SINGLE_BUTTON_ITEM_LINE_FORM,
      method: REQUEST_TYPE.GET,
      params
    });
  },
  // 单行具体页签功能按钮新增
  singleFormButtonItemDefinitionAdd(data) {
    return request({
      url: BIZCONFIG_API.SINGLE_BUTTON_ITEM_LINE_FORM_ADD,
      method: REQUEST_TYPE.POST,
      data
    });
  },
  // 单行具体页签功能按钮编辑
  singleFormButtonItemDefinitionEdit(data) {
    return request({
      url: BIZCONFIG_API.SINGLE_BUTTON_ITEM_LINE_FORM_EDIT,
      method: REQUEST_TYPE.POST,
      data
    });
  },
  // 单行具体页签功能按钮删除
  singleFormButtonItemDefinitionDelete(data) {
    return request({
      url: BIZCONFIG_API.SINGLE_BUTTON_ITEM_LINE_FORM_DELETE+'?ids='+data.ids,
      method: REQUEST_TYPE.POST,
      data
    });
  },
  // 单行具体页签表单分配
  singleFormItemDefinition(data) {
    return request({
      url: BIZCONFIG_API.SINGLE_Form_ITEM_LINE_FORM,
      method: REQUEST_TYPE.POST,
      data
    });
  },
  // 单行具体页签表单分配增加编辑
  singleFormItemDefinitionSave(data) {
    return request({
      url: BIZCONFIG_API.SINGLE_Form_ITEM_LINE_FORM_SAVE,
      method: REQUEST_TYPE.POST,
      data
    });
  },
  // 单行具体页签表单分配删除
  singleFormItemDefinitionDelete(data) {
    return request({
      url: BIZCONFIG_API.SINGLE_Form_ITEM_LINE_FORM_DELETE+'?ids='+data.ids,
      method: REQUEST_TYPE.POST,
      data
    });
  },
  // 多行业务事务表单定义查询
  multipleFormDefinition(data) {
    return request({
      url: BIZCONFIG_API.MULTIPLE_LINE_FORM,
      method: REQUEST_TYPE.POST,
      data
    });
  },
  // 多行业务事务表单定义新增编辑
  multipleFormDefinitionSave(data) {
    return request({
      url: BIZCONFIG_API.MULTIPLE_LINE_FORM_SAVE,
      method: REQUEST_TYPE.POST,
      data
    });
  },
  // 多行业务事务表单定义删除
  multipleFormDefinitionDelete(data) {
    return request({
      url: BIZCONFIG_API.MULTIPLE_LINE_FORM_DELETE+'?ids='+data.ids,
      method: REQUEST_TYPE.POST,
      data
    });
  },
  // 多行业务事务按钮定义查询
  multipleButtonDefinition(data) {
    return request({
      url: BIZCONFIG_API.MULTIPLE_BUTTON_LINE_FORM,
      method: REQUEST_TYPE.POST,
      data
    });
  },
  // 多行业务事务按钮定义新增
  multipleButtonDefinitionAdd(data) {
    return request({
      url: BIZCONFIG_API.MULTIPLE_BUTTON_LINE_ADD,
      method: REQUEST_TYPE.POST,
      // data:JSON.stringify([data])
      data
    });
  },
  // 多行业务事务按钮定义编辑
  multipleButtonDefinitionEdit(data) {
    return request({
      url: BIZCONFIG_API.MULTIPLE_BUTTON_LINE_EDIT,
      method: REQUEST_TYPE.POST,
      // data:JSON.stringify([data])
      data
    });
  },
  // 多行业务事务按钮定义删除
  multipleButtonDefinitionDelete(data) {
    return request({
      url: BIZCONFIG_API.MULTIPLE_BUTTON_LINE_DELETE+'?ids='+data.ids,
      method: REQUEST_TYPE.POST,
      data
    });
  },
  // 多行业务事务左侧栏按钮分配
  multipleLeftButtonDefinition(data) {
    return request({
      url: BIZCONFIG_API.MULTIPLE_LEFT_BUTTON_LINE_FORM,
      method: REQUEST_TYPE.POST,
      data
    });
  },
  // 多行业务事务左侧栏按钮分配新增
  multipleLeftButtonDefinitionAdd(data) {
    return request({
      url: BIZCONFIG_API.MULTIPLE_LEFT_BUTTON_LINE_FORM_ADD,
      method: REQUEST_TYPE.POST,
      data
    });
  },
  // 多行业务事务左侧栏按钮分配编辑
  multipleLeftButtonDefinitionEdit(data) {
    return request({
      url: BIZCONFIG_API.MULTIPLE_LEFT_BUTTON_LINE_FORM_EDIT,
      method: REQUEST_TYPE.POST,
      data
    });
  },
  // 多行业务事务左侧栏按钮分配删除
  multipleLeftButtonDefinitionDelete(data) {
    return request({
      url: BIZCONFIG_API.MULTIPLE_LEFT_BUTTON_LINE_FORM_DELETE+'?ids='+data.ids,
      method: REQUEST_TYPE.POST,
      data
    });
  },
  // 多行业务事务左侧栏字段分配
  multipleLeftFontDefinition(data) {
    return request({
      url: BIZCONFIG_API.MULTIPLE_LEFT_FONT_LINE_FORM,
      method: REQUEST_TYPE.POST,
      data
    });
  },
  // 多行业务事务左侧栏字段分配新增编辑
  multipleLeftFontDefinitionSave(data) {
    return request({
      url: BIZCONFIG_API.MULTIPLE_LEFT_FONT_LINE_FORM_SAVE,
      method: REQUEST_TYPE.POST,
      data
    });
  },
  // 多行业务事务左侧栏字段分配删除
  multipleLeftFontDefinitionDelete(data) {
    return request({
      url: BIZCONFIG_API.MULTIPLE_LEFT_FONT_LINE_FORM_DELETE+'?ids='+data.ids,
      method: REQUEST_TYPE.POST,
      data
    });
  },
  // 多行业务事务左侧栏字段设置
  multipleLeftFontSetDefinition(data) {
    return request({
      url: BIZCONFIG_API.MULTIPLE_LEFT_FONT_LINE_SET,
      method: REQUEST_TYPE.POST,
      data
    });
  },
  // 多行业务事务左侧栏字段设置增加编辑
  multipleLeftFontSetDefinitionSave(data) {
    return request({
      url: BIZCONFIG_API.MULTIPLE_LEFT_FONT_LINE_SET_SAVE,
      method: REQUEST_TYPE.POST,
      data
    });
  },
  // 多行业务事务左侧栏字段设置删除
  multipleLeftFontSetDefinitionDelete(data) {
    return request({
      url: BIZCONFIG_API.MULTIPLE_LEFT_FONT_LINE_SET_DELETE+'?ids='+data.ids,
      method: REQUEST_TYPE.POST,
      data
    });
  },
  // 多行业务事务业务类型分配
  multipleBusTypeSetDefinition(data) {
    return request({
      url: BIZCONFIG_API.MULTIPLE_BUSTYPE_FONT_LINE,
      method: REQUEST_TYPE.POST,
      data
    });
  },
  // 多行业务事务业务类型分配编辑
  multipleBusTypeSetDefinitionSave(data) {
    return request({
      url: BIZCONFIG_API.MULTIPLE_BUSTYPE_FONT_LINE_SAVE,
      method: REQUEST_TYPE.POST,
      data
    });
  },
  // 多行业务事务业务类型分配新增
  multipleBusTypeSetDefinitionBatSave(data) {
    return request({
      url: BIZCONFIG_API.MULTIPLE_BUSTYPE_FONT_LINE_BATSAVE,
      method: REQUEST_TYPE.POST,
      data
    });
  },
  // 多行业务事务业务类型分配删除
  multipleBusTypeSetDefinitionDelete(data) {
    return request({
      url: BIZCONFIG_API.MULTIPLE_BUSTYPE_FONT_LINE_DELETE+'?ids='+data.ids,
      method: REQUEST_TYPE.POST,
      data
    });
  },
  // 多行业务事务业务类型 功能按钮
  multipleBusTypeBtnSetDefinition(data) {
    return request({
      url: BIZCONFIG_API.MULTIPLE_BUSTYPE_BUTTON_LINE,
      method: REQUEST_TYPE.POST,
      data
    });
  },
  // 多行业务事务业务类型 功能按钮新增
  multipleBusTypeBtnSetDefinitionAdd(data) {
    return request({
      url: BIZCONFIG_API.MULTIPLE_BUSTYPE_BUTTON_LINE_ADD,
      method: REQUEST_TYPE.POST,
      data
    });
  },
  // 多行业务事务业务类型 功能按钮编辑
  multipleBusTypeBtnSetDefinitionEdit(data) {
    return request({
      url: BIZCONFIG_API.MULTIPLE_BUSTYPE_BUTTON_LINE_EDIT,
      method: REQUEST_TYPE.POST,
      data
    });
  },
  // 多行业务事务业务类型 功能按钮删除
  multipleBusTypeBtnSetDefinitionDelete(data) {
    return request({
      url: BIZCONFIG_API.MULTIPLE_BUSTYPE_BUTTON_LINE_DELETE+'?ids='+data.ids,
      method: REQUEST_TYPE.POST,
      data
    });
  },
  // 多行业务事务业务类型 表单分配
  multipleBusTypeFormSetDefinition(data) {
    return request({
      url: BIZCONFIG_API.MULTIPLE_BUSTYPE_FORM_LINE,
      method: REQUEST_TYPE.POST,
      data
    });
  },
  // 多行业务事务业务类型 表单分配新增编辑
  multipleBusTypeFormSetDefinitionSave(data) {
    return request({
      url: BIZCONFIG_API.MULTIPLE_BUSTYPE_FORM_LINE_SAVE,
      method: REQUEST_TYPE.POST,
      data
    });
  },
  // 多行业务事务业务类型 表单分配删除
  multipleBusTypeFormSetDefinitionDelete(data) {
    return request({
      url: BIZCONFIG_API.MULTIPLE_BUSTYPE_FORM_LINE_DELETE+'?ids='+data.ids,
      method: REQUEST_TYPE.POST,
      data
    });
  },
  // 分步策略
  distributionStrategy(data) {
    return request({
      url: BIZCONFIG_API.DISTRI_STRATEGY,
      method: REQUEST_TYPE.POST,
      data
    });
  },
  // 新增分步策略
  distributionStrategySave(data) {
    return request({
      url: BIZCONFIG_API.DISTRI_STRATEGY_SAVE,
      method: REQUEST_TYPE.POST,
      data
    });
  },
  // 删除分步策略
  distributionStrategyDelete(data) {
    return request({
      url: BIZCONFIG_API.DISTRI_STRATEGY_DELETE + "?ids=" + data.ids,
      method: REQUEST_TYPE.POST,
      data
    });
  },
  // 打印模板
  printTemplate(data) {
    return request({
      url: BIZCONFIG_API.PRINT_TEMPLATE,
      method: REQUEST_TYPE.POST,
      data
    });
  },
  // 新增编辑打印模板
  printTemplateSave(data) {
    return request({
      url: BIZCONFIG_API.PRINT_TEMPLATE_SAVA,
      method: REQUEST_TYPE.POST,
      data
    });
  },
  // 删除打印模板
  printTemplateDelete(data) {
    return request({
      url: BIZCONFIG_API.PRINT_TEMPLATE_DELETE + "?ids=" + data.ids,
      method: REQUEST_TYPE.POST,
      data
    });
  }
};

export default indexApi;
