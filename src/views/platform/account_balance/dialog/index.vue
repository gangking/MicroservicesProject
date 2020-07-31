<template>
  <div class="chart">
    <el-dialog ref="dialog" title="记账余额查询" :visible.sync="dialogVisible" :close-on-click-modal="false" :close-on-press-escape="true" :fullscreen="fullscreen" class="preview-dialog" @close="closeDialog" @open="loadComponent" append-to-body>
      <component :is="compon" :balanceObj="balanceObj" />
    </el-dialog>
  </div>
</template>

<script>
import { dynamicImport } from '@/utils/dynamic-import';
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    balanceObj: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      dialogVisible: false,
      fullscreen: true,
      compon: ''
    };
  },
  computed: {},
  created() {},
  mounted() {},
  watch: {
    visible: {
      handler: function(val, oldVal) {
        this.dialogVisible = this.visible;
      },
      immediate: true
    }
  },
  methods: {
    closeDialog() {
      this.$emit('update:visible', false);
    },
    btnClose() {
      this.$emit('update:visible', false);
    },
    loadComponent() {
      this.compon = dynamicImport(`@/views/platform/account_balance/${this.balanceObj.componet}`);
    }
  },
  components: {}
};
</script>

<style scoped lang="scss">
/deep/ .el-dialog {
  height: 100%;
  padding: 0 !important;
  .el-dialog__body {
    height: calc(100vh) !important;
    padding: 0;
    overflow: hidden;
  }
}
</style>
