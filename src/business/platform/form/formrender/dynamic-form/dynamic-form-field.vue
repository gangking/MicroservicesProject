<template>
  <div>
    <!-- 单行文本、 多行文本、数字-->
    <template v-if="fieldType==='text'||fieldType==='textarea'">
      <div v-if="readonlyText">{{ model }}</div>
      <div v-else>
        <el-input v-model="model" :placeholder="placeholder" :type="fieldType" :name="field.name" :autosize="autosize" :rows="fieldOptions.rows||2" :readonly="readonly" :disabled="readonly" clearable v-on="$listeners" />
      </div>
    </template>
    <!-- 数字-->
    <template v-if="fieldType==='number'">
      <div v-if="readonlyText">{{ model }}</div>
      <div v-else class="number">
        <el-input v-model="model" :placeholder="placeholder" :type="fieldType" :name="field.name" :autosize="autosize" :rows="fieldOptions.rows||2" :readonly="readonly" :disabled="readonly" clearable v-on="$listeners" />
        <!-- 转换组件 -->
        <!-- <div class="exchange">{{numberValue}}</div> -->
      </div>
    </template>
    <!-- 单项选择 -->
    <template v-else-if="fieldType==='radio'">
      <template v-if="readonlyText">
        <el-tag v-if="$utils.isNotEmpty(model)">{{ model|optionsFilter(options,'label','val') }}</el-tag>
      </template>
      <el-radio-group v-else v-model="model" :disabled="readonly" v-on="$listeners">
        <component :is="fieldOptions.button?'el-radio-button':'el-radio'" v-for="o in fieldOptions.options||ajaxOptions" :key="o.val" :label="o.val" :border="fieldOptions.border">{{ o.label }}</component>
      </el-radio-group>
    </template>
    <!-- 多选项选择 -->
    <template v-else-if="fieldType==='checkbox'">
      <template v-if="readonlyText">
        <template v-if="checkboxGroupValue && checkboxGroupValue.length >0">
          <el-tag v-for="(v,i) in checkboxGroupValue" :key="i" class="ibps-mr-5">{{ v|optionsFilter(options,'label','val') }}</el-tag>
        </template>
      </template>
      <el-checkbox-group v-else v-model="checkboxGroupValue" :disabled="readonly" v-on="$listeners">
        <component :is="fieldOptions.button?'el-checkbox-button':'el-checkbox'" v-for="o in fieldOptions.options||ajaxOptions" :key="o.val" :label="o.val" :border="fieldOptions.border">{{ o.label }}</component>
      </el-checkbox-group>
    </template>

    <!-- 下拉框 -->
    <template v-else-if="fieldType==='select'">
      <template v-if="readonlyText">
        <el-tag v-if="$utils.isNotEmpty(model)">{{ model|optionsFilter(options,'label','val') }}</el-tag>
      </template>
      <el-select v-else v-model="model" :placeholder="placeholder" :name="field.name" :style="{width:fieldOptions.width||' 100%'}" clearable :disabled="readonly" v-on="$listeners">
        <el-option v-for="o in fieldOptions.options||ajaxOptions" :key="o.val" :label="o.label" :value="o.val" />
      </el-select>
    </template>

    <!-- 远程搜索 -->
    <template v-else-if="fieldType==='remoteSearch'">
      <template v-if="readonlyText">
        <!-- <el-tag v-if="$utils.isNotEmpty(model)">{{ model|optionsFilter(options,'label','val') }}</el-tag> -->
      </template>
      <fssc-remote-search v-model="model" :model="fieldOptions" :remote="remote" :readonly="readonly" placeholder="请输入内容" v-on="$listeners" @listenChange="serachData" />
    </template>

    <!-- 开关 -->
    <template v-else-if="fieldType==='switch'">
      <template v-if="readonlyText">
        <el-tag v-if="$utils.isNotEmpty(model)">{{ model|optionsFilter(options,'label','val') }}</el-tag>
      </template>
      <template v-else>
        <el-checkbox v-if="fieldOptions.appearance==='checkbox'" v-model="model" v-on="$listeners" />
        <el-switch v-else v-model="model" :width="fieldOptions.width" v-on="$listeners" />
      </template>
    </template>

    <!-- 滑块 -->
    <el-slider v-else-if="fieldType==='slider'" v-model="model" :disabled="readonly" />
    <!-- 日期控件 -->
    <template v-else-if="fieldType==='datePicker'||fieldType==='currentTime'||fieldType==='currentDate'">
      <div v-if="readonlyText">{{ model|dateFormat(datefmt,datefmt) }}</div>
      <template v-else>
        <el-date-picker v-if="dateType ==='date' || dateType =='datetime' " v-model="model" :type="dateType" :value-format="datefmt" :format="datefmt" :placeholder="fieldOptions.placeholder" :style="{width:fieldOptions.width||' 100%'}" :readonly="readonly" clearable />
        <el-time-picker v-else-if="dateType ==='time' " v-model="model" :type="dateType" :value-format="datefmt" :format="datefmt" :placeholder="fieldOptions.placeholder" :style="{width:fieldOptions.width||' 100%'}" :readonly="readonly" clearable />
        <!--TODO:自定义-->
      </template>
    </template>

    <!-- =======================增强字段==============================-->
    <!--富文本框-->
    <template v-else-if="fieldType==='editor'">
      <div v-if="readonlyText" v-html="model" />
      <ibps-ueditor v-else v-model="model" :placeholder="fieldOptions.placeholder" :readonly="readonly" />
    </template>
    <!--数据字典-->
    <ibps-dictionary v-else-if="fieldType==='dictionary'" v-model="model" :type-key="fieldOptions.dictionary" :multiple="fieldOptions.multiple" :select-mode="fieldOptions.select_mode" :display-mode="fieldOptions.display_mode" :separator="fieldOptions.split" :readonly="readonly" v-on="$listeners" />
    <!-- 自动编号-->
    <template v-else-if="fieldType==='autoNumber'">
      <ibps-auto-number v-model="model" :alias="fieldOptions.identity" :init="fieldOptions.init" :placeholder="fieldOptions.placeholder" :readonly="readonly" :readonly-text="readonlyText" />
    </template>

    <!-- 上传附件-->
    <ibps-attachment v-else-if="fieldType==='attachment'" v-model="model" :placeholder="fieldOptions.placeholder" :download="fieldOptions.download||true" :readonly="readonly" :limit="fileQuantity" :file-size="maxFileSize" :accept="accept" :file-ext="fileFormates" multiple v-on="$listeners" />
    <!-- 选择器-->
    <ibps-user-selector v-else-if="fieldType==='selector' || fieldType==='currentUser' || fieldType==='currentOrg' " v-model="model" :placeholder="$utils.isNotEmpty(fieldOptions.placeholder)? fieldOptions.placeholder:'请选择'" :type="fieldOptions.selector_type" :multiple="fieldOptions.multiple" :store="fieldOptions.store||'id'" :disabled="readonly" :readonly-text="readonlyText?'text':null" />
    <!--自定义对话框-->
    <ibps-custom-dialog v-else-if="fieldType === 'customDialog'" v-model="model" :template-key="fieldOptions.dialog" :multiple="fieldOptions.multiple === 'Y'" :placeholder="fieldOptions.placeholder" :store="fieldOptions.store" :icon="fieldOptions.icon?'ibps-icon-'+fieldOptions.icon:''" :type="fieldOptions.dialog_type" :readonly="readonly" />

    <!--fssc自定义对话框-->
    <fssc-custom-dialog v-else-if="fieldType === 'fsscCustom'" :template-key="fieldOptions.dialog" :multiple="fieldOptions.multiple === 'Y'" :placeholder="fieldOptions.placeholder" :store="fieldOptions.store" :icon="fieldOptions.icon?'ibps-icon-'+fieldOptions.icon:''" :type="fieldOptions.dialog_type" v-model="model" :readonly="readonly" :model="fieldOptions" :remote="remote" v-on="$listeners" />
    <!-- 关联数据-->
    <ibps-link-data v-else-if="fieldType==='linkdata'" v-model="model" :template-key="fieldOptions.linkdata" :placeholder="$utils.isNotEmpty(fieldOptions.placeholder)? fieldOptions.placeholder:'请选择'" :multiple="fieldOptions.multiple === 'Y'" :readonly="readonly" />

    <!-- 地址-->
    <div v-else-if="fieldType==='address'">
      <ibps-address v-model="addressValue" :size="fieldOptions.size" :top="fieldOptions.top || 'country'" :top-val="topVal" :level="fieldOptions.level||'district'" :disabled="readonly" data-type="code" />
      <p />
      <el-input v-if="fieldOptions.is_street" v-model="streetValue" :disabled="readonly" placeholder="详细地址" type="textarea" />
    </div>
    <!-- 签名-->
    <ibps-signature v-else-if="fieldType==='signature'" v-model="model" :placeholder="fieldOptions.placeholder" :height="fieldOptions.height" :disabled="readonly" />
    <!-- 图片-->
    <ibps-image v-else-if="fieldType==='image'" v-model="model" :width="fieldOptions.width" :height="fieldOptions.height" :limit="fieldOptions.limit" :accept="fieldOptions.accept" :tip="fieldOptions.tip" :size="fieldOptions.size" :upload-type="fieldOptions.uploadType" :disabled="readonly" />
    <!-- 链接 -->
    <ibps-link v-else-if="fieldType === 'hyperlink'" :text="fieldOptions.text" :link="fieldOptions.link" :show-type="fieldOptions.showType" :text-type="fieldOptions.textType" :link-type="fieldOptions.linkType" :type="fieldOptions.type" :icon="fieldOptions.icon?'ibps-icon-'+fieldOptions.icon:''" />

    <!-- =======================其它字段==============================-->
    <!-- 文本-->
    <span v-else-if="fieldType==='label'">{{ fieldOptions.value|| fieldOptions.placeholder }}</span>
  </div>
