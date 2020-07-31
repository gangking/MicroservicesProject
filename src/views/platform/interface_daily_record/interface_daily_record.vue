<template>
  <div class="bg" ref="main" v-loading="bgLoading" element-loading-text="发送中,请等待">
    <!-- <div class="title">
      <span>集成接口定义</span>
    </div>-->
    <div class="header-btn" ref="header_btn">
      <div class="btn-wrapper">
        <div class="btn-left">
          <el-button type="primary" icon="ibps-icon-search" @click="handler('search')">查询</el-button>
          <!-- <el-button type="primary" @click="handler('edit')">编辑</el-button> -->
          <!-- <el-button type="primary" @click="handler('downExcel')">导出</el-button> -->
          <el-button type="primary" icon="ibps-icon-refresh" @click="handler('reset')">重置</el-button>
        </div>
        <!-- <div class="btn-right">
          <el-button type="success" @click="send">发送</el-button>
        </div>-->
      </div>
    </div>
    <div class="header-input" ref="header_input">
      <el-form :inline="true" ref="ruleForm" label-width="100px">
        <el-form-item label="接口名称">
          <el-input v-model="searchForm.apiName" placeholder="请输入接口名称" clearable></el-input>
        </el-form-item>
        <el-form-item label="接口参数">
          <el-input v-model="searchForm.content" placeholder="请输入接口参数" clearable></el-input>
        </el-form-item>
        <el-form-item label="返回消息">
          <el-input v-model="searchForm.message" placeholder="请输入返回消息" clearable></el-input>
        </el-form-item>
        <el-form-item label="创建时间">
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
        <el-table-column prop="apiName" label="接口名称"></el-table-column>
        <el-table-column prop="content" label="接口参数" show-overflow-tooltip></el-table-column>
        <el-table-column prop="message" label="返回消息" show-overflow-tooltip></el-table-column>
        <el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>
        <el-table-column prop="updateTime" label="更新时间" align="center"></el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <template slot-scope="scope">
            <el-button @click="handleDetail(scope.$index, scope.row)" type="text">查看详情</el-button>
          </template>
        </el-table-column>
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

    <!-- 详情弹窗 -->
    <el-dialog title="接口日志详情" :visible.sync="dialogVisible" top="10vh" style="height:90%">
      <div class="diaItem">
        <div class="diaTitle">接口名称:</div>
        <div class="diaCont">{{dialogInfo.apiName}}</div>
      </div>
      <div class="diaItem">
        <div class="diaTitle">接口参数:</div>
        <div class="diaCont">{{dialogInfo.content}}</div>
      </div>
      <div class="diaItem">
        <div class="diaTitle">返回消息:</div>
        <div class="diaCont">{{dialogInfo.message}}</div>
      </div>
      <div class="diaItem">
        <div class="diaTitle">创建时间:</div>
        <div class="diaCont">{{dialogInfo.createTime}}</div>
      </div>
      <div class="diaItem">
        <div class="diaTitle">更新时间:</div>
        <div class="diaCont">{{dialogInfo.updateTime}}</div>
      </div>
      <div class="diaItem">
        <div class="diaTitle">备注:</div>
        <div class="diaCont">{{dialogInfo.remarks}}</div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import request from "@/utils/request";
import {
  getTable,
  downExcel
} from "@/api/platform/interface_daily_record/interface_daily_record";
import ActionUtils from "@/utils/action";
import fecha from "@/utils/fecha";
import _ from "lodash";
export default {
  props: {},
  data() {
    return {
      dialogVisible: false,
      dialogInfo: {},
      formLabelWidth: "120px",
      jzTime: [],
      searchForm: {
        apiName: "",
        content: "",
        message: "",
        starTime: "",
        endTime: ""
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
      console.log("val", val);
      this.searchForm.starTime = val ? val[0] : "";
      this.searchForm.endTime = val ? val[1] : "";
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
          this.currentPage = 1;
          this.getAllTable();
          break;
        default:
          break;
      }
    },
    handleDetail(index, data) {
      this.dialogInfo = data;
      console.log("handleDetail", this.dialogInfo);
      this.dialogVisible = true;
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
      getTable({
        extraParameters: {},
        parameters: [
          {
            key: "Q^API_NAME_^SL",
            value: this.searchForm.apiName
          },
          {
            key: "Q^CONTENT_^SL",
            value: this.searchForm.content
          },
          {
            key: "Q^MESSAGE_^SL",
            value: this.searchForm.message
          },
          {
            key: "Q^CREATE_TIME_^DL",
            value: this.searchForm.starTime
          },
          {
            key: "Q^CREATE_TIME_^DG",
            value: this.searchForm.endTime
          }
        ],
        requestPage: {
          pageNo: this.currentPage,
          limit: this.pageSize,
          totalCount: this.totalCount
        },
        sorts: []
      }).then(res => {
        console.log("res", res);
        this.loading = false;
        this.tableData = res.data.dataResult;
        this.totalCount = res.data.pageResult.totalCount;
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
.diaItem {
  margin-bottom: 15px;
  .diaTitle {
    vertical-align: top;
    display: inline-block;
    text-align: right;
    margin-right: 15px;
    font-weight: 700;
    width: 12%;
  }
  .diaCont {
    display: inline-block;
    width: 80%;
  }
}
</style>
