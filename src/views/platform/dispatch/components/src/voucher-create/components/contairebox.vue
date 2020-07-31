<template>
  <div class="contairebox">
    <dynamic-form class="inputclass" ref="snyform" :value="value" :models.sync="models" :form-def="delFormScript" :readonly="readonly" :permissions="permissions" :column-min-width="columnMinWidth" :validate-immediately="validateImmediately" :initialization="initialization" />
  </div>
</template>
<script>
import DynamicForm from '@/business/platform/form/formrender/dynamic-form/dynamic-form';
import { JFormMixins } from '@/views/platform/dispatch/Invoice/mixins/formScript';

export default {
  name: 'contaire-box',
  components: {
    DynamicForm
  },

  mixins: [JFormMixins()],

  props: {
    formDef: {
      type: String,
      required: true
    },
    value: {
      type: Object,
      default: function() {
        return {};
      }
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
      height: '100%',
      models: {}
    };
  },
  computed: {
    formDefData() {
      return JSON.parse(this.formDef);
    },
    formData() {
      return this.value;
    },
    delFormScript() {
      const formdefine = JSON.parse(this.formDef);
      if (formdefine.attrs) {
        formdefine.attrs.script = {};
      }
      return formdefine;
    }
  },

  watch: {
    value: {
      handler(nval, oldval) {
        // console.log('sany-dynamic-form', this.$refs['snyform'].getFormData())
        // this.$emit('update:models', this.$refs['snyform'].getFormData())
      }
    }
  },
  mounted() {
    /*  console.log('多行表单数据', this.formDef)
        this.$emit('dynamicformMounted', 'yese') */
  },
  methods: {
    getFormData() {
      return this.$refs['snyform'].getFormData();
    },

    submitVerify(callback) {
      console.log('执行表单验证了');
      this.$refs['snyform'].validate((valid, invalidFields) => {
        console.log('valid,invalidFields', valid, invalidFields);
        callback && callback(valid, invalidFields);
      });
      return this.$refs['snyform'].submitVerify();
    }

    // onFormSave() {
    //     this.$emit('form-save', this.formData, this.formDefData)
    // }
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
