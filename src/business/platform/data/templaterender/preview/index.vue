<template>
  <!--默认-->
  <!-- 隐藏掉 v-if="type==='default'" -->
  <el-dialog v-if="isDialog" :title="title" :visible.sync="dialogVisible" :close-on-click-modal="false" :close-on-press-escape="false" :fullscreen="fullscreen" :width="width" :height="height" class="data-template-renderer-dialog" top="5vh" append-to-body @open="getFormData" @close="closeDialog">
    <template-render v-if="dialogVisible" :multiple="multiple" :data="dataTemplate" @close="closeDialog" />
  </el-dialog>
  <template-render v-else :multiple="multiple" :data="dataTemplate" @close="closeDialog" />
  <!--自定义对话框-->
  <!--   <ibps-selector-dialog
    v-else-if="type==='dialog' "
    :value="selectedValue"
    :visible.sync="dialogVisible"
    v-bind="$props"
    :title="title"
    :width="width"
    :height="height"
    :multiple="multiple"
    :label-key="labelKey"
    @input="handleSelectChange"
    @close="closeDialog"
    @action-event="handleActionEvent"
  >
    <template v-slot="scope">
      <template-render
        v-if="dialogVisible"
        v-bind="scope"
        :data="dataTemplate"
        @close="closeDialog"
        @selected="handleSelectChange"
      />
    </template>
  </ibps-selector-dialog>-->
</template>
<script>
import { getByKey } from '@/api/platform/data/dataTemplate';
import { getFormDataByFormKey } from '@/api/platform/form/formDef';

import ButtonsConstants from '@/business/platform/data/constants/buttons';
import TemplateRender from '../index';
import IbpsSelectorDialog from '@/components/ibps-selector/dialog';
import { buildFelds } from '../utils';
import { mapMutations } from 'vuex';
import Vue from 'vue';
Vue.component('data-template-formrender', () =>
  import('@/business/platform/form/formrender/index.vue')
);

export default {
  components: {
    TemplateRender,
    IbpsSelectorDialog
  },
  props: {
    isDialog: {
      type: Boolean,
      default: true
    },
    visible: {
      type: Boolean,
      default: false
    },
    dataTemplateKey: {
      // 模版定义Key
      type: String
    },
    data: {
      // 数据模版数据
      type: Object
    },
    multiple: {
      type: Boolean,
      default: true
    },
    invoiceInfo: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  data() {
    return {
      dialogVisible: this.visible,
      dialogLoading: false,
      fullscreen: true,
      width: null,
      height: null,
      type: 'default',
      toolbars: [],
      dataTemplate: {},
      title: '',
      selectedValue: [],
      labelKey: ''
    };
  },
  watch: {
    visible: {
      handler: function(val, oldVal) {
        this.dialogVisible = this.visible;
        val && this.getFormData();
      },
      immediate: true
    },
    data: {
      handler(val, oldVal) {
        console.log(val, '数据模版的值');
      },
      immediate: true
    },
    invoiceInfo: {
      handler(val, oldVal) {
        // console.log(val, "invoiceInfoinvoiceInfoinvoiceInfoinvoiceInfo");
      },
      immediate: true
    }
  },
  provide() {
    return {
      getDataTemplate: () => this.dataTemplate,
      getHeadInfo: () => this.invoiceInfo
    };
  },
  methods: {
    ...mapMutations('ibps/form', ['getTemplatekey', 'getBokey']),
    handleSelectChange(val) {
      this.selectedValue = val;
    },
    handleActionEvent(key) {
      this.$emit('action-event', key, this.selectedValue);
    },
    emitEventHandler(actionKey, { formData }) {
      switch (actionKey) {
        case 'close':
          this.closeDialog();
          break;
        case 'preview':
          this.formData = formData;
          break;
      }
    },
    cleanValue() {},
    // 关闭当前窗口
    closeDialog() {
      this.$emit('update:visible', false);
      this.$emit('close', false);
    },
    getFormData() {
      if (this.$utils.isEmpty(this.dataTemplateKey) && this.$utils.isNotEmpty(this.data)) {
        const data = JSON.parse(JSON.stringify(this.data));
        if (this.data.attrs && this.$utils.isNotEmpty(this.data.attrs.form_key)) {
          getFormDataByFormKey({
            formKey: this.data.attrs.form_key
          })
            .then(response => {
              console.log(this.dataTemplateKey, 'dataTemplateKey88877');
              const formData = this.$utils.parseData(response.data);
              const datasets = buildFelds(formData.fields, data.datasets);
              data.datasets = datasets;
              this.dataTemplate = data;
              this.initDataTemplate();
              this.dialogLoading = false;
            })
            .catch(() => {
              this.dialogLoading = false;
            });
        } else {
          this.dataTemplate = data;
          this.initDataTemplate();
        }
        return;
      }
      this.dialogLoading = true;

      this.getTemplatekey(this.dataTemplateKey);

      getByKey({
        dataTemplateKey: this.dataTemplateKey
      })
        .then(response => {
          // 从后台获取数据
          this.dataTemplate = this.$utils.parseData(response.data);
          console.log(this.dataTemplate, '888888888this.dataTemplate');
          this.initDataTemplate();

          this.dialogLoading = false;
        })
        .catch(() => {
          this.dialogLoading = false;
        });
    },

    initDataTemplate() {
      this.type = this.dataTemplate.type;
      if (this.type === 'dialog') {
        this.title = this.dataTemplate.name;
        const dialogs = this.dataTemplate.dialogs;
        const width = parseInt(dialogs.attrs ? dialogs.attrs.width || '500' : '500');
        const height = parseInt(dialogs.attrs ? dialogs.attrs.height || '450' : '450');
        const template = this.dataTemplate.templates[0];
        this.fullscreen = null;

        this.width = width <= 100 ? `${width}%` : `${width}px`;
        this.height = height <= 100 ? `${height}%` : `${height}px`;
        this.toolbars = this.handleButton(dialogs.buttons ? dialogs.buttons.dialog_buttons : []);
        this.labelKey = template.result_columns ? template.result_columns[0].name : '';
        this.$emit('init-data', {
          labelKey: this.labelKey
        });
      } else {
        this.fullscreen = true;
        this.title = null;
        this.width = null;
        this.height = null;
      }
    },
    handleButton(buttons) {
      const toolbars = [];
      buttons.forEach(button => {
        const buttonType = button.button_type;
        const btn = ButtonsConstants[buttonType] || {};
        toolbars.push({
          key: buttonType,
          label: button.label || btn.label,
          type: button.type || btn.type,
          icon: button.icon || btn.icon
        });
      });
      return toolbars;
    }
  }
};
</script>
<style lang="scss" >
.data-template-renderer-dialog {
  .el-dialog__header {
    padding: 0;
    border-bottom: 0;
  }
  .el-dialog__body {
    padding: 0;
  }
  .el-dialog__headerbtn {
    z-index: 99999;
  }
}
</style>

