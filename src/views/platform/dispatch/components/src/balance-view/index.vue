<template>
  <!-- <el-dialog :title="dialogTitle" top="5vh" :visible.sync="dialogflexible" width="80%" append-to-body :before-close="handleClose"> -->
  <div class="diabox">
    <div class="tableBox">
      <el-table ref="multipleTable" @selection-change="handleSelectionChange" :data="tableData" tooltip-effect="dark" style="width: 100%" height="100%" :row-class-name="tableRowClassName">
        <el-table-column type="selection" width="55" :selectable='checkboxT'>
        </el-table-column>
        <el-table-column fixed="left" prop="code" label="客商编码" width="120">
        </el-table-column>
        <el-table-column prop="natureName" label="客商名称" width="120">
        </el-table-column>
        <el-table-column prop="nature" label="客商性质" width="160">
        </el-table-column>
        <el-table-column prop="bukrs" label="公司代码" width="160">
        </el-table-column>
        <el-table-column prop="prctr" label="利润中心" width="160">
        </el-table-column>
        <!-- <el-table-column prop="balanceVal" label="余额" width="160">
        </el-table-column> -->
        <el-table-column prop="baseCurrency" label="本位币" width="160">
        </el-table-column>
        <el-table-column prop="gsber" label="业务范围" width="160">
        </el-table-column>
        <el-table-column prop="dmbtrAp" label="应付账款" width="160">
        </el-table-column>
        <el-table-column prop="dmbtrOp" label="其他应付款" width="160">
        </el-table-column>
        <el-table-column prop="dmbtrAr" label="应收账款" width="160">
        </el-table-column>
        <el-table-column prop="dmbtrOr" label="其他应收款" width="160">
        </el-table-column>
        <el-table-column prop="dmbtrPd" label="已到期应付款" width="160">
        </el-table-column>
        <el-table-column prop="dmbtrOpd" label="未到期应付款" width="160">
        </el-table-column>
        <el-table-column prop="dmbtrRd" label="已到期应收款" width="160">
        </el-table-column>
        <el-table-column fixed="right" prop="dmbtrOrd" label="未到期应收款" width="160">
        </el-table-column>
      </el-table>
    </div>

    <div class="pagination">
      <el-pagination @current-change="handleCurrentChange" :current-page="pageResult.page" layout="total, prev, pager, next, jumper" :total="pageResult.totalCount" :page-size="10">
      </el-pagination>
    </div>
    <span class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="exportFunc">导 出</el-button>
    </span>
  </div>

  <!-- </el-dialog> -->
</template>

<script>
import util from '@/utils/util';

