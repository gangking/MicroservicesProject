<template>
  <fullScreenDynamicForm ref="fullScreenDynamicForm" :data="formDefine" @on-form-event="onFormButtonEvent" />
</template>
<script>
import fullScreenDynamicForm from './full-screen-dynamic-form';
import { createNamespacedHelpers } from 'vuex';
import DynamicFormModel from '@/js-model/dynamic-form-model';
const { mapActions } = createNamespacedHelpers('ibps/compositeSingle');
import util from '@/utils/util';
import ComponentProps from '../mixins/components-props';
export default {
  components: {
    fullScreenDynamicForm
  },
  mixins: [ComponentProps],

  data() {
    return {
      formDefine: DynamicFormModel.parse({}),
      isInit: false
    };
  },
  mounted() {
    console.log('mounted...当步骤离开之前');
    this.refresh();
  },
  methods: {
    ...mapActions(['getStepFormDefine']),
    /**
     * 当步骤离开之前
     */
    BeforeStepLeave() {
      console.log('before.......BeforeStepLeave.......payableFormData');

      return this.onSaveFormData();
    },
    /**
     * 当页签切换离开之前
     */
    beforeLeave() {
      console.log('beforetab.........payableFormData');
      return this.onSaveFormData();
    },

    onActivated() {
      console.log('beforetab....onActivated.....payableFormData');
      return this.refresh();
    },

    onSaveFormData() {
      if (this.isInit) {
        const { formData, data } = this.$refs['fullScreenDynamicForm'].getFormData();

        //console.log("ske", formData, data);
        return this.onFormEvent(
          'onSingleFormButtonSave',
          { buttonName: '保存表单' },
          formData,
          data
        );
      }
      return true;
    },
    /**
     * 当提交到流程的时候需要先保存
     */
    pushCompoundForm() {
      return this.onSaveFormData();
    },

    onFormButtonEvent(action, btnval, value, data) {
      this.onFormEvent(action, btnval, value, data).then(() => {
        this.refresh();
      });
    },

    /**
     * 当页签被展示的时候
     */
    refresh() {
      this.isInit = false;

      console.log('当页签被展示的时候哥在刷新数据哦', this.stepContainer.stepVal);

      this.getStepFormDefine({
        tag: this.itemVal,
        stepVal: this.stepContainer.stepVal
      }).then(data => {
        this.isInit = true;

        this.formDefine = data;
      });
    },

    onFormEvent(action, btnval, value, data) {
      return this.payable.onActionEvent(action, btnval, this, value, data);
    }
  }
};
</script>

