<template>
  <div class="dynamic-form">
    <!--表头-->
    <div v-if="hasHeader" class="form-header">
      <div v-if="hasHeader" class="title">{{ formDef.name }}</div>
      <div v-if="hasDesc" class="desc">{{ formDef.desc }}</div>
    </div>
    <!--表单-->
    <el-form ref="from" :model="models" :inline="inline" :label-suffix="colon" :label-width="labelWidth" :label-position="labelPosition" :status-icon="statusIcon">
      <template v-for="(field,index) in formDef.fields">
        <!-- 只读类型-->
        <template v-if="field.field_type==='desc'
            || field.field_type==='flow_diagram'
            || field.field_type==='approval_history'">
          <dynamic-form-other :key="index" :models.sync="models" :remote="value" :field="field" :params="params" />
        </template>
        <!-- 表单意见-->
        <template v-else-if="field.field_type==='approval_opinion'">
          <dynamic-form-opinion :key="index" :remote="value" :models.sync="opinions" :rights.sync="rights" :field="field" />
        </template>
        <!--栅格布局-->
        <template v-if="field.field_type === 'grid'">
          <el-row :key="index" :gutter="field.field_options.gutter ? field.field_options.gutter : 0" :justify="field.field_options.justify" :align="field.field_options.align" class="widget-col" type="flex">
            <el-col v-for="(col, colIndex) in field.field_options.columns" :key="colIndex" :span="col.span ? col.span : 0">
              <template v-for="(item, i) in col.fields">
                <dynamic-form-item :key="i" :remote="models" :models.sync="models" :rights.sync="rights" :field="item" :formula="responseFormula" :code="code" :is-readonly="readonly" :readonly-style="readonlyStyle" />
              </template>
            </el-col>
          </el-row>
        </template>
        <!--其他类型-->
        <template v-else>
          <dynamic-form-item :ref="'formItem'+field.name" :key="index" :remote="models" :models.sync="models" :rights.sync="rights" :field="field" :default-value="defaultValue" :formula="responseFormula" :code="code" :is-readonly="readonly" :readonly-style="readonlyStyle" :label-width="labelWidth" />
        </template>
      </template>
    </el-form>
  </div>
</template>

