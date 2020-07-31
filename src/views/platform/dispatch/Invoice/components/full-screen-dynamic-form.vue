<template>
  <full-screen-container :is-hidden-full-screen="true" class="full-dynamic-form">
    <sany-message v-if="message" slot="screen-header" :data="message" />
    <sany-dynamic-form v-if="visible" ref="sanyfullscreen" slot="screen-content" :form-def="formInfoData" @value-change-method="onDataChange" />
    <container-btus class="dynamic-btns" v-if="btns.length > 0" slot="screen-footer" footer="yes" :right-btns="btns" @click="onFormButtonEvent" />
  </full-screen-container>
</template>

<script>
/*  @dynamicformMounted="dynamicformMounted" */
import SanyDynamicForm from './sany-dynamic-form';
import FullScreenContainer from './full-screen-container';
import ContainerBtus from './container-btns';
import SanyMessage from './message';
import util from '@/utils/util';
export default {
  name: 'full-screen-dynamic-form',
  components: {
    SanyDynamicForm,
    FullScreenContainer,
    ContainerBtus,
    SanyMessage
  },

  props: {
    data: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      models: {},
      visible: false,
      btns: [],
      message: null,
      formInfoData: {}
    };
  },
  inject: ['payable'],

  watch: {
    data: {
      handler(val) {
        if (!util.isEmpty(val)) {
          this.formInfoData = val;
          this.message = val.message;
          this.btns = val.propertyButtonList;
          // console.log('this.btns.length', this.btns.length)
          this.visible = true;
        } else {
          this.visible = false;
        }
      },
      immediate: true
    }
  },
  methods: {
    onDataChange(field, nval, method) {
      // d
      // console.log('changeData', field, nval, method, this.payable);
      this.payable.onActionEvent('onFormDataChange', { field, nval, method }, this);
    },
    getFormData() {
      // console.log("this.$refs['sanyfullscreen']", this, this.$refs, this.$refs['sanyfullscreen'])
      return {
        formData: this.$refs['sanyfullscreen'].getFormData(),
        data: this.data
      };
    },
    submitVerify(callback) {
      return this.$refs['sanyfullscreen'].submitVerify(callback);
    },

    onFormButtonEvent(action, btnval) {
      console.log('form:action', action);
      const { formData, data } = this.getFormData();
      action && this.$emit('on-form-event', action, btnval, formData, data);
    }
  }
};
</script>

<style lang="scss">
.full-dynamic-form.full-screen-container {
  .screen-footer {
    flex-basis: 38px;
    line-height: 38px;
    padding: 0 2px 0 0;
  }
}
</style>
