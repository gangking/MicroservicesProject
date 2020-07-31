<template>
  <!-- 资产报账付款明细台账 -->
  <div class="bg" ref="main" v-loading="bgLoading" element-loading-text="发送中,请等待">
    <!-- <div class="title">
      <span>集成接口定义</span>
    </div>-->
    <div class="header-btn" ref="header_btn">
      <div class="btn-wrapper">
        <div class="btn-left">
          <el-button type="primary" @click="handler('search')">查询</el-button>
          <!-- <el-button type="primary" @click="handler('edit')">编辑</el-button> -->
          <el-button type="primary" @click="handler('downExcel')">导出</el-button>
          <el-button type="primary" @click="handler('reset')">重置</el-button>
        </div>
        <!-- <div class="btn-right">
          <el-button type="success" @click="send">发送</el-button>
        </div>-->
      </div>
    </div>
    <div class="header-input" ref="header_input">
      <el-form :inline="true" ref="ruleForm" label-width="100px">
        <!-- <el-form-item label="资产编号">
          <el-input v-model="searchForm.docNumber" placeholder="请输入资产编号" clearable></el-input>
        </el-form-item>-->
        <el-form-item label="归档合同编号">
          <el-input v-model="searchForm.contractNo" placeholder="请输入归档合同编号" clearable></el-input>
        </el-form-item>
        <el-form-item label="合同编号">
          <el-input v-model="searchForm.contractnum" placeholder="请输入合同编号" clearable></el-input>
        </el-form-item>
        <el-form-item label="公司代码">
          <el-input v-model="searchForm.bukrs" placeholder="请输入公司代码" clearable></el-input>
        </el-form-item>
        <el-form-item label="客商代码">
          <el-input v-model="searchForm.partnerid" placeholder="请输入客商代码" clearable></el-input>
        </el-form-item>
        <el-form-item label="客商名称">
          <el-input v-model="searchForm.partnername" placeholder="请输入客商名称" clearable></el-input>
        </el-form-item>
        <el-form-item label="单据编号">
          <el-input v-model="searchForm.docNumber" placeholder="请输入单据编号" clearable></el-input>
        </el-form-item>
        <el-form-item label="发起时间">
          <el-date-picker v-model="jzTime" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" @change="changeJzTime"></el-date-picker>
        </el-form-item>
      </el-form>
    </div>
    <div class="table-content" :style="{height:height+'px'}">
      <el-table ref="multipleTable" :height="height" :data="tableData" border highlight-current-row v-loading="loading" tooltip-effect="dark" @section-change="selection" style="width: 100%">
        <!-- <el-table-column type="selection"></el-table-column> -->
        <el-table-column prop="docNumber" label="单据号码"></el-table-column>
        <el-table-column prop="bsDesc" label="业务场景描述"></el-table-column>
        <el-table-column prop="contractNo" label="归档合同编号"></el-table-column>
        <el-table-column prop="contractnum" label="合同编号"></el-table-column>
        <el-table-column prop="partnerid" label="客商代码"></el-table-column>
        <el-table-column prop="partnername" label="客商名称"></el-table-column>
        <el-table-column prop="docDescription" label="单据事由"></el-table-column>
        <el-table-column prop="username" label="发起人"></el-table-column>
        <el-table-column prop="bukrs" label="公司代码"></el-table-column>
        <el-table-column prop="docDate" label="发起时间"></el-table-column>
        <el-table-column prop="docStatus" label="单据状态"></el-table-column>
        <el-table-column prop="orgid" label="部门ID"></el-table-column>
        <el-table-column label="更多" width="180">
          <template slot-scope="scope">
            <el-button type="text" @click="handleAssetsDetail(scope.$index, scope.row)">资产信息</el-button>
            <el-button type="text" @click="handleAccouDetail(scope.$index, scope.row)">账务信息</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="footer" ref="footer">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 50, 100]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="totalCount"></el-pagination>
    </div>

    <!-- 详情弹窗 -->
    <el-dialog title="信息详情" :visible.sync="dialogVisible" width="50%">
      <div class="tabBox" style="height:350px;">
        <el-table :data="diaTableData" style="width: 100%" height="100%">
          <el-table-column v-for="(item, index) in listLabel" :key="index" :prop="item.property" :label="item.label"></el-table-column>
        </el-table>
      </div>

    </el-dialog>
  </div>
