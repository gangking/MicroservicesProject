<template>
  <!-- 个人资产卡片明细台账 -->
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
        <el-form-item label="归档合同编号">
          <el-input v-model="searchForm.contractno" placeholder="请输入归档合同编号" clearable></el-input>
        </el-form-item>
        <el-form-item label="资产编号">
          <el-input v-model="searchForm.assetNo" placeholder="请输入资产编号" clearable></el-input>
        </el-form-item>
        <el-form-item label="合同编号">
          <el-input v-model="searchForm.contractnum" placeholder="请输入合同编号" clearable></el-input>
        </el-form-item>
        <!-- <el-form-item label="资产保管人">
          <el-input v-model="searchForm.userno" placeholder="请输入资产保管人" clearable></el-input>
        </el-form-item> -->
        <el-form-item label="资产管理员">
          <el-input v-model="searchForm.assetAdmin" placeholder="请输入资产管理员" clearable></el-input>
        </el-form-item>
        <el-form-item label="公司代码">
          <el-input v-model="searchForm.bukrs" placeholder="请输入公司代码" clearable></el-input>
        </el-form-item>
        <el-form-item label="资产使用部门">
          <el-input v-model="searchForm.assetUserdept" placeholder="请输入资产使用部门" clearable></el-input>
        </el-form-item>
        <!-- <el-form-item label="客商代码">
          <el-input v-model="searchForm.kostl" placeholder="请输入客商代码" clearable></el-input>
        </el-form-item> -->
        <el-form-item label="客商名称">
          <el-input v-model="searchForm.partnername" placeholder="请输入客商名称" clearable></el-input>
        </el-form-item>
        <el-form-item label="单据编号">
          <el-input v-model="searchForm.docNumber" placeholder="请输入单据编号" clearable></el-input>
        </el-form-item>
        <!-- <el-form-item label="记账日期">
          <el-date-picker
            v-model="jzTime"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
            @change="changeJzTime"
          ></el-date-picker>
        </el-form-item>-->
        <!-- <el-form-item label="客商代码">
          <el-input v-model="this.searchForm.bukrs" placeholder="请输入客商代码" clearable></el-input>
        </el-form-item>
        <el-form-item label="客商名称">
          <el-input v-model="ruleForm.ksName" placeholder="请输入客商名称" clearable></el-input>
        </el-form-item>-->
      </el-form>
    </div>
    <!--  -->
    <div class="table-content" :style="{height:height+'px'}">
      <el-table
        ref="multipleTable"
        :height="height"
        :data="tableData"
        border
        highlight-current-row
        v-loading="loading"
        tooltip-effect="dark"
        @section-change="selection"
        style="width: 100%"
      >
        <!-- <el-table-column type="selection"></el-table-column> -->
        <el-table-column prop="assetNo" label="资产编号"></el-table-column>
        <el-table-column prop="assetClass" label="资产类别"></el-table-column>
        <el-table-column prop="assetDesc" label="资产描述"></el-table-column>
        <el-table-column prop="additionAssetDesc" label="附加产值描述"></el-table-column>
        <el-table-column prop="assetKeeper" label="资产保管人"></el-table-column>
        <el-table-column prop="assetAdmin" label="资产管理员"></el-table-column>
        <el-table-column prop="assetUserdept" label="资产使用部门"></el-table-column>
        <el-table-column prop="assetKostl" label="资产成本中心"></el-table-column>
        <el-table-column prop="assetPrjno" label="资产项目订单号"></el-table-column>
        <el-table-column prop="bukrs" label="公司代码"></el-table-column>
        <el-table-column prop="storageAddr" label="存放位置"></el-table-column>
        <el-table-column prop="storageDesc" label="存放描述"></el-table-column>
        <el-table-column prop="username" label="制单人姓名"></el-table-column>
        <el-table-column prop="docDate" label="单据日期"></el-table-column>
        <el-table-column prop="docNumber" label="单据编号"></el-table-column>
        <el-table-column prop="contractNo" label="合同编号"></el-table-column>
        <el-table-column prop="partnerid" label="客商代码"></el-table-column>
        <el-table-column prop="partnername" label="客商名称"></el-table-column>
        <!-- <el-table-column label="调整分值" width="180">
          <template slot-scope="scope">
            <span
              class="number"
              @click="handleDetail(scope.$index, scope.row)"
              style="margin-left: 10px"
            >{{ scope.row.xyf }}</span>
          </template>
        </el-table-column>-->
      </el-table>
    </div>
    <div class="footer" ref="footer">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="searchForm.pageNum"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="10"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import { getTable, downExcel } from "@/api/platform/report_query/report_query";
import ActionUtils from "@/utils/action";
import fecha from "@/utils/fecha";
import _ from "lodash";
export default {
  props: {},
  data() {
    return {
      jzTime: [],
      searchForm: {
        pageNum: 1,
        pageSize: 10,
        assetNo: "",
        contractno: "",
        contractnum: "",
        assetKeeper: "",
        assetAdmin: "",
        bukrs: "",
        assetUserdept: "",
        partnerid: "",
        partnername: "",
        docNumber: ""
      },
      creditVisible: false,
      loading: false,
      bgLoading: false,
      ruleForm: {
        ksType: "",
        ksDaiMa: "",
        ksName: ""
      },
      rules: {},
      tableData: [], //数据
      totalCount: 0, //总数
      height: 0,
      title: "",
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
    window.addEventListener("resize", this.tableResize);
    this.getAllTable();
    //this.getTemplateData();
    setTimeout(() => {
      this.getHeight();
    }, 100);
  },
  watch: {},
  methods: {
    changeJzTime(val) {
      this.searchForm.exBudatStart = val ? val[0] : "";
      this.searchForm.exBudatEnd = val ? val[1] : "";
      console.log("jzTime", this.searchForm);
    },
    handler(command) {
      switch (command) {
        case "search":
          this.search();
          break;
        case "edit":
          this.edit();
          break;
        case "downExcel":
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
          downExcel(this.searchForm)
            .then(response => {
              console.log(response);
              if (response) {
                ActionUtils.exportFile(
                  response.data,
                  fecha.formatDate("yyyyMMddHHmmss") + ".xls"
                );
              }
            })
            .catch(req => {
              console.log("下载失败");
            });
          break;
        case "reset":
          Object.assign(this.$data.searchForm, this.$options.data().searchForm);
          this.jzTime = [];
          this.searchForm.pageNum = 1;
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
    handleDetail(index, data) {
      if (data.id) {
        this.$router.push({
          path: "/xygl/xymxcx",
          // path: "/ResolutionCenter/xygl/xymxcx",
          query: { creditDescribe: data.creditDescribe, ksDaiMa: data.ksDaiMa }
        });
      } else {
        this.$message({
          message: "缺少id字段",
          type: "warning"
        });
      }
    },

    //搜索
    search() {
      this.searchForm.pageNum = 1;
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
      getTable(this.searchForm).then(response => {
        console.log("response", response);
        this.loading = false;
        this.tableData = response.data.conents;
        this.totalCount = response.data.total;
      });
    },
    //分页
    handleSizeChange(val) {
      this.searchForm.pageSize = val;
      this.getAllTable();
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.searchForm.pageNum = val;
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
    window.removeEventListener("resize", this.tableResize);
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
