<template>
  <div class="bg" id="prepose">
    <!-- <div class="header-btn">
      <div class="btn-wrapper">
        <div class="btn-left">
          <el-button type="primary" @click="search">查询</el-button>
        </div>
        <div class="btn-right"></div>
      </div>
    </div>
    <div class="header-input">
      <el-form :model="ruleForm" :inline="true" ref="ruleForm" label-width="100px">
        <el-form-item label="关联单据">
          <el-input v-model="ruleForm.refnr" placeholder="请输入关联单据号"></el-input>
        </el-form-item>
        <el-form-item label="关联单据行ID">
          <el-input v-model="ruleForm.refit" placeholder="请输入关联单据行ID"></el-input>
        </el-form-item>
        <el-form-item label="值类别">
          <el-input v-model="ruleForm.wrcat" placeholder="请输入值类别"></el-input>
        </el-form-item>
      </el-form>
    </div> -->
    <!--  -->
    <div class="table-content" :style="{height:height+'px'}">
      <el-table
        ref="multipleTable"
        :height="height"
        :data="tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)"
        border
        highlight-current-row
        v-loading="loading"
        tooltip-effect="dark"
        @section-change="selection"
        style="width: 100%"
      >
        <el-table-column prop="budps" label="预算程序"></el-table-column>
        <el-table-column prop="farea" label="基金范围"></el-table-column>
        <el-table-column prop="fictr" label="基金中心"></el-table-column>

        <el-table-column prop="fonds" label="基金"></el-table-column>

        <el-table-column prop="refnr" label="关联单据"></el-table-column>
        <el-table-column prop="refit" label="关联单据行ID"></el-table-column>

        <el-table-column prop="spsor" label="发起人"></el-table-column>
        <el-table-column prop="fipex" label="承诺项目"></el-table-column>

        <el-table-column prop="wrcat" label="值类别"></el-table-column>
        <!-- <el-table-column prop="budget" label="预算"></el-table-column>
        <el-table-column prop="commit" label="承诺"></el-table-column>
        <el-table-column prop="snspt" label="消耗"></el-table-column>-->
        <el-table-column prop="balance" label="余额"></el-table-column>
      </el-table>
    </div>
    <div class="footer">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 30]"
        :page-size="pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import { searchPrepose } from "@/api/platform/account_balance/balance";
export default {
  props: {
    balanceObj: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      currentPage: 1,
      pagesize: 10,
      loading: false,
      bgLoading: false,
      ruleForm: {
        refnr: "",
        refit: "",
        wrcat: ""
      },

      tableData: [], //数据
      totalCount: 0, //总数
      height: 0
    };
  },
  computed: {},
  created() {},
  mounted() {
    setTimeout(() => {
      this.getTableHeight();
    }, 100);
    window.addEventListener(
      "resize",
      () => {
        this.getTableHeight();
      },
      false
    );
    this.loadData();
  },
  watch: {},
  methods: {
    //搜索
    search() {
      // this.$set(this.rules["monat"][0], "required", false);
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          this.searchTable();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    handleSizeChange(val) {
      this.pagesize = val;
    },
    handleCurrentChange(val) {
      this.currentPage = val;
    },
    //加载数据
    loadData() {
      this.getTable();
    },
    //表格的选择
    selection(row) {
      console.log(row);
    },
    //获取表格数据
    getTable() {
      this.loading = true;
      let params = {
        refnr: this.balanceObj ? this.balanceObj.refnr : "",
        refit: this.balanceObj ? this.balanceObj.refit : "",
        wrcat: ""
      };

      this.getTableHeight();
      console.log(params, "参数params");
      searchPrepose(params).then(response => {
        this.loading = false;

        this.tableData = response.data;
        this.totalCount = response.data.length;
      });
    },
    //获取表格数据
    searchTable() {
      this.loading = true;
      this.getTableHeight();
      searchPrepose(this.ruleForm).then(response => {
        this.loading = false;

        this.tableData = response.data;
        this.totalCount = response.data.length;
      });
    },
    //计算中间table高度
    getTableHeight() {
      if (document.querySelector("#prepose")) {
        let height = document.querySelector("#prepose").clientHeight;

        // let btnHeight = document.querySelector("#prepose .header-btn")
        //   .clientHeight;

        // let inputHeight = document.querySelector("#prepose .header-input")
        //   .clientHeight;

        let footerHeight = document.querySelector("#prepose .footer")
          .clientHeight;
        this.height = height  - footerHeight;
      }
    }
  },
  components: {},
  destroyed() {
    window.removeEventListener("resize", this.getTableHeight);
  }
};
</script>

<style scoped lang="scss">
.bg {
  height: 100%;
  background: #fff;
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
/deep/ .el-table {
  height: 100% !important;
}
</style>
