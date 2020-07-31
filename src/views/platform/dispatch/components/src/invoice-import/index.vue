<template>
  <div class="boxTEST">
    <div class="selectBox" v-if="dialogTitle=='发票导入'">
      <el-tag @close="deleteItem(tag)" v-for="tag in activeInvoiceList" :key="tag.ID_" closable :type="tag.ID_">
        {{tag.INVOICE_NO}}
      </el-tag>
    </div>
    <div class="selectBox" v-else>
      <el-tag @close="deleteItem(tag)" v-for="tag in activeInvoiceCorrelation" :key="tag.ID_" closable :type="tag.ID_">
        {{tag.DOC_NUMBER}}
      </el-tag>
    </div>
    <div class="diabox">
      <el-table border v-if="dialogTitle=='发票导入'" ref="multipleTable" @select="selectRow" @select-all="allSelectRow" @selection-change="handleSelectionChange" :data="tableData" tooltip-effect="dark" style="width: 100%" height="100%">
        <el-table-column align="center" type="selection" width="55">
        </el-table-column>
        <el-table-column align="center" prop="TYPE" label="发票类型" width="180">
          <template slot-scope="scope">
            <span>{{scope.row.TYPE | incoiceType}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="SALER_NAME" label="销方公司名称" width="200">
        </el-table-column>
        <el-table-column align="center" prop="INVOICE_AMOUNT" label="发票金额" width="140">
        </el-table-column>
        <el-table-column align="center" prop="TAX_RATE" label="税率" width="120">
        </el-table-column>
        <el-table-column align="center" prop="INVOICE_TAX" label="税额" width="120">
        </el-table-column>
        <el-table-column align="center" prop="INVOICE_DATE" label="发票日期" width="180">
        </el-table-column>
        <el-table-column align="center" prop="CREATE_TIME_" label="创建日期" width="180">
        </el-table-column>
        <el-table-column align="center" prop="URLFILE" label="影像存储文件" width="160" fixed="right">
          <template slot-scope="scope">
            <el-tooltip v-if="scope.row.URLFILE" class="item" effect="light" content="Left Center 提示文字" placement="left">
              <div slot="content"><img :src="scope.row.URLFILE" style="width:600px;" alt=""></div>
              <el-button type="text">我的影像</el-button>
            </el-tooltip>
            <span v-else>暂无影像</span>
          </template>
        </el-table-column>
      </el-table>
      <el-table v-else ref="multipleTable" @select="selectRow" @select-all="allSelectRow" @selection-change="handleSelectionChange" :data="tableData" tooltip-effect="dark" style="width: 100%" height="100%">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column prop="DOC_NUMBER" label="单据号码" width="120">
        </el-table-column>
        <el-table-column prop="DOC_DATE" label="单据日期" width="160">
        </el-table-column>
        <el-table-column prop="BUKRS" label="公司代码" width="160">
        </el-table-column>
        <el-table-column prop="BUTXT" label="公司名称" width="160">
        </el-table-column>
        <el-table-column prop="ORGTEXT" label="费用归属部门" width="160">
        </el-table-column>
        <el-table-column prop="TODMBTR" label="申请金额合计" width="160">
        </el-table-column>
        <el-table-column prop="DOC_DESCRIPTION" label="单据事由">
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination">
      <el-pagination @current-change="handleCurrentChange" :current-page="pageResult.page" layout="total, prev, pager, next, jumper" :total="pageResult.totalCount" :page-size="10">
      </el-pagination>
    </div>
    <span class="dialog-footer">
      <el-button type="primary" v-if="dialogTitle=='发票导入'" @click="importFunc">导 入</el-button>
      <el-button type="primary" v-else @click="invoiceCorrelationFunc">关 联</el-button>
    </span>
  </div>

</template>

<script>
import { createNamespacedHelpers } from 'vuex';
const { mapActions } = createNamespacedHelpers('ibps/compositeMultiline');
import { invoiceList } from '@/api/platform/invoice/multilineForm.js';
import { showLoading, hideLoading } from '@/utils/loading';
import ComponentProps from '../../../Invoice/mixins/components-props';
export default {
  name: 'invoice-import',
  mixins: [ComponentProps],
  inject: ['multiline'],
  created() {
    this.dialogTitle = this.itemVal.buttonName;
    console.log('发票导入里面', this.dialogTitle, this.itemVal);
    this.onload();
  },
  data() {
    return {
      dialogTitle: this.itemVal.buttonName,
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
  methods: {
    ...mapActions(['multilineInvioImportData']),
    onload() {
      showLoading();
      this.tableData = [];
      this.multipleSelection = [];
      // this.activeInvoiceList = [];
      invoiceList({
        parameters: [
          {
            key: 'dataTemplateKey',
            value: this.dialogTitle == '发票导入' ? 'DT_FPDR_BS01' : 'EXPENSE_APPLICATION'
          }
        ],
        requestPage: {
          pageNo: this.pageResult.page,
          limit: 10,
          totalCount: null
        },
        sorts: []
      })
        .then(res => {
          console.log('获取发票列表', res);
          hideLoading();
          this.tableData = res.data.dataResult;
          this.pageResult = res.data.pageResult;
          this.autoCheckList();
        })
        .catch(req => {
          hideLoading();
          this.$message.error('发票列表获取失败');
        });
    },
    // 自动选中
    autoCheckList() {
      this.$refs.multipleTable.clearSelection();
      this.$nextTick(() => {
        if (this.dialogTitle == '发票导入') {
          this.activeInvoiceList.forEach(row => {
            this.tableData.forEach(item => {
              if (item.ID_ == row.ID_) {
                this.$refs.multipleTable.toggleRowSelection(item);
              }
            });
          });
        } else {
          this.activeInvoiceCorrelation.forEach(row => {
            this.tableData.forEach(item => {
              if (item.ID_ == row.ID_) {
                this.$refs.multipleTable.toggleRowSelection(item);
              }
            });
          });
        }
      });
    },
    // 去重
    deDuplication() {
      if (this.dialogTitle == '发票导入') {
        var arry = this.activeInvoiceList.reduce(function(prev, element) {
          if (!prev.find(el => el.ID_ == element.ID_)) {
            prev.push(element);
          }
          return prev;
        }, []);
        this.activeInvoiceList = arry;
      } else {
        var arry = this.activeInvoiceCorrelation.reduce(function(prev, element) {
          if (!prev.find(el => el.ID_ == element.ID_)) {
            prev.push(element);
          }
          return prev;
        }, []);
        this.activeInvoiceCorrelation = arry;
      }
    },
    // 删除
    deleteItem(row) {
      let arr =
        this.dialogTitle == '发票导入' ? this.activeInvoiceList : this.activeInvoiceCorrelation;
      arr.splice(
        arr.findIndex(item => item.ID_ === row.ID_),
        1
      );
      this.autoCheckList();
    },
    // 当前勾选
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 勾选某一项
    selectRow(selection, row) {
      if (selection.length > this.multipleSelection.length) {
        if (this.dialogTitle == '发票导入') {
          this.activeInvoiceList.push(row);
        } else {
          this.activeInvoiceCorrelation.push(row);
        }

        // 新增的同时去重
        this.deDuplication();
      } else {
        // 删除
        this.deleteItem(row);
      }
    },
    // 点击全选
    allSelectRow(selection) {
      if (selection.length > 0) {
        selection.forEach((val, index, arr) => {
          if (this.dialogTitle == '发票导入') {
            this.activeInvoiceList.push(val);
          } else {
            this.activeInvoiceCorrelation.push(val);
          }
        });
        // 同时去重
        this.deDuplication();
      } else {
        this.tableData.forEach((val, index, arr) => {
          // 删除
          this.deleteItem(val);
        });
      }
    },
    // 翻页
    handleCurrentChange(page) {
      this.pageResult['page'] = page;
      this.onload();
    },
    // 关联
    invoiceCorrelationFunc() {
      this.$message({
        message: '已关联',
        type: 'success'
      });
    },
    // 导入
    importFunc() {
      this.activeInvoiceList.forEach((val, index, arr) => {
        console.log('点击发票导入', val);
        const info = {
          val: {
            INVOICE_TYPE: val.TYPE ? val.TYPE : '',
            INVOICE_CODE: val.INVOICE_CODE ? val.INVOICE_CODE : '',
            INVOICE_NO: val.INVOICE_NO ? val.INVOICE_NO : '',
            INVOICE_ISSUEDATE: val.INVOICE_DATE ? val.INVOICE_DATE : '',
            IN_TAX_AMOUNT: val.INVOICE_AMOUNT ? val.INVOICE_AMOUNT : '',
            INVOICE_TAX: val.INVOICE_TAX ? val.INVOICE_TAX : '',
            INVOICE_TAXRATE: val.TAX_RATE ? val.TAX_RATE : '',
            INVOICE_DESC: val.SALER_NAME ? val.SALER_NAME : '',
            REMARK: val.REMARK ? val.REMARK : '',
            URLFILE: val.URLFILE ? val.URLFILE : ''
          },
          data: {
            tableName: 'BO_EX02_HEAD',
            bcCode: val.BC_CODE,
            headFlag: 'N',
            ywlxId: ''
          },
          stepVal: this.stepVal
        };
        // 循环导入
        this.multilineInvioImportData(info).then(() => {
          this.multiline['reloadOutlineTableData'](-1, false, true);
        });
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.boxTEST {
  width: 100%;
  height: 100%;
  padding: 10px;
  box-sizing: border-box;
  .diabox {
    width: 100%;
    height: calc(100% - 150px);
    border: 1px solid #ccc;
    box-sizing: border-box;
  }
  .selectBox {
    height: 40px;
    overflow: auto;
    border: 1px solid #ccc;
    margin-bottom: 10px;
    padding: 5px;
    box-sizing: border-box;
    text-align: left;
  }
  .pagination {
    height: 40px;
    padding: 10px 0;
    text-align: center;
  }
  .dialog-footer {
    display: block;
    width: 100%;
    height: 30px;
    text-align: right;
  }
}
</style>