<template>
  <div class="contairebox">
    <dynamic-form class="inputclass" ref="snyform" :value="value" :models.sync="models" :form-def="delFormScript" :readonly="readonly" :permissions="permissions" :column-min-width="columnMinWidth" :validate-immediately="validateImmediately" :initialization="initialization" />
  </div>
</template>
<script>
import DynamicForm from '@/business/platform/form/formrender/dynamic-form/dynamic-form';
import { JFormMixins } from '../mixins/formScriptTwo';

export default {
  name: 'contaire-box',
  components: {
    DynamicForm
  },
  mixins: [JFormMixins],
  props: {
    formDef: {
      type: String,
      default: ''
    },
    value: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      height: '100%',
      validateImmediately: true,
      initialization: false,
      columnMinWidth: '80',
      readonly: false,
      models: {},
      permissions: {}
    };
  },
  computed: {
    formDefData() {
      if (!this.formDef) {
        return {};
      }
      return JSON.parse(this.formDef);
    },
    delFormScript() {
      console.log('delFormScript', this.formDef);
      if (!this.formDef) {
        return {};
      }
      const formdefine = JSON.parse(this.formDef);
      if (formdefine.attrs) {
        formdefine.attrs.script = {};
      }
      return formdefine;
    },
    formData() {
      return this.value;
    }
  }
};
</script>
<style lang='scss' >
/deep/ .el-tabs__nav-wrap {
  background: #fff;
}
.contairebox {
  flex: 1;
  // overflow-y: auto;
  overflow-y: auto;
  overflow-x: hidden !important;
  //   background: red;
  .inputclass {
    .el-form-item.el-form-item--small .el-form-item__content div {
      height: 30px;
      background: #f7f5f5;
      border-radius: 4px;
      padding-left: 3px;
      box-sizing: border-box;
      line-height: 30px;
      > input {
        position: relative;
        left: -9px;
        width: calc(100% + 9px);
      }
    }
  }
}
</style>
