export const controlOptions = [{
  value: 'input',
  label: '单行文本'
}, {
  value: 'hidden',
  label: '隐藏域'
}, {
  value: 'select',
  label: '下拉框'
}, {
  value: 'dictionary',
  label: '数据字典'
}, {
  value: 'selector',
  label: '选择器'
}, {
  value: 'date',
  label: '日期控件'
}, {
  value: 'daterange',
  label: '日期范围'
}, {
  value: 'number',
  label: '数字'
}, {
  value: 'numberRange',
  label: '数字范围'
}]

export const selectorTypeOptions = [{
  value: 'user',
  label: '用户'
}, {
  value: 'org',
  label: '组织'
}, {
  value: 'position',
  label: '岗位'
}, {
  value: 'role',
  label: '角色'
}]

export const dateOptions = [{
  value: 'date',
  label: '日期',
  datefmt: 'yyyy-MM-dd'
}, {
  value: 'datetime',
  label: '日期时间',
  datefmt: 'yyyy-MM-dd HH:mm:ss'
}, {
  value: 'time',
  label: '时间',
  datefmt: 'HH:mm:ss'
}, {
  value: 'custom',
  label: '自定义'
}]

export const showTypesOptions = [{
  value: 'input',
  label: '原样输出'
}, {
  value: 'hidden',
  label: '隐藏'
}, {
  value: 'date',
  label: '日期格式'
}, {
  value: 'number',
  label: '数字格式'
}, {
  value: 'select',
  label: '枚举值格式'
}, {
  value: 'editor',
  label: '富文本格式'
}, {
  value: 'dictionary',
  label: '数据字典格式'
}, {
  value: 'selector',
  label: '选择器格式'
}, {
  value: 'customDialog',
  label: '自定义对话框'
}, {
  value: 'attachment',
  label: '附件格式'
}]

export const numberOptions = [{
  value: 'orig',
  label: '原样输出'
}, {
  value: 'integer',
  label: '整型'
}, {
  value: 'number',
  label: '小数'
}, {
  value: 'currency',
  label: '货币'
}]

export const storageFormatOptions = [{
  value: 'json',
  label: 'json'
}, {
  value: 'id',
  label: '仅ID'
}, {
  value: 'bind',
  label: '绑定ID'
}]

export const customDialogOptions = [{
  dialog: 'jqxzdhk',
  dialog_name: '假期选择对话框'
}, {
  dialog: 'gysdhk',
  dialog_name: '供应商对话框'
}, {
  dialog: 'spxzq',
  dialog_name: '商品选择器'
}, {
  dialog: '"ywryxzq"',
  dialog_name: '业务人员选择器'
}, {
  dialog: 'bmsxxzq',
  dialog_name: '部门树形选择器'
}, {
  dialog: 'kfxzq',
  dialog_name: '客服选择器'
}, {
  dialog: 'cqxzq',
  dialog_name: '产品选择器'
}, {
  dialog: 'gysxzq',
  dialog_name: '供应商选择器'
}, {
  dialog: 'khlbxzq',
  dialog_name: '客户类别选择器'
}, {
  dialog: 'zzxzq',
  dialog_name: '组织选择器'
}]

export const resultFormatOptions = [{
  value: 'orig',
  label: '原样输出'
}, {
  value: 'dataPicker',
  label: '日期格式'
}, {
  value: 'select',
  label: '枚举值格式'
}, {
  value: 'dictionary',
  label: '数据字典格式'
}, {
  value: 'selector',
  label: '选择器格式'
}, {
  value: 'attachment',
  label: '附件格式'
}]

export const tableDataOptions = [{
  date: '主键',
  name: ['测试']
}, {
  date: '租户id',
  name: ['测试']
}, {
  date: 'IP地址',
  name: ['测试']
}, {
  date: '创建人',
  name: ['测试']
}, {
  date: '创建时间',
  name: ['测试']
}, {
  date: '更新人',
  name: ['测试']
}, {
  date: '更新时间',
  name: ['测试']
}, {
  date: '单行',
  name: ['测试']
}, {
  date: '多行',
  name: ['测试']
}, {
  date: '日期',
  name: ['测试']
}, {
  date: '富文本',
  name: ['测试']
}, {
  date: '数据字典',
  name: ['测试']
}, {
  date: '自动编号',
  name: ['测试']
}, {
  date: '附件',
  name: ['测试']
}, {
  date: '选择器',
  name: ['测试']
}, {
  date: '地址',
  name: ['测试']
}, {
  date: '签名',
  name: ['测试']
}, {
  date: '当前时间',
  name: ['测试']
}, {
  date: '当前日期',
  name: ['测试']
}, {
  date: '当前用户',
  name: ['测试']
}, {
  date: '当前组织',
  name: ['测试']
}]

