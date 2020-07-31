<template>
  <div class="chart">
    <el-dialog ref="dialog" :title="title" :visible.sync="dialogVisible" :close-on-click-modal="false" :close-on-press-escape="true" :fullscreen="fullscreen" class="preview-dialog" @close="closeDialog" @open="loadComponent" append-to-body>
      <component :is="compon" :compontObj="compontObj" />
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
    compontObj: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      title: '成本监控',
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
    },

    compontObj: {
      handler: function(val, oldVal) {
        this.title = this.getTile(val.componet);
      }
    }
  },
  methods: {
    getTile(name) {
      let titles = {
        wipaufnr: '长期在制订单',
        subaufnr: '工序外协',
        overaufnr: '完工订单收货及时性',
        feedaufnr: '完工订单投料率',
        difaccount: '存货报废差异科目',
        omaufnr: '跨期打开订单'
      };
      return titles[name];
    },
    closeDialog() {
      this.$emit('update:visible', false);
    },
    btnClose() {
      this.$emit('update:visible', false);
    },
    loadComponent() {
      this.compon = dynamicImport(
        `@/views/platform/cost_monitoring/components/${this.compontObj.componet}`
      );
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