</template>
<script>
import FormOptions from '@/business/platform/form/constants/formoptions';
import {
  fileTypes as FILE_TYPES,
  accept as ACCEPT
} from '@/business/platform/form/constants/fileTypes';
import IbpsUeditor from '@/components/ibps-ueditor';
import IbpsDictionary from '@/business/platform/cat/dictionary/select';
import IbpsAutoNumber from '@/business/platform/system/identity/auto-number';
import IbpsAttachment from '@/business/platform/file/attachment/selector';
import IbpsUserSelector from '@/business/platform/org/selector';
import IbpsAddressCascader from '@/components/ibps-address/cascader';
import IbpsSignature from './components/signature';
import IbpsImage from '@/components/ibps-image';
import IbpsLink from '@/components/ibps-link';
import IbpsCustomDialog from '@/business/platform/data/templaterender/custom-dialog';
import IbpsLinkData from '@/business/platform/data/templaterender/link-data';
import FormUtls from '@/business/platform/form/utils/formUtil';

import FsscRemoteSearch from '@/components/fssc-remote-search';
import FsscCustomDialog from '@/components/fssc-custom-dialog';

export default {
  components: {
    'ibps-ueditor': IbpsUeditor,
    'ibps-dictionary': IbpsDictionary,
    'ibps-auto-number': IbpsAutoNumber,
    'ibps-attachment': IbpsAttachment,
    'ibps-user-selector': IbpsUserSelector,
    'ibps-address': IbpsAddressCascader,
    'ibps-signature': IbpsSignature,
    'ibps-image': IbpsImage,
    'ibps-link': IbpsLink,
    'ibps-custom-dialog': IbpsCustomDialog,
    'ibps-link-data': IbpsLinkData,
    FsscRemoteSearch,
    FsscCustomDialog
  },
  props: {
    remote: Object,
    value: {
      type: [String, Number, Date, Object, Array]
    },
    field: {
      type: Object,
      required: true
    },
    readonly: {
      type: Boolean
    },
    readonlyStyle: {
      type: String,
      default: 'text'
    },
    params: {
      type: Object
    }
  },
  data() {
    return {
      ajaxOptions: [],
      model: this.value
    };
  },
  computed: {
    numberValue() {
      let name = this.field.name;
      let value = this.remote[name];

      if (isNaN(parseFloat(value))) {
        return '0.00';
      } else {
        value = this.toThousandsNoZero(value);
        return value;
      }
    },
    fieldType() {
      return this.field.field_type;
    },
    fieldOptions() {
      return this.field.field_options || {};
    },
    checkboxGroupValue: {
      get() {
        if (Array.isArray(this.model)) {
          return this.model;
        }
        return this.model ? this.model.split(',') : [];
      },
      set(value) {
        this.model = value.join(',');
      }
    },
    // 地址值
    addressValue: {
      get() {
        console.log(
          '地址值是多？',
          FormUtls.getAddressControlValue(this.model, this.fieldOptions),
          this.model,
          this.fieldOptions
        );
        return FormUtls.getAddressControlValue(this.model, this.fieldOptions);
      },
      set(value) {
        this.model = FormUtls.getAddressValue(value, this.model, this.fieldOptions);
      }
    },
    streetValue: {
      get() {
        if (this.$utils.isEmpty(this.model)) {
          return '';
        }
        const data = JSON.parse(this.model);
        return data['street'] || '';
      },
      set(val) {
        let data = {};
        if (this.$utils.isNotEmpty(this.model)) {
          data = JSON.parse(this.model);
        }
        data['street'] = val;
        this.model = JSON.stringify(data);
      }
    },
    readonlyText() {
      if (!this.readonly) return false;
      if (this.readonlyStyle === 'text') {
        return true;
      } else {
        return false;
      }
    },

    formData() {
      return this.data;
    },

    autosize() {
      let autosize = this.fieldOptions.autosize;
      if (
        this.fieldOptions.autosize &&
        (this.fieldOptions.min_rows || this.fieldOptions.max_rows)
      ) {
        const row = {};
        row.minRows = this.fieldOptions.min_rows ? this.fieldOptions.min_rows : null;
        row.minRows = this.fieldOptions.max_rows ? this.fieldOptions.max_rows : null;
        autosize = row;
      }
      return autosize;
    },
    // 日期格式
    datefmt() {
      if (this.fieldType === 'currentDate') {
        return FormOptions.t.DATE_FORMATS['date'];
      } else if (this.fieldType === 'currentTime') {
        return FormOptions.t.DATE_FORMATS['datetime'];
      } else {
        if (this.fieldOptions['datefmt_type'] && this.fieldOptions['datefmt_type'] !== 'custom') {
          return (
            FormOptions.t.DATE_FORMATS[this.fieldOptions['datefmt_type']] ||
            FormOptions.t.DATE_FORMATS['date']
          );
        }
        return this.fieldOptions['datefmt'] || FormOptions.t.DATE_FORMATS['date'];
      }
    },
    // 日期类型
    dateType() {
      // year/month/date/week/ datetime/datetimerange/daterange
      if (this.fieldType === 'currentDate') {
        return 'date';
      } else if (this.fieldType === 'currentTime') {
        return 'datetime';
      } else {
        if (this.fieldOptions['datefmt_type'] === 'date') {
          return 'date';
        } else if (this.fieldOptions['datefmt_type'] === 'datetime') {
          return 'datetime';
        } else if (this.fieldOptions['datefmt_type'] === 'time') {
          return 'time';
        } else if (
          this.fieldOptions['datefmt_type'] &&
          this.fieldOptions['datefmt_type'] !== 'custom'
        ) {
          // TODO: 根据自定义的配置
          return 'datetime';
        } else {
          return 'datetime';
        }
      }
    },
    /**
     * 单选、多选、下拉等选项
     */
    options() {
      return this.fieldOptions['options'] || [];
    },
    /**
     *  占位符
     */
    placeholder() {
      return !this.$attrs.readonly ? this.fieldOptions['placeholder'] : '';
    },
    /**
     * 下拉占位符
     */
    selectPlaceholder() {
      return !this.$attrs.readonly
        ? this.fieldOptions['include_blank_value'] || this.fieldOptions['placeholder']
        : '';
    },
    /**
     * 最大文件上传
     */
    maxFileSize() {
      if (this.$utils.isNotEmpty(this.fieldOptions.max_file_size)) {
        return this.fieldOptions.max_file_size * 1024 * 1024;
      } else {
        return null;
      }
    },
    /**
     * 最大文件个数
     */
    fileQuantity() {
      if (
        this.$utils.isNotEmpty(this.fieldOptions.max_file_quantity) &&
        (this.fieldOptions.max_file_quantity !== '-1' || this.fieldOptions.max_file_quantity !== -1)
      ) {
        return parseInt(this.fieldOptions.max_file_quantity, 10);
      } else {
        return null;
      }
    },
    accept() {
      const mediaType = this.fieldOptions.media_type;
      if (this.$utils.isEmpty(mediaType)) {
        return '*';
      }
      const x = ACCEPT[mediaType];
      if (x) {
        return x;
      } else {
        return '*';
      }
    },
    fileFormates() {
      const mediaType = this.fieldOptions.media_type;
      if (this.$utils.isEmpty(mediaType)) {
        return [];
      }
      const x = FILE_TYPES[mediaType];
      if (x) {
        return x.map(v => {
          return '.' + v;
        });
      } else {
        return (this.fieldOptions.media || '').split(',');
      }
    },
    bindId() {
      const bindId = this.fieldOptions['bind_id'];
      if (this.$utils.isEmpty(bindId)) {
        return '';
      }
      return this.formData[bindId] || '';
    },
    /**
     * 是否多选
     */
    multiple() {
      return !this.$utils.toBoolean(this.fieldOptions['is_single']);
    },
    // 高
    height() {
      return this.fieldOptions.height ? parseInt(this.fieldOptions.height, 10) : null;
    },
    topVal() {
      const top = this.fieldOptions.top;
      const topval = this.fieldOptions.topval;
      if (this.$utils.isEmpty(topval)) {
        if (top === 'country') {
          return '0';
        }
        return ''; // 异常配置
      }
      if (top === 'country') {
        return '0';
      } else if (top === 'province' || top === 'city' || top === 'district') {
        return topval[topval.length - 1];
      }
      return '';
    },
    // 是否显示审批历史
    showApprovalHistory() {
      return !!(this.params.taskId || this.params.bpmnInstId);
    },
    // 是否显示流程图
    showFlowDiagram() {
      return !!(this.params.defId || this.params.taskId || this.params.bpmnInstId);
    },
    otherOptionValue() {
      return this.getOtherOptionValue();
    }
  },
  watch: {
    value: {
      handler(val) {
        console.log(val);
      },
      immediate: true
    }
  },
  watch: {
    value: {
      deep: true,
      handler(val) {
        this.model = val;
      }
    },
    model: {
      deep: true,
      handler(val) {
        this.$emit('update:value', val);
      }
    }
  },
  methods: {
    toThousandsNoZero(num) {
      return num
        ? (isNaN(parseFloat(num.toString().replace(/,/g, '')))
            ? 1
            : parseFloat(num.toString().replace(/,/g, ''))
          )
            .toFixed(2)
            .toString()
            .replace(/(\d)(?=(\d{3})+\.)/g, function($0, $1) {
              return $1 + ',';
            })
        : '';
    },

    /* 联动搜索相应 */
    serachData(obj, chain) {
      const newObj = {};
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          const element = obj[key];

          for (const a in chain) {
            if (key == a) {
              newObj[chain[a]] = element;
            }
          }
        }
      }
      // 转换后数据
      console.log(newObj);
    },
    changeOtherOption(value) {
      const otherId = this.fieldOptions['option_other_id'];
      if (this.$utils.isEmpty(otherId)) return;
      const formData = this.$utils.newData(this.formData);
      formData[otherId] = value;
      this.changeFormData(formData);
    },
    getOtherOptionValue() {
      const otherId = this.fieldOptions['option_other_id'];
      if (this.$utils.isEmpty(otherId)) return;
      return this.formData[otherId] || '';
    },
    /**
     * 对话框回调
     */
    dialogCallback(data, params) {
      const bind = this.getBind();
      if (this.$utils.isEmpty(bind)) {
        return;
      }
      // 设置联动数据
      const formData = this.$utils.newData(this.formData);
      bind.forEach(obj => {
        const name = obj.name;
        const field = obj.fieldName;
        if (this.$utils.isEmpty(name) || this.$utils.isEmpty(field)) {
          return true;
        }
        // TODO  目前只支持主表  数据处理没做
        const value = data
          .map(d => {
            return d[field];
          })
          .join(',');
        formData[name] = value;
      });
      this.changeFormData(formData);
    },
    /**
     * 对话框回调
     */
    // TODO pc 端做这个功能再做
    dialogAttrCallback(data, params) {},
    /**
     * 关联数据回调
     */
    linkdataCallback(data, params) {
      const linkLinkage = this.getLinkLinkage();
      const linkAttr = this.getLinkAttr();
      if (this.$utils.isEmpty(linkLinkage) && this.$utils.isEmpty(linkAttr)) {
        return;
      }

      // 设置联动数据
      const formData = this.$utils.newData(this.formData);
      linkLinkage.forEach(obj => {
        const name = obj.name;
        const field = obj.field;
        if (this.$utils.isEmpty(name) || this.$utils.isEmpty(field)) {
          return true;
        }
        // TODO  目前只支持主表  数据处理没做
        const value = data
          .map(d => {
            return d[field];
          })
          .join(',');
        formData[name] = value;
      });

      this.linkageChangeFormData(linkAttr, formData, data, params);
    },
    /**
     * 关联数据---关联属性
     */
    linkdataAttrCallback(data, params) {
      const linkAttr = this.getLinkAttr();
      if (this.$utils.isEmpty(linkAttr)) {
        return;
      }
      const formData = this.$utils.newData(this.formData);
      this.linkageChangeFormData(linkAttr, formData, data, params);
    },
    /**
     * 关联数据----联动改变表单数据
     */
    linkageChangeFormData(linkAttr, formData, data, params) {
      if (this.$utils.isNotEmpty(linkAttr)) {
        // 关联属性
        linkAttr.forEach(obj => {
          const name = obj.name;
          const field = obj.field;
          if (this.$utils.isEmpty(name) || this.$utils.isEmpty(field)) {
            return true;
          }
          // TODO  目前只支持主表  数据处理没做
          const value = data
            .map(d => {
              return d[field];
            })
            .join(',');
          formData[name] = value;
        });
      }
      this.changeFormData(formData);
    },
    getLinkLinkage() {
      return this.fieldOptions['link_linkage'] || [];
    },
    getLinkAttr: function() {
      return this.fieldOptions['link_attr'] || [];
    },
    getBind: function() {
      return this.fieldOptions['bind'] || [];
    },
    getBindId: function() {
      return this.fieldOptions['bind_id'] || '';
    },
    selectorBindCallback(data) {
      var bindId = this.getBindId();
      if (this.$utils.isNotEmpty(bindId)) {
        const formData = this.$utils.newData(this.formData);
        formData[bindId] = data;
        this.changeFormData(formData);
      } else {
        this.$message.error('[' + this.label + ']字段未绑Id');
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.number {
  position: relative;
  .exchange {
    position: absolute;
    right: 25px;
    top: 3px;
  }
}
</style>

