<template>
  <div class="bg" ref="main" v-loading="bgLoading" element-loading-text="发送中,请等待">
    <!-- <div class="title">
      <span>集成接口定义</span>
    </div>-->
    <div class="header-btn" ref="header_btn">
      <div class="btn-wrapper">
        <div class="btn-left">
          <el-button type="primary" @click="handler('search')">查询</el-button>
          <el-button type="primary" @click="handler('add')">新增</el-button>
          <el-button type="primary" @click="handler('edit')">编辑</el-button>

          <el-button type="danger" @click="handler('delete')">删除</el-button>
        </div>
        <!-- <div class="btn-right">
          <el-button type="success" @click="send">发送</el-button>
        </div>-->
      </div>
    </div>
    <div class="header-input" ref="header_input">
      <el-form :rules="rules" :inline="true" ref="ruleForm" label-width="100px">
        <el-form-item label="信用体系描述">
          <el-input v-model="ruleForm.CREDIT_DESCRIBE_" placeholder="请输入信用体系描述" clearable></el-input>
        </el-form-item>
        <el-form-item label="分值上限">
          <el-input v-model="ruleForm.SCORE_LIMIT_" placeholder="请输入分值上限" clearable></el-input>
        </el-form-item>
        <el-form-item label="基准分值">
          <el-input v-model="ruleForm.BENCHMARK_SCORES_" placeholder="请输入基准分值" clearable></el-input>
        </el-form-item>
        <el-form-item label="月分值上限">
          <el-input v-model="ruleForm.MONTHLY_POINTS_" placeholder="请输入月分值上限" clearable></el-input>
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
        <el-table-column type="selection"></el-table-column>
        <el-table-column prop="serialNumber" label="编号"></el-table-column>
        <el-table-column prop="creditDescribe" label="信用体系描述"></el-table-column>
        <el-table-column prop="scoreLimit" label="分值上限"></el-table-column>
        <el-table-column prop="benchmarkScores" label="基准分值"></el-table-column>
        <el-table-column prop="monthlyPoints" label="月分值上限"></el-table-column>

        <!-- <el-table-column label=" 状态">
          <template slot-scope="scope">{{transStatus(scope.row.status)}}</template>
        </el-table-column>-->
      </el-table>
    </div>
    <div class="footer" ref="footer">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="20"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount"
      ></el-pagination>
    </div>
    <!-- 新增 编辑 -->
    <credit-dialog
      :visible.sync="creditVisible"
      @upTable="search"
      @close="visible=>creditVisible =visible"
      :title="title"
      :creditData="creditData"
    />
  </div>
</template>

<script>
import {
  creditQuery,
  creditSave,
  creditEdit,
  creditRemove
} from "@/api/platform/credit/system_management";
import creditDialog from "@/views/platform/credit/system_management/components/dialog";
import ActionUtils from "@/utils/action";
import _ from "lodash";
export default {
  props: {},
  data() {
    return {
      creditVisible: false,
      loading: false,
      bgLoading: false,
      ruleForm: {
        CREDIT_DESCRIBE_: "",
        SCORE_LIMIT_: "",
        BENCHMARK_SCORES_: "",
        MONTHLY_POINTS_: ""
      },
      rules: {},
      tableData: [], //数据
      currentPage: 1, //当前页
      pageSize: 20, // 每页多少条
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
    this.getTable();
    setTimeout(() => {
      this.getHeight();
    }, 100);
  },
  watch: {},
  methods: {
    handler(command) {
      switch (command) {
        case "search":
          this.search();
          break;
        case "add":
          this.creditData = {};
          this.creditVisible = true;
          this.title = "新增";
          break;
        case "edit":
          ActionUtils.selectedRecord(this.$refs.multipleTable.selection)
            .then(data => {
              this.creditVisible = true;
              this.creditData = data;
              this.title = "编辑";
            })
            .catch(() => {});
          break;
          break;
        case "delete":
          let idsDelete = ActionUtils.getSelectedIds(
            this.$refs.multipleTable.selection
          );
          if (idsDelete.length == 0) {
            this.$message({
              message: "至少选择一条数据",
              type: "warning"
            });
            return;
          }
          creditRemove({ ids: idsDelete.join(",") }).then(response => {
            if (response.state == 200) {
              this.$message({
                showClose: true,
                message: "成功",
                type: "success"
              });
              this.getTable();
            } else {
              this.$message({
                showClose: true,
                duration: 6000,
                message: "删除不成功，请重试",
                type: "warning"
              });
            }
          });

          break;
        default:
          break;
      }
    },
    //搜索
    search() {
      this.getTable();
    },
    //表格的选择
    selection(row) {
      console.log(row);
    },
    //获取表格数据
    getTable(limit = 20, pageno = 1) {
      this.loading = true;
      let params = {
        parameters: [],
        requestPage: {
          limit: this.pageSize || limit,
          pageNo: this.currentPage || pageno
        },
        sorts: [
          {
            field: "SERIAL_NUMBER_",
            order: "SERIAL_NUMBER_"
          }
        ]
      };
      for (const key in this.ruleForm) {
        if (this.ruleForm.hasOwnProperty(key)) {
          const element = this.ruleForm[key];
          if (element) {
            var strKey = "Q^";
            var strValue = "";
            if (Array.isArray(element)) {
              strKey = strKey + key + "^SIN";
              strValue = element.join(",");
            } else {
              strKey = strKey + key + "^SL";
              strValue = element;
            }
            params.parameters.push({
              key: strKey,
              value: strValue
            });
          }
        }
      }
      creditQuery(params).then(response => {
        this.loading = false;
        this.tableData = response.data.dataResult;
        this.totalCount = response.data.pageResult.totalCount;
      });
    },
    //分页
    handleSizeChange(val) {
      this.pageSize = val;
      this.getTable();
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.currentPage = val;
      this.getTable();
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
    creditDialog
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
</style>
