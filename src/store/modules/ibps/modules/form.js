
export default {
  namespaced: true,
  state: {
    defaultFormDef: {
      name: '未命名表单',
      key: '',
      attrs: {
        inline: false, // 是否使用inline排版
        labelPosition: 'right', // 标签对齐方式
        labelWidth: '100', // 标签宽度
        labelWidthUnit: 'px', // 标签宽度单位
        size: 'small', // 尺寸
        statusIcon: false, // 显示验证图标
        descPosition: 'inline'
      },
      fields: [] // 字段列表
    },
    formDef: {}, // 表单定义
    curField: {},
    curFieldIndex: 0,
    activeName: 'form-property', // 标签
    chain: {}, // 数据联动的关联对象
    dataTemplateId: "",// 表单关联id
    dataTemplatField: [],// 数据集的显示全部字段
    dataTemplatKey: "",// 数据集的表单key
    boKey: "",//数据集的表单bokey
    allBoKey: ""//数据集的完整表单bokey

  },
  mutations: {
    /**
     * 更新表单定义
     * @param {*} state
     * @param {*} formDef
     */
    updateFormDef(state, formDef) {
      Object.assign(state.formDef, formDef)
    },
    /**
     *  更新表单字段
     * @param {*} state
     * @param {*} fields
     */
    updateFormFields(state, fields) {
      state.formDef.fields = fields
    },
    updateCurField(state, field, ) {
      state.formDef.fields.splice(state.curFieldIndex, 1, field)
      state.curField = field
    },

    selectField(state, { field, isInit }) {
      state.curField = field
      // curFieldId, 就切换至'字段配置'页
      if (!isInit) {
        state.asideActiveName = 'field-config'
      }
    },
    toggleAsideActive(state, newName) {
      state.asideActiveName = newName
    },
    /* 
    动态生成的表单，联动搜索，对应表单项

    */
    chainForm(state, chain) {
      state.chain = chain
    },
    /* 
    表单id

   */
    formTemplate(state, id) {
      state.dataTemplateId = id
    },

    /* 
    数据模版获取数据

  */
    getTemplateFiled(state, data) {
      state.dataTemplatField = data
    },
    /* 
     数据模版表单的formkey
   */
    getTemplatekey(state, data) {
      state.dataTemplatKey = data
    },
    /* 
   数据模版表单的bomkey
 */
    getBokey(state, data) {
      state.boKey = data

    },
    /* 
 数据模版表单的bomkey
*/
    getAllBokey(state, data) {
      state.allBoKey = data

    },
  }
}