<script>
import FormOptions from '../../constants/formoptions';
import FormUtil from '../../utils/formUtil';
import DynamicFormItem from './dynamic-form-item';
import DynamicFormOther from './dynamic-form-other';
import DynamicFormOpinion from './components/approval-opinion';
import util from '@/utils/util';
import { mapState, mapMutations } from 'vuex';
export default {
  components: {
    DynamicFormItem,
    DynamicFormOther,
    DynamicFormOpinion
  },
  provide() {
    return {
      dynamic: this
    };
  },
  props: {
    formDef: {
      type: Object,
      required: true
    },
    value: {
      type: Object
    },
    readonly: {
      type: Boolean,
      default: false
    },
    permissions: {
      type: Object
    },
    columnMinWidth: {
      type: String
    },
    validateImmediately: {
      // 是否初始验证
      type: Boolean,
      default: true
    },
    initialization: {
      type: Boolean,
      default: false
    },
    // 扩展参数
    params: Object
  },
  data() {
    return {
      models: {}, // 表单model对象数据
      rights: {}, // 表单权限
      defaultValue: {}, // 表单默认值
      responseFormula: {}, // 公式
      responseLinkages: {},
      responseVerifys: [], // 表单提交校验
      opinions: {},
      init: false
    };
  },
  computed: {
    ...mapState('ibps', {
      chain: state => state.form.chain
    }),
    formAttrs() {
      return this.formDef.attrs || {};
    },
    hasHeader() {
      return this.formDef && this.formDef.attrs && !this.formDef.attrs.hide_name;
    },
    hasDesc() {
      return (
        this.formDef && this.formDef.attrs && !this.formDef.attrs.hide_desc && this.formDef.desc
      );
    },
    inline() {
      return this.formAttrs.inline || false;
    },
    colon() {
      return this.formAttrs ? (this.formAttrs.colon ? ':' : '') : '';
    },
    labelWidth() {
      if (
        this.$utils.isNotEmpty(this.formAttrs.labelWidth) &&
        this.$utils.isNotEmpty(this.formAttrs.labelWidthUnit)
      ) {
        return this.formDef.attrs.labelWidth + this.formDef.attrs.labelWidthUnit;
      } else {
        return '100px';
      }
    },
    labelPosition() {
      if (this.$utils.isNotEmpty(this.formAttrs.labelPosition)) {
        return this.formDef.attrs.labelPosition;
      } else {
        return 'right';
      }
    },
    statusIcon() {
      if (this.$utils.isNotEmpty(this.formAttrs.statusIcon)) {
        return this.formDef.attrs.statusIcon;
      } else {
        return false;
      }
    },
    code() {
      return this.formDef.code;
    },
    readonlyStyle() {
      return this.formDef && this.formDef.attrs && this.formDef.attrs.read_style
        ? this.formDef.attrs.read_style
        : 'text';
    },
    hasScript() {
      return this.formDef.attrs ? this.$utils.isNotEmpty(this.formDef.attrs.script) : false;
    }
  },
  watch: {
    /* 关联的数据 */
    chain: {
      handler(obj) {
        for (const key in obj) {
          if (obj.hasOwnProperty(key)) {
            if (key) {
              const element = obj[key];
              this.$set(this.models, key, element);
            }
          }
        }
        // console.log('传入表单的数据', this.models);
        // this.formData = JSON.parse(JSON.stringify(this.formData));
      },
      // immediate: true,
      deep: true
    },
    value: {
      handler(val, oldVal) {
        this.initResponseFields();
      },
      immediate: true
    },
    formDef: {
      handler(val) {
        if (this.$refs.from) {
          this.$refs.from.resetFields();
        }
        this.models = {}; // 表单model对象数据
        this.rights = {}; // 表单权限
        this.defaultValue = {}; // 表单默认值
        this.responseFormula = {}; // 公式
        this.responseLinkages = {};
        this.responseVerifys = []; // 表单提交校验
        this.opinions = {};
        this.init = false;
        this.initResponseFields();
      },
      deep: true,
      immediate: true
    },
    models(val, oldVal) {
      console.log('models', val, this.value);
      this.$emit('update:models', val);
      // 延迟验证
      this.$nextTick(() => {
        this.validate(() => {});
      });
      //表单全部值
      this.currentFinalFormData(val);
    },
    initialization(val) {
      if (val && this.hasScript) {
        this.$emit('load-script');
      }
    }
  },

  mounted() {
    // 初始化脚本
    this.$nextTick(() => {
      if (this.validateImmediately) {
        this.validate(() => {});
      }
    });
  },
  methods: {
    /**
     * 初始化字段
     */
    initResponseFields() {
      // this.models = {} // 表单model对象数据
      // this.rights = {} // 表单权限
      // this.defaultValue = {} // 表单默认值
      // this.responseFormula = {} // 公式
      // this.responseLinkages = {}
      // this.responseVerifys = [] // 表单提交校验
      // this.opinions = {}
      // this.init = false
      // this.$refs.from.resetFields()

      const fields = this.formDef.fields;
      console.log('fields,dynamic', fields);
      if (!fields) {
        return;
      }

      this.generateModles(fields);
      // 初始化运行公式计算
      this.initRunCalFormula();
      //console.log('表单权限', this.rights);
      this.$nextTick(() => {
        this.$emit('init-response', '');
      });

      // console.log('fjsdkflj啊呀呀呀')
    },
    /**
     * 生成modles
     */
    generateModles(fields) {
      for (let i = 0; i < fields.length; i++) {
        const field = fields[i];
        const fieldType = field.field_type;
        if (fieldType === 'grid') {
          // 栅格布局
          if (field.field_options.columns && field.field_options.columns.length > 0) {
            // 循环遍历所有字段
            field.field_options.columns.forEach(item => {
              this.generateModles(item.fields);
            });
          }
        } else if (fieldType === 'table') {
          // 子表单
          this.models[field.name] = this.value[field.name] || [];
          FormUtil.getTableDefaultData(field, (element, val) => {
            const data = this.defaultValue[field.name] || {};
            data[element.name] = val || '';
            this.defaultValue[field.name] = data;
          });
          // ====== 初始化表单权限
          this.initFormRights(field);
        } else if (field.field_type === 'approval_opinion') {
          if (
            this.params &&
            this.params.formOpinionData &&
            Object.keys(this.params.formOpinionData).indexOf(field.name) >= 0
          ) {
            this.opinions[field.name] = this.params.formOpinionData
              ? this.params.formOpinionData[field.name]
              : '';
          } else {
            this.opinions[field.name] = '';
          }
          // ====== 初始化表单权限
          this.initFormRights(field);
        } else {
          // 不是只读字段
          if (!FormOptions.t.NON_MODEL_FIELD_TYPES.includes(fieldType)) {
            if (
              this.value &&
              Object.keys(this.value).indexOf(field.name) >= 0 &&
              !util.isEmpty(this.value[field.name])
            ) {
              //  console.log('dynamic-value', this.value)
              // 有值
              this.models[field.name] = this.value[field.name];
            } else {
              // 默认值
              this.models[field.name] = FormUtil.getFieldDefaultValue(field, (name, val) => {
                console.log('this.models[name]', name, val);
                this.models[field.name] = val;
                console.log('this.models[name]', name, this.models[name]);
              });
            }
          }

          // ====== 初始化需要进行公式计算的字段
          this.initResponseFormula(field);
          // ====== 初始化表单权限
          this.initFormRights(field);
          // ======  初始化需要进行联动数据的字段
          this.initResponseLinkages(field);
        }
      }
    },

    /**
     *  初始化表单权限
     */
    initFormRights(field) {
      this.rights[field.name] =
        this.getPermissions(this.permissions, field) || FormUtil.getDefaultRigths(field);
      // console.log('this.rights[field.name]', field.name, this.rights)
    },
    // 获取权限
    getPermissions(permissions, { name, field_type }) {
      if (this.$utils.isEmpty(permissions)) {
        return;
      }
      const fieldType = field_type;
      let rightsValue = null;
      const isNonInputField = FormOptions.t.NON_INPUT_FIELD_TYPES.includes(fieldType);
      let isSpecial = false;
      if (isNonInputField && permissions.fields) {
        // 非输入字段
        rightsValue = permissions.fields[name] ? permissions.fields[name] : null;
      } else if (fieldType === 'approval_opinion' && permissions.opinions) {
        // 意见 特殊处理
        rightsValue = permissions.opinions[name] ? permissions.opinions[name] : null;
      } else if (fieldType === 'table' && permissions.tables) {
        // 子表
        isSpecial = true;
        rightsValue = permissions.tables[name] ? permissions.tables[name] : null;
      } else {
        // 字段
        rightsValue = permissions.fields[name] ? permissions.fields[name] : null;
      }
      if (this.readonly && !isNonInputField && !isSpecial) {
        // 只读权限
        rightsValue =
          rightsValue !== FormOptions.t.PERMISSIONS.HIDE
            ? FormOptions.t.PERMISSIONS.READ
            : rightsValue;
      }
      return rightsValue;
    },
    // 初始化需要进行公式计算的字段
    initResponseFormula(item) {
      FormUtil.setResponseFormula(this.responseFormula, item, this.code);
    },
    // 初始化运行公式计算
    initRunCalFormula() {
      // 不需要字段的进行公式计算 比如获取但其当前时间
      const data = FormUtil.runCalFormula(
        this.responseFormula[FormUtil.NOT_NEED_FIELD],
        this.models || {},
        this.formDef.code
      );
      console.log('fffffffff:', data);
      this.models = { ...data };
    },
    // 初始化联动数据
    initResponseLinkages(item) {
      FormUtil.setResponseLinkages(this.responseLinkages, item, this.code);
    },
    getFormSubmitVerify() {
      const verifys = this.formDef.attrs ? this.formDef.attrs.verifys : [];
      let errors = {};
      if (this.$utils.isEmpty(verifys)) {
        return errors;
      }
      verifys.forEach(verify => {
        if (!FormUtil.runFormSubmitVerify(verify.formula, this.formData, this.formDef.code)) {
          errors = {
            result: false,
            msg: verify.msg
          };
          return false;
        }
      });
      return errors;
    },

    /**
     * 获取表单数据
     */
    getFormData() {
      return this.models;
    },
    /**
     * 设置表单字段数据
     */
    setFieldData(name, value) {
      this.models[name] = value;
    },
    /**
     * 设置表单权限
     */
    setFormRights(name, value) {
      this.rights[name] = value;
    },
    /**
     * 获取审批意见数据
     */
    getFormOpinionData() {
      return this.opinions;
    },
    /**
     * 表单验证
     */
    validate(callback) {
      this.$refs.from.validate((valid, invalidFields) => {
        callback(valid, invalidFields);
      });
    },
    submitVerify() {
      const verifys = this.formDef.attrs.verifys;
      if (this.$utils.isEmpty(verifys)) {
        return;
      }
      for (let i = 0; i < verifys.length; i++) {
        const verify = verifys[i];
        const valid = FormUtil.runFormSubmitVerify(verify.formula, this.getFormData(), this.code);
        if (!valid) {
          return {
            result: valid,
            message: verify.msg
          };
        }
      }
      return;
    },
    ...mapMutations('ibps/compositeSingle', ['currentFinalFormData'])
  }
};
</script>

<style lang="scss">
.dynamic-form {
  .el-input {
    width: 100%;
  }
  .el-select {
    width: 100%;
  }
  .form-header {
    border-bottom: 1px solid #2b34410d;
    margin-bottom: 5px;
    .title {
      font-size: 16px;
      font-weight: bold;
      color: #222;
      text-align: left;
      padding: 8px 10px 10px;
      margin: 0;
    }
    .desc {
      word-wrap: break-word;
      word-break: normal;
      text-indent: 0;
      line-height: 1.6;
      margin: 0 0 11px;
      padding: 3px 30px 8px;
    }
  }
  .dynamic-form-table-item__readonly {
    margin-bottom: 0;
  }
}

.widget-col {
  margin-left: 0 !important;
  margin-right: 0 !important;
}
</style>
<style lang="scss" scoped>
/deep/ .el-form-item {
  text-align: left;
}
/deep/ .el-form-item--small .el-form-item__content {
  line-height: 24px !important;
}
/deep/ .el-form-item--small .el-form-item__label {
  line-height: 24px !important;
}
/deep/ .el-form--label-top .el-form-item__label {
  padding: 0 5px 0px !important;
}
/deep/ .el-form-item__label {
  font-size: 12px;
}
</style>
