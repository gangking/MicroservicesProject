<template>
  <div class="tabbox">
    <div class="tab-con">
      <el-table class="content" ref="tabboxTable" :data="tableData" header-cell-class-name="headerRowStyle" border height="100%" highlight-current-row style="width: 100%" @row-click="onRowClick">
        <el-table-column v-for="(item,key) in tableTitle" :key="key" :min-width="item.style.width" :align="item.style['align']" :prop="item.fieldName" :label="item.fieldDesc">
          <template slot="header" slot-scope="scope">
            <span :style="item.style.style">{{ scope.column.label }}</span>
          </template>

          <template slot-scope="scope">
            <div :style="item.style.style" v-html="item.style.tppl ? renderRow(item.style.tppl, scope, item.fieldName): scope.row[item.fieldName]" />
          </template>
        </el-table-column>
      </el-table>
    </div><!-- table-end -->

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

  data() {
    return {
      currentpage: 1
    };
  },
  computed: {
    messageData() {},
    tableTitle() {
      const define = (this.tabList || []).map(item => {
        item.style = item.style ? JSON.parse(item.style) : {};
        return item;
      });

      return define;
    },
    // 表内容数据
    tableData() {
      console.log(`tabContent======`, this.tabContent);
      //              const table_data = {"state":200,"request":null,"message":"","cause":"","variables":{},"data":{"dataResult":[{"pk":"","name":null,"ip":null,"createBy":null,"createTime":null,"updateBy":null,"updateTime":null,"tenantId":null,"dataStatus":null,"dbtype":null,"id":"647774099258474496","znum":"GL201911130000401","bukrs":null,"blart":"SA","waers":null,"bldat":1573574400000,"budat":1574092800000,"wwert":null,"xblnr":null,"monat":null,"xref1Hd":null,"bktxt":null,"kursf":1,"uname":null,"buzei":"001","koart":null,"hkont":"1461010000","lifnr":null,"kunnr":null,"umskz":null,"wrbtr":1500,"xnegp":null,"rstgr":null,"gsber":null,"prctr":null,"pprctr":null,"kostl":null,"aufnr":null,"sgtxt":null,"dmbtr":1500,"zuonr":null,"zterm":null,"zlsch":null,"zfbdt":null,"valut":null,"kidno":null,"xref1":null,"xref2":null,"xref3":null,"posid":null,"simNumber":"2019110000417","postNumber":null}],"pageResult":null}}
      //               return table_data.data.dataResult
      this.$nextTick(() => {
        if (!utils.isEmpty(this.tabContent)) {
          if (this.tabContent.dataResult.length > 0) {
            // this.selectBusinessTypeData(this.data.table_data[0])
            console.log(`this.tabContent.dataResult[0]==`, this.tabContent.dataResult[0]);
            this.onRowClick(this.tabContent.dataResult[0]);
            this.$emit('clickRowData', this.tabContent.dataResult[0]);
          }
        }
      });

      return this.tabContent.dataResult;
    }
  },

  watch: {
    tabList(val) {
      console.log(`val=========`, val);
    },
    tabContent(val) {
      if (!utils.isEmpty(val.dataResult)) {
        const index = val.dataResult[0];
        this.tableData.forEach(item => {
          if (item.id == index.id) {
            this.setCurrent(item);
            return;
          }
        });
      }
    }
  },
  methods: {
    renderRow(tpl, scope, fieldName) {
      scope.value = scope.row[fieldName];
      return renderTppl(tpl, scope);
    },
    // 点中一行渲染自定义表单数据
    onRowClick(row, column, event) {
      console.log('tddddd==============', row, column, event);

      this.$emit('clickRowData', row);
    },
    // 选中某行
    setCurrent(row) {
      this.$refs.tabboxTable.setCurrentRow(row);
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.currentpage = val;
      this.$emit('currentChange', val);
    }
  }
};
</script>
<style lang="scss" scoped>
// /deep/ .content .el-table  .el-table__body-wrapper{
//   height:800px;
// }
.tabbox {
  height: calc(100% - 101px) !important;
  display: flex;
  flex-direction: column;
  overflow: auto;
  .tab-con {
    // height: 85%;
    height: 100%;
  }

  .fenye {
    width: 100%;
    height: 15%;
    display: none;
    // overflow: hidden;
  }

  .header {
    height: 49px;
    border-bottom: 1px solid #ccc;
  }
  .el-table .content {
    //  .el-table__body-wrapper{
    //       height: 900px
    //     }
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
    height: 47px;
    border-top: 2px solid #ccc !important;
  }
}
</style>
