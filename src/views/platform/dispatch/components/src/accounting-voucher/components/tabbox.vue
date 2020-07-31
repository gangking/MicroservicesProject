<template>
  <div class="tabbox">
    <div class="tab-con">
      <el-table class="content" ref="tabboxTable" :data="tableData" header-cell-class-name="headerRowStyle" border highlight-current-row style="width: 100%" @row-click="onRowClick">
        <el-table-column v-for="(item,key) in tableTitle" :key="key" :min-width="item.style.width" :align="item.style['align']" :prop="item.fieldName" :label="item.fieldDesc">
          <template slot="header" slot-scope="scope">
            <span :style="item.style.style">{{ scope.column.label }}</span>
          </template>
          <template slot-scope="scope">
            <div :style="item.style.style" v-html="item.style.tppl ? renderRow(item.style.tppl, scope, item.fieldName): scope.row[item.fieldName]" />
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import SanyMessage from './message';
import { renderTppl } from '@/views/platform/dispatch/Invoice/utils/tppl';
import { stringify } from 'querystring';

import utils from '@/utils/util';
export default {
  components: {
    SanyMessage
  },
  props: {
    tabList: {
      type: Array,
      default: () => []
    },
    tabContent: {
      type: Object,
      default: function() {
        return {};
      }
    },
    total: {
      type: Number
    }
  },
  computed: {
    tableTitle() {
      const define = (this.tabList || []).map(item => {
        item.style = item.style ? JSON.parse(item.style) : {};
        return item;
      });
      return define;
    },
    // 表内容数据
    tableData() {
      console.log(`表内容数据`, this.tabContent);
      this.$nextTick(() => {
        if (!utils.isEmpty(this.tabContent)) {
          if (this.tabContent.dataResult.length > 0) {
            // 默认选中第一行
            this.onRowClick(this.tabContent.dataResult[0]);
            // 选中样式
            this.$refs.tabboxTable.setCurrentRow(this.tabContent.dataResult[0]);
          }
        }
      });
      return this.tabContent.dataResult;
    }
  },
  methods: {
    // 样式
    renderRow(tpl, scope, fieldName) {
      scope.value = scope.row[fieldName];
      return renderTppl(tpl, scope);
    },
    // 点中一行渲染自定义表单数据
    onRowClick(row, column, event) {
      console.log('点中一行渲染自定义表单数据', row, column, event);
      this.$emit('clickRowData', row);
    }
  }
};
</script>
<style lang="scss" scoped>
.tabbox {
  height: calc(100%) !important;
  display: flex;
  flex-direction: column;
  overflow: auto;
  .tab-con {
    // height: 85%;
    height: 100%;
  }

  .header {
    height: 49px;
    border-bottom: 1px solid #ccc;
  }
  .content {
    height: auto;
    flex: 1;
    overflow: auto;
  }
  .pageClass {
    margin-top: 10px;
    margin-left: 10px;
  }
  /deep/ .headerRowStyle {
    background: #f0f9eb !important;
    color: black;
    font-family: '黑体';
    font-weight: 700;
    height: 45px;
    border-top: 1px solid #d4d4de !important;
  }
}
</style>
