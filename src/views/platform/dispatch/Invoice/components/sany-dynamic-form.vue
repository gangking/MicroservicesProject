<template>
  <div>
    <dynamic-form ref="snyform" :value="formData" :models.sync="models" :form-def="formDynamicDef" :readonly="readonly" :permissions="permissions" :column-min-width="columnMinWidth" :validate-immediately="validateImmediately" :initialization="initialization" />
  </div>
</template>
<script>
import DynamicForm from '@/business/platform/form/formrender/dynamic-form/dynamic-form';
import { JFormMixins } from '../mixins/formScript';
import util from '@/utils/util';
export default {
  name: 'sany-dynamic-form',
  components: {
    DynamicForm
  },

  mixins: [JFormMixins()],

  props: {
    formDef: {
      type: Object,
      default() {
        return {};
      }
    }
  },

  data() {
    return {
      height: '100%',
      models: {},
      formDynamicDef: {},
      script: '',
      validateImmediately: true,
      initialization: false,
      columnMinWidth: '80',
      readonly: false,
      formData: {}
    };
  },

  watch: {
    formDef: {
      handler(nval, oldval) {
        console.log('改变数据了11111....', nval);
        if (this.isNotEmpty(nval) && nval != oldval) {
          console.log('改变数据了....', nval);
          const { data, permissions, formData } = nval;
          const formDynamicDef = JSON.parse(data);
          if (formDynamicDef.attrs) {
            this.script = formDynamicDef.attrs.script;
            formDynamicDef.attrs.script = {};
          }
          this.reloadScript();
          this.permissions = JSON.parse(permissions);

          this.formDynamicDef = formDynamicDef;
          this.formData = formData;
        }
        // console.log('sany-dynamic-form', this.$refs['snyform'].getFormData())
        // this.$emit('update:models', this.$refs['snyform'].getFormData())
      },
      immediate: true
    }
  },
  mounted() {
    console.log('动态表单挂载....');
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
    },

    onFormSave() {
      this.$emit('form-save', this.formData, this.formDefData);
    },
    isNotEmpty(val) {
      console.log('判断是否为空', !util.isEmpty(this.formDef));
      return !util.isEmpty(val);
    }
  }
};
</script>
<style lang='scss' scoped>
/deep/ .el-tabs__nav-wrap {
  background: #fff;
}
</style>
