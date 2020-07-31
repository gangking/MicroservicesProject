<template>
  <!-- 摊销台账明细 -->
  <div class="bg" ref="main" v-loading="bgLoading" element-loading-text="发送中,请等待">
    <!-- <div class="title">
      <span>集成接口定义</span>
    </div>-->
    <div class="header-btn" ref="header_btn">
      <div class="btn-wrapper">
        <div class="btn-left">
          <!-- 生成台账按钮 -->
          <!-- <accBtn docNum="GL20200521000113" /> -->

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
        <el-form-item label="单据号码">
          <el-input v-model="searchForm.docNumber" placeholder="请输入单据号码" clearable></el-input>
        </el-form-item>
        <el-form-item label="公司代码">
          <el-input v-model="searchForm.bukrs" placeholder="请输入公司代码" clearable></el-input>
        </el-form-item>
        <el-form-item label="提单人工号">
          <el-input v-model="searchForm.userno" placeholder="请输入提单人工号" clearable></el-input>
        </el-form-item>
        <el-form-item label="提单人名称">
          <el-input v-model="searchForm.username" placeholder="请输入提单人名称" clearable></el-input>
        </el-form-item>
        <el-form-item label="处理人账号">
          <el-input v-model="searchForm.exUserno" placeholder="请输入处理人账号" clearable></el-input>
        </el-form-item>
        <el-form-item label="处理人名称">
          <el-input v-model="searchForm.exUsername" placeholder="请输入处理人名称" clearable></el-input>
        </el-form-item>
        <el-form-item label="成本中心">
          <el-input v-model="searchForm.kostl" placeholder="请输入成本中心" clearable></el-input>
        </el-form-item>
        <el-form-item label="利润中心">
          <el-input v-model="searchForm.prctr" placeholder="请输入利润中心" clearable></el-input>
        </el-form-item>
        <el-form-item label="记账日期">
          <el-date-picker
            v-model="jzTime"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
            @change="changeJzTime"
          ></el-date-picker>
        </el-form-item>
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
        <el-table-column prop="amoNumber" label="台账号码"></el-table-column>
        <el-table-column prop="docNumber" label="单据号码"></el-table-column>
        <el-table-column prop="bukrs" label="公司代码"></el-table-column>
        <el-table-column prop="userno" label="提单人工号"></el-table-column>
        <el-table-column prop="username" label="提单人姓名"></el-table-column>
        <el-table-column prop="expenseItem1" label="费用项目"></el-table-column>
        <el-table-column prop="expenseItem2" label="费用明细"></el-table-column>
        <el-table-column prop="kostl" label="成本中心"></el-table-column>
        <el-table-column prop="prctr" label="利润中心"></el-table-column>
        <el-table-column prop="amoSumWrbtr" label="摊销金额"></el-table-column>
        <el-table-column prop="exBelnr" label="费用凭证号码"></el-table-column>
        <el-table-column prop="exBudat" label="记账日期"></el-table-column>
        <el-table-column prop="exBudat" label="记账人"></el-table-column>
        <el-table-column prop="exBudat" label="记账人姓名"></el-table-column>
        <!-- <el-table-column prop="amoMontBe" label="摊销起始时间"></el-table-column>
        <el-table-column prop="amoMontEn" label="摊销结束时间"></el-table-column>-->
        <!-- <el-table-column prop="amoAlWrbtr" label="已摊金额"></el-table-column>
        <el-table-column prop="amoReWrbtr" label="剩余金额"></el-table-column>-->
        <!-- <el-table-column prop="ksName" label="摊销明细"></el-table-column> -->
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
        :current-page="currentPage"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="10"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import accBtn from "./account_button";
import {
  getDelTable,
  downDelExcel
} from "@/api/platform/cost_amortizing/account_management";
import ActionUtils from "@/utils/action";
import fecha from "@/utils/fecha";
import _ from "lodash";
export default {
  props: {},
  data() {
    return {
      jzTime: [],
      searchForm: {
        docNumber: "",
        burks: "",
        userno: "",
        username: "",
        exUserno: "",
        exUsername: "",
        exBudatStart: "",
        exBudatEnd: "",
        kostl: "",
        prctr: ""
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
      currentPage: 1, //当前页
      pageSize: 10, // 每页多少条
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
          downDelExcel(this.searchForm)
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
      getDelTable({
        extraParameters: {},
        parameters: [
          { key: "Q^DOC_NUMBER^SL", value: this.searchForm.docNumber },
          { key: "Q^BUKRS^SL", value: this.searchForm.burks },
          { key: "Q^USERNO^SL", value: this.searchForm.userno },
          { key: "Q^USERNAME^SL", value: this.searchForm.username },
          { key: "Q^AMO_USERNO^SL", value: this.searchForm.exUserno },
          { key: "Q^AMO_USERNAME^SL", value: this.searchForm.exUsername },
          // { key: "Q^EX_BUDAT^DL", value: this.searchForm.exBudatStart },
          // { key: "Q^EX_BUDAT^DG", value: this.searchForm.exBudatEnd },
          { key: "Q^KOSTL^SL", value: this.searchForm.kostl },
          { key: "Q^PRCTR^SL", value: this.searchForm.prctr },
          { key: "Q^BUDAT^LL", value: this.searchForm.exBudatStart },
          { key: "Q^BUDAT^LG", value: this.searchForm.exBudatEnd }
        ],
        requestPage: {
          pageNo: this.currentPage,
          limit: this.pageSize,
          totalCount: this.totalCount
        },
        sorts: []
      }).then(response => {
        console.log("response", response);
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
  components: {
    accBtn
  },
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