</template>

<script>
import {
  getAssetTable,
  downAssetExcel,
  getAsset,
  getAccount
} from '@/api/platform/cost_amortizing/account_management';
import ActionUtils from '@/utils/action';
import fecha from '@/utils/fecha';
import _ from 'lodash';
export default {
  props: {},
  data() {
    return {
      dialogVisible: false,
      diaTableData: [],
      listLabel: [],
      jzTime: [],
      searchForm: {
        contractNo: '',
        contractnum: '',
        docDateStart: '',
        docDateEnd: '',
        bukrs: '',
        partnerid: '',
        partnername: '',
        docNumber: ''
      },
      creditVisible: false,
      loading: false,
      bgLoading: false,
      ruleForm: {
        ksType: '',
        ksDaiMa: '',
        ksName: ''
      },
      rules: {},
      tableData: [{ name: 1 }], //数据
      currentPage: 1, //当前页
      pageSize: 10, // 每页多少条
      totalCount: 0, //总数
      height: 0,
      title: '',
      creditData: {} //编辑用到的数据
    };
  },
  computed: {
    tableResize() {
      return _.throttle(() => {
        this.$nextTick(() => {
          this.getHeight();
        });
      }, 150);
    }
  },
  created() {},
  mounted() {
    window.addEventListener('resize', this.tableResize);
    this.getAllTable();
    //this.getTemplateData();
    setTimeout(() => {
      this.getHeight();
    }, 100);
  },
  watch: {},
  methods: {
    changeJzTime(val) {
      this.searchForm.docDateStart = val ? val[0] : '';
      this.searchForm.docDateEnd = val ? val[1] : '';
      console.log('jzTime', this.searchForm);
    },
    handler(command) {
      switch (command) {
        case 'search':
          this.search();
          break;
        case 'edit':
          this.edit();
          break;
        case 'downExcel':
          // let idsDown = ActionUtils.getSelectedIds(
          //   this.$refs.multipleTable.selection
          // );
          // if (idsDown.length == 0) {
          //   this.$message({
          //     message: "至少选择一条数据",
          //     type: "warning"
          //   });
          //   return;
          // }
          downAssetExcel(this.searchForm)
            .then(response => {
              console.log(response);
              if (response) {
                ActionUtils.exportFile(response.data, fecha.formatDate('yyyyMMddHHmmss') + '.xls');
              }
            })
            .catch(req => {
              console.log('下载失败');
            });
          break;
        case 'reset':
          Object.assign(this.$data.searchForm, this.$options.data().searchForm);
          this.jzTime = [];
          this.currentPage = 1;
          this.getAllTable();
          // let selectData = this.$refs.multipleTable.selection;
          // if (selectData.length == 0) {
          //   this.$message({
          //     message: "至少选择一条数据",
          //     type: "warning"
          //   });
          //   return;
          // }
          // let obj = { czDTOS: [] };
          // selectData.forEach(item => {
          //   let lineData = {};
          //   lineData["creditID"] = item.id;
          //   lineData["clrid"] = this.$store.getters.userId;
          //   lineData["ksdm"] = item.ksDaiMa;
          //   obj.czDTOS.push(lineData);
          // });
          // creditReset(obj)
          //   .then(response => {
          //     if (response.state == 200) this.getTable();
          //   })
          //   .catch(req => {
          //     console.log("失败");
          //   });
          break;
        default:
          break;
      }
    },
    // 资产详情
    handleAssetsDetail(index, row) {
      console.log('row', row);
      getAsset(row.id).then(res => {
        console.log('res', res);
        this.listLabel = [
          {
            label: '资产编号',
            property: 'assetNo'
          },
          {
            label: '报账金额',
            property: 'wrbtr'
          }
        ];
        this.diaTableData = res.data;
        this.dialogVisible = true;
      });
    },
    // 账务详情
    handleAccouDetail(index, row) {
      console.log('row', row);
      getAccount(row.id).then(res => {
        this.listLabel = [
          {
            label: '付款信息金额',
            property: 'zfkje'
          },
          {
            label: '挂账信息金额',
            property: 'payableAmount'
          },
          {
            label: '冲账信息金额',
            property: 'prepaidAmountCr'
          }
        ];
        this.diaTableData = res.data;
        this.dialogVisible = true;
      });
    },
    //搜索
    search() {
      this.currentPage = 1;
      this.getAllTable();
    },
    //编辑
    edit() {
      // this.getTable();
    },
    //表格的选择
    selection(row) {
      console.log(row);
    },
    //获取表格数据
    getAllTable() {
      this.loading = true;
      // let obj = {};
      // for (const key in this.ruleForm) {
      //   if (this.ruleForm.hasOwnProperty(key)) {
      //     const element = this.ruleForm[key];
      //     if (element) {
      //       obj[key] = element;
      //     }
      //   }
      // }
      getAssetTable({
        extraParameters: {},
        parameters: [
          { key: 'Q^CONTRACT_NO^S', value: this.searchForm.contractNo },
          { key: 'Q^CONTRACTNUM^S', value: this.searchForm.contractnum },
          { key: 'Q^DOC_DATE^LL', value: this.searchForm.docDateStart },
          { key: 'Q^DOC_DATE^LG', value: this.searchForm.docDateEnd },
          { key: 'Q^BUKRS^S', value: this.searchForm.bukrs },
          { key: 'Q^PARTNERID^S', value: this.searchForm.partnerid },
          { key: 'Q^PARTNERNAME^SL', value: this.searchForm.partnername },
          { key: 'Q^DOC_NUMBER^S', value: this.searchForm.docNumber }
        ],
        requestPage: {
          pageNo: this.currentPage,
          limit: this.pageSize,
          totalCount: this.totalCount
        },
        sorts: []
      }).then(response => {
        console.log('response', response);
        this.loading = false;
        this.tableData = response.data.dataResult;
        this.totalCount = response.data.pageResult.totalCount;
      });
    },
    //分页
    handleSizeChange(val) {
      this.pageSize = val;
      this.getAllTable();
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.currentPage = val;
      this.getAllTable();
    },
    getHeight() {
      this.height =
        this.$refs.main.clientHeight -
        this.$refs.header_btn.clientHeight -
        this.$refs.header_input.clientHeight -
        this.$refs.footer.clientHeight;
    }
  },
  components: {},
  destroyed() {
    window.removeEventListener('resize', this.tableResize);
  }
};
</script>

<style scoped lang="scss">
.bg {
  height: 100%;
  background: #fff;
  // /deep/ .el-date-editor .el-range-input {
  //   width: 26% !important;
  // }
  /deep/ .el-date-editor--daterange.el-input,
  .el-date-editor--daterange.el-input__inner,
  .el-date-editor--timerange.el-input,
  .el-date-editor--timerange.el-input__inner {
    width: 230px !important;
  }
  .header-btn {
    height: 60px;
    line-height: 60px;
    padding-left: 10px;
    background-color: #f5f5f7;
    border: 1px solid #ebeef5;
    .btn-left {
      float: left;
    }
    .btn-right {
      float: right;
      padding-right: 10px;
    }
  }
  .header-input {
    padding: 5px;
    border: 1px solid #ebeef5;
  }
  .footer {
    padding: 5px 0;
    border-top: 1px solid #dcdfe6;
    background: #fff;
  }
}
.checkBox /deep/ .el-form-item__content {
  width: 220px;
}
// /deep/ .el-loading-spinner .circular {
//   width: 80px;
//   height: 80px;
// }
.number {
  color: #3192e8;
  cursor: pointer;
}
</style>