import { queryViewBalance, queryViewBalanceOut } from '@/api/platform/invoice/multilineForm.js';
import { showLoading, hideLoading } from '@/utils/loading';
import ActionUtils from '@/utils/action';
import ComponentProps from '../../../Invoice/mixins/components-props';
import fecha from '@/utils/fecha';
export default {
  name: 'balance-view',
  mixins: [ComponentProps],
  props: {
    isflag: {
      type: Boolean,
      default: false
    },
    dialogTitle: {
      type: String,
      default: ''
    }
  },
  // inject: ['payable'],
  // computed: {
  //   ...mapState([
  //     'instId' // instId
  //   ])
  // },
  watch: {
    isflag(val) {
      this.dialogflexible = val;
      if (val) {
        // console.log('获取id值', this.instId);
        this.onload();
      }
    }
  },
  data() {
    return {
      dialogflexible: false,
      pageResult: {
        page: 1,
        totalCount: 0
      },
      tableData: [],
      multipleSelection: [],
      activeInvoiceList: [],
      activeInvoiceCorrelation: []
    };
  },
  created() {
    this.onload();
  },
  methods: {
    // 小计行变色
    tableRowClassName({ row, rowIndex }) {
      console.log(this.tableData);
      console.log('小计行变色', row.subtotal);
      if (row.subtotal) {
        return 'success-row';
      } else {
        return '';
      }
    },
    refresh() {
      this.onload();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 导出
    exportFunc() {
      showLoading();
      queryViewBalanceOut(this.multipleSelection)
        .then(res => {
          hideLoading();
          this.$message.success('导出成功');
          console.log('导出成功', res);
          ActionUtils.exportFile(
            res.data,
            '余额查看' + fecha.formatDate('yyyyMMddHHmmss') + '.xls'
          );
        })
        .catch(req => {
          hideLoading();
          this.$message.error('导出失败');
          console.log('导出失败', req);
        });
    },
    onload() {
      this.tableData = [];
      this.multipleSelection = [];
      // var list = require('./test').list;
      // this.setList(list);

      showLoading();
      queryViewBalance({
        instId: this.instId
      })
        .then(res => {
          // this.tableData = res.data;
          this.setList(res.data);
          hideLoading();
          console.log('查看余额成功', res);
        })
        .catch(req => {
          hideLoading();
          this.$message.error('查看余额失败');
        });
    },
    setList(list) {
      var data = [];
      for (var i = 0; i < list.length; i++) {
        if (!data[list[i].code]) {
          var arr = [];
          arr.push(list[i]);
          data[list[i].code] = arr;
        } else {
          data[list[i].code].push(list[i]);
        }
      }
      // console.log('分类后的数组', data, typeof data);
      var newList = [];
      for (var key in data) {
        // console.log(data[key]);
        var item = data[key];
        if (item.length > 0) {
          var subtotalVal = {
            dmbtrAp: 0,
            dmbtrOp: 0,
            dmbtrAr: 0,
            dmbtrOr: 0,
            dmbtrPd: 0,
            dmbtrOpd: 0,
            dmbtrRd: 0,
            dmbtrOrd: 0
          };
          item.forEach(a => {
            a['subtotal'] = false;
            subtotalVal.dmbtrAp += parseInt(a.dmbtrAp);
            subtotalVal.dmbtrOp += parseInt(a.dmbtrOp);
            subtotalVal.dmbtrAr += parseInt(a.dmbtrAr);
            subtotalVal.dmbtrOr += parseInt(a.dmbtrOr);
            subtotalVal.dmbtrPd += parseInt(a.dmbtrPd);
            subtotalVal.dmbtrOpd += parseInt(a.dmbtrOpd);
            subtotalVal.dmbtrRd += parseInt(a.dmbtrRd);
            subtotalVal.dmbtrOrd += parseInt(a.dmbtrOrd);
          });
          subtotalVal['code'] = '小计';
          subtotalVal['subtotal'] = true;
          item.push(subtotalVal);
          newList = newList.concat(item);
        }
      }
      this.tableData = newList;
      console.log('合并后的数组', newList);
    },
    checkboxT(row, rowIndex) {
      if (row.subtotal) {
        return false;
      } else {
        return true;
      }
    },
    handleClose() {
      this.dialogflexible = false;
      this.$emit('closebalanceViewDialog', false);
    },
    // 翻页
    handleCurrentChange(page) {
      this.pageResult['page'] = page;
      this.onload();
    }
  }
};
</script>

<style lang="scss" scoped>
.diabox {
  padding: 20px;
  height: 100%;
  box-sizing: border-box;
  .tableBox {
    position: relative;
    height: calc(100% - 85px);
    /deep/ .el-table {
      .success-row {
        background: #f5f5f6;
      }
    }
  }

  .pagination {
    height: 40px;
    text-align: center;
  }
  .dialog-footer {
    display: block;
    height: 40px;
  }
}
// /deep/ .el-dialog__body {
//   padding: 20px;
//   .selectBox {
//     height: 60px;
//     overflow: auto;
//     border: 1px solid #ccc;
//     margin-bottom: 10px;
//     padding: 5px;
//     box-sizing: border-box;
//   }
//   .diabox {
//     height: 400px;
//   }
//   .pagination {
//     height: 40px;
//     text-align: center;
//   }
// }
</style>