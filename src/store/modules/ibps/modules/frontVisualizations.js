import indexApi from "@/api/platform/dispose_visualization";
import { showLoading, hideLoading } from "@/utils/loading";

const mutations = {};

const state = {
  test: "hahah"
};

const actions = {
  publicSendService({ state: { test } }, { params, fun }) {
    showLoading();
    return fun({ ...params })
      .then(data => {
        hideLoading();
        return data;
      })
      .catch(req => {
        hideLoading();
        return Promise.reject(req);
      });
  },
  // 获取业务对象
  businessObjectFunc({ dispatch }, params = {}) {
    return dispatch("publicSendService", {
      params,
      fun: indexApi.businessObject
    }).then(({ data }) => {
      //   console.log("获取业务对象", data);
      return data;
    });
  },
  // 业务场景配置树
  businessQueryTree({ dispatch }, params = {}) {
    return dispatch("publicSendService", {
      params,
      fun: indexApi.businessQueryTree
    }).then(({ data }) => {
      //   console.log("服务目录分类", data);
      return data;
    });
  },
  // 服务目录
  findTreeDataType({ dispatch }, params = {}) {
    return dispatch("publicSendService", {
      params: {},
      fun: indexApi.findTreeDataType
    }).then(({ data }) => {
      //   console.log("服务目录分类", data);
      return data;
    });
  },
  // 获取业务场景
  queryPageList({ dispatch }, params) {
    return dispatch("publicSendService", {
      params,
      fun: indexApi.queryPageList
    }).then(({ data }) => {
      //   console.log("获取业务场景", data);
      return data;
    });
  },
  // 保存业务场景
  businessPageSave({ dispatch }, params) {
    return dispatch("publicSendService", {
      params,
      fun: indexApi.businessPageSave
    }).then(({ data }) => {
      return data;
    });
  },
  // 删除业务场景
  businessPageRemove({ dispatch }, params) {
    return dispatch("publicSendService", {
      params,
      fun: indexApi.businessPageRemove
    }).then(({ data }) => {
      return data;
    });
  },
  // 业务情形方法
  // 查询业务情形
  queryBusinessSituation({ dispatch }, params) {
    return dispatch("publicSendService", {
      params,
      fun: indexApi.queryBusinessSituation
    }).then(({ data }) => {
      return data;
    });
  },
  // 保存/新增业务情形
  saveBusinessSituation({ dispatch }, params) {
    return dispatch("publicSendService", {
      params,
      fun: indexApi.saveBusinessSituation
    }).then(({ data }) => {
      return data;
    });
  },
  // 删除业务情形
  removeBusinessSituation({ dispatch }, params) {
    return dispatch("publicSendService", {
      params,
      fun: indexApi.removeBusinessSituation
    }).then(({ data }) => {
      return data;
    });
  },
  // 删除业务类型
  removeBusinessType({ dispatch }, params) {
    return dispatch("publicSendService", {
      params,
      fun: indexApi.removeBusinessType
    }).then(({ data }) => {
      return data;
    });
  },
  // 保存业务类型
  saveBusinessType({ dispatch }, params) {
    return dispatch("publicSendService", {
      params,
      fun: indexApi.saveBusinessType
    }).then(({ data }) => {
      return data;
    });
  },
  // 查询业务类型列表
  queryBusinessTypeList({ dispatch }, params) {
    return dispatch("publicSendService", {
      params,
      fun: indexApi.queryBusinessTypeList
    }).then(({ data }) => {
      return data;
    });
  },
  // 查询业务类型列表树
  queryBusinessTypeTree({ dispatch }, params) {
    return dispatch("publicSendService", {
      params,
      fun: indexApi.queryBusinessTypeTree
    }).then(({ data }) => {
      return data;
    });
  },
  // 单行业务事务表单定义查询
  singleFormDefinition({ dispatch }, params) {
    return dispatch("publicSendService", {
      params,
      fun: indexApi.singleFormDefinition
    }).then(({ data }) => {
      return data;
    });
  },
  // 新增/编辑单行业务事务表单定义
  singleFormDefinitionSave({ dispatch }, params) {
    return dispatch("publicSendService", {
      params,
      fun: indexApi.singleFormDefinitionSave
    }).then(({ data }) => {
      return data;
    });
  },
  // 删除单行业务事务表单定义
  singleFormDefinitionDelete({ dispatch }, params) {
    return dispatch("publicSendService", {
      params,
      fun: indexApi.singleFormDefinitionDelete
    }).then(({ data }) => {
      return data;
    });
  },
  // 新增/编辑单行业务事务表单定义
  singleFormPageDefinitionSave({ dispatch }, params) {
    return dispatch("publicSendService", {
      params,
      fun: indexApi.singleFormPageDefinitionSave
    }).then(({ data }) => {
      return data;
    });
  },
  // 删除单行业务事务表单定义
  singleFormPageDefinitionDelete({ dispatch }, params) {
    return dispatch("publicSendService", {
      params,
      fun: indexApi.singleFormPageDefinitionDelete
    }).then(({ data }) => {
      return data;
    });
  },
  // 单行页签定义查询
  singleFormPageDefinition({ dispatch }, params) {
    return dispatch("publicSendService", {
      params,
      fun: indexApi.singleFormPageDefinition
    }).then(({ data }) => {
      return data;
    });
  },
  // 单行功能按钮
  singleFormButtonDefinition({ dispatch }, params) {
    return dispatch("publicSendService", {
      params,
      fun: indexApi.singleFormButtonDefinition
    }).then(({ data }) => {
      return data;
    });
  },
  // 编辑单行业务事务表单功能按钮
  singleFormButtonDefinitionEdit({ dispatch }, params) {
    return dispatch("publicSendService", {
      params,
      fun: indexApi.singleFormButtonDefinitionEdit
    }).then(({ data }) => {
      return data;
    });
  },
  // 编辑单行业务事务表单功能按钮
  singleFormButtonDefinitionSave({ dispatch }, params) {
    return dispatch("publicSendService", {
      params,
      fun: indexApi.singleFormButtonDefinitionSave
    }).then(({ data }) => {
      return data;
    });
  },
  // 删除单行业务事务表单功能按钮
  singleFormButtonDefinitionDelete({ dispatch }, params) {
    return dispatch("publicSendService", {
      params,
      fun: indexApi.singleFormButtonDefinitionDelete
    }).then(({ data }) => {
      return data;
    });
  },
  // 全局按钮查询
  singleFormButtonAll({ dispatch }, params) {
    return dispatch("publicSendService", {
      params,
      fun: indexApi.singleFormButtonAll
    }).then(({ data }) => {
      return data;
    });
  },
  // 单行具体页签功能按钮
  singleFormButtonItemDefinition({ dispatch }, params) {
    return dispatch("publicSendService", {
      params,
      fun: indexApi.singleFormButtonItemDefinition
    }).then(({ data }) => {
      return data;
    });
  },
  // 单行具体页签功能按钮新增
  singleFormButtonItemDefinitionAdd({ dispatch }, params) {
    return dispatch("publicSendService", {
      params,
      fun: indexApi.singleFormButtonItemDefinitionAdd
    }).then(({ data }) => {
      return data;
    });
  },
  // 单行具体页签功能按钮编辑
  singleFormButtonItemDefinitionEdit({ dispatch }, params) {
    return dispatch("publicSendService", {
      params,
      fun: indexApi.singleFormButtonItemDefinitionEdit
    }).then(({ data }) => {
      return data;
    });
  },
  // 单行具体页签功能按钮删除
  singleFormButtonItemDefinitionDelete({ dispatch }, params) {
    return dispatch("publicSendService", {
      params,
      fun: indexApi.singleFormButtonItemDefinitionDelete
    }).then(({ data }) => {
      return data;
    });
  },
  // 单行具体页签表单分配
  singleFormItemDefinition({ dispatch }, params) {
    return dispatch("publicSendService", {
      params,
      fun: indexApi.singleFormItemDefinition
    }).then(({ data }) => {
      return data;
    });
  },
  // 单行具体页签表单分配增加编辑
  singleFormItemDefinitionSave({ dispatch }, params) {
    return dispatch("publicSendService", {
      params,
      fun: indexApi.singleFormItemDefinitionSave
    }).then(({ data }) => {
      return data;
    });
  },
  // 单行具体页签表单分配删除
  singleFormItemDefinitionDelete({ dispatch }, params) {
    return dispatch("publicSendService", {
      params,
      fun: indexApi.singleFormItemDefinitionDelete
    }).then(({ data }) => {
      return data;
    });
  },
  // 多行业务事务表单定义查询
  multipleFormDefinition({ dispatch }, params) {
    return dispatch("publicSendService", {
      params,
      fun: indexApi.multipleFormDefinition
    }).then(({ data }) => {
      return data;
    });
  },
  // 多行业务事务表单定义新增编辑
  multipleFormDefinitionSave({ dispatch }, params) {
    return dispatch("publicSendService", {
      params,
      fun: indexApi.multipleFormDefinitionSave
    }).then(({ data }) => {
      return data;
    });
  },
  // 多行业务事务表单定义删除
  multipleFormDefinitionDelete({ dispatch }, params) {
    return dispatch("publicSendService", {
      params,
      fun: indexApi.multipleFormDefinitionDelete
    }).then(({ data }) => {
      return data;
    });
  },
  // 多行业务事务按钮定义查询
  multipleButtonDefinition({ dispatch }, params) {
    return dispatch("publicSendService", {
      params,
      fun: indexApi.multipleButtonDefinition
    }).then(({ data }) => {
      return data;
    });
  },
  // 多行业务事务按钮定义新增
  multipleButtonDefinitionAdd({ dispatch }, params) {
    return dispatch("publicSendService", {
      params,
      fun: indexApi.multipleButtonDefinitionAdd
    }).then(({ data }) => {
      return data;
    });
  },
  // 多行业务事务按钮定义编辑
  multipleButtonDefinitionEdit({ dispatch }, params) {
    return dispatch("publicSendService", {
      params,
      fun: indexApi.multipleButtonDefinitionEdit
    }).then(({ data }) => {
      return data;
    });
  },
  // 多行业务事务按钮定义删除
  multipleButtonDefinitionDelete({ dispatch }, params) {
    return dispatch("publicSendService", {
      params,
      fun: indexApi.multipleButtonDefinitionDelete
    }).then(({ data }) => {
      return data;
    });
  },
  // 多行业务事务左侧栏按钮分配
  multipleLeftButtonDefinition({ dispatch }, params) {
    return dispatch("publicSendService", {
      params,
      fun: indexApi.multipleLeftButtonDefinition
    }).then(({ data }) => {
      return data;
    });
  },
  // 多行业务事务左侧栏按钮分配新增
  multipleLeftButtonDefinitionAdd({ dispatch }, params) {
    return dispatch("publicSendService", {
      params,
      fun: indexApi.multipleLeftButtonDefinitionAdd
    }).then(({ data }) => {
      return data;
    });
  },
  // 多行业务事务左侧栏按钮分配编辑
  multipleLeftButtonDefinitionEdit({ dispatch }, params) {
    return dispatch("publicSendService", {
      params,
      fun: indexApi.multipleLeftButtonDefinitionEdit
    }).then(({ data }) => {
      return data;
    });
  },
  // 多行业务事务左侧栏按钮分配删除
  multipleLeftButtonDefinitionDelete({ dispatch }, params) {
    return dispatch("publicSendService", {
      params,
      fun: indexApi.multipleLeftButtonDefinitionDelete
    }).then(({ data }) => {
      return data;
    });
  },
  // 多行业务事务左侧栏字段分配
  multipleLeftFontDefinition({ dispatch }, params) {
    return dispatch("publicSendService", {
      params,
      fun: indexApi.multipleLeftFontDefinition
    }).then(({ data }) => {
      return data;
    });
  },
  // 多行业务事务左侧栏字段分配新增编辑
  multipleLeftFontDefinitionSave({ dispatch }, params) {
    return dispatch("publicSendService", {
      params,
      fun: indexApi.multipleLeftFontDefinitionSave
    }).then(({ data }) => {
      return data;
    });
  },
  // 多行业务事务左侧栏字段分配删除
  multipleLeftFontDefinitionDelete({ dispatch }, params) {
    return dispatch("publicSendService", {
      params,
      fun: indexApi.multipleLeftFontDefinitionDelete
    }).then(({ data }) => {
      return data;
    });
  },
  // 多行业务事务左侧栏字段设置
  multipleLeftFontSetDefinition({ dispatch }, params) {
    return dispatch("publicSendService", {
      params,
      fun: indexApi.multipleLeftFontSetDefinition
    }).then(({ data }) => {
      return data;
    });
  },
  // 多行业务事务左侧栏字段设置增加编辑
  multipleLeftFontSetDefinitionSave({ dispatch }, params) {
    return dispatch("publicSendService", {
      params,
      fun: indexApi.multipleLeftFontSetDefinitionSave
    }).then(({ data }) => {
      return data;
    });
  },
  // 多行业务事务左侧栏字段设置删除
  multipleLeftFontSetDefinitionDelete({ dispatch }, params) {
    return dispatch("publicSendService", {
      params,
      fun: indexApi.multipleLeftFontSetDefinitionDelete
    }).then(({ data }) => {
      return data;
    });
  },
  // 多行业务事务业务类型分配
  multipleBusTypeSetDefinition({ dispatch }, params) {
    return dispatch("publicSendService", {
      params,
      fun: indexApi.multipleBusTypeSetDefinition
    }).then(({ data }) => {
      return data;
    });
  },
  // 多行业务事务业务类型分配编辑
  multipleBusTypeSetDefinitionSave({ dispatch }, params) {
    return dispatch("publicSendService", {
      params,
      fun: indexApi.multipleBusTypeSetDefinitionSave
    }).then(({ data }) => {
      return data;
    });
  },
  // 多行业务事务业务类型分配新增
  multipleBusTypeSetDefinitionBatSave({ dispatch }, params) {
    return dispatch("publicSendService", {
      params,
      fun: indexApi.multipleBusTypeSetDefinitionBatSave
    }).then(({ data }) => {
      return data;
    });
  },
  // 多行业务事务业务类型分配删除
  multipleBusTypeSetDefinitionDelete({ dispatch }, params) {
    return dispatch("publicSendService", {
      params,
      fun: indexApi.multipleBusTypeSetDefinitionDelete
    }).then(({ data }) => {
      return data;
    });
  },
  // 多行业务事务业务类型 功能按钮
  multipleBusTypeBtnSetDefinition({ dispatch }, params) {
    return dispatch("publicSendService", {
      params,
      fun: indexApi.multipleBusTypeBtnSetDefinition
    }).then(({ data }) => {
      return data;
    });
  },
  // 多行业务事务业务类型 功能按钮新增
  multipleBusTypeBtnSetDefinitionAdd({ dispatch }, params) {
    return dispatch("publicSendService", {
      params,
      fun: indexApi.multipleBusTypeBtnSetDefinitionAdd
    }).then(({ data }) => {
      return data;
    });
  },
  // 多行业务事务业务类型 功能按钮编辑
  multipleBusTypeBtnSetDefinitionEdit({ dispatch }, params) {
    return dispatch("publicSendService", {
      params,
      fun: indexApi.multipleBusTypeBtnSetDefinitionEdit
    }).then(({ data }) => {
      return data;
    });
  },
  // 多行业务事务业务类型 功能按钮删除
  multipleBusTypeBtnSetDefinitionDelete({ dispatch }, params) {
    return dispatch("publicSendService", {
      params,
      fun: indexApi.multipleBusTypeBtnSetDefinitionDelete
    }).then(({ data }) => {
      return data;
    });
  },
  // 多行业务事务业务类型 表单分配
  multipleBusTypeFormSetDefinition({ dispatch }, params) {
    return dispatch("publicSendService", {
      params,
      fun: indexApi.multipleBusTypeFormSetDefinition
    }).then(({ data }) => {
      return data;
    });
  },
  // 多行业务事务业务类型 表单分配新增编辑
  multipleBusTypeFormSetDefinitionSave({ dispatch }, params) {
    return dispatch("publicSendService", {
      params,
      fun: indexApi.multipleBusTypeFormSetDefinitionSave
    }).then(({ data }) => {
      return data;
    });
  },
  // 多行业务事务业务类型 表单分配删除
  multipleBusTypeFormSetDefinitionDelete({ dispatch }, params) {
    return dispatch("publicSendService", {
      params,
      fun: indexApi.multipleBusTypeFormSetDefinitionDelete
    }).then(({ data }) => {
      return data;
    });
  },
  // 分步策略
  distributionStrategy({ dispatch }, params) {
    return dispatch("publicSendService", {
      params,
      fun: indexApi.distributionStrategy
    }).then(({ data }) => {
      return data;
    });
  },
  // 新增分步策略
  distributionStrategySave({ dispatch }, params) {
    return dispatch("publicSendService", {
      params,
      fun: indexApi.distributionStrategySave
    }).then(({ data }) => {
      return data;
    });
  },
  // 删除分步策略
  distributionStrategyDelete({ dispatch }, params) {
    return dispatch("publicSendService", {
      params,
      fun: indexApi.distributionStrategyDelete
    }).then(({ data }) => {
      return data;
    });
  },
  // 打印模板
  printTemplate({ dispatch }, params) {
    return dispatch("publicSendService", {
      params,
      fun: indexApi.printTemplate
    }).then(({ data }) => {
      return data;
    });
  },
  // 新增编辑打印模板
  printTemplateSave({ dispatch }, params) {
    return dispatch("publicSendService", {
      params,
      fun: indexApi.printTemplateSave
    }).then(({ data }) => {
      return data;
    });
  },
  // 删除打印模板
  printTemplateDelete({ dispatch }, params) {
    return dispatch("publicSendService", {
      params,
      fun: indexApi.printTemplateDelete
    }).then(({ data }) => {
      return data;
    });
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