export const treeDisplayOptions = [
  { value: 'id_', label: '主键' },
  { value: 'ip_', label: 'IP地址' },
  { value: 'create_by_', label: '创建人' },
  { value: 'create_time_', label: '创建时间' },
  { value: 'update_by_', label: '更新人' },
  { value: 'update_time_', label: '更新时间' },
  { value: 'chan_wei_', label: '单位名' },
  { value: 'bu_men_', label: '部门名' },
  { value: 'xing_ming_', label: '姓名' },
  { value: 'zhi_wu_', label: '职务' },
  { value: 'chu_cha_shi_jian', label: '出差时间' },
  { value: 'chu_ci_shi_jian1_', label: '返回时间' },
  { value: 'chu_chai_di_dian_', label: '出差地点' },
  { value: 'ren_wu_', label: '任务' },
  { value: 'jtsds', label: '交通实得数' },
  { value: 'jtfps', label: '交通发票数' },
  { value: 'zssds', label: '住宿实得数' },
  { value: 'zsfps', label: '住宿发票数' },
  { value: 'jin_tie_bu_zhu_', label: '津贴补助' },
  { value: 'he_ji_', label: '合计' },
  { value: 'ge_ji_dai_xie_', label: '合计大写' },
  { value: 'tian_bao_ren_', label: '填报人' },
  { value: 'bmfzryj', label: '审核意见' },
  { value: 'bmspr', label: '审批人' },
  { value: 'bmspsj', label: '审批时间' },
  { value: 'bmbz', label: '备注' },
  { value: 'ren_shi_yi_xian_', label: '审批意见' },
  { value: 'rsspr', label: '审批人' },
  { value: 'rsspsj', label: '审批时间' },
  { value: 'bz1', label: '备注' },
  { value: 'cai_wu_yi_xian_', label: '审批意见' },
  { value: 'cai_wu_shen_pi_ren', label: '审批人' },
  { value: 'cwspsj', label: '审批时间' },
  { value: 'cai_wu_bei_zhu_', label: '备注' },
  { value: 'cwfzryj', label: '审批意见' },
  { value: 'cwfzrspr', label: '审批人' },
  { value: 'cwfzrspsj', label: '审批时间' },
  { value: 'bz2', label: '备注' },
  { value: 'dwfzryj', label: '审批意见' },
  { value: 'dwfzspr', label: '审批人' },
  { value: 'dwfzrspsj', label: '审批时间' },
  { value: 'bz3', label: '备注' },
  { value: 'chu_na_yi_jian_', label: '审核意见' },
  { value: 'chu_na_ren_', label: '审核人' },
  { value: 'chu_na_shi_jian_', label: '审核时间' },
  { value: 'chu_na_bei_zhu_', label: '备注' },
  { value: 'kuai_ji_ji_zhang_', label: '审核意见' },
  { value: 'kuai_ji_ren_yuan_', label: '记账人' },
  { value: 'ji_zhang_shi_jian_', label: '记账时间' },
  { value: 'bz4_', label: '备注' },
  { value: 'chan_wei_i_d_', label: '单位' },
  { value: 'bu_men_i_d_', label: '部门' },
  { value: 'yong_hu_i_d_', label: '用户id' },
  { value: 'zong_tian_shu_', label: '总天数' },
  { value: 'zong_e_', label: '总额' },
  { value: 'zong_e_dai_xie_', label: '总额大写' },
  { value: 'zong_zhu_xiu_', label: '总住宿' }
]

