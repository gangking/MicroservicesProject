<template>
  <fullScreenDynamicForm ref="multilineform" :data="formDefine" @on-form-event="onFormButtonSave" />
</template>

<script>
import fullScreenDynamicForm from './full-screen-dynamic-form';
import DynamicFormModel from '@/js-model/dynamic-form-model';
import { createNamespacedHelpers } from 'vuex';
import ComponentProps from '../mixins/components-props';
import util from '@/utils/util';
const { mapActions, mapState, mapGetters } = createNamespacedHelpers('ibps/compositeMultiline');
const NO_CREATE_DATA = 'NO_CREATE_DATA';
export default {
  name: 'multiline-container',
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
  inject: ['multiline'],
  created() {
    this.LoadDynamicFormDefine();
  },
  methods: {
    ...mapActions(['getFormDefineById']),
    LoadDynamicFormDefine() {
      console.log('----this.itemVal', this.itemVal);
      const { btype, dataId } = this.itemVal;
      this.isInit = false;
      this.getFormDefineById({ btype, dataId, stepVal: this.stepVal })
        .then(data => {
          this.formDefine = Object.freeze(data);
          this.$nextTick(() => {
            this.isInit = true;
          });
        })
        .then(() => {
          return new Promise((reslove, reject) => {
            this.$nextTick(() => {
              const multilineform = this.$refs['multilineform'];
              if (!dataId) {
                setTimeout(() => {
                  let { formData: value, data } = multilineform.getFormData();
                  this.onFormEvent('createMultiFormSave', {}, value, data).then(res => {
                    res ? reslove(res) : reject(res);
                  });
                }, 300);
              } else {
                reslove(NO_CREATE_DATA);
              }
            });
          });
        })
        .then(val => {
          if (NO_CREATE_DATA != val) {
            const {
              data: { tailId }
            } = val;
            console.log('新增数据ID', tailId, val);
            this.itemVal['dataId'] = tailId;
            this.getFormDefineById({ btype, dataId: tailId, stepVal: this.stepVal }).then(data => {
              this.formDefine = Object.freeze(data);
              this.multiline['reloadOutlineTableData'](-1, false);
            });
          }
        });
    },
    /**
     * 当提交到流程的时候需要先保存
     */
    pushCompoundForm() {
      console.log('保存多行表单....');
      return this.onSaveFormData();
    },
    onSaveFormData() {
      if (this.isInit) {
        const { formData, data } = this.$refs['multilineform'].getFormData();

        //console.log("ske", formData, data);
        return this.onFormEvent('multiFormSave', { buttonName: '保存表单' }, formData, data).then(
          () => {
            return this.LoadDynamicFormDefine();
          }
        );
      }
      return true;
    },
    onFormButtonSave(action, btnval, ...args) {
      this.onFormEvent.apply(this, [action, btnval, ...args]).then(() => {
        return this.LoadDynamicFormDefine();
      });
    },

    onFormEvent(action, btnval, ...args) {
      // console.log('多行表单保存', action, args);
      return this.payable.onActionEvent.apply(this.payable, [action, btnval, this, ...args]);
      /*  .then(() => {
          return this.LoadDynamicFormDefine();
        }); */
      // this.$emit('on-action-event', action, args);
    }
  }
};
</script>

<style lang="scss" scoped>
.two-layout-box-container {
  height: 100%;
}
</style>
