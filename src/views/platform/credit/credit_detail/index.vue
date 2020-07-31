<template>
  <div class="bg" ref="main" v-loading="bgLoading" element-loading-text="发送中,请等待">
    <!-- <div class="title">
      <span>集成接口定义</span>
    </div>-->
    <div class="header-btn" ref="header_btn">
      <div class="btn-wrapper">
        <div class="btn-left">
          <el-button type="primary" @click="handler('search')">查询</el-button>
          <!-- <el-button type="primary" @click="handler('importExcel')">导入</el-button> -->
          <el-button type="primary" @click="handler('downExcel')">导出</el-button>
          <el-button type="primary" @click="handler('template')">模版</el-button>
        </div>
        <!-- <div class="btn-right">
          <el-button type="success" @click="send">发送</el-button>
        </div>-->
      </div>
    </div>
    <div class="header-input" ref="header_input">
      <el-form :rules="rules" :inline="true" ref="ruleForm" label-width="100px">
        <el-form-item label="客商类型">
          <el-select v-model="ruleForm['kstype']" clearable placeholder="请选择客商类型">
            <el-option
              v-for="item in optionsType"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="客商代码">
          <el-input v-model="ruleForm.ksdaima" placeholder="请输入客商代码" clearable></el-input>
        </el-form-item>
        <el-form-item label="客商名称">
          <el-input v-model="ruleForm.ksName" placeholder="请输入客商名称" clearable></el-input>
        </el-form-item>
        <el-form-item label="单据号码">
          <el-input v-model="ruleForm.docNumber" placeholder="请输入单据号码" clearable></el-input>
        </el-form-item>
        <el-form-item label="处理人账号">
          <el-input v-model="ruleForm.clyZh" placeholder="请输入处理人账号" clearable></el-input>
        </el-form-item>

        <el-form-item label="处理人名称">
          <el-input v-model="ruleForm.clyName" placeholder="请输入处理人名称" clearable></el-input>
        </el-form-item>
        <el-form-item label="信用体系">
          <el-input v-model="ruleForm.creditDescribe" placeholder="请输入信用体系" clearable></el-input>
        </el-form-item>

        <el-form-item label="处理日期">
          <el-date-picker
            v-model="ruleForm.time"
            value-format="yyyy-MM-dd"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
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
        <el-table-column prop="kstype" label="客商类型"></el-table-column>
        <el-table-column prop="bukrs" label="公司代码"></el-table-column>
        <el-table-column prop="ksdaima" label="客商代码"></el-table-column>
        <el-table-column prop="ksname" label="客商名称"></el-table-column>
        <el-table-column prop="docNumber" label="单据号码"></el-table-column>
        <el-table-column prop="creditJustDes" label="调整类型"></el-table-column>
        <el-table-column prop="resizeId" label="调整原因代码"></el-table-column>
        <el-table-column prop="causeDescribe" label="调整原因描述"></el-table-column>
        <el-table-column prop="tzfz" label="调整分值"></el-table-column>
        <el-table-column prop="xtly" label="系统来源"></el-table-column>
        <el-table-column prop="tzDate" label="调整日期"></el-table-column>
        <el-table-column prop="clyZh" label="处理人账号"></el-table-column>
        <el-table-column prop="clyName" label="处理人名称"></el-table-column>
        <el-table-column prop="creditDescribe" label="信用体系"></el-table-column>
        <el-table-column prop="spyj" label="审批意见"></el-table-column>
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
  </div>
</template>

<script>
import { creditQuery, downExcel } from "@/api/platform/credit/credit_detail";
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
        time: [],
        beginTime: "",
        clyZh: "",
        creditDescribe: "",
        docNumber: "",
        endTime: "",
        ksdaima: "",
        kstype: "",
        ksName: "",
        clyName: ""
      },
      rules: {},
      tableData: [], //数据
      currentPage: 1, //当前页
      pageSize: 20, // 每页多少条
      totalCount: 0, //总数
      height: 0
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

    this.getRouterParam();
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
        case "importExcel":
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
          let idsReset = ActionUtils.getSelectedIds(
            this.$refs.multipleTable.selection
          );
          if (idsReset.length == 0) {
            this.$message({
              message: "至少选择一条数据",
              type: "warning"
            });
            return;
          }

          break;
        default:
          break;
      }
    },
    getRouterParam() {
      let { creditDescribe, ksDaiMa } = this.$route.query;
      if (creditDescribe || ksDaiMa) {
        this.$set(this.ruleForm, "creditDescribe", creditDescribe);
        this.$set(this.ruleForm, "ksdaima", ksDaiMa);
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
      let obj = {};
      for (const key in this.ruleForm) {
        if (this.ruleForm.hasOwnProperty(key)) {
          const element = this.ruleForm[key];
          if (element) {
            if (key == "time" && element.length > 0) {
              obj["beginTime"] = element[0];
              obj["endTime"] = element[1];
            }
            obj[key] = element;
          }
        }
      }
      delete obj["time"];
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