export const customGroupOptions = [
  { icon: 'S', value: 'fieldsTreesettingTitle_1', label: '主键' },
  { icon: 'S', value: 'fieldsTreesettingTitle_2', label: '租户ID' },
  { icon: 'S', value: 'fieldsTreesettingTitle_3', label: 'IP地址' },
  { icon: 'D', value: 'fieldsTreesettingTitle_4', label: '创建人' },
  { icon: 'S', value: 'fieldsTreesettingTitle_5', label: '创建时间' },
  { icon: 'S', value: 'fieldsTreesettingTitle_6', label: '更新人' },
  { icon: 'D', value: 'fieldsTreesettingTitle_7', label: '更新时间' },
  { icon: 'S', value: 'fieldsTreesettingTitle_8', label: '到货通知流水' },
  { icon: 'S', value: 'fieldsTreesettingTitle_9', label: '到货通知单号' },
  { icon: 'S', value: 'fieldsTreesettingTitle_10', label: '外部到货通知单号' },
  { icon: 'S', value: 'fieldsTreesettingTitle_11', label: '收货方（实体）' },
  { icon: 'S', value: 'fieldsTreesettingTitle_12', label: '货主' },
  { icon: 'S', value: 'fieldsTreesettingTitle_13', label: '供应商' },
  { icon: 'S', value: 'fieldsTreesettingTitle_14', label: '货品/物料' },
  { icon: 'S', value: 'fieldsTreesettingTitle_15', label: '仓库ID' },
  { icon: 'S', value: 'fieldsTreesettingTitle_16', label: '入库类型' },
  { icon: 'S', value: 'fieldsTreesettingTitle_17', label: '状态' },
  { icon: 'S', value: 'fieldsTreesettingTitle_18', label: '流程类型' },
  { icon: 'S', value: 'fieldsTreesettingTitle_19', label: '入库模式' },
  { icon: 'S', value: 'fieldsTreesettingTitle_20', label: '计量方式' },
  { icon: 'S', value: 'fieldsTreesettingTitle_21', label: '合同号' },
  { icon: 'S', value: 'fieldsTreesettingTitle_22', label: '采购单号' },
  { icon: 'S', value: 'fieldsTreesettingTitle_23', label: '运输单号' },
  { icon: 'D', value: 'fieldsTreesettingTitle_24', label: '采购日期' },
  { icon: 'S', value: 'fieldsTreesettingTitle_25', label: '车牌号' },
  { icon: 'S', value: 'fieldsTreesettingTitle_26', label: '承运商' },
  { icon: 'D', value: 'fieldsTreesettingTitle_27', label: '预计发货时间' },
  { icon: 'D', value: 'fieldsTreesettingTitle_28', label: '预计到达时间' },
  { icon: 'D', value: 'fieldsTreesettingTitle_29', label: '到货时间' },
  { icon: 'D', value: 'fieldsTreesettingTitle_30', label: '发货时间' },
  { icon: 'S', value: 'fieldsTreesettingTitle_31', label: '发货人' },
  { icon: 'S', value: 'fieldsTreesettingTitle_32', label: '收货人' },
  { icon: 'S', value: 'fieldsTreesettingTitle_33', label: '收货方（物流）' },
  { icon: 'S', value: 'fieldsTreesettingTitle_34', label: '公司ID' },
  { icon: 'S', value: 'fieldsTreesettingTitle_35', label: '类型' },
  { icon: 'S', value: 'fieldsTreesettingTitle_36', label: '收货单号' },
  { icon: 'S', value: 'fieldsTreesettingTitle_37', label: '供应商名' },
  { icon: 'S', value: 'fieldsTreesettingTitle_38', label: '仓库保管员' },
  { icon: 'S', value: 'fieldsTreesettingTitle_39', label: '采购员' },
  { icon: 'S', value: 'fieldsTreesettingTitle_40', label: '需求单位人员' },
  { icon: 'D', value: 'fieldsTreesettingTitle_41', label: '验收日期' },
  { icon: 'S', value: 'fieldsTreesettingTitle_42', label: '验收结果' },
  { icon: 'C', value: 'fieldsTreesettingTitle_43', label: '处理措施' },
  { icon: 'C', value: 'fieldsTreesettingTitle_44', label: '备注' },
  { icon: 'D', value: 'fieldsTreesettingTitle_45', label: '入库时间' },
  { icon: 'S', value: 'fieldsTreesettingTitle_46', label: '仓库' },
  { icon: 'S', value: 'fieldsTreesettingTitle_47', label: '任务名称' },
  { icon: 'S', value: 'fieldsTreesettingTitle_48', label: '车牌/车厢号' },
  { icon: 'S', value: 'fieldsTreesettingTitle_49', label: '备注' },
  { icon: 'S', value: 'fieldsTreesettingTitle_50', label: '删除标志' }
]
