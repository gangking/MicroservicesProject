<template>
  <div class="chart">
    <el-dialog ref="dialog" :title="title" :visible.sync="dialogVisible" :close-on-click-modal="false" :close-on-press-escape="true" :fullscreen="fullscreen" class="preview-dialog" @close="closeDialog" @open="loadComponent" append-to-body>
      <component :is="compon" :monitorDetailObj="monitorDetailObj" />
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
    monitorDetailObj: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      dialogVisible: false,
      fullscreen: true,
      compon: '',
      title: '成本监控'
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
    monitorDetailObj: {
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
      let name = this.getComponentName(this.monitorDetailObj.componet);
      console.log(name, '第三屏的名字');
      this.compon = dynamicImport(`@/views/platform/monitor/${name}`);
    },
    getComponentName(tag) {
      let componentObj = {
        wipaufnr: 'long_term', //长期在制订单
        subaufnr: 'process_outsour', //工序外协
        overaufnr: 'completed_timely', //完工订单收货及时性
        feedaufnr: 'completed_feeding', //完工订单投料率
        difaccount: 'stock_diff', //存货报废差异科目
        omaufnr: 'intertemporal_open' //跨期打开订单
      };
      return componentObj[tag];
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
