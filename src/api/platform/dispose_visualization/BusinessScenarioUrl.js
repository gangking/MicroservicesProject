import { BASE_URL, INFO_URL, DATA_URL, COMP_URL } from "@/api/baseUrl";
import _ from "lodash";
const BASE_PLATFORM_API = BASE_URL + INFO_URL; // 
const BASE_BUSINESS_API = BASE_URL + DATA_URL; // 
const BASE_BIZCONFIG_API = BASE_URL + COMP_URL; // 
const REQUEST_TYPE = {
  POST: "post",
  GET: "get"
};

let PLATFORM_API = {
  TYPE_FINDTREEDATA: "/system/v3/cat/type/findTreeData" // 服务目录分类
};
let BUSINESS_API = {
  BUSINESS_OBJ: "/bo/def/query" // 业务对象
};
let BIZCONFIG_API = {
  BUSINESS_QUERY_TREE: "/bsBasic/queryTree", // 业务场景配置树
  QUERY_PAGE_LIST: "/bsBasic/queryPageList", // 业务场景查询
  BUSINESS_PAGE_SAVE: "/bsBasic/save", // 业务场景保存
  BUSINESS_PAGE_REMOVE: "/bsBasic/remove", // 业务场景删除
  QUERY_BUSINESS_SITUATION: "/bsBsi/query", // 查询业务情形
  SAVE_BUSINESS_SITUATION: "/bsBsi/save", // 保存业务情形
  REMOVE_BUSINESS_SITUATION: "/bsBsi/remove", // 删除业务情形
  BUSINESS_TYPE_TREE: "/bsBc/queryTree", // 业务类型树
  BUSINESS_TYPE_LIST: "/bsBc/queryPage", // 业务类型列表
  BUSINESS_TYPE_SAVE: "/bsBc/save", // 保存业务类型
  BUSINESS_TYPE_REMOVE: "/bsBc/remove", // 删除业务类型
  SINGLE_LINE_FORM: "/bsSlcfBasic/query", //单行业务事务表单定义查询 Single line form definition
  SINGLE_LINE_FORM_SAVE: "/bsSlcfBasic/save", // 新增/编辑单行业务事务表单定义
  SINGLE_LINE_FORM_DELETE: "/bsSlcfBasic/remove", // 删除单行业务事务表单定义
  SINGLE_PAGE_LINE_FORM: "/bsSlcfTabs/query", // 单行页签定义
  SINGLE_PAGE_LINE_FORM_SAVE: "/bsSlcfTabs/save", // 新增/编辑单行业务事务表单页签定义
  SINGLE_PAGE_LINE_FORM_DELETE: "/bsSlcfTabs/remove", // 删除单行业务事务表单页签定义
  SINGLE_BUTTON_LINE_FORM: "/bsSlcfAssignButton/query", // 单行功能按钮
  SINGLE_BUTTON_ALL: "/btnDef/queryAll", // 全局按钮查询
  SINGLE_BUTTON_LINE_FORM_EDIT: "/bsSlcfAssignButton/batchSave", // 新增单行业务事务表单功能按钮
  SINGLE_BUTTON_LINE_FORM_SAVE: "/bsSlcfAssignButton/save", // 编辑单行业务事务表单功能按钮
  SINGLE_BUTTON_LINE_FORM_DELETE: "/bsSlcfAssignButton/remove", // 删除单行业务事务表单功能按钮
  SINGLE_BUTTON_ITEM_LINE_FORM: "/bsSlcfTabsAssignButton/query", // 单行具体页签功能按钮
  SINGLE_BUTTON_ITEM_LINE_FORM_ADD: "/bsSlcfTabsAssignButton/batchSave", // 单行具体页签功能按钮新增
  SINGLE_BUTTON_ITEM_LINE_FORM_EDIT: "/bsSlcfTabsAssignButton/save", // 单行具体页签功能按钮编辑
  SINGLE_BUTTON_ITEM_LINE_FORM_DELETE: "/bsSlcfTabsAssignButton/remove", // 单行具体页签功能按钮删除
  SINGLE_Form_ITEM_LINE_FORM: "/bsSlcfTabsAssignform/query", // 单行具体页签表单分配
  SINGLE_Form_ITEM_LINE_FORM_SAVE: "/bsSlcfTabsAssignform/save", // 单行具体页签表单分配增加编辑
  SINGLE_Form_ITEM_LINE_FORM_DELETE: "/bsSlcfTabsAssignform/remove", // 单行具体页签表单分配删除
  MULTIPLE_LINE_FORM: "/bsMlcfBt/query", //多行业务事务表单定义查询
  MULTIPLE_LINE_FORM_SAVE: "/bsMlcfBt/save", //多行业务事务表单定义新增编辑
  MULTIPLE_LINE_FORM_DELETE: "/bsMlcfBt/remove", //多行业务事务表单定义删除
  MULTIPLE_BUTTON_LINE_FORM: "/bsMlcfBtButton/query", //多行业务事务按钮定义查询
  MULTIPLE_BUTTON_LINE_ADD: "/bsMlcfBtButton/batchSave", //多行业务事务按钮定义新增
  MULTIPLE_BUTTON_LINE_EDIT: "/bsMlcfBtButton/save", //多行业务事务按钮定义编辑
  MULTIPLE_BUTTON_LINE_DELETE: "/bsMlcfBtButton/remove", //多行业务事务按钮定义删除
  MULTIPLE_LEFT_BUTTON_LINE_FORM: "/bsMlcfBtLeftButton/query", //多行业务事务左侧栏按钮分配
  MULTIPLE_LEFT_BUTTON_LINE_FORM_ADD: "/bsMlcfBtLeftButton/batchSave", //多行业务事务左侧栏按钮分配新增
  MULTIPLE_LEFT_BUTTON_LINE_FORM_EDIT: "/bsMlcfBtLeftButton/save", //多行业务事务左侧栏按钮分配编辑
  MULTIPLE_LEFT_BUTTON_LINE_FORM_DELETE: "/bsMlcfBtLeftButton/remove", //多行业务事务左侧栏按钮分配删除
  MULTIPLE_LEFT_FONT_LINE_FORM: "/bsMlcfBtLeftField/query", //多行业务事务左侧栏字段分配
  MULTIPLE_LEFT_FONT_LINE_FORM_SAVE: "/bsMlcfBtLeftField/save", //多行业务事务左侧栏字段分配新增编辑
  MULTIPLE_LEFT_FONT_LINE_FORM_DELETE: "/bsMlcfBtLeftField/remove", //多行业务事务左侧栏字段分配删除
  MULTIPLE_LEFT_FONT_LINE_SET: "/btLeftRules/queryList", //多行业务事务左侧栏字段设置
  MULTIPLE_LEFT_FONT_LINE_SET_SAVE: "/btLeftRules/save", //多行业务事务左侧栏字段设置增加编辑
  MULTIPLE_LEFT_FONT_LINE_SET_DELETE: "/btLeftRules/remove", //多行业务事务左侧栏字段设置删除
  MULTIPLE_BUSTYPE_FONT_LINE: "/bsMlcfBtBc/query", // 多行业务事务业务类型分配
  MULTIPLE_BUSTYPE_FONT_LINE_SAVE: "/bsMlcfBtBc/save", // 多行业务事务业务类型分配编辑
  MULTIPLE_BUSTYPE_FONT_LINE_BATSAVE: "/bsMlcfBtBc//batchSave", // 多行业务事务业务类型分配新增
  MULTIPLE_BUSTYPE_FONT_LINE_DELETE: "/bsMlcfBtBc/remove", // 多行业务事务业务类型分配删除
  MULTIPLE_BUSTYPE_BUTTON_LINE: "/bsMlcfBtBcButton/query", // 多行业务事务业务类型 功能按钮
  MULTIPLE_BUSTYPE_BUTTON_LINE_ADD: "/bsMlcfBtBcButton/batchSave", // 多行业务事务业务类型 功能按钮新增
  MULTIPLE_BUSTYPE_BUTTON_LINE_EDIT: "/bsMlcfBtBcButton/save", // 多行业务事务业务类型 功能按钮编辑
  MULTIPLE_BUSTYPE_BUTTON_LINE_DELETE: "/bsMlcfBtBcButton/remove", // 多行业务事务业务类型 功能按钮删除
  MULTIPLE_BUSTYPE_FORM_LINE: "/bsMlcfBtBcForm/query", // 多行业务事务业务类型 表单分配
  MULTIPLE_BUSTYPE_FORM_LINE_SAVE: "/bsMlcfBtBcForm/save", // 多行业务事务业务类型 表单分配新增编辑
  MULTIPLE_BUSTYPE_FORM_LINE_DELETE: "/bsMlcfBtBcForm/remove", // 多行业务事务业务类型 表单分配删除
  DISTRI_STRATEGY: "/bsStepStrategy/queryList", // 分步策略 Distribution strategy
  DISTRI_STRATEGY_SAVE: "/bsStepStrategy/save", // 分步策略新增编辑
  DISTRI_STRATEGY_DELETE: "/bsStepStrategy/remove", // 删除分步策略
  PRINT_TEMPLATE: "/bsPrint/query", // 打印模板 Print template
  PRINT_TEMPLATE_SAVA: "/bsPrint/save", // 新增编辑打印模板 Print template
  PRINT_TEMPLATE_DELETE: "/bsPrint/remove" // 删除打印模板 Print template
};

PLATFORM_API = _.mapValues(PLATFORM_API, function(v) {
  return BASE_PLATFORM_API + v;
});

BIZCONFIG_API = _.mapValues(BIZCONFIG_API, function(v) {
  return BASE_BIZCONFIG_API + v;
});

BUSINESS_API = _.mapValues(BUSINESS_API, function(v) {
  return BASE_BUSINESS_API + v;
});

export { REQUEST_TYPE, PLATFORM_API, BUSINESS_API, BIZCONFIG_API };
