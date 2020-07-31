<template>
  <div class="bg" id="monitoring-feedaufnr" v-loading="bgLoading">
    <div class="header-btn">
      <div class="btn-wrapper">
        <div class="btn-left">
          <el-button type="primary" @click="handler('search')">查询</el-button>
        </div>
      </div>
    </div>
    <div class="header-input">
      <el-form :model="ruleForm" :rules="rules" :inline="true" ref="ruleForm" label-width="80px">
        <el-form-item label="公司代码" prop="bukrs">
          <el-select
            v-model="ruleForm.bukrs"
            filterable
            clearable
            @change="companySelect"
            @clear="clearCompany"
            placeholder="请选择公司代码"
          >
            <el-option
              v-for="item in companyOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="工厂" prop="werks">
          <el-select
            v-model="ruleForm.werks"
            filterable
            multiple
            @change="werksSelect"
            @remove-tag="removeTag"
            placeholder="请选择工厂"
          >
            <el-option
              v-for="item in factoryOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="财年" prop="gjahr">
          <el-date-picker
            v-model="ruleForm.gjahr"
            value-format="yyyy"
            type="year"
            placeholder="选择财年"
          ></el-date-picker>
        </el-form-item>

        <el-form-item label="期间" prop="monat">
          <el-select v-model="ruleForm.monat" clearable placeholder="请选择期间">
           <el-option label="01" value="01"></el-option>
            <el-option label="02" value="02"></el-option>
            <el-option label="03" value="03"></el-option>
            <el-option label="04" value="04"></el-option>
            <el-option label="05" value="05"></el-option>
            <el-option label="06" value="06"></el-option>
            <el-option label="07" value="07"></el-option>
            <el-option label="08" value="08"></el-option>
            <el-option label="09" value="09"></el-option>
            <el-option label="10" value="10"></el-option>
            <el-option label="11" value="11"></el-option>
            <el-option label="12" value="12"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="版本号" prop="zgxjkbbh">
          <el-input v-model="ruleForm.zgxjkbbh"></el-input>
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
        <el-table-column prop="bukrs" label="公司代码"></el-table-column>
        <el-table-column prop label="版本号">
          <template slot-scope="scope">
            <span class="routerSpan" @click="routeTo(scope.row)">{{ scope.row.zgxjkbbh }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="werks" label="工厂"></el-table-column>
        <el-table-column prop="year" label="监控年度"></el-table-column>
        <el-table-column prop="month" label="监控月份"></el-table-column>

        <el-table-column prop="disqualifiedCount" label="不合格数量"></el-table-column>
        <el-table-column prop="discrepanciesAmount" label="差异金额(万元)"></el-table-column>
     
        <el-table-column prop="createTime" label="创建时间"></el-table-column>
      </el-table>
    </div>
    <div class="footer">
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

    <monitor-detail-dialog
      :visible.sync="monitorDetaiVisible"
      :monitorDetailObj="monitorDetailObj"
    />
  </div>
</template>

<script>
import monitorDetailDialog from "@/views/platform/cost_monitoring/components/dialog";
import {
  getButxt,
  getFactory,
  getFeedaufnrReport
} from "@/api/platform/monitor/costMonitor";
export default {
  props: {
    compontObj: {
      type: Object,
      default: () => {}
    }
  },
  components: {
    monitorDetailDialog
  },
  data() {
    return {
      monitorDetaiVisible: false, //监控成本弹窗 第三屏
      monitorDetailObj: {}, //跳转带的值
      loading: false,
      bgLoading: false,
      ruleForm: {
        zgxjkbbh: "", //版本号
        bukrs: "",
        werks: [],
        gjahr: "",
        monat: ""
      },
      rules: {
        bukrs: [
          { required: true, message: "请选择公司代码", trigger: "change" }
        ],
        werks: [
          {
            required: true,
            message: "请选择工厂",
            trigger: ["change"],
            type: "array"
          }
        ]
      },
      companyOptions: [], //公司代码
      factoryOptions: [], // 工厂代码
      tableData: [], //数据
      currentPage: 1, //当前页
      pageSize: 20, // 每页多少条
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
  watch: {
    compontObj: {
      handler(val) {
        this.ruleForm.bukrs = val.bukrs;
        this.ruleForm.gjahr = val.year;
        this.ruleForm.monat = val.month;
        this.ruleForm.werks.push(val.werks);
        //公司选择
        this.companySelect(val.bukrs);
        // 加载表格
        this.getTable();
      },
      immediate: true
    }
  },
  methods: {
    handler(command) {
      switch (command) {
        case "search":
          this.search();
          break;
        default:
          break;
      }
    },
    //合并行
    // objectSpanMethod({ row, column, rowIndex, columnIndex }) {
    //   if (
    //     columnIndex == 0 ||
    //     columnIndex == 1 ||
    //     columnIndex == 2 ||
    //     columnIndex == 3 ||
    //     columnIndex == 4
    //   ) {
    //     if (rowIndex % 2 === 0) {
    //       return {
    //         rowspan: 2,
    //         colspan: 1
    //       };
    //     } else {
    //       return {
    //         rowspan: 0,
    //         colspan: 0
    //       };
    //     }
    //   }
    // },
    //弹出框
    routeTo(row) {
      this.monitorDetailObj = {};
      this.monitorDetaiVisible = true;
      Object.assign(this.monitorDetailObj, row);
      this.monitorDetailObj["componet"] = "feedaufnr";
    },
    //日期装换
    transformTime(timestamp) {
      if (timestamp) {
        var time = new Date(timestamp);
        var y = time.getFullYear();
        var M = time.getMonth() + 1;
        var d = time.getDate();
        var h = time.getHours(); // 小时 (0 ~ 23)
        var m = time.getMinutes(); // 分钟 (0 ~ 59)
        var s = time.getSeconds(); // 秒数 (0 ~ 59)
        // return y + '-' + M + '-' + d + ' ' + h + ':' + m + ':' + s;
        return y + "-" + M + "-" + d;
      } else {
        return "";
      }
    },
    //搜索
    search() {
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          this.getTable();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //公司的选择
    companySelect(item) {
      this.factoryOptions = [];
      getFactory({ bukrs: item }).then(response => {
        console.log(response);
        this.factoryOptions = response.data.map(item => {
          return {
            value: item.werks,
            label: item.name1
          };
        });
      });
    },
    //清空公司选择
    clearCompany() {
      this.factoryOptions = [];
    },
    //工厂的选择
    werksSelect() {
      this.getTableHeight();
    },
    //工厂的删除
    removeTag() {
      this.getTableHeight();
    },
    //加载公司代码数据
    loadData() {
      getButxt().then(response => {
        this.companyOptions = response.data.map(item => {
          return {
            value: item.bukrs,
            // label: item.butxt
            label: item.bukrs
          };
        });
        // console.log("获取公司代码数据", response);
      });
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
        sorts: []
      };

      for (const key in this.ruleForm) {
        if (this.ruleForm.hasOwnProperty(key)) {
          const element = this.ruleForm[key];
          // changed by dingdx 2019-12-06
          if (element) {
            var strKey = "Q^";
            var strValue = "";
            if (Array.isArray(element)) {
              strKey = strKey + key + "^SIN";
              strValue = element.join(",");
            } else {
              strKey = strKey + key + "^S";
              strValue = element;
            }
            params.parameters.push({
              key: strKey,
              value: strValue
            });
          }
        }
      }
      this.getTableHeight();
      console.log(params, "参数params");
      getFeedaufnrReport(params).then(response => {
        this.loading = false;
        this.tableData = response.data.dataResult;
        this.totalCount = response.data.pageResult.totalCount;
      });
    },
    //计算中间table高度
    getTableHeight() {
      if (document.querySelector("#monitoring-feedaufnr")) {
        let height = document.querySelector("#monitoring-feedaufnr")
          .clientHeight;
        // console.log(height, "height整体");
        let btnHeight = document.querySelector(
          "#monitoring-feedaufnr .header-btn"
        ).clientHeight;
        // console.log(btnHeight, "btnHeight整体");
        let inputHeight = document.querySelector(
          "#monitoring-feedaufnr .header-input"
        ).clientHeight;
        //console.log(inputHeight, "inputHeight中间的输入框");
        let footerHeight = document.querySelector(
          "#monitoring-feedaufnr .footer"
        ).clientHeight;
        this.height = height - btnHeight - inputHeight - footerHeight;
        //  console.log(this.height);
      }
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
    }
  },
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
.routerSpan {
  cursor: pointer;
  color: #3dc;
}
</style>
