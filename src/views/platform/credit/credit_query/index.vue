<template>
  <div class="bg" ref="main" v-loading="bgLoading" element-loading-text="发送中,请等待">
    <!-- <div class="title">
      <span>集成接口定义</span>
    </div>-->
    <div class="header-btn" ref="header_btn">
      <div class="btn-wrapper">
        <div class="btn-left">
          <el-button type="primary" @click="handler('search')">查询</el-button>
          <el-button type="primary" @click="handler('downExcel')">导出</el-button>
          <el-button type="primary" @click="handler('reset')">重置</el-button>
        </div>
        <!-- <div class="btn-right">
          <el-button type="success" @click="send">发送</el-button>
        </div>-->
      </div>
    </div>
    <div class="header-input" ref="header_input">
      <el-form :rules="rules" :inline="true" ref="ruleForm" label-width="100px">
        <el-form-item label="客商类型">
          <el-select v-model="ruleForm.ksType" clearable placeholder="请选择客商类型">
            <el-option
              v-for="item in optionsType"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="客商代码">
          <el-input v-model="ruleForm.ksDaiMa" placeholder="请输入客商代码" clearable></el-input>
        </el-form-item>
        <el-form-item label="客商名称">
          <el-input v-model="ruleForm.ksName" placeholder="请输入客商名称" clearable></el-input>
        </el-form-item>
      </el-form>
    </div>
    <!--  -->
    <div class="table-content" :style="{height:height+'px'}">
      <el-table
        ref="multipleTable"
        :height="height"
        :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)"
        border
        highlight-current-row
        v-loading="loading"
        tooltip-effect="dark"
        @section-change="selection"
        style="width: 100%"
      >
        <el-table-column type="selection"></el-table-column>
        <el-table-column prop="ksType" label="客商类型"></el-table-column>
        <el-table-column prop="ksDaiMa" label="客商代码"></el-table-column>
        <el-table-column prop="ksName" label="客商名称"></el-table-column>
        <el-table-column prop="creditDescribe" label="信用体系"></el-table-column>
        <el-table-column label="调整分值" width="180">
          <template slot-scope="scope">
            <span
              class="number"
              @click="handleDetail(scope.$index, scope.row)"
              style="margin-left: 10px"
            >{{ scope.row.xyf }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="benchmarkScores" label="基础分值"></el-table-column>
        <el-table-column prop="xyzf" label="信用总分"></el-table-column>
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
  downExcel,
  creditReset,
  getTemplateData,
  getRemoteParameter
} from "@/api/platform/credit/credit_query";
import creditDialog from "@/views/platform/credit/system_management/components/dialog";
import ActionUtils from "@/utils/action";
import fecha from "@/utils/fecha";
import _ from "lodash";
export default {
  props: {},
  data() {
    return {
      optionsType: [
        {
          value: "K",
          label: "供应商"
        },
        {
          value: "D",
          label: "客户"
        },
        {
          value: "P",
          label: "员工"
        }
      ],
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
    //this.getTemplateData();
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
        case "downExcel":
          let idsDown = ActionUtils.getSelectedIds(
            this.$refs.multipleTable.selection
          );
          if (idsDown.length == 0) {
            this.$message({
              message: "至少选择一条数据",
              type: "warning"
            });
            return;
          }
          downExcel({ ids: idsDown })
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
          let selectData = this.$refs.multipleTable.selection;
          if (selectData.length == 0) {
            this.$message({
              message: "至少选择一条数据",
              type: "warning"
            });
            return;
          }
          let obj = { czDTOS: [] };
          selectData.forEach(item => {
            let lineData = {};
            lineData["creditID"] = item.id;
            lineData["clrid"] = this.$store.getters.userId;
            lineData["ksdm"] = item.ksDaiMa;
            obj.czDTOS.push(lineData);
          });
          creditReset(obj)
            .then(response => {
              if (response.state == 200) this.getTable();
            })
            .catch(req => {
              console.log("失败");
            });
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
      this.getTable();
    },
    //表格的选择
    selection(row) {
      console.log(row);
    },
    // async getTemplateData() {
    //   let result = await getTemplateData({
    //     parameters: [
    //       {
    //         key: "dataTemplateKey",
    //         value: "CREDIT_TYPE"
    //       },
    //       {
    //         key: "Q^CREDIT_TYPE^SL",
    //         value: ""
    //       },
    //       {
    //         key: "Q^CREDIT_TYPE_DES^SL",
    //         value: ""
    //       }
    //     ],
    //     requestPage: {
    //       pageNo: 1,
    //       limit: 20,
    //       totalCount: null
    //     },
    //     sorts: []
    //   });

    //   console.log(result);
    //   if (result.state == 200) {
    //     this.optionsType = result.data.dataResult.map(item => {
    //       return {
    //         label: item.CREDIT_TYPE_DES,
    //         value: item.CREDIT_TYPE
    //       };
    //     });
    //   }
    // },
    //获取表格数据
    getTable(limit = 20, pageno = 1) {
      this.loading = true;
      let obj = {};
      for (const key in this.ruleForm) {
        if (this.ruleForm.hasOwnProperty(key)) {
          const element = this.ruleForm[key];
          if (element) {
            obj[key] = element;
          }
        }
      }
      creditQuery(obj).then(response => {
        this.loading = false;
        this.tableData = response.data;
        this.totalCount = response.data.length;
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
.number {
  color: #3192e8;
  cursor: pointer;
}
</style>
