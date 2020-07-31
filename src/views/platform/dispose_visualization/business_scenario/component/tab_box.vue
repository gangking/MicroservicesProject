<template>
  <div class="tabBox">
    <el-tabs v-model="activeNames" @tab-click="handleClick">
      <el-tab-pane v-for="(item,index) in tabList" :key="index" :label="item.label" :name="item.name">{{
        item.label}}</el-tab-pane>
    </el-tabs>
    <div class="content">
      <slot name="tableSlot"></slot>
    </div>
  </div>
</template>

<script>
import tableLayout from './table_layout.vue';
export default {
  props: {
    tabList: {
      type: Array,
      default: () => {
        return [];
      }
    },
    activeName: {
      type: String,
      default: ''
    },
    tbaleTitle: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      activeNames: this.activeName
    };
  },
  watch: {
    activeName: {
      handler(val) {
        this.activeNames = val;
      },
      immediate: true
    }
  },
  components: {
    tableLayout
  },
  methods: {
    handleClick(tab, event) {
      this.$emit('handleClick', tab);
    }
  }
};
</script>

<style lang="scss" scoped>
.tabBox {
  width: 100%;
  height: 100%;
  padding: 0 10px;
  box-sizing: border-box;
  overflow: auto;
  /deep/ .el-tabs {
    .el-tabs__header {
      margin: 0;
      .el-tabs__active-bar {
        padding: 0 10px;
        margin-left: -10px;
        height: 3px;
      }
      .el-tabs__item {
        padding: 0 10px;
      }
    }
    .el-tabs__content {
      display: none;
    }
  }
  .content {
    height: calc(100% - 40px);
    padding: 10px 0;
    box-sizing: border-box;
    // overflow: auto;
  }
}
</style>