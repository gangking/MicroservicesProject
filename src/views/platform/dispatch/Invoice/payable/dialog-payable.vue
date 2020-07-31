<template>
  <el-dialog class="wrapper" :visible="visible" :before-close="handleClose" append-to-body fullscreen :show-close="false">
    <invoice-form v-if="visible" ref="outerSkin" :params="getParams" />
  </el-dialog>

</template>

<script>
import InvoiceForm from './index';
export default {
  components: {
    InvoiceForm
  },

  provide() {
    return {
      outerSkin: this
    };
  },
  inject: {
    ibpsPayable: {
      from: 'ibpsPayable',
      default() {
        return this;
      }
    }
  },
  props: {
    visible: Boolean,

    getParams: {
      type: Object,
      default() {
        return {};
      }
    }
  },

  methods: {
    handleClose() {
      this.ibpsPayable.$emit('exit-multi-form', 'exit-multi-form');
      this.$emit('update:visible', false);
    }
  }
};
</script>
<style lang="scss" >
.el-dialog__wrapper.wrapper {
  > .el-dialog.is-fullscreen {
    > .el-dialog__body {
      padding: 10px;
      background: #9093994d;
      height: 100%;
      overflow: hidden;
    }
    > .el-dialog__header {
      display: none;
    }
  }
}
</style>

